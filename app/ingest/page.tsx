"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileUploadButton } from "@/components/file-upload-button"
import { DataPipeline } from "@/components/data-pipeline"
import { useToast } from "@/hooks/use-toast"
import { Database, FileType, Upload, Globe, Server } from "lucide-react"

export default function IngestPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = (file: File) => {
    setIsLoading(true)
    // Simulate processing
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "File uploaded successfully",
        description: `Uploaded ${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
      })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Ingestion</h1>
        <p className="text-muted-foreground">Configure how data is collected and processed</p>
      </div>

      <DataPipeline />

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">File Upload</TabsTrigger>
          <TabsTrigger value="api">API Integration</TabsTrigger>
          <TabsTrigger value="live">Live Capture</TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Network Data</CardTitle>
              <CardDescription>Upload CSV or PCAP files for analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-10">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-lg font-semibold">Upload your files</h3>
                  <p className="text-sm text-muted-foreground">Drag and drop files here or click to browse</p>
                </div>
                <FileUploadButton onFileUpload={handleFileUpload} isLoading={isLoading} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Supported Formats</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start space-x-3 rounded-md border p-4">
                    <FileType className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">PCAP Data</h4>
                      <p className="text-sm text-muted-foreground">
                        Raw network packet capture data with protocol information
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 rounded-md border p-4">
                    <Database className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Ground Truth Data</h4>
                      <p className="text-sm text-muted-foreground">
                        Pre-labeled network events with attack classifications
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Integration</CardTitle>
              <CardDescription>Connect to external data sources via API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input id="api-key" placeholder="Enter your API key" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endpoint">Endpoint URL</Label>
                <Input id="endpoint" placeholder="https://api.example.com/data" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interval">Polling Interval (seconds)</Label>
                <Input id="interval" placeholder="60" type="number" min="10" />
              </div>
              <Button className="mt-2">Connect API</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="live" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Network Capture</CardTitle>
              <CardDescription>Capture and analyze network traffic in real-time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="interface">Network Interface</Label>
                <select
                  id="interface"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="eth0">eth0 (Ethernet)</option>
                  <option value="wlan0">wlan0 (Wireless)</option>
                  <option value="lo">lo (Loopback)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="filter">Capture Filter (BPF syntax)</Label>
                <Input id="filter" placeholder="port 80 or port 443" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Capture Duration (minutes)</Label>
                <Input id="duration" placeholder="5" type="number" min="1" />
              </div>
              <Button className="mt-2">Start Capture</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
          <CardDescription>Configure and manage your data sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-md border">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <Server className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">Internal Network</h4>
                    <p className="text-sm text-muted-foreground">172.28.0.0/16 subnet</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                  <span className="text-sm">Active</span>
                </div>
              </div>
            </div>
            <div className="rounded-md border">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium">External Traffic</h4>
                    <p className="text-sm text-muted-foreground">Internet-facing traffic</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                  <span className="text-sm">Active</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Add Data Source
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
