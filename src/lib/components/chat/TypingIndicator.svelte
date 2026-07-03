<script>
	import { fade, scale, fly } from 'svelte/transition';
	import { onDestroy } from 'svelte';
	import { chat } from '$lib/stores/chat.js';
	
	export let isVisible = false;
	
	$: typingMessage = $chat.typingMessage;
	
	const pirateMessages = [
		'Jack is charting a course...',
		'The captain is thinking...',
		'Ahoy! Jack is preparing...',
		'Searching the treasure map...',
		'Jack is weighing anchor...'
	];
	
	let currentMessageIndex = 0;
	let messageInterval;
	
	$: if (isVisible) {
		// Clear any existing interval first
		if (messageInterval) {
			clearInterval(messageInterval);
		}
		messageInterval = setInterval(() => {
			currentMessageIndex = (currentMessageIndex + 1) % pirateMessages.length;
			// Only update the message, don't change the typing state
			chat.setTyping(isVisible, pirateMessages[currentMessageIndex]);
		}, 2000);
	} else {
		if (messageInterval) {
			clearInterval(messageInterval);
			messageInterval = null;
		}
		currentMessageIndex = 0;
	}
	
	onDestroy(() => {
		if (messageInterval) {
			clearInterval(messageInterval);
		}
	});
</script>

{#if isVisible}
	<div 
		class="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 mb-4 max-w-[95%] sm:max-w-[90%] md:max-w-[80%] rounded-xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 shadow-lg shadow-purple-500/20 border border-gray-300/30 dark:border-gray-600/30"
		in:fly={{ y: 10, duration: 400, delay: 100 }}
		out:fade={{ duration: 300 }}
	>
		<!-- Pirate-themed icon -->
		<div class="flex-shrink-0 w-6 h-6 flex items-center justify-center">
			<span class="text-amber-400 text-lg animate-bounce">⚓</span>
		</div>
		
		<!-- Dynamic typing message -->
		<span class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium" key={typingMessage}>
			{typingMessage}
		</span>
		
		<!-- Enhanced typing dots -->
		<div class="flex gap-1.5">
			<div class="w-2.5 h-2.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-typing-bounce shadow-sm"></div>
			<div class="w-2.5 h-2.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-typing-bounce shadow-sm"></div>
			<div class="w-2.5 h-2.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-typing-bounce shadow-sm"></div>
		</div>
	</div>
{/if}