import { dev } from '$app/environment';
import { RATE_LIMIT_SECRET } from '$env/static/private';
import { POINTER_TYPES } from '$lib/constants.js';
import { db } from '$lib/server/db.js';
import { clicks, stats_table } from '$lib/server/schema.js';
import { get_stats } from '$lib/server/stats.js';
import { eq, sql } from 'drizzle-orm';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { ulid } from 'ulid';

const limiter = new RateLimiter({
	// A rate is defined as [number, unit]
	IP: [1000, 'd'], // IP address limiter
	IPUA: [100, 'h'], // IP + User Agent limiter
	cookie: {
		// Cookie limiter
		name: 'limiterid', // Unique cookie name for this limiter
		secret: RATE_LIMIT_SECRET, // Use $env/static/private
		rate: [10, 'm'],
		preflight: true, // Require preflight call (see load function)
	},
});

export const load = async (event) => {
	await limiter.cookieLimiter?.preflight(event);

	return {
		rows: await get_stats(),
	};
};

export const actions = {
	default: async (event) => {
		if (!dev && (await limiter.isLimited(event))) {
			return { success: false, message: 'Rate limit exceeded' };
		}

		const formdata = await event.request.formData();
		const duration = formdata.get('duration')?.toString();
		const pointer_type = formdata.get('pointer-type')?.toString();

		if (!duration || !pointer_type)
			return {
				success: false,
				message: 'Missing required fields',
			};

		if (+duration > 1000 || +duration < 0) {
			return {
				success: false,
				message: 'Who clicks for more than a second? 🤔',
			};
		}

		const pointer_type_num =
			(POINTER_TYPES.indexOf(pointer_type!) + POINTER_TYPES.length) % POINTER_TYPES.length;

		try {
			// console.time('txn');
			await db.batch([
				db.insert(clicks).values({
					id: ulid(Date.now()),
					duration: +duration,
					pointer_type: +pointer_type_num,
				}),

				// Now update the row whose type is point_type, then update that too
				db
					.insert(stats_table)
					.values({
						type: pointer_type_num,
						average_duration: +duration,
						count: 1,
					})
					.onConflictDoUpdate({
						target: stats_table.type,
						set: {
							average_duration: sql<number>`(average_duration * count + ${+duration}) / (count + 1)`,
							count: sql<number>`count + 1`,
						},
						setWhere: eq(stats_table.type, pointer_type_num),
					}),
			]);
			// console.timeEnd('txn');

			return { success: true, message: 'Click recorded 🦄' };
		} catch (e) {
			console.log(e);
			return { success: false, message: 'Failed to record click' };
		}
	},
};
