// Pirate audio system for chat messages
// Randomly plays pirate sound effects from static/audio/

import { audio } from '$lib/stores/audio.js';
import { get } from 'svelte/store';

const PIRATE_SOUNDS = [
    '/audio/pirate1.mp3',
    '/audio/pirate2.mp3',
    '/audio/pirate3.mp3'
];

// Randomly decide whether to play a sound (50% chance)
function shouldPlaySound() {
    return Math.random() > 0.5;
}

// Get a random pirate sound file
function getRandomPirateSound() {
    const randomIndex = Math.floor(Math.random() * PIRATE_SOUNDS.length);
    return PIRATE_SOUNDS[randomIndex];
}

// Play a random pirate sound with random chance
export function playRandomPirateSound() {
    // Check if audio is enabled
    const audioEnabled = get(audio);
    if (!audioEnabled) return;
    
    // Random chance to play sound
    if (!shouldPlaySound()) return;
    
    const soundFile = getRandomPirateSound();
    
    try {
        // Use the audio store's playSound method
        audio.playSound(soundFile, 0.6); // Lower volume for ambient sounds
    } catch (error) {
        console.warn('Failed to play pirate sound:', error);
    }
}

// Preload all pirate sounds
export function preloadPirateSounds() {
    audio.preloadSounds(PIRATE_SOUNDS);
}