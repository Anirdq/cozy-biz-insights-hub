
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const kpiData = [
  { month: 'Jan', conversionRate: 2.1, avgOrderValue: 150, customerLifetime: 450 },
  { month: 'Feb', conversionRate: 2.3, avgOrderValue: 155, customerLifetime: 460 },
  { month: 'Mar', conversionRate: 2.0, avgOrderValue: 148, customerLifetime: 440 },
  { month: 'Apr', conversionRate: 2.7, avgOrderValue: 162, customerLifetime: 485 },
  { month: 'May', conversionRate: 2.9, avgOrderValue: 168, customerLifetime: 510 },
  { month: 'Jun', conversionRate: 2.8, avgOrderValue: 165, customerLifetime: 495 },
  { month: 'Jul', conversionRate: 3.1, avgOrderValue: 172, customerLifetime: 520 },
  { month: 'Aug', conversionRate: 3.0, avgOrderValue: 170, customerLifetime: 515 },
  { month: 'Sep', conversionRate: 3.3, avgOrderValue: 178, customerLifetime: 535 },
  { month: 'Oct', conversionRate: 3.5, avgOrderValue: 182, customerLifetime: 550 },
  { month: 'Nov', conversionRate: 3.4, avgOrderValue: 180, customerLifetime: 545 },
  { month: 'Dec', conversionRate: 3.7, avgOrderValue: 185, customerLifetime: 560 }
];

export const KPIChart = () => {
  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={kpiData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="month" 
            className="text-sm" 
            stroke="#64748B"
          />
          <YAxis 
            yAxisId="left"
            className="text-sm" 
            stroke="#64748B"
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            className="text-sm" 
            stroke="#64748B"
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
            }}
            formatter={(value, name) => {
              if (name === 'conversionRate') return [`${value}%`, 'Conversion Rate'];
              if (name === 'avgOrderValue') return [`$${value}`, 'Avg Order Value'];
              if (name === 'customerLifetime') return [`$${value}`, 'Customer Lifetime Value'];
              return [value, name];
            }}
          />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="conversionRate" 
            stroke="#8B5CF6" 
            strokeWidth={3}
            name="Conversion Rate (%)"
            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="avgOrderValue" 
            stroke="#14B8A6" 
            strokeWidth={3}
            name="Avg Order Value ($)"
            dot={{ fill: '#14B8A6', strokeWidth: 2, r: 4 }}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="customerLifetime" 
            stroke="#F59E0B" 
            strokeWidth={3}
            name="Customer Lifetime Value ($)"
            dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
