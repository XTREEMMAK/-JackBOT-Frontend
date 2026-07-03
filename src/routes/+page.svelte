<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Header from '$lib/components/layout/Header.svelte';
	import ChatWindow from '$lib/components/chat/ChatWindow.svelte';
	import QuotesRotator from '$lib/components/ui/QuotesRotator.svelte';
	
	let isLoaded = false;
	
	onMount(() => {
		// Delay initial fade-in for smoother loading
		setTimeout(() => {
			isLoaded = true;
		}, 100);
		
		// Add keyboard shortcuts
		const handleKeyDown = (event) => {
			// Ctrl/Cmd + / to focus chat input
			if ((event.ctrlKey || event.metaKey) && event.key === '/') {
				event.preventDefault();
				const chatInput = document.querySelector('input[aria-label="Chat message input"]');
				if (chatInput) {
					chatInput.focus();
				}
			}
		};
		
		document.addEventListener('keydown', handleKeyDown);
		
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<svelte:head>
	<title>{import.meta.env.PUBLIC_APP_NAME} - The Pirate Assistant</title>
	<meta name="description" content="{import.meta.env.PUBLIC_APP_DESCRIPTION}" />
</svelte:head>

{#if isLoaded}
	<!-- Skip link for screen readers -->
	<a 
		href="#chat-input" 
		class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-amber-600 text-white px-4 py-2 rounded-lg z-50"
	>
		Skip to chat input
	</a>
	
	<div 
		class="min-h-screen flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 mobile-safe-area"
		in:fade={{ duration: 800 }}
	>
		<!-- Floating Logo Header -->
		<Header />
		
		<!-- Main App Container -->
		<div class="w-full max-w-3xl flex flex-col mt-16 sm:mt-18 md:mt-20 lg:mt-36 h-[calc(100vh-7rem)] sm:h-[calc(100vh-8rem)] md:h-[calc(100vh-9rem)]">
			<!-- Chat Window -->
			<div class="flex-grow min-h-0 mt-8">
				<ChatWindow />
			</div>
			
			<!-- Quote Section -->
			<div class="flex-shrink-0 mt-4">
				<QuotesRotator />
			</div>
		</div>
	</div>
{/if}
