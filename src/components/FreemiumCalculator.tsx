import React, { useState, useCallback } from 'react';

interface Inputs {
  freeUsers: number;
  conversionRate: number;
  premiumPrice: number;
  monthlyCosts: number;
}

export const FreemiumCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    freeUsers: 1000,
    conversionRate: 5,
    premiumPrice: 19,
    monthlyCosts: 500,
  });

  const handleChange = useCallback((field: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(e.target.value) || 0 }));
  }, []);

  const payingUsers = Math.round(inputs.freeUsers * (inputs.conversionRate / 100));
  const revenue = payingUsers * inputs.premiumPrice;
  const profit = revenue - inputs.monthlyCosts;
  const freeCost = inputs.monthlyCosts - (inputs.monthlyCosts * (inputs.conversionRate / 100));

  return (
    <div className="space-y-6">
      <p className="text-zinc-400 text-lg">See if freemium math works for your SaaS before you build it.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { label: 'Free users', field: 'freeUsers' as const, hint: 'Expected signups per month' },
          { label: 'Conversion rate (%)', field: 'conversionRate' as const, hint: 'Industry avg: 2-5%' },
          { label: 'Premium price ($/mo)', field: 'premiumPrice' as const, hint: 'What you charge paying users' },
          { label: 'Monthly costs ($)', field: 'monthlyCosts' as const, hint: 'Infrastructure + tools' },
        ].map(({ label, field, hint }) => (
          <div key={field}>
            <label className="label" htmlFor={`fm-${field}`}>{label}</label>
            <input id={`fm-${field}`} type="number" min="0" value={inputs[field]} onChange={handleChange(field)} className="input" />
            <p className="text-xs text-zinc-600 mt-1">{hint}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {[
          { label: 'Paying Users', value: payingUsers.toLocaleString(), color: 'text-emerald-400', desc: `${inputs.conversionRate}% of ${inputs.freeUsers.toLocaleString()} free users` },
          { label: 'Monthly Revenue', value: `$${revenue.toLocaleString()}`, color: 'text-blue-400', desc: `${payingUsers} × $${inputs.premiumPrice}/mo` },
          { label: 'Monthly Profit', value: profit >= 0 ? `$${profit.toLocaleString()}` : `-$${Math.abs(profit).toLocaleString()}`, color: profit >= 0 ? 'text-amber-400' : 'text-red-400', desc: profit >= 0 ? 'Sustainable freemium' : 'Needs higher conversion or price' },
        ].map(({ label, value, color, desc }) => (
          <div key={label} className="card text-center">
            <p className="text-sm text-zinc-500 mb-1">{label}</p>
            <p className={`text-3xl font-bold font-mono ${color}`}>{value}</p>
            <p className="text-xs text-zinc-600 mt-1">{desc}</p>
          </div>
        ))}
      </div>

      {profit < 0 && (
        <div className="card border-red-500/20 bg-red-500/5">
          <p className="text-red-400 font-semibold">Your freemium model is losing money.</p>
          <p className="text-zinc-400 text-sm mt-1">Try raising the conversion rate above {Math.ceil((inputs.monthlyCosts / inputs.premiumPrice) / inputs.freeUsers * 10000) / 100}%, increasing the premium price, or reducing monthly costs.</p>
        </div>
      )}
    </div>
  );
};
