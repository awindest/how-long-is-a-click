import 'dotenv/config';
import type { Config } from 'drizzle-kit';

const { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, PROD } = process.env;

const is_prod = PROD === '1';

export default {
	schema: './src/lib/server/schema.ts',
	out: './migrations',
	driver: 'turso',
	dbCredentials: {
		url: is_prod ? TURSO_DATABASE_URL ?? '' : 'file:./db.sqlite',
		authToken: is_prod ? TURSO_AUTH_TOKEN ?? '' : undefined,
	},
} satisfies Config;
