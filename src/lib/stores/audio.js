import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createAudioStore() {
    const initialEnabled = browser ? (localStorage.getItem('audioEnabled') !== 'false') : true;
    const { subscribe, set, update } = writable(initialEnabled);

    let audioContext;
    const audioCache = new Map();

    const preloadSound = async (url) => {
        if (!browser || audioCache.has(url)) return;
        
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            audioCache.set(url, audioBuffer);
        } catch (error) {
            console.warn('Failed to preload sound:', url, error);
        }
    };

    const playSound = async (url, volume = 1.0) => {
        if (!browser) return;
        
        const enabled = localStorage.getItem('audioEnabled') !== 'false';
        if (!enabled) return;

        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }

            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            let audioBuffer = audioCache.get(url);
            
            if (!audioBuffer) {
                await preloadSound(url);
                audioBuffer = audioCache.get(url);
            }

            if (audioBuffer) {
                const source = audioContext.createBufferSource();
                const gainNode = audioContext.createGain();
                
                source.buffer = audioBuffer;
                gainNode.gain.value = volume;
                
                source.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                source.start();
            }
        } catch (error) {
            console.warn('Failed to play sound:', url, error);
        }
    };

    return {
        subscribe,
        toggle: () => update(enabled => {
            const newEnabled = !enabled;
            if (browser) {
                localStorage.setItem('audioEnabled', newEnabled.toString());
            }
            return newEnabled;
        }),
        playSound,
        preloadSound,
        preloadSounds: (urls) => {
            if (browser) {
                urls.forEach(url => preloadSound(url));
            }
        }
    };
}

export const audio = createAudioStore();