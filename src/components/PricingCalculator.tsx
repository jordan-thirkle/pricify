import React, { useState, useCallback } from 'react';

interface Inputs {
  monthlyCosts: number;
  targetMargin: number;
  targetCustomers: number;
  competitorPriceLow: number;
  competitorPriceHigh: number;
}

export const PricingCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    monthlyCosts: 200,
    targetMargin: 70,
    targetCustomers: 100,
    competitorPriceLow: 15,
    competitorPriceHigh: 49,
  });

  const handleChange = useCallback((field: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(e.target.value) || 0 }));
  }, []);

  const costPerCustomer = inputs.monthlyCosts / Math.max(inputs.targetCustomers, 1);
  const rawPrice = costPerCustomer / ((100 - inputs.targetMargin) / 100);
  const competitorMid = (inputs.competitorPriceLow + inputs.competitorPriceHigh) / 2;
  const recommendedPrice = Math.round((rawPrice + competitorMid) / 2);
  const projectedMRR = recommendedPrice * inputs.targetCustomers;
  const projectedProfit = projectedMRR - inputs.monthlyCosts;

  return (
    <div className="space-y-6">
      <p className="text-zinc-400 text-lg">Enter your numbers. Get a price that works for you and your customers.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { label: 'Monthly costs ($)', field: 'monthlyCosts' as const, hint: 'Servers, tools, subscriptions' },
          { label: 'Target profit margin (%)', field: 'targetMargin' as const, hint: '70% is healthy for SaaS' },
          { label: 'Target customer count', field: 'targetCustomers' as const, hint: 'Realistic first-year goal' },
          { label: 'Competitor low price ($)', field: 'competitorPriceLow' as const, hint: 'Cheapest alternative' },
          { label: 'Competitor high price ($)', field: 'competitorPriceHigh' as const, hint: 'Most expensive alternative' },
        ].map(({ label, field, hint }) => (
          <div key={field}>
            <label className="label" htmlFor={field}>{label}</label>
            <input id={field} type="number" min="0" value={inputs[field]} onChange={handleChange(field)} className="input" />
            <p className="text-xs text-zinc-600 mt-1">{hint}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {[
          { label: 'Your Price', value: `$${recommendedPrice}/mo`, color: 'text-emerald-400', desc: 'Recommended monthly price' },
          { label: 'Monthly Revenue', value: `$${projectedMRR.toLocaleString()}`, color: 'text-blue-400', desc: `At ${inputs.targetCustomers} customers` },
          { label: 'Monthly Profit', value: `$${projectedProfit.toLocaleString()}`, color: 'text-amber-400', desc: `${inputs.targetMargin}% margin target` },
        ].map(({ label, value, color, desc }) => (
          <div key={label} className="card text-center">
            <p className="text-sm text-zinc-500 mb-1">{label}</p>
            <p className={`text-3xl font-bold font-mono ${color}`}>{value}</p>
            <p className="text-xs text-zinc-600 mt-1">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
