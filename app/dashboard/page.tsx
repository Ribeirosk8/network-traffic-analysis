"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, BarChart3, Clock, Network } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttackDistributionChart } from "@/components/attack-distribution-chart"
import { TimelineChart } from "@/components/timeline-chart"
import { NetworkGraph } from "@/components/network-graph"
import { EventsTable } from "@/components/events-table"
import { AttackWindowsTable } from "@/components/attack-windows-table"
import { ProtocolDistributionChart } from "@/components/protocol-distribution-chart"
import { fetchAndParseCSV } from "@/lib/data-utils"
import { sampleData } from "@/lib/sample-data"
import type { NetworkEvent, FileType } from "@/lib/types"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [data, setData] = useState<NetworkEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [attackWindows, setAttackWindows] = useState<any[]>([])
  const [attackTypes, setAttackTypes] = useState<Record<string, number>>({})
  const [uniqueIPs, setUniqueIPs] = useState<string[]>([])
  const [fileType, setFileType] = useState<FileType>("groundtruth")

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)

        // Try to get data from localStorage first
        const storedData = localStorage.getItem("networkData")
        const storedFileType = localStorage.getItem("fileType")

        if (storedData) {
          const parsedData = JSON.parse(storedData)
          setData(parsedData.events || parsedData)
          setAttackWindows(parsedData.attackWindows || [])
          setAttackTypes(parsedData.attackTypes || {})
          setUniqueIPs(parsedData.uniqueIPs || [])
          setFileType((storedFileType as FileType) || "groundtruth")
        } else {
          // If no stored data, fetch from default URL
          const url =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/GroundTruth%20%281%29-EbVXgH0tplYpLx33wnDtZP98AGayKL.csv"
          const result = await fetchAndParseCSV(url)

          if (result.events.length === 0) {
            setData(sampleData)
          } else {
            setData(result.events)
            setAttackWindows(result.attackWindows || [])
            setAttackTypes(result.attackTypes || {})
            setUniqueIPs(result.uniqueIPs || [])
            setFileType(result.fileType || "groundtruth")

            // Store in localStorage for future use
            localStorage.setItem(
              "networkData",
              JSON.stringify({
                events: result.events,
                attackWindows: result.attackWindows,
                attackTypes: result.attackTypes,
                uniqueIPs: result.uniqueIPs,
              }),
            )
            localStorage.setItem("fileType", result.fileType || "groundtruth")
          }
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        toast({
          title: "Error loading data",
          description: "Failed to load network data. Please try again.",
          variant: "destructive",
        })
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router, toast])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Overview</h1>
        <p className="text-muted-foreground">
          Summary of your security environment activity, including alerts and events
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
            <CardTitle className="text-sm font-medium">{fileType === "pcap" ? "Protocols" : "Attack Types"}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(attackTypes).length}</div>
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
                  <ProtocolDistributionChart data={attackTypes} />
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
                  {Object.entries(attackTypes)
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
              <AttackWindowsTable data={attackWindows} labelKey={fileType === "pcap" ? "Protocol" : "Attack Type"} />
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
  )
}
