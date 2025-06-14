
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar } from "lucide-react";
import { toast } from "sonner";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExportDialog = ({ open, onOpenChange }: ExportDialogProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'csv') => {
    setIsExporting(true);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`Dashboard exported as ${format.toUpperCase()} successfully!`);
    setIsExporting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Export Dashboard
          </DialogTitle>
          <DialogDescription>
            Choose the format to export your dashboard data and visualizations.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800"
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
            >
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-red-500" />
                <span className="font-medium">Export as PDF</span>
              </div>
              <span className="text-xs text-slate-500">Complete dashboard with charts and data</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800"
              onClick={() => handleExport('csv')}
              disabled={isExporting}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-500" />
                <span className="font-medium">Export as CSV</span>
              </div>
              <span className="text-xs text-slate-500">Raw data for analysis</span>
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
            <Badge variant="secondary" className="text-xs">
              Pro Feature
            </Badge>
            <span>Advanced export options available in pro plan</span>
          </div>
        </div>
        
        {isExporting && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">Exporting...</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
