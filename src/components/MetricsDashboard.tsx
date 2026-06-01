import React, { useState, useCallback } from 'react';

interface Inputs {
  mrr: number;
  customers: number;
  monthlyChurn: number;
  acquisitionCost: number;
  avgRevenuePerUser: number;
}

export const MetricsDashboard: React.FC = () => {
  const [inputs, setInputs] = useState<Inputs>({
    mrr: 5000,
    customers: 200,
    monthlyChurn: 3,
    acquisitionCost: 50,
    avgRevenuePerUser: 25,
  });

  const handleChange = useCallback((field: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prev => ({ ...prev, [field]: parseFloat(e.target.value) || 0 }));
  }, []);

  const churnedPerMonth = Math.round(inputs.customers * (inputs.monthlyChurn / 100));
  const avgLifetime = inputs.monthlyChurn > 0 ? Math.round(1 / (inputs.monthlyChurn / 100)) : 0;
  const ltv = avgLifetime * inputs.avgRevenuePerUser;
  const ltvCacRatio = inputs.acquisitionCost > 0 ? (ltv / inputs.acquisitionCost) : 0;
  const arr = inputs.mrr * 12;
  const arpu = inputs.customers > 0 ? Math.round(inputs.mrr / inputs.customers) : 0;

  return (
    <div className="space-y-6">
      <p className="text-zinc-400 text-lg">The numbers that matter. MRR, churn, LTV — all in one place.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { label: 'MRR ($)', field: 'mrr' as const, hint: 'Monthly recurring revenue' },
          { label: 'Total customers', field: 'customers' as const, hint: 'Active paying customers' },
          { label: 'Monthly churn (%)', field: 'monthlyChurn' as const, hint: 'Customers lost per month' },
          { label: 'CAC ($)', field: 'acquisitionCost' as const, hint: 'Cost to acquire one customer' },
        ].map(({ label, field, hint }) => (
          <div key={field}>
            <label className="label" htmlFor={`m-${field}`}>{label}</label>
            <input id={`m-${field}`} type="number" min="0" value={inputs[field]} onChange={handleChange(field)} className="input" />
            <p className="text-xs text-zinc-600 mt-1">{hint}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        {[
          { label: 'ARR', value: `$${arr.toLocaleString()}`, color: 'text-emerald-400', desc: 'Annual run rate' },
          { label: 'LTV', value: `$${ltv.toLocaleString()}`, color: 'text-blue-400', desc: `${avgLifetime} month avg lifetime` },
          { label: 'LTV:CAC', value: ltvCacRatio.toFixed(1) + ':1', color: ltvCacRatio >= 3 ? 'text-emerald-400' : ltvCacRatio >= 1 ? 'text-amber-400' : 'text-red-400', desc: ltvCacRatio >= 3 ? 'Excellent' : ltvCacRatio >= 1 ? 'Marginal' : 'Unsustainable' },
          { label: 'Churned/mo', value: churnedPerMonth.toString(), color: inputs.monthlyChurn <= 3 ? 'text-emerald-400' : 'text-red-400', desc: `${inputs.monthlyChurn}% of ${inputs.customers} customers` },
        ].map(({ label, value, color, desc }) => (
          <div key={label} className="card text-center">
            <p className="text-sm text-zinc-500 mb-1">{label}</p>
            <p className={`text-2xl md:text-3xl font-bold font-mono ${color}`}>{value}</p>
            <p className="text-xs text-zinc-600 mt-1">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
