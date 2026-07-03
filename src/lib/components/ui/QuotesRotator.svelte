<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	
	const quotes = [
		'"If buying isn\'t owning, then pirating isn\'t stealing" - Pirate Proverb',
		'"Dead men tell no tales, but they sure do leave behind some shiny loot!" - Captain Redbeard',
		'"Why is the rum always gone? Because pirates drink it all!" - Jack Sparrow-ish',
		'"Heave ho, me hearties, and let\'s find some treasure!" - Every Pirate Ever',
		'"A smooth sea never made a skilled pirate." - Pirate Wisdom',
		'"Not all treasure is silver and gold, mate." - Captain Jack',
		'"Take what you can, give nothing back!" - Pirates Code',
		'"The sea calls to those with adventure in their hearts." - Old Salt'
	];
	
	let currentQuoteIndex = 0;
	let currentQuote = quotes[0];
	let isVisible = true;
	
	onMount(() => {
		const interval = setInterval(() => {
			isVisible = false;
			
			setTimeout(() => {
				currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
				currentQuote = quotes[currentQuoteIndex];
				isVisible = true;
			}, 500);
		}, 5000);
		
		return () => clearInterval(interval);
	});
</script>

<div 
	class="relative flex items-center justify-end gap-3 sm:gap-4 min-h-16 sm:min-h-20 px-3 sm:px-4 py-2"
	in:fly={{ y: 50, duration: 800, delay: 1200 }}
>
	{#if isVisible}
		<!-- Speech bubble -->
		<div 
			class="relative bg-white/90 dark:bg-gray-800/90 rounded-2xl p-3 sm:p-4 shadow-lg border border-gray-300/50 dark:border-gray-600/50 max-w-s"
			in:fade={{ duration: 500 }}
			out:fade={{ duration: 500 }}
		>
			<div class="text-gray-700 dark:text-gray-300 italic text-xs sm:text-sm">
				{currentQuote}
			</div>
			<!-- Speech bubble tail pointing right -->
			<div class="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2 w-0 h-0 border-l-[8px] border-l-white/90 dark:border-l-gray-800/90 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"></div>
		</div>
	{/if}
	
	<!-- Pirate character -->
	<img 
		src="/images/PirateProfile.webp" 
		alt="Pirate decoration"
		class="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover opacity-80 transition-all duration-300 hover:opacity-100 hover:scale-110 shadow-md flex-shrink-0"
	/>
</div>