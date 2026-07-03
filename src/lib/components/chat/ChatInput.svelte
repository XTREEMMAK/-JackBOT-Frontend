<script>
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	
	const dispatch = createEventDispatcher();
	
	let inputValue = '';
	let inputElement;
	let isFocused = false;
	let isSubmitting = false;
	
	$: characterCount = inputValue.length;
	$: isNearLimit = characterCount > 800;
	$: isAtLimit = characterCount >= 1000;
	
	function sanitizeInput(text) {
		// Basic XSS prevention and cleanup
		return text
			.trim()
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#x27;')
			.replace(/\//g, '&#x2F;')
			.substring(0, 1000); // Enforce max length
	}
	
	async function handleSubmit() {
		if (isSubmitting || isAtLimit) return;
		
		const sanitizedInput = sanitizeInput(inputValue);
		
		if (sanitizedInput && sanitizedInput.length > 0) {
			isSubmitting = true;
			
			
			dispatch('message', { text: sanitizedInput });
			inputValue = '';
			
			// Reset submitting state after a short delay
			setTimeout(() => {
				isSubmitting = false;
			}, 1000);
		}
	}
	
	function handleKeydown(event) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			handleSubmit();
		}
	}
	
	function handleFocus() {
		isFocused = true;
	}
	
	function handleBlur() {
		isFocused = false;
	}
</script>

<div 
	class="w-full bg-white/90 dark:bg-gray-800/50 border border-indigo-200/70 dark:border-gray-600/50 rounded-2xl mb-5 backdrop-blur-sm transition-all duration-300 {isFocused ? 'transform scale-105 shadow-2xl shadow-amber-500/30 dark:shadow-amber-400/40 border-amber-400/60 dark:border-amber-500/50 rounded-3xl' : ''}"
	in:fade={{ duration: 500, delay: 300 }}
>
	<div class="flex gap-3 p-2">
		<input
			id="chat-input"
			bind:this={inputElement}
			bind:value={inputValue}
			on:keydown={handleKeydown}
			on:focus={handleFocus}
			on:blur={handleBlur}
			type="text"
			placeholder="Type your message..."
			aria-label="Chat message input"
			aria-describedby="send-button"
			maxlength="1000"
			class="flex-grow bg-transparent border-none text-gray-900 dark:text-white text-sm sm:text-base p-3 sm:p-4 outline-none placeholder-gray-500 dark:placeholder-gray-400"
		/>
		<button
			id="send-button"
			on:click={handleSubmit}
			disabled={!inputValue.trim() || isSubmitting || isAtLimit}
			aria-label="Send message"
			class="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed border-none rounded-xl px-4 sm:px-6 py-3 sm:py-3 text-white cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/40 active:transform active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-purple-500 touch-target-mobile"
		>
			{#if isSubmitting}
				<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
			{:else}
				<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
					<path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
				</svg>
			{/if}
		</button>
	</div>
	
	<!-- Character counter -->
	{#if isFocused && characterCount > 0}
		<div class="text-xs text-gray-500 dark:text-gray-400 text-right mt-1 px-2">
			<span class:text-orange-500={isNearLimit} class:text-red-500={isAtLimit}>
				{characterCount}/1000
			</span>
			{#if isAtLimit}
				<span class="text-red-500 ml-2">Character limit reached</span>
			{/if}
		</div>
	{/if}
</div>