<script lang="ts">
	import { dev } from '$app/environment';
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { draggable } from '@neodrag/svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-french-toast';

	export let data;

	let start_time = 0;
	let duration = 0;

	let pointer_type = '';

	function onDown(e: PointerEvent) {
		start_time = performance.now();
		pointer_type = e.pointerType;
	}

	function onUp() {
		duration = performance.now() - start_time;
	}

	onMount(() => {
		// Change the query param
		$page.url.searchParams.set('t', Date.now() + '');
		goto($page.url, { replaceState: true });

		setInterval(() => {
			invalidateAll();
		}, 5000);
	});
</script>

<svelte:head>
	<!-- <meta
		property="twitter:image"
		content="https://how-long-is-a-click.com/social.png?{Date.now()}"
	/>
	<meta property="og:image" content="https://how-long-is-a-click.com/social.png?{Date.now()}" /> -->
</svelte:head>

<form
	use:enhance={() => {
		return async ({ update, result }) => {
			await update();

			if (dev) {
				// @ts-ignore
				result.data.success ? toast.success(result.data.message) : toast.error(result.data.message);
			}
		};
	}}
	method="post"
><p style="padding-top:100px;"></p>
	<h1 use:draggable>How long is a click?</h1>

	<br /><br />

	<input type="hidden" name="duration" value={duration} />
	<input type="hidden" name="pointer-type" value={pointer_type} />

	<button type="submit" on:pointerdown={onDown} on:pointerup={onUp}> Click me 🚀 </button>
</form>

<h3>{Math.floor(duration)}ms</h3>

<hr />

<section class="stats">
	{#each data.rows as { type, average_duration, count }}
		<div class="average" use:draggable>
			<p title="Pointer Type">{type}</p>
			<h2 title="Average duration for all collected clicks">{average_duration}</h2>
			{count}
		</div>
	{/each}
</section>

<footer>
	Code written by <a href="https://x.com/puruvjdev">@puruvjdev</a> •
	<a target="_blank" rel="noreferrer" href="https://github.com/puruvj/how-long-is-a-click">source</a
	> or 
	<a target="_blank" rel="noreferrer" href="https://github.com/awindest/how-long-is-a-click/blob/main/README.md">Indest Labs source</a
	>
</footer>

<style>
	button {
		box-shadow: var(--shadow-6);

		width: var(--size-fluid-8);
		height: var(--size-fluid-8);
		border-radius: var(--radius-blob-1);

		background-image: var(--gradient-2);
		color: var(--gray-2);
		font-size: 1.2rem;
		text-shadow: none;

		transition: transform 0.2s;
	}

	button:hover {
		transform: scale(1.1);
	}

	button:active {
		transform: scale(0.9);
	}

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	h1 {
		padding-top: var(--size-6);
		text-align: center;
		cursor: move;
	}

	.stats {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem;
	}

	.average {
		background-color: var(--gray-8);
		border-radius: var(--radius-3);
		padding: var(--size-3);
		box-shadow: var(--shadow-3);
		border: 0.5px solid var(--gray-5);
		width: 200px;
		cursor: move;
	}

	.average p {
		color: var(--gray-5);
		text-transform: uppercase;
		font-weight: 500;
		font-size: 0.8rem;
	}

	.average h2 {
		font-size: var(--font-size-fluid-3);
	}
</style>
