import { db } from ".";
import { webhooks } from "./schema";
import { faker } from '@faker-js/faker';

// Eventos comuns do Stripe
const stripeEvents = [
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'charge.succeeded',
  'charge.failed',
  'customer.created',
  'customer.updated',
  'customer.deleted',
  'invoice.created',
  'invoice.finalized',
  'invoice.paid',
  'invoice.payment_failed',
  'subscription.created',
  'subscription.updated',
  'subscription.deleted',
  'checkout.session.completed',
  'payment_method.attached',
  'setup_intent.succeeded',
  'payout.created',
  'payout.paid',
  'refund.created'
];

function generateStripeWebhook() {
  const eventType = faker.helpers.arrayElement(stripeEvents);
  const customerId = `cus_${faker.string.alphanumeric(14)}`;
  const paymentIntentId = `pi_${faker.string.alphanumeric(24)}`;
  const chargeId = `ch_${faker.string.alphanumeric(24)}`;
  const invoiceId = `in_${faker.string.alphanumeric(24)}`;
  const subscriptionId = `sub_${faker.string.alphanumeric(24)}`;
  
  // Simular diferentes tipos de body baseado no evento
  let body: any = {
    id: `evt_${faker.string.alphanumeric(24)}`,
    object: "event",
    api_version: "2023-10-16",
    created: Math.floor(Date.now() / 1000),
    type: eventType,
    livemode: faker.datatype.boolean(),
    pending_webhooks: faker.number.int({ min: 0, max: 3 }),
    request: {
      id: `req_${faker.string.alphanumeric(24)}`,
      idempotency_key: faker.string.uuid()
    }
  };

  // Customizar o data baseado no tipo de evento
  switch (eventType) {
    case 'payment_intent.succeeded':
    case 'payment_intent.payment_failed':
      body.data = {
        object: {
          id: paymentIntentId,
          object: "payment_intent",
          amount: faker.number.int({ min: 1000, max: 50000 }),
          currency: faker.helpers.arrayElement(['usd', 'eur', 'brl']),
          customer: customerId,
          status: eventType.includes('succeeded') ? 'succeeded' : 'requires_payment_method',
          metadata: {
            order_id: faker.string.alphanumeric(10)
          }
        }
      };
      break;

    case 'charge.succeeded':
    case 'charge.failed':
      body.data = {
        object: {
          id: chargeId,
          object: "charge",
          amount: faker.number.int({ min: 1000, max: 50000 }),
          currency: faker.helpers.arrayElement(['usd', 'eur', 'brl']),
          customer: customerId,
          paid: eventType.includes('succeeded'),
          status: eventType.includes('succeeded') ? 'succeeded' : 'failed'
        }
      };
      break;

    case 'customer.created':
    case 'customer.updated':
    case 'customer.deleted':
      body.data = {
        object: {
          id: customerId,
          object: "customer",
          email: faker.internet.email(),
          name: faker.person.fullName(),
          created: Math.floor(Date.now() / 1000)
        }
      };
      break;

    case 'invoice.created':
    case 'invoice.finalized':
    case 'invoice.paid':
    case 'invoice.payment_failed':
      body.data = {
        object: {
          id: invoiceId,
          object: "invoice",
          amount_due: faker.number.int({ min: 1000, max: 50000 }),
          currency: faker.helpers.arrayElement(['usd', 'eur', 'brl']),
          customer: customerId,
          subscription: subscriptionId,
          status: eventType.includes('paid') ? 'paid' : eventType.includes('failed') ? 'open' : 'draft'
        }
      };
      break;

    case 'subscription.created':
    case 'subscription.updated':
    case 'subscription.deleted':
      body.data = {
        object: {
          id: subscriptionId,
          object: "subscription",
          customer: customerId,
          status: eventType.includes('deleted') ? 'canceled' : 'active',
          current_period_start: Math.floor(Date.now() / 1000),
          current_period_end: Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000)
        }
      };
      break;

    case 'checkout.session.completed':
      body.data = {
        object: {
          id: `cs_${faker.string.alphanumeric(200)}`,
          object: "checkout.session",
          amount_total: faker.number.int({ min: 1000, max: 50000 }),
          currency: faker.helpers.arrayElement(['usd', 'eur', 'brl']),
          customer: customerId,
          payment_status: "paid",
          status: "complete"
        }
      };
      break;

    default:
      body.data = {
        object: {
          id: faker.string.alphanumeric(24),
          object: eventType.split('.')[0]
        }
      };
  }

  return {
    method: 'POST',
    pathname: '/stripe',
    ip: faker.internet.ip(),
    contentType: 'application/json',
    contentLength: JSON.stringify(body).length,
    queryParams: {},
    headers: {
      'content-type': 'application/json',
      'stripe-signature': `t=${Math.floor(Date.now() / 1000)},v1=${faker.string.alphanumeric(64)}`,
      'user-agent': 'Stripe/1.0 (+https://stripe.com/docs/webhooks)',
      'accept': '*/*',
      'accept-encoding': 'gzip',
      'host': faker.internet.domainName(),
      'x-forwarded-for': faker.internet.ip(),
      'x-forwarded-proto': 'https'
    },
    body: JSON.stringify(body, null, 2)
  };
}

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...');
  
  try {
    // Gerar 60 webhooks do Stripe
    const webhookData = Array.from({ length: 60 }, () => generateStripeWebhook());
    
    // Inserir todos os webhooks
    const result = await db.insert(webhooks).values(webhookData).returning();
    
    console.log(`✅ Seed concluído! ${result.length} webhooks inseridos.`);
    console.log('📊 Estatísticas:');
    
    // Contar eventos por tipo
    const eventCounts = webhookData.reduce((acc, webhook) => {
      const eventType = JSON.parse(webhook.body).type;
      acc[eventType] = (acc[eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(eventCounts).forEach(([event, count]) => {
      console.log(`   ${event}: ${count}`);
    });
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  }
}

seed().then(() => {
  console.log('🎉 Seed finalizado com sucesso!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Falha no seed:', error);
  process.exit(1);
});