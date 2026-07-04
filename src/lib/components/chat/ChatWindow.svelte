<script>
	import { onMount, afterUpdate } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { chat } from '$lib/stores/chat.js';
	import { audio } from '$lib/stores/audio.js';
	import ChatMessage from './ChatMessage.svelte';
	import ChatInput from './ChatInput.svelte';
	import TypingIndicator from './TypingIndicator.svelte';
	
	let chatContainer;
	let isAtBottom = true;
	
	// Auto-scroll to bottom when new messages arrive
	afterUpdate(() => {
		if (chatContainer && isAtBottom) {
			scrollToBottom();
		}
	});
	
	function scrollToBottom() {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}
	
	function handleScroll() {
		if (chatContainer) {
			const { scrollTop, scrollHeight, clientHeight } = chatContainer;
			isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
		}
	}
	
	async function handleMessage(event) {
		const messageText = event.detail.text;
		
		// Add user message with sending status
		const messageId = Date.now() + Math.random();
		chat.addMessage({
			id: messageId,
			text: messageText,
			isUser: true,
			timestamp: new Date().toISOString(),
			status: 'sending'
		});
		
		// Send to webhook
		await sendToWebhook(messageText, messageId);
	}
	
	async function sendToWebhook(message, messageId) {
		try {
			// Mark message as sent
			chat.updateMessageStatus(messageId, 'sent');
			
			// Set typing indicator
			chat.setTyping(true);
			
			const response = await fetch('/api/webhook', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					message: message,
					timestamp: new Date().toISOString(),
					user: 'anonymous'
				})
			});

			const typingTime = 1000 + Math.random() * 2000;

			// Our own /api/webhook route always replies with JSON. If we get
			// something else back - a redirect landed on it, or the status is
			// 401/403 - a reverse-proxy auth gate (e.g. an expired SSO
			// session) intercepted the request before it ever reached our
			// server code, not a real webhook/connection failure.
			const contentType = response.headers.get('content-type') || '';
			const isAuthIntercept = response.redirected
				|| response.status === 401
				|| response.status === 403
				|| !contentType.includes('application/json');

			if (isAuthIntercept) {
				chat.updateMessageStatus(messageId, 'failed');

				setTimeout(() => {
					chat.setTyping(false);
					chat.addMessage({
						text: "Arrr, yer session has run its course! Refresh the page to sign back in, then send that message again.",
						isUser: false,
						timestamp: new Date().toISOString(),
						status: 'received'
					});
				}, typingTime);
			} else if (response.ok) {
				const data = await response.json();

				setTimeout(() => {
					chat.setTyping(false);
					chat.addMessage({
						text: data.reply || 'Ahoy! I received your message, mate!',
						isUser: false,
						timestamp: new Date().toISOString(),
						status: 'received'
					});
				}, typingTime);
			} else {
				// Mark user message as failed
				chat.updateMessageStatus(messageId, 'failed');

				// Fallback response
				setTimeout(() => {
					chat.setTyping(false);
					chat.addMessage({
						text: 'Arrr! The connection seems to be having troubles, but I heard ye!',
						isUser: false,
						timestamp: new Date().toISOString(),
						status: 'received'
					});
				}, typingTime);
			}
		} catch (error) {
			console.error('Error sending message:', error);
			
			// Mark user message as failed
			chat.updateMessageStatus(messageId, 'failed');
			
			setTimeout(() => {
				chat.setTyping(false);
				chat.addMessage({
					text: 'Arrr! The seas be rough today, but I\'m still listening!',
					isUser: false,
					timestamp: new Date().toISOString(),
					status: 'received'
				});
			}, 1500);
		}
	}
	
	function handleRetry(event) {
		const { message } = event.detail;
		
		// Update message status to sending
		chat.updateMessageStatus(message.id, 'sending');
		
		// Retry sending the failed message
		sendToWebhook(message.text, message.id);
	}
	
	onMount(() => {
		// Preload pirate audio files
		import('$lib/utils/pirateAudio.js').then(({ preloadPirateSounds }) => {
			preloadPirateSounds();
		});
		
		// Welcome message if no messages exist
		if ($chat.messages.length === 0) {
			// Ensure typing is false initially
			chat.setTyping(false);
			
			setTimeout(() => {
				chat.addMessage({
					text: 'Ahoy there, matey! Welcome aboard the Jack BOT ship! I be yer trusty AI first mate, ready to help ye navigate the digital seas. What adventure shall we embark on today?',
					isUser: false,
					timestamp: new Date().toISOString(),
					status: 'received'
				});
			}, 1000);
		} else {
			// If messages exist, ensure typing is false
			chat.setTyping(false);
		}
	});
</script>

<div class="flex flex-col h-full">
	<!-- Chat Messages Container -->
	<div 
		class="flex-grow overflow-hidden rounded-2xl border border-indigo-200/70 dark:border-gray-600/50 backdrop-blur-sm shadow-lg shadow-black/20 dark:shadow-black/40 mb-5 bg-white/95 dark:bg-gray-800/90"
		in:fade={{ duration: 800, delay: 200 }}
	>
		<div 
			bind:this={chatContainer}
			on:scroll={handleScroll}
			role="log"
			aria-live="polite"
			aria-label="Chat conversation"
			class="h-full overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 custom-scrollbar"
			style="padding-top: 120px; mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.1) 2%, rgba(0,0,0,0.8) 20%, black 30%);"
		>
			{#each $chat.messages as message, index (message.id)}
				<ChatMessage {message} {index} on:retry={handleRetry} />
			{/each}
			
			<TypingIndicator isVisible={$chat.isTyping} />
		</div>
	</div>
	
	<!-- Chat Input -->
	<ChatInput on:message={handleMessage} />
</div>