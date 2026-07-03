<script>
	import { fade, fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import DOMPurify from 'dompurify';
	
	export let message;
	export let index = 0;
	
	let messageElement;
	let showSpeakerIndicator = false;
	
	// Create event dispatcher for retry functionality
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	
	$: isUser = message.isUser;
	$: displayTime = new Date(message.timestamp).toLocaleDateString('en-US', { 
		hour: '2-digit', 
		minute: '2-digit' 
	});
	$: messageStatus = message.status || 'sent';
	
	// Sanitize HTML content for safe rendering
	const formattedText = message.text.replace(/\n/g, '<br>');
$: sanitizedContent = DOMPurify.sanitize(formattedText, {
	ALLOWED_TAGS: [
		'b', 'i', 'em', 'strong', 'u', 'br', 'p', 'span', 'div',
		'code', 'pre', 'a', 'h1', 'h2', 'h3','h4','ul', 'ol', 'li'
	],
	ALLOWED_ATTR: ['style', 'class', 'href', 'target', 'rel'],
	ALLOW_DATA_ATTR: false
});
	
	function handleRetry() {
		dispatch('retry', { message });
	}
	
	onMount(() => {
		// Show speaker pulse for bot messages with 5-second loop
		if (!isUser) {
			showSpeakerIndicator = true;
			
			// Set up interval to repeat animation every 5 seconds
			const pulseInterval = setInterval(() => {
				showSpeakerIndicator = true;
				setTimeout(() => {
					showSpeakerIndicator = false;
				}, 2000);
			}, 5000);
			
			// Initial timeout for first animation
			setTimeout(() => {
				showSpeakerIndicator = false;
			}, 2000);
			
			// Cleanup interval on component destroy
			return () => clearInterval(pulseInterval);
		}
	});
</script>

<div 
	bind:this={messageElement}
	class="message-container mx-3.5 mb-4 relative max-w-[90%] sm:max-w-[85%] md:max-w-[80%] lg:max-w-[70%] {isUser ? 'ml-auto text-right' : 'mr-auto ml-6'}"
	in:fly={{ y: 30, duration: 500, delay: Math.min(index * 80, 300) }}
>
	<div 
		class="message mx-2.5 p-3 rounded-xl shadow-lg transition-all duration-300 relative z-10 {isUser 
			? 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white shadow-amber-500/30 hover:shadow-amber-500/50 hover:transform hover:-translate-y-1 hover:scale-102 hover:origin-right' 
			: 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-white shadow-gray-300/30 dark:shadow-gray-800/30 hover:shadow-gray-400/50 dark:hover:shadow-gray-700/50 hover:transform hover:-translate-y-1 hover:scale-102 hover:origin-left'}"
	>
		<div class="message-content">
			{@html sanitizedContent}
		</div>
	</div>
	
	<!-- Bot profile picture for bot messages -->
	{#if !isUser}
		<div class="absolute -left-8 top-[12px] w-8 h-8 z-0">
			<!-- Profile picture -->
			<img 
				src="/images/JackBot_icon.png" 
				alt="Jack BOT"
				class="w-full h-full rounded-full object-cover border-2 border-amber-400"
			/>
			
			<!-- Animated border when speaking -->
			{#if showSpeakerIndicator}
				<div 
					class="absolute inset-0 rounded-full border-2 border-amber-400 animate-border-pulse"
				></div>
			{/if}
		</div>
	{/if}
	
	<!-- Speaker indicator for user messages -->
	{#if isUser}
		<div 
			class="absolute -right-6 top-[18px] w-4 h-4 rounded-full bg-amber-400 shadow-purple-glow z-0"
		></div>
	{/if}
	
	<!-- Message status and timestamp -->
	<div class="message-meta flex items-center gap-2 mt-2 opacity-0 transition-opacity duration-200">
		<!-- Timestamp -->
		<div class="text-xs text-gray-600 dark:text-gray-500">
			{displayTime}
		</div>
		
		<!-- Status indicator for user messages -->
		{#if isUser}
			<div class="flex items-center gap-1">
				{#if messageStatus === 'sending'}
					<div class="w-3 h-3 border-2 border-gray-400 dark:border-gray-400 border-t-purple-400 rounded-full animate-spin"></div>
					<span class="text-xs text-gray-600 dark:text-gray-500">Sending...</span>
				{:else if messageStatus === 'sent'}
					<span class="text-xs text-green-400">✓</span>
				{:else if messageStatus === 'failed'}
					<span class="text-xs text-red-400" aria-label="Message failed">✗</span>
					<button 
						on:click={handleRetry}
						class="text-xs text-red-400 hover:text-red-300 underline focus:outline-none focus:ring-2 focus:ring-red-400 rounded px-1"
						aria-label="Retry sending message"
					>
						Retry
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.message-container:hover .message-meta {
		opacity: 1;
	}
</style>