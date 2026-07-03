import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createThemeStore() {
    // Initialize with system preference or default to dark
    const initialTheme = browser 
        ? (localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
        : 'dark';
    
    const { subscribe, set, update } = writable(initialTheme);

    return {
        subscribe,
        toggle: () => update(theme => {
            const newTheme = theme === 'dark' ? 'light' : 'dark';
            if (browser) {
                localStorage.setItem('theme', newTheme);
                if (newTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
            return newTheme;
        }),
        set: (newTheme) => {
            if (browser) {
                localStorage.setItem('theme', newTheme);
                if (newTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
            return set(newTheme);
        },
        init: () => {
            if (browser) {
                const savedTheme = localStorage.getItem('theme');
                const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                const initialTheme = savedTheme || systemPreference;
                
                // Ensure dark class is properly applied
                if (initialTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
                set(initialTheme);
            }
        }
    };
}

export const theme = createThemeStore();