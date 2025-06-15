
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const SalesChart = () => {
  const { data: salesData, isLoading, error } = useQuery({
    queryKey: ['sales-chart-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales_data')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      // Transform the data to match the chart format
      return data?.map(item => ({
        month: new Date(item.date).toLocaleDateString('en-US', { month: 'short' }),
        revenue: Number(item.revenue),
        orders: item.orders
      })) || [];
    }
  });

  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-slate-500">Loading sales data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-red-500">Error loading sales data</div>
      </div>
    );
  }

  if (!salesData || salesData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-slate-500">No sales data available</div>
      </div>
    );
  }

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
