<script>
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Header from '$lib/components/layout/Header.svelte';
	
	let isOnline = true;
	
	onMount(() => {
		// Check initial connection status
		isOnline = navigator.onLine;
		
		
		// Listen for connection changes
		const handleOnline = () => {
			isOnline = true;
			// Auto-redirect when back online
			setTimeout(() => {
				window.location.href = '/';
			}, 1000);
		};
		
		const handleOffline = () => {
			isOnline = false;
		};
		
		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);
		
		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	});
	
	function handleRetry() {
		if (navigator.onLine) {
			window.location.href = '/';
		} else {
			window.location.reload();
		}
	}
</script>

<svelte:head>
	<title>Offline - Jack BOT Agent</title>
	<meta name="description" content="Jack BOT Agent is currently offline. Check your connection and try again." />
</svelte:head>

<div class="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 mobile-safe-area" in:fade={{ duration: 800 }}>
	<Header />
	
	<div class="text-center max-w-md mt-20 sm:mt-24 md:mt-32">
		<div class="text-6xl mb-6 animate-bounce">
			{#if isOnline}
				⚓
			{:else}
				🏴‍☠️
			{/if}
		</div>
		
		{#if isOnline}
			<h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Connection Restored!</h1>
			<p class="text-gray-600 dark:text-gray-300 mb-6">
				Ahoy! The winds have changed and we're back online. 
				Redirecting ye to the main deck...
			</p>
		{:else}
			<h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Offline Mode</h1>
			<p class="text-gray-600 dark:text-gray-300 mb-6">
				Arrr! Ye seem to be sailing in uncharted waters without an internet connection. 
				Check yer connection and try again, matey!
			</p>
		{/if}
		
		<div class="space-y-4">
			<button 
				on:click={handleRetry}
				class="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-600 px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/40 w-full"
			>
				{isOnline ? 'Return to App' : 'Try Again'}
			</button>
			
			<div class="text-sm text-gray-500 dark:text-gray-400">
				<p>📶 Connection Status: <span class="font-semibold {isOnline ? 'text-green-500' : 'text-red-500'}">{isOnline ? 'Online' : 'Offline'}</span></p>
			</div>
		</div>
		
		<!-- Offline features -->
		{#if !isOnline}
			<div class="mt-8 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-300/50 dark:border-gray-600/50 backdrop-blur-sm">
				<h3 class="font-semibold text-gray-900 dark:text-white mb-2">⚓ Offline Features</h3>
				<ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
					<li>• Previous messages are cached</li>
					<li>• App interface remains functional</li>
					<li>• Theme and audio settings preserved</li>
				</ul>
			</div>
		{/if}
	</div>
</div>