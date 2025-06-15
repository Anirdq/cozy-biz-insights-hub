
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Filter, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface DateRangeFilterProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export const DateRangeFilter = ({ dateRange, onDateRangeChange }: DateRangeFilterProps) => {
  const { toast } = useToast();
  const [preset, setPreset] = useState<string>("");

  const presets = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "last7days", label: "Last 7 days" },
    { value: "last30days", label: "Last 30 days" },
    { value: "last90days", label: "Last 90 days" },
    { value: "thisMonth", label: "This month" },
    { value: "lastMonth", label: "Last month" },
    { value: "thisYear", label: "This year" },
  ];

  const applyPreset = (presetValue: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (presetValue) {
      case "today":
        onDateRangeChange({ from: today, to: today });
        break;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        onDateRangeChange({ from: yesterday, to: yesterday });
        break;
      case "last7days":
        const week = new Date(today);
        week.setDate(week.getDate() - 6);
        onDateRangeChange({ from: week, to: today });
        break;
      case "last30days":
        const month = new Date(today);
        month.setDate(month.getDate() - 29);
        onDateRangeChange({ from: month, to: today });
        break;
      case "last90days":
        const quarter = new Date(today);
        quarter.setDate(quarter.getDate() - 89);
        onDateRangeChange({ from: quarter, to: today });
        break;
      case "thisMonth":
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        onDateRangeChange({ from: monthStart, to: today });
        break;
      case "lastMonth":
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        onDateRangeChange({ from: lastMonthStart, to: lastMonthEnd });
        break;
      case "thisYear":
        const yearStart = new Date(now.getFullYear(), 0, 1);
        onDateRangeChange({ from: yearStart, to: today });
        break;
    }
    
    setPreset(presetValue);
    
    toast({
      title: "Date range applied",
      description: `Filter applied for ${presets.find(p => p.value === presetValue)?.label}`,
    });
  };

  const clearFilter = () => {
    onDateRangeChange(undefined);
    setPreset("");
    
    toast({
      title: "Filter cleared",
      description: "Date range filter has been removed",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-4 w-4" />
              Quick Presets
            </CardTitle>
            <CardDescription>
              Select a predefined date range for quick filtering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={preset} onValueChange={applyPreset}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a preset..." />
                </SelectTrigger>
                <SelectContent>
                  {presets.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarIcon className="h-4 w-4" />
              Custom Range
            </CardTitle>
            <CardDescription>
              Pick a custom date range for precise filtering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={onDateRangeChange}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Filter Status</CardTitle>
          <CardDescription>
            View and manage your active date range filter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              {dateRange?.from ? (
                <p className="text-sm">
                  <span className="font-medium">Active Filter:</span>{" "}
                  {format(dateRange.from, "MMM dd, yyyy")}
                  {dateRange.to && ` - ${format(dateRange.to, "MMM dd, yyyy")}`}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">No date filter applied</p>
              )}
            </div>
            
            {dateRange?.from && (
              <Button
                onClick={clearFilter}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-3 w-3" />
                Clear Filter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Usage Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Use quick presets for common date ranges like "Last 30 days" or "This month"</p>
            <p>• Custom ranges allow you to select any specific date period</p>
            <p>• Filters will apply to all analytics charts and reports</p>
            <p>• Clear the filter to view all available data</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
