<script>
	import { chat } from '$lib/stores/chat.js';
	import { fade } from 'svelte/transition';
	
	function clearChat() {
		// Clear all messages
		chat.clearMessages();
		
		// Send default welcome message like on first load
		setTimeout(() => {
			chat.addMessage({
				text: "Ahoy there, matey! Welcome aboard the Jack BOT ship! I be yer trusty AI first mate, ready to help ye navigate the digital seas. What adventure shall we embark on today?",
				isUser: false,
				timestamp: new Date().toISOString()
			});
		}, 500);
	}
</script>

<button
	on:click={clearChat}
	class="fixed top-4 sm:top-6 md:top-8 right-28 sm:right-32 md:right-40 z-[60] p-3 sm:p-4 rounded-full bg-amber-100/90 dark:bg-amber-900/80 backdrop-blur-sm border border-amber-300/50 dark:border-amber-600/50 transition-all duration-500 hover:scale-110 hover:bg-amber-200/90 dark:hover:bg-amber-800/90 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-lg touch-target-mobile"
	aria-label="Clear chat history"
	title="Clear chat history"
>
	<svg 
		class="w-5 h-5 text-red-600" 
		fill="currentColor" 
		viewBox="0 0 20 20"
		in:fade={{ duration: 200 }}
	>
		<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
	</svg>
</button>