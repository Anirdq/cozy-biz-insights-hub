
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const trafficData = [
  { source: 'Organic Search', visitors: 4200, color: '#14B8A6' },
  { source: 'Direct', visitors: 3100, color: '#8B5CF6' },
  { source: 'Social Media', visitors: 2400, color: '#F59E0B' },
  { source: 'Email', visitors: 1800, color: '#EF4444' },
  { source: 'Referral', visitors: 1200, color: '#6366F1' },
  { source: 'Paid Ads', visitors: 800, color: '#10B981' }
];

export const TrafficChart = () => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
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
      <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
        {trafficData.map((item, index) => (
          <div key={index} className="flex items-center justify-start">
            <div 
              className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-slate-600 dark:text-slate-400 truncate text-xs">
              {item.source}: {item.visitors.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
