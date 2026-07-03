<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores/theme.js';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import AudioToggle from '$lib/components/ui/AudioToggle.svelte';
	import ClearChatButton from '$lib/components/ui/ClearChatButton.svelte';
	import PWAInstall from '$lib/components/ui/PWAInstall.svelte';
	import BackgroundLayer from '$lib/components/background/BackgroundLayer.svelte';
	
	let { children } = $props();
	
	// Background configuration - easily switch between gradient/video
	let backgroundType = 'gradient'; // Change to 'video' to use video background
	let videoSource = '/videos/pirate-ocean.mp4'; // Add your video file path
	let overlayImage = ''; // Optional overlay image path
	
	onMount(() => {
		// Initialize theme properly
		theme.init();
	});
</script>

<div class="min-h-screen text-gray-900 dark:text-white transition-all duration-700 ease-in-out">
	<!-- Background Component (supports gradient OR video) -->
	<BackgroundLayer 
		type={backgroundType} 
		videoSrc={videoSource} 
		imageSrc={overlayImage}
	/>
	
	<!-- Theme, Audio, and Clear Chat toggles -->
	<ThemeToggle />
	<AudioToggle />
	<ClearChatButton />
	
	<!-- PWA Install prompt -->
	<PWAInstall />
	
	<!-- Main content -->
	{@render children()}
</div>
