
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Eye, 
  ShoppingCart,
  Download,
  Moon,
  Sun
} from "lucide-react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SalesChart } from "@/components/SalesChart";
import { TrafficChart } from "@/components/TrafficChart";
import { KPIChart } from "@/components/KPIChart";
import { MetricCard } from "@/components/MetricCard";
import { ExportDialog } from "@/components/ExportDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Fetch real data for metric cards
  const { data: salesSummary, isLoading: salesLoading } = useQuery({
    queryKey: ['sales-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales_data')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      const totalRevenue = data?.reduce((sum, item) => sum + Number(item.revenue), 0) || 0;
      const totalOrders = data?.reduce((sum, item) => sum + item.orders, 0) || 0;
      const avgConversion = data?.reduce((sum, item) => sum + Number(item.conversion_rate), 0) / (data?.length || 1) || 0;
      
      return { totalRevenue, totalOrders, avgConversion };
    }
  });

  const { data: trafficSummary, isLoading: trafficLoading } = useQuery({
    queryKey: ['traffic-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('traffic_data')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      const totalVisitors = data?.reduce((sum, item) => sum + item.visitors, 0) || 0;
      const totalPageViews = data?.reduce((sum, item) => sum + item.page_views, 0) || 0;
      
      return { totalVisitors, totalPageViews };
    }
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          
          <SidebarInset className="flex-1">
            {/* Header */}
            <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowExportDialog(true)}
                    className="dark:border-slate-600 dark:text-slate-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleTheme}
                    className="dark:border-slate-600 dark:text-slate-300"
                  >
                    {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </header>

            <main className="container mx-auto px-6 py-8">
              {/* Page Title */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                  Dashboard Overview
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Monitor your business performance and key metrics
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard
                  title="Total Revenue"
                  value={salesSummary ? `$${salesSummary.totalRevenue.toLocaleString()}` : "$0"}
                  change="+12.5%"
                  trend="up"
                  icon={DollarSign}
                  color="blue"
                  isLoading={salesLoading}
                />
                <MetricCard
                  title="Website Visitors"
                  value={trafficSummary ? trafficSummary.totalVisitors.toLocaleString() : "0"}
                  change="+8.2%"
                  trend="up"
                  icon={Users}
                  color="teal"
                  isLoading={trafficLoading}
                />
                <MetricCard
                  title="Page Views"
                  value={trafficSummary ? trafficSummary.totalPageViews.toLocaleString() : "0"}
                  change="-2.4%"
                  trend="down"
                  icon={Eye}
                  color="purple"
                  isLoading={trafficLoading}
                />
                <MetricCard
                  title="Conversion Rate"
                  value={salesSummary ? `${salesSummary.avgConversion.toFixed(2)}%` : "0%"}
                  change="+0.8%"
                  trend="up"
                  icon={ShoppingCart}
                  color="green"
                  isLoading={salesLoading}
                />
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800 dark:text-white">
                      <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                      Sales Performance
                    </CardTitle>
                    <CardDescription className="dark:text-slate-400">
                      Monthly revenue trends and growth
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SalesChart />
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800 dark:text-white">
                      <Users className="h-5 w-5 mr-2 text-teal-600" />
                      Traffic Analytics
                    </CardTitle>
                    <CardDescription className="dark:text-slate-400">
                      Website visitor patterns and sources
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TrafficChart />
                  </CardContent>
                </Card>
              </div>

              {/* Full Width KPI Chart */}
              <Card className="border-0 shadow-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800 dark:text-white">
                    <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                    Key Performance Indicators
                  </CardTitle>
                  <CardDescription className="dark:text-slate-400">
                    Track your most important business metrics over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <KPIChart />
                </CardContent>
              </Card>
            </main>

            <ExportDialog 
              open={showExportDialog} 
              onOpenChange={setShowExportDialog}
            />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Dashboard;
