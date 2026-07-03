<script>
	import { audio } from '$lib/stores/audio.js';
	import { fade } from 'svelte/transition';
	
	function toggleAudio() {
		audio.toggle();
	}
</script>

<button
	on:click={toggleAudio}
	class="fixed top-4 sm:top-6 md:top-8 right-16 sm:right-20 md:right-24 z-[60] p-3 sm:p-4 rounded-full bg-amber-100/90 dark:bg-amber-900/80 backdrop-blur-sm border border-amber-300/50 dark:border-amber-600/50 transition-all duration-500 hover:scale-110 hover:bg-amber-200/90 dark:hover:bg-amber-800/90 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-lg touch-target-mobile"
	aria-label="Toggle audio"
>
	{#if $audio}
		<svg 
			class="w-5 h-5 text-green-600" 
			fill="currentColor" 
			viewBox="0 0 20 20"
			in:fade={{ duration: 200 }}
		>
			<path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.792L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.792a1 1 0 011.617.792zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" />
		</svg>
	{:else}
		<svg 
			class="w-5 h-5 text-red-600" 
			fill="currentColor" 
			viewBox="0 0 20 20"
			in:fade={{ duration: 200 }}
		>
			<path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.792L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.792a1 1 0 011.617.792zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd" />
		</svg>
	{/if}
</button>