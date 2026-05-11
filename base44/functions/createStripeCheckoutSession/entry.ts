import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), {
    apiVersion: '2023-10-16',
});

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            console.error('[Stripe Checkout] Unauthorized access attempt');
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { priceId, mode = 'subscription' } = await req.json();

        if (!priceId) {
            console.error('[Stripe Checkout] Missing priceId');
            return Response.json({ error: 'Missing priceId' }, { status: 400 });
        }

        console.log(`[Stripe Checkout] Creating session for user ${user.email}, priceId: ${priceId}, mode: ${mode}`);

        const origin = req.headers.get('origin') || 'https://portal-da-espiritualidade.base44.app';

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: mode,
            success_url: `${origin}/Home?payment=success`,
            cancel_url: `${origin}/Subscription?cancelled=true`,
            customer_email: user.email,
            metadata: {
                base44_app_id: Deno.env.get("BASE44_APP_ID"),
                user_id: user.id,
                user_email: user.email,
            },
        });

        console.log(`[Stripe Checkout] Session created successfully: ${session.id}`);
        return Response.json({ url: session.url, sessionId: session.id });

    } catch (error) {
        console.error("[Stripe Checkout] Error:", error.message, error.stack);
        return Response.json({ error: error.message }, { status: 500 });
    }
});