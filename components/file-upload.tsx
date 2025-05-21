"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { parseCSVData } from "@/lib/csv-parser"

export function FileUpload() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      const text = await file.text()
      const data = parseCSVData(text)

      // Store data in localStorage for demo purposes
      // In a real app, you might want to use a state management solution
      localStorage.setItem("networkData", JSON.stringify(data))

      toast({
        title: "File uploaded successfully",
        description: `Parsed ${data.length} network traffic records`,
      })

      // Redirect to dashboard
      window.location.href = "/dashboard"
    } catch (error) {
      toast({
        title: "Error uploading file",
        description: "Please make sure the file is in the correct CSV format",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Upload className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold">Upload Network Traffic Data</h2>
            <p className="text-sm text-muted-foreground">
              Upload your CSV file containing network traffic data to begin analysis
            </p>
          </div>
          <div className="grid w-full max-w-sm gap-2.5">
            <label htmlFor="file-upload" className="w-full">
              <Button className="w-full" asChild>
                <span>{isLoading ? "Uploading..." : "Select CSV File"}</span>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isLoading}
            />
            <p className="text-center text-xs text-muted-foreground">Supported format: CSV</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
