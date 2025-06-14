
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const salesData = [
  { month: 'Jan', revenue: 4200, orders: 28 },
  { month: 'Feb', revenue: 5100, orders: 34 },
  { month: 'Mar', revenue: 4800, orders: 31 },
  { month: 'Apr', revenue: 6200, orders: 42 },
  { month: 'May', revenue: 7100, orders: 48 },
  { month: 'Jun', revenue: 6900, orders: 46 },
  { month: 'Jul', revenue: 8200, orders: 55 },
  { month: 'Aug', revenue: 7800, orders: 52 },
  { month: 'Sep', revenue: 8900, orders: 59 },
  { month: 'Oct', revenue: 9400, orders: 63 },
  { month: 'Nov', revenue: 10200, orders: 68 },
  { month: 'Dec', revenue: 11500, orders: 76 }
];

export const SalesChart = () => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="month" 
            className="text-sm" 
            stroke="#64748B"
          />
          <YAxis 
            className="text-sm" 
            stroke="#64748B"
            tickFormatter={(value) => `$${value/1000}k`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
            }}
            formatter={(value, name) => [
              name === 'revenue' ? `$${value.toLocaleString()}` : value,
              name === 'revenue' ? 'Revenue' : 'Orders'
            ]}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#3B82F6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
