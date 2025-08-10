"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle, DialogPortal } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Download, FileSpreadsheet, FileText, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { exportData, type ExportFormat, type ExportData } from "@/lib/export-utils"

interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  exportData: ExportData
  title?: string
}

const formatOptions = [
  {
    value: 'excel' as ExportFormat,
    label: 'Excel (.xlsx)',
    description: 'Best for data analysis and calculations',
    icon: FileSpreadsheet,
    color: 'text-green-600'
  },
  {
    value: 'csv' as ExportFormat,
    label: 'CSV (.csv)', 
    description: 'Compatible with most spreadsheet apps',
    icon: FileText,
    color: 'text-blue-600'
  },
  {
    value: 'googlesheets' as ExportFormat,
    label: 'Google Sheets',
    description: 'Download CSV with import instructions',
    icon: FileSpreadsheet,
    color: 'text-orange-600'
  }
]

export function ExportModal({ open, onOpenChange, exportData, title = "Export Data" }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('excel')
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (!exportData.data || exportData.data.length === 0) {
      toast.error("No data available to export")
      return
    }

    setIsExporting(true)
    
    try {
      exportData(exportData, selectedFormat)
      
      const formatLabel = formatOptions.find(f => f.value === selectedFormat)?.label || selectedFormat
      toast.success(`Successfully exported ${exportData.data.length} records as ${formatLabel}`)
      
      if (selectedFormat === 'googlesheets') {
        toast.info("Check your downloads folder for the CSV file, then follow the import instructions!", {
          duration: 8000
        })
      }
      
      onOpenChange(false)
    } catch (error) {
      console.error('Export error:', error)
      toast.error(error instanceof Error ? error.message : "Failed to export data")
    } finally {
      setIsExporting(false)
    }
  }

  const selectedFormatOption = formatOptions.find(f => f.value === selectedFormat)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="backdrop-blur-lg bg-black/50" />
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-white border-0 shadow-2xl" showCloseButton={false}>
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle className="text-center text-lg font-medium">{title}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 h-6 w-6"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Ready to export <span className="font-semibold">{exportData.data?.length || 0} records</span>
              </div>

              <div className="space-y-3">
                <Label htmlFor="format-select" className="text-sm font-medium">
                  Choose Export Format
                </Label>
                
                <Select value={selectedFormat} onValueChange={(value: ExportFormat) => setSelectedFormat(value)}>
                  <SelectTrigger id="format-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map((format) => {
                      const Icon = format.icon
                      return (
                        <SelectItem key={format.value} value={format.value}>
                          <div className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 ${format.color}`} />
                            <div>
                              <div className="font-medium">{format.label}</div>
                            </div>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              {selectedFormatOption && (
                <Card className="bg-gray-50 border-l-4 border-l-gray-400">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <selectedFormatOption.icon className={`w-5 h-5 mt-0.5 ${selectedFormatOption.color}`} />
                      <div>
                        <div className="font-medium text-sm">{selectedFormatOption.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{selectedFormatOption.description}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={isExporting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                className="flex-1 bg-[#1b7339] hover:bg-[#1b7339]/80"
                disabled={isExporting || !exportData.data?.length}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

