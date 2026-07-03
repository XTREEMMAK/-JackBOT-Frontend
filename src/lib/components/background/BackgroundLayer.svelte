<script>
	import { onMount } from 'svelte';
	
	export let type = 'gradient'; // 'gradient' or 'video'
	export let videoSrc = ''; // Path to video file
	export let imageSrc = ''; // Path to background image
	export let gradientClasses = 'from-amber-50 via-yellow-100 to-orange-200 dark:from-amber-950 dark:via-yellow-900 dark:to-orange-950';
	
	let videoElement;
	let isVideoLoaded = false;
	
	onMount(() => {
		if (type === 'video' && videoElement) {
			videoElement.addEventListener('loadeddata', () => {
				isVideoLoaded = true;
			});
		}
	});
</script>

<!-- Main Background Layer (Gradient OR Video) -->
{#if type === 'video' && videoSrc}
	<div class="fixed inset-0 -z-30">
		<!-- Fallback gradient while video loads -->
		{#if !isVideoLoaded}
			<div class="absolute inset-0 bg-gradient-to-br {gradientClasses} transition-all duration-700 ease-in-out"></div>
		{/if}
		
		<!-- Video background -->
		<video
			bind:this={videoElement}
			class="absolute inset-0 w-full h-full object-cover {isVideoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000"
			autoplay
			muted
			loop
			playsinline
		>
			<source src={videoSrc} type="video/mp4">
			<!-- Fallback for unsupported video -->
			<div class="absolute inset-0 bg-gradient-to-br {gradientClasses}"></div>
		</video>
	</div>
{:else}
	<!-- Gradient background (default) -->
	<div class="fixed inset-0 -z-30 bg-gradient-to-br {gradientClasses} animate-gradient transition-all duration-700 ease-in-out"></div>
{/if}

<!-- Overlay Layer (Always gradient or image for depth) -->
<div class="fixed inset-0 -z-20">
	{#if imageSrc}
		<div 
			class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-10 transition-all duration-700 ease-in-out"
			style="background-image: url('{imageSrc}')"
		></div>
	{:else}
		<div class="absolute inset-0 bg-gradient-to-br {gradientClasses} transition-all duration-700 ease-in-out"></div>
	{/if}
</div>

<!-- Top Fade Overlay (Subtle gradient for depth) -->
<div class="fixed inset-0 -z-10 bg-gradient-to-t from-orange-200/40 to-transparent dark:from-orange-950/30 transition-all duration-700 ease-in-out"></div>