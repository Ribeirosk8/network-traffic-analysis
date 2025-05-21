"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, BarChart3, Clock, Network, Shield } from "lucide-react"
import { AttackDistributionChart } from "@/components/attack-distribution-chart"
import { TimelineChart } from "@/components/timeline-chart"
import { NetworkGraph } from "@/components/network-graph"
import { EventsTable } from "@/components/events-table"
import { AttackWindowsTable } from "@/components/attack-windows-table"
import { ProtocolDistributionChart } from "@/components/protocol-distribution-chart"
import { fetchAndParseCSV } from "@/lib/data-utils"
import { sampleData } from "@/lib/sample-data"
import type { NetworkEvent, PcapEvent, FileType } from "@/lib/types"
import { LoadingSpinner } from "@/components/loading-spinner"
import { FileSelector } from "@/components/file-selector"

export default function Home() {
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

  useEffect(() => {
    loadData(selectedFile)
  }, [selectedFile])

  async function loadData(fileType: string) {
    try {
      setLoading(true)
      setError(null)

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span className="font-bold">Network Attack Analyzer</span>
          </div>
          <FileSelector selectedFile={selectedFile} onSelectFile={setSelectedFile} isLoading={loading} />
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="grid gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Network Traffic Analysis</h1>
            <p className="text-muted-foreground">
              Analysis of {fileType === "pcap" ? "PCAP" : "Ground Truth"} network traffic data to identify attack
              patterns
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.length}</div>
                <p className="text-xs text-muted-foreground">Network traffic events</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {fileType === "pcap" ? "Protocols" : "Attack Types"}
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {fileType === "pcap" ? Object.keys(protocols).length : Object.keys(attackTypes).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {fileType === "pcap" ? "Unique protocols" : "Unique attack categories"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attack Windows</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attackWindows.length}</div>
                <p className="text-xs text-muted-foreground">
                  1-min windows with {fileType === "pcap" ? "3+ protocols" : "3+ attack types"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique IPs</CardTitle>
                <Network className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uniqueIPs.length}</div>
                <p className="text-xs text-muted-foreground">Distinct IP addresses</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="attack-windows">
                {fileType === "pcap" ? "Protocol Windows" : "Attack Windows"}
              </TabsTrigger>
              <TabsTrigger value="network">Network Graph</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>{fileType === "pcap" ? "Protocol Distribution" : "Attack Distribution"}</CardTitle>
                    <CardDescription>
                      {fileType === "pcap"
                        ? "Distribution of different protocols in the dataset"
                        : "Distribution of different attack types in the dataset"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    {fileType === "pcap" ? (
                      <ProtocolDistributionChart data={protocols} />
                    ) : (
                      <AttackDistributionChart data={attackTypes} />
                    )}
                  </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>{fileType === "pcap" ? "Protocol Summary" : "Attack Summary"}</CardTitle>
                    <CardDescription>
                      {fileType === "pcap" ? "Summary of detected protocols" : "Summary of detected attack patterns"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(fileType === "pcap" ? protocols : attackTypes)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([type, count]) => (
                          <div key={type} className="flex items-center">
                            <div className="w-full flex-1">
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-medium">
                                  {type.length > 30 ? `${type.substring(0, 30)}...` : type}
                                </div>
                                <div className="text-sm text-muted-foreground">{count}</div>
                              </div>
                              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                  className="h-full bg-primary"
                                  style={{
                                    width: `${(count / data.length) * 100}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="attack-windows">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {fileType === "pcap"
                      ? "1-Minute Windows with Multiple Protocols"
                      : "1-Minute Windows with Multiple Attack Types"}
                  </CardTitle>
                  <CardDescription>
                    {fileType === "pcap"
                      ? "Time windows containing at least 3 different protocols"
                      : "Time windows containing at least 3 different types of attacks"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AttackWindowsTable
                    data={attackWindows}
                    labelKey={fileType === "pcap" ? "Protocol" : "Attack Type"}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="network">
              <Card>
                <CardHeader>
                  <CardTitle>Network Connections</CardTitle>
                  <CardDescription>Visualization of network connections and attack patterns</CardDescription>
                </CardHeader>
                <CardContent className="h-[500px] pt-6">
                  <NetworkGraph data={data} fileType={fileType} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>{fileType === "pcap" ? "Protocol Timeline" : "Attack Timeline"}</CardTitle>
                  <CardDescription>
                    {fileType === "pcap"
                      ? "Timeline of protocol usage over the monitored period"
                      : "Timeline of attack events over the monitored period"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <TimelineChart data={data} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                  <CardDescription>Detailed list of all network events</CardDescription>
                </CardHeader>
                <CardContent>
                  <EventsTable data={data} fileType={fileType} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
