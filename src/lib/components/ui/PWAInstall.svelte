<script>
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	
	let showInstallPrompt = false;
	let deferredPrompt = null;
	let isInstalled = false;
	
	onMount(() => {
		// Check if already installed
		if (window.matchMedia('(display-mode: standalone)').matches || 
			window.navigator.standalone === true) {
			isInstalled = true;
			return;
		}
		
		// Listen for install prompt
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			deferredPrompt = e;
			showInstallPrompt = true;
		});
		
		// Listen for app installed
		window.addEventListener('appinstalled', () => {
			console.log('[PWA] App installed successfully');
			showInstallPrompt = false;
			isInstalled = true;
			deferredPrompt = null;
			
		});
	});
	
	async function handleInstall() {
		if (!deferredPrompt) return;
		
		// Show install prompt
		deferredPrompt.prompt();
		
		// Wait for user choice
		const { outcome } = await deferredPrompt.userChoice;
		
		if (outcome === 'accepted') {
			console.log('[PWA] User accepted install');
		} else {
			console.log('[PWA] User dismissed install');
		}
		
		// Clean up
		deferredPrompt = null;
		showInstallPrompt = false;
	}
	
	function dismissPrompt() {
		showInstallPrompt = false;
		deferredPrompt = null;
	}
</script>

{#if showInstallPrompt && !isInstalled}
	<div 
		class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-gray-300/50 dark:border-gray-600/50 shadow-lg p-4"
		in:scale={{ duration: 400, delay: 1000 }}
		out:fade={{ duration: 300 }}
	>
		<div class="flex items-start gap-3">
			<!-- App icon -->
			<div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
				<span class="text-white text-xl">⚓</span>
			</div>
			
			<!-- Content -->
			<div class="flex-grow">
				<h3 class="font-semibold text-gray-900 dark:text-white mb-1">
					Install Jack BOT Agent
				</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
					Add to your home screen for quick access and offline use!
				</p>
				
				<!-- Buttons -->
				<div class="flex gap-2 flex-col sm:flex-row">
					<button
						on:click={handleInstall}
						class="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white px-4 py-3 sm:py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 touch-target-mobile"
					>
						Install App
					</button>
					<button
						on:click={dismissPrompt}
						class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-4 py-3 sm:py-2 rounded-lg text-sm font-medium transition-colors duration-200 touch-target-mobile"
					>
						Maybe Later
					</button>
				</div>
			</div>
			
			<!-- Close button -->
			<button
				on:click={dismissPrompt}
				class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
				aria-label="Close install prompt"
			>
				<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
				</svg>
			</button>
		</div>
	</div>
{/if}

<!-- Offline indicator -->
<div class="offline-indicator fixed top-4 left-1/2 transform -translate-x-1/2 z-50 opacity-0 invisible transition-all duration-300">
	<div class="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
		⚠️ You're offline - some features may be limited
	</div>
</div>

<style>
	:global(body.offline .offline-indicator) {
		opacity: 1;
		visibility: visible;
	}
</style>