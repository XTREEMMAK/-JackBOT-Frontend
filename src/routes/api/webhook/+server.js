import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
export async function POST({ request, cookies }) {
    try {
        const body = await request.json();
        const { message, timestamp, user } = body;

        // Forward to the actual webhook
        const webhookResponse = await fetch(env.WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                timestamp,
                user
            })
        });

        if (webhookResponse.ok) {
            const data = await webhookResponse.json();
            
            // Return the webhook response or generate a pirate-themed response
            return json({
                reply: data.reply || generatePirateResponse(message),
                status: 'success',
                timestamp: new Date().toISOString()
            });
        } else {
            // Fallback if webhook fails
            return json({
                reply: generatePirateResponse(message),
                status: 'webhook_failed',
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Webhook error:', error);
        
        // Fallback response
        return json({
            reply: "Arrr! The seas be rough today, but I'm still here to help ye!",
            status: 'error',
            timestamp: new Date().toISOString()
        });
    }
}

function generatePirateResponse(message) {
    const pirateResponses = [
        "Ahoy matey! I hear what ye be sayin'!",
        "Arrr! That be an interesting tale ye tell!",
        "Shiver me timbers, that's quite a message!",
        "Yo ho ho! I be listenin' to every word!",
        "Batten down the hatches, that's some fine thinkin'!",
        "Avast ye! I be at yer service!",
        "Blimey! Ye got me attention there!",
        "By the beard of Blackbeard, that be noteworthy!",
        "Splice the mainbrace! I understand ye well!",
        "Heave ho! Let me think on that for ye!"
    ];
    
    return pirateResponses[Math.floor(Math.random() * pirateResponses.length)];
}