import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import Stripe from 'npm:stripe';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"), {
    apiVersion: '2023-10-16',
});

Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!webhookSecret) {
        console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured');
        return Response.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    let event;

    try {
        const body = await req.text();
        event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
        console.log(`[Stripe Webhook] Received event: ${event.type}`);
    } catch (err) {
        console.error(`[Stripe Webhook] Signature verification failed:`, err.message);
        return Response.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                console.log(`[Stripe Webhook] Checkout completed for session: ${session.id}`);
                
                const userEmail = session.customer_email || session.metadata?.user_email;
                
                if (!userEmail) {
                    console.error('[Stripe Webhook] No user email found in session');
                    break;
                }

                const users = await base44.asServiceRole.entities.User.filter({ email: userEmail });
                
                if (!users || users.length === 0) {
                    console.error(`[Stripe Webhook] User not found: ${userEmail}`);
                    break;
                }

                const user = users[0];
                const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
                const priceId = lineItems.data[0]?.price?.id;

                console.log(`[Stripe Webhook] Processing payment for user ${userEmail}, priceId: ${priceId}`);

                // Assinatura Básica (R$29,90/mês) - substituir pelo price ID real
                if (priceId === 'price_1TD3VO1kul1So0t8kNKppACe') {
                    await base44.asServiceRole.entities.User.update(user.id, {
                        tipo_assinatura: 'basico',
                        subscription_status: 'active',
                        creditos_mensais_ia: 1,
                        trial_ends_at: null,
                    });
                    console.log(`[Stripe Webhook] Básico subscription activated for ${userEmail}`);
                }
                // Assinatura Premium (price_1T4qqs1kul1So0t8fmkBkmBc)
                else if (priceId === 'price_1T4qqs1kul1So0t8fmkBkmBc') {
                    await base44.asServiceRole.entities.User.update(user.id, {
                        tipo_assinatura: 'premium',
                        subscription_status: 'active',
                        creditos_mensais_ia: 18,
                        creditos_integracao_mensais: 720,
                        trial_ends_at: null,
                    });
                    console.log(`[Stripe Webhook] Premium subscription activated for ${userEmail}`);
                }
                // Pacotes de créditos extras
                // 8 créditos de mensagem = 8 x 40 = 320 créditos de integração
                else if (priceId === 'price_1T4qsV1kul1So0t8hA5spwBD') {
                    const novosCreditos = (user.creditos_extras || 0) + 8;
                    const novosIntegracao = (user.creditos_integracao_extras || 0) + 320;
                    await base44.asServiceRole.entities.User.update(user.id, {
                        creditos_extras: novosCreditos,
                        creditos_integracao_extras: novosIntegracao
                    });
                    console.log(`[Stripe Webhook] Added 8 message credits + 320 integration credits to ${userEmail}`);
                }
                // 16 créditos de mensagem = 16 x 40 = 640 créditos de integração
                else if (priceId === 'price_1T4qtW1kul1So0t83GKbzJRO') {
                    const novosCreditos = (user.creditos_extras || 0) + 16;
                    const novosIntegracao = (user.creditos_integracao_extras || 0) + 640;
                    await base44.asServiceRole.entities.User.update(user.id, {
                        creditos_extras: novosCreditos,
                        creditos_integracao_extras: novosIntegracao
                    });
                    console.log(`[Stripe Webhook] Added 16 message credits + 640 integration credits to ${userEmail}`);
                }
                // 24 créditos de mensagem = 24 x 40 = 960 créditos de integração
                else if (priceId === 'price_1T4quR1kul1So0t8H4VZJkmy') {
                    const novosCreditos = (user.creditos_extras || 0) + 24;
                    const novosIntegracao = (user.creditos_integracao_extras || 0) + 960;
                    await base44.asServiceRole.entities.User.update(user.id, {
                        creditos_extras: novosCreditos,
                        creditos_integracao_extras: novosIntegracao
                    });
                    console.log(`[Stripe Webhook] Added 24 message credits + 960 integration credits to ${userEmail}`);
                }

                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const customerEmail = subscription.customer_email;
                
                if (customerEmail) {
                    const users = await base44.asServiceRole.entities.User.filter({ email: customerEmail });
                    if (users && users.length > 0) {
                        await base44.asServiceRole.entities.User.update(users[0].id, {
                            tipo_assinatura: 'free',
                            subscription_status: 'cancelled',
                            creditos_mensais_ia: 0
                        });
                        console.log(`[Stripe Webhook] Subscription cancelled for ${customerEmail}`);
                    }
                }
                break;
            }

            default:
                console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }

        return Response.json({ received: true });

    } catch (error) {
        console.error('[Stripe Webhook] Processing error:', error.message, error.stack);
        return Response.json({ error: error.message }, { status: 500 });
    }
});