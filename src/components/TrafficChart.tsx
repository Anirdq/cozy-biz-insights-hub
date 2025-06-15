
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const TrafficChart = () => {
  const { data: trafficData, isLoading, error } = useQuery({
    queryKey: ['traffic-chart-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('traffic_data')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      // Transform data for pie chart - group by source or create mock sources
      const colors = ['#14B8A6', '#8B5CF6', '#F59E0B', '#EF4444', '#6366F1', '#10B981'];
      const sources = ['Organic Search', 'Direct', 'Social Media', 'Email', 'Referral', 'Paid Ads'];
      
      return data?.slice(0, 6).map((item, index) => ({
        source: sources[index] || `Source ${index + 1}`,
        visitors: item.visitors,
        color: colors[index] || '#64748B'
      })) || [];
    }
  });

  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-slate-500">Loading traffic data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-red-500">Error loading traffic data</div>
      </div>
    );
  }

  if (!trafficData || trafficData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-slate-500">No traffic data available</div>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="60%">
        <PieChart>
          <Pie
            data={trafficData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={30}
            paddingAngle={2}
            dataKey="visitors"
          >
            {trafficData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
            }}
            formatter={(value, name) => [value.toLocaleString(), 'Visitors']}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 space-y-2">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {trafficData.map((item, index) => (
            <div key={index} className="flex items-center min-w-0">
              <div 
                className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600 dark:text-slate-400 text-xs leading-tight">
                {item.source}: {item.visitors.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
