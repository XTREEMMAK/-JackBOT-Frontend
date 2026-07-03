import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createChatStore() {
    // Load messages from localStorage if available with error handling
    let initialMessages = [];
    if (browser) {
        try {
            initialMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
            
            // Validate that it's an array
            if (!Array.isArray(initialMessages)) {
                throw new Error('Invalid messages format');
            }
            
            // Clean up old messages to prevent unbounded growth (keep last 100 messages)
            if (initialMessages.length > 100) {
                initialMessages = initialMessages.slice(-100);
                localStorage.setItem('chatMessages', JSON.stringify(initialMessages));
            }
        } catch (error) {
            console.warn('Failed to load chat messages from localStorage:', error);
            initialMessages = [];
            // Clear corrupted data
            localStorage.removeItem('chatMessages');
        }
    }
    
    const { subscribe, set, update } = writable({
        messages: initialMessages,
        isTyping: false,
        isConnected: true,
        typingMessage: 'Jack is thinking...'
    });

    return {
        subscribe,
        addMessage: (message) => update(state => {
            const newMessage = {
                id: message.id || Date.now() + Math.random(),
                text: message.text,
                isUser: message.isUser,
                timestamp: message.timestamp || new Date().toISOString(),
                status: message.status || (message.isUser ? 'sent' : 'received')
            };
            
            // Play random pirate sound for bot messages
            if (!message.isUser && browser) {
                import('$lib/utils/pirateAudio.js').then(({ playRandomPirateSound }) => {
                    playRandomPirateSound();
                });
            }
            
            const newMessages = [...state.messages, newMessage];
            
            if (browser) {
                localStorage.setItem('chatMessages', JSON.stringify(newMessages));
            }
            
            return {
                ...state,
                messages: newMessages
            };
        }),
        setTyping: (isTyping, message = 'Jack is thinking...') => update(state => ({
            ...state,
            isTyping,
            typingMessage: message
        })),
        updateMessageStatus: (messageId, status) => update(state => {
            const updatedMessages = state.messages.map(msg => 
                msg.id === messageId ? { ...msg, status } : msg
            );
            
            if (browser) {
                localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
            }
            
            return {
                ...state,
                messages: updatedMessages
            };
        }),
        setConnected: (isConnected) => update(state => ({
            ...state,
            isConnected
        })),
        clearMessages: () => update(state => {
            if (browser) {
                localStorage.removeItem('chatMessages');
            }
            return {
                ...state,
                messages: []
            };
        })
    };
}

export const chat = createChatStore();