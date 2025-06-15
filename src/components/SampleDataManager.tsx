
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw, Trash2, Plus } from "lucide-react";

export const SampleDataManager = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [recordCount, setRecordCount] = useState("30");
  const [dataType, setDataType] = useState("all");

  const generateSampleData = async () => {
    setIsGenerating(true);
    try {
      const count = parseInt(recordCount);
      const promises = [];

      if (dataType === "all" || dataType === "sales") {
        promises.push(generateSalesData(count));
      }
      if (dataType === "all" || dataType === "traffic") {
        promises.push(generateTrafficData(count));
      }
      if (dataType === "all" || dataType === "performance") {
        promises.push(generatePerformanceData(count));
      }

      await Promise.all(promises);

      toast({
        title: "Sample data generated",
        description: `Successfully generated ${count} records for ${dataType === "all" ? "all tables" : dataType}.`,
      });
    } catch (error) {
      console.error('Error generating sample data:', error);
      toast({
        title: "Error generating data",
        description: "Failed to generate sample data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSalesData = async (count: number) => {
    const salesData = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - count);

    for (let i = 0; i < count; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      salesData.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 50000) + 10000,
        orders: Math.floor(Math.random() * 100) + 20,
        conversion_rate: Math.random() * 5 + 2,
      });
    }

    const { error } = await supabase
      .from('sales_data')
      .insert(salesData);
    
    if (error) throw error;
  };

  const generateTrafficData = async (count: number) => {
    const trafficData = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - count);

    for (let i = 0; i < count; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      trafficData.push({
        date: date.toISOString().split('T')[0],
        visitors: Math.floor(Math.random() * 5000) + 1000,
        page_views: Math.floor(Math.random() * 15000) + 3000,
        bounce_rate: Math.random() * 30 + 20,
        avg_session_duration: Math.floor(Math.random() * 300) + 60,
      });
    }

    const { error } = await supabase
      .from('traffic_data')
      .insert(trafficData);
    
    if (error) throw error;
  };

  const generatePerformanceData = async (count: number) => {
    const performanceData = [];
    const metrics = [
      { name: 'Customer Satisfaction', target: 4.5 },
      { name: 'Response Time', target: 2.0 },
      { name: 'Uptime', target: 99.9 },
    ];
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - count);

    for (let i = 0; i < count; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      metrics.forEach(metric => {
        let value;
        if (metric.name === 'Customer Satisfaction') {
          value = Math.random() * 1 + 4; // 4-5 range
        } else if (metric.name === 'Response Time') {
          value = Math.random() * 2 + 1; // 1-3 range
        } else {
          value = Math.random() * 2 + 98; // 98-100 range
        }
        
        performanceData.push({
          date: date.toISOString().split('T')[0],
          metric_name: metric.name,
          metric_value: value,
          target_value: metric.target,
        });
      });
    }

    const { error } = await supabase
      .from('performance_metrics')
      .insert(performanceData);
    
    if (error) throw error;
  };

  const clearData = async () => {
    setIsClearing(true);
    try {
      const promises = [];
      
      if (dataType === "all" || dataType === "sales") {
        promises.push(supabase.from('sales_data').delete().neq('id', ''));
      }
      if (dataType === "all" || dataType === "traffic") {
        promises.push(supabase.from('traffic_data').delete().neq('id', ''));
      }
      if (dataType === "all" || dataType === "performance") {
        promises.push(supabase.from('performance_metrics').delete().neq('id', ''));
      }

      await Promise.all(promises);

      toast({
        title: "Data cleared",
        description: `Successfully cleared ${dataType === "all" ? "all data" : dataType + " data"}.`,
      });
    } catch (error) {
      console.error('Error clearing data:', error);
      toast({
        title: "Error clearing data",
        description: "Failed to clear data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="record-count">Number of Records</Label>
          <Input
            id="record-count"
            type="number"
            value={recordCount}
            onChange={(e) => setRecordCount(e.target.value)}
            min="1"
            max="365"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="data-type">Data Type</Label>
          <Select value={dataType} onValueChange={setDataType}>
            <SelectTrigger>
              <SelectValue placeholder="Select data type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Data Types</SelectItem>
              <SelectItem value="sales">Sales Data</SelectItem>
              <SelectItem value="traffic">Traffic Data</SelectItem>
              <SelectItem value="performance">Performance Metrics</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4">
        <Button 
          onClick={generateSampleData} 
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Generate Sample Data
        </Button>
        
        <Button 
          onClick={clearData} 
          disabled={isClearing}
          variant="destructive"
          className="flex items-center gap-2"
        >
          {isClearing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Clear Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Sales Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Revenue, orders, conversion rates</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Traffic Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Visitors, page views, bounce rates</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">KPIs, targets, satisfaction scores</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
