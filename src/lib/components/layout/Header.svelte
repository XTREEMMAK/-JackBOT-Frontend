<script>
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	
	let logoElement;
	
	onMount(() => {
		// Add floating animation class after mount
		if (logoElement) {
			logoElement.classList.add('animate-float');
		}
	});
</script>

<div class="fixed top-1 sm:top-2 md:top-3 left-1/2 transform -translate-x-1/2 z-50 w-[50vw] h-32  sm:h-38  md:h-44  lg:h-56  xl:h-64  2xl:h-72">
	<img 
		bind:this={logoElement}
		src="/images/JackBot_logo.webp" 
		alt="Jack BOT Agent Logo"
		class="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(240,176,52,0.4)] transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(240,176,52,0.6)]"
		in:scale={{ duration: 800, delay: 200 }}
	/>
</div>

