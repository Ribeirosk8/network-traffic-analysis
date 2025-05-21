"use client"

import { useState, useEffect } from "react"
import { BarChart3, Clock, Globe, Network, Shield, Zap } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardCard } from "@/components/dashboard-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchAndParseCSV } from "@/lib/data-utils"
import { sampleData } from "@/lib/sample-data"
import type { NetworkEvent, PcapEvent, FileType } from "@/lib/types"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const { toast } = useToast()
  const [data, setData] = useState<NetworkEvent[]>([])
  const [pcapData, setPcapData] = useState<PcapEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [attackWindows, setAttackWindows] = useState<any[]>([])
  const [attackTypes, setAttackTypes] = useState<Record<string, number>>({})
  const [protocols, setProtocols] = useState<Record<string, number>>({})
  const [uniqueIPs, setUniqueIPs] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [fileType, setFileType] = useState<FileType>("unknown")
  const [selectedFile, setSelectedFile] = useState<string>("groundtruth")
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!uploadedFileName) {
      loadData(selectedFile)
    }
  }, [selectedFile])

  async function loadData(fileType: string) {
    try {
      setLoading(true)
      setError(null)
      setUploadedFileName(null)

      let url =
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/GroundTruth%20%281%29-EbVXgH0tplYpLx33wnDtZP98AGayKL.csv"

      if (fileType === "pcap") {
        url =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mypcap_20091103083612-D6MDJSPxMECRWP0UfuKwcq9t8B7ekN.csv"
      }

      const result = await fetchAndParseCSV(url)

      if (result.events.length === 0) {
        console.warn("No data loaded from CSV, using sample data")
        setData(sampleData)
        setAttackWindows([])
        setAttackTypes({})
        setUniqueIPs([])
        setProtocols({})
        setFileType("groundtruth")
      } else {
        setData(result.events)
        setPcapData(result.pcapEvents || [])
        setAttackWindows(result.attackWindows || [])
        setAttackTypes(result.attackTypes || {})
        setUniqueIPs(result.uniqueIPs || [])
        setProtocols(result.protocols || {})
        setFileType(result.fileType || "unknown")
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Failed to load network data. Using sample data instead.")

      setData(sampleData)
      setAttackWindows([])
      setAttackTypes({})
      setUniqueIPs([])
      setProtocols({})
      setFileType("groundtruth")
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true)
      setError(null)
      setUploadedFileName(file.name)

      const text = await file.text()
      const result = await parseUploadedFile(text)

      if (result.events.length === 0) {
        throw new Error("No valid data found in the uploaded file")
      }

      setData(result.events)
      setPcapData(result.pcapEvents || [])
      setAttackWindows(result.attackWindows || [])
      setAttackTypes(result.attackTypes || {})
      setUniqueIPs(result.uniqueIPs || [])
      setProtocols(result.protocols || {})
      setFileType(result.fileType || "unknown")

      toast({
        title: "File uploaded successfully",
        description: `Parsed ${result.events.length} network traffic records`,
      })
    } catch (error) {
      console.error("Error processing uploaded file:", error)
      setError("Failed to process the uploaded file. Please check the format.")
      toast({
        title: "Error uploading file",
        description: "Please make sure the file is in the correct CSV format",
        variant: "destructive",
      })

      // Reset to previous selection
      loadData(selectedFile)
    } finally {
      setLoading(false)
    }
  }

  // Parse uploaded file
  async function parseUploadedFile(csvText: string) {
    // Determine if it's a PCAP or Ground Truth file based on content
    const firstLine = csvText.split("\n")[0].toLowerCase()

    // Check if it's likely a PCAP file
    const isPcapFile =
      (firstLine.includes("time") && firstLine.includes("source") && firstLine.includes("destination")) ||
      firstLine.includes("protocol")

    // Use our existing parser with the text content
    return await fetchAndParseCSV(undefined, csvText, isPcapFile ? "pcap" : "groundtruth")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Filter dashboards based on search query
  const filteredDashboards = [
    {
      title: "Security Overview",
      description: "Summary of your security environment activity, including alerts and events",
      href: "/dashboard",
      icon: <Shield />,
      thumbnail: "/security-dashboard.png",
    },
    {
      title: "Network Graph",
      description: "Interactive visualization of network connections and attack patterns",
      href: "/network",
      icon: <Network />,
      thumbnail: "/network-graph-visualization.png",
    },
    {
      title: "Attack Timeline",
      description: "Chronological view of attack events over the monitored period",
      href: "/timeline",
      icon: <Clock />,
      thumbnail: "/placeholder.svg?height=200&width=400&query=timeline%20chart%20with%20events",
    },
    {
      title: "Attack Distribution",
      description: "Statistical breakdown of attack types or protocols",
      href: "/attacks",
      icon: <BarChart3 />,
      thumbnail: "/placeholder.svg?height=200&width=400&query=bar%20chart%20showing%20attack%20distribution",
    },
    {
      title: "Detection & Response",
      description: "Information about alerts and cases within the security solution",
      href: "/security/detection",
      icon: <Zap />,
      thumbnail: "/placeholder.svg?height=200&width=400&query=security%20alerts%20dashboard",
    },
    {
      title: "Geo Analysis",
      description: "Geographic visualization of attack sources and targets",
      href: "/security/geo",
      icon: <Globe />,
      thumbnail: "/placeholder.svg?height=200&width=400&query=world%20map%20with%20attack%20vectors",
    },
  ].filter(
    (dashboard) =>
      dashboard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dashboard.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <DashboardLayout
      selectedFile={selectedFile}
      onSelectFile={setSelectedFile}
      onFileUpload={handleFileUpload}
      isLoading={loading}
      fileName={uploadedFileName}
    >
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboards</h1>
            <p className="text-muted-foreground">
              {uploadedFileName ? (
                <>
                  Analyzing uploaded file: <span className="font-medium">{uploadedFileName}</span>
                </>
              ) : (
                <>Select a dashboard to analyze your network traffic data</>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search dashboards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-[200px] lg:w-[300px]"
            />
            <Button>Create Dashboard</Button>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Security Views</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDashboards.map((dashboard) => (
              <DashboardCard key={dashboard.title} {...dashboard} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Custom Dashboards</h2>
          <div className="rounded-lg border border-dashed p-8 text-center">
            <h3 className="text-lg font-medium">No custom dashboards yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">Create your first custom dashboard to get started</p>
            <Button className="mt-4">Create Dashboard</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
