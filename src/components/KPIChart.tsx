
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const KPIChart = () => {
  const { data: kpiData, isLoading, error } = useQuery({
    queryKey: ['kpi-chart-data'],
    queryFn: async () => {
      const { data: salesData, error: salesError } = await supabase
        .from('sales_data')
        .select('*')
        .order('date', { ascending: true });
      
      if (salesError) throw salesError;
      
      // Transform the data to match the chart format
      return salesData?.map(item => ({
        month: new Date(item.date).toLocaleDateString('en-US', { month: 'short' }),
        conversionRate: Number(item.conversion_rate),
        avgOrderValue: Number(item.revenue) / Math.max(item.orders, 1),
        customerLifetime: Number(item.revenue) / Math.max(item.orders, 1) * 3 // Mock calculation
      })) || [];
    }
  });

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-slate-500">Loading performance data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-red-500">Error loading performance data</div>
      </div>
    );
  }

  if (!kpiData || kpiData.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-slate-500">No performance data available</div>
      </div>
    );
  }

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
              if (name === 'conversionRate') return [`${Number(value).toFixed(1)}%`, 'Conversion Rate'];
              if (name === 'avgOrderValue') return [`$${Number(value).toFixed(0)}`, 'Avg Order Value'];
              if (name === 'customerLifetime') return [`$${Number(value).toFixed(0)}`, 'Customer Lifetime Value'];
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
