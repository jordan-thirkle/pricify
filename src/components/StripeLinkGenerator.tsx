import React, { useState, useCallback } from 'react';

export const StripeLinkGenerator: React.FC = () => {
  const [productName, setProductName] = useState('Pro Plan');
  const [price, setPrice] = useState(29);
  const [interval, setInterval_] = useState<'month' | 'year' | 'one_time'>('month');
  const [description, setDescription] = useState('Full access to all features');
  const [copied, setCopied] = useState(false);

  const stripeLink = interval === 'one_time'
    ? `https://buy.stripe.com/test_${productName.toLowerCase().replace(/\s+/g, '-')}`
    : `https://buy.stripe.com/test_${productName.toLowerCase().replace(/\s+/g, '-')}_${interval}`;

  const checkoutCode = `import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe('pk_live_YOUR_KEY');
await stripe.redirectToCheckout({
  lineItems: [{
    price: 'price_XXXXXXXX',
    quantity: 1,
  }],
  mode: '${interval === 'one_time' ? 'payment' : 'subscription'}',
  successUrl: 'https://yoursite.com/success',
  cancelUrl: 'https://yoursite.com/cancel',
});`;

  const paymentLinkHtml = `<a href="https://buy.stripe.com/YOUR_LINK"
   class="your-button-class">
  Get ${productName} — $${price}${interval === 'one_time' ? '' : '/' + interval}
</a>`;

  const copyCode = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <p className="text-zinc-400 text-lg">Generate Stripe payment links and code snippets. No account needed for the generator.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="label" htmlFor="sl-name">Product name</label>
          <input id="sl-name" type="text" value={productName} onChange={e => setProductName(e.target.value)} className="input" placeholder="Pro Plan" />
        </div>
        <div>
          <label className="label" htmlFor="sl-price">Price ($)</label>
          <input id="sl-price" type="number" min="1" value={price} onChange={e => setPrice(parseInt(e.target.value) || 0)} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="sl-interval">Billing interval</label>
          <select id="sl-interval" value={interval} onChange={e => setInterval_(e.target.value as any)} className="input">
            <option value="month">Monthly subscription</option>
            <option value="year">Yearly subscription</option>
            <option value="one_time">One-time payment</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="sl-desc">Description</label>
          <input id="sl-desc" type="text" value={description} onChange={e => setDescription(e.target.value)} className="input" />
        </div>
      </div>

      <div className="card">
        <p className="text-sm text-zinc-500 mb-3">Payment Link HTML</p>
        <pre className="bg-black/50 rounded-xl p-4 text-sm font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap">{paymentLinkHtml}</pre>
        <button onClick={() => copyCode(paymentLinkHtml, 'HTML')} className="mt-3 text-sm text-emerald-400 hover:text-emerald-300 font-medium">
          {copied ? 'Copied' : 'Copy HTML'}
        </button>
      </div>

      <div className="card">
        <p className="text-sm text-zinc-500 mb-3">Stripe.js Checkout Code</p>
        <pre className="bg-black/50 rounded-xl p-4 text-sm font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap">{checkoutCode}</pre>
        <button onClick={() => copyCode(checkoutCode, 'JS')} className="mt-3 text-sm text-emerald-400 hover:text-emerald-300 font-medium">
          {copied ? 'Copied' : 'Copy Code'}
        </button>
      </div>

      <div className="card bg-emerald-500/5 border-emerald-500/20">
        <p className="text-emerald-400 font-semibold mb-1">Ready to accept payments?</p>
        <p className="text-zinc-400 text-sm">Create a Stripe account, generate a real payment link from your dashboard, and paste it into the HTML template above. The code snippets are ready to use with your own Stripe keys.</p>
      </div>
    </div>
  );
};
