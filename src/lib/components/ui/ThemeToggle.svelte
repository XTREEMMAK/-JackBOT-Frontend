<script>
	import { theme } from '$lib/stores/theme.js';
	import { fade } from 'svelte/transition';
	
	function toggleTheme() {
		theme.toggle();
	}
</script>

<button
	on:click={toggleTheme}
	class="fixed top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 z-[60] p-3 sm:p-4 rounded-full bg-amber-100/90 dark:bg-amber-900/80 backdrop-blur-sm border border-amber-300/50 dark:border-amber-600/50 transition-all duration-500 hover:scale-110 hover:bg-amber-200/90 dark:hover:bg-amber-800/90 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-lg touch-target-mobile"
	aria-label="Toggle theme"
>
	{#if $theme === 'dark'}
		<svg 
			class="w-5 h-5 text-amber-600" 
			fill="currentColor" 
			viewBox="0 0 20 20"
			in:fade={{ duration: 200 }}
		>
			<path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
		</svg>
	{:else}
		<svg 
			class="w-5 h-5 text-purple-600" 
			fill="currentColor" 
			viewBox="0 0 20 20"
			in:fade={{ duration: 200 }}
		>
			<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
		</svg>
	{/if}
</button>