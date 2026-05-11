import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), {
    apiVersion: '2023-10-16',
});

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { session_id } = await req.json();

        if (!session_id) {
            return Response.json({ error: 'session_id é obrigatório' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ['line_items', 'line_items.data.price']
        });

        if (session.payment_status !== 'paid') {
            return Response.json({ success: false, message: 'Pagamento não confirmado' }, { status: 402 });
        }

        const priceId = session.line_items?.data[0]?.price?.id;
        const customerEmail = session.customer_email || session.metadata?.user_email;

        const isPremiumSubscription = priceId === 'price_1T4qqs1kul1So0t8fmkBkmBc';

        return Response.json({
            success: true,
            payment_status: session.payment_status,
            customer_email: customerEmail,
            price_id: priceId,
            is_premium_subscription: isPremiumSubscription,
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});