<script lang="ts">
	import { initClient } from '@ts-rest/core';
	// import * as apiContract from '@mono-ex/api-contract';
	import { contract } from '@mono-ex/api-contract';
	import { createQuery } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';

	// const { contract } = apiContract;

	const client = initClient(contract, {
		baseUrl: '/api',
		baseHeaders: {}
	});

	// onMount(async () => {
	// 	const res = await client.getPreviousResults();
	// 	if (res.status === 200) {
	// 		response = res.body;
	// 	}
	// });

	let response: string;

	onMount(() => {
		fetch('/api')
			.then((res) => res.json())
			.then((json) => {
				console.log(json);
				response = json;
			});
	});

	const query = createQuery({
		queryKey: ['helloworld'],
		queryFn: async () => {
			const res = await client.getPreviousResults();
			console.log('whatever', res);
			if (res.status === 200) {
				return res.body;
			}
			throw new Error('Failed to fetch');
		}
	});
</script>

<div>
	<p>My component's hello world here:</p>
	<!-- {#if response}
		<p>{response}</p>
	{:else}
		<p>Loading</p>
	{/if} -->
	{#if $query.isLoading}
		<p>Loading...</p>
	{:else if $query.isError}
		<p>Error</p>
	{:else if $query.isSuccess}
		{#each $query.data as todo}
			<p>Success</p>
			<p>{todo}</p>
		{/each}
	{/if}
	<p>updated 2</p>
</div>

<style>
</style>
