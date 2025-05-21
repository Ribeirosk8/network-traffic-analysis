"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, BarChart3, Network, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { AttackDistributionChart } from "@/components/attack-distribution-chart"
import { TimelineChart } from "@/components/timeline-chart"
import { NetworkGraph } from "@/components/network-graph"
import { EventsTable } from "@/components/events-table"
import { type NetworkEvent, categorizeAttackTypes, getUniqueIPs } from "@/lib/csv-parser"

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<NetworkEvent[]>([])
  const [attackTypes, setAttackTypes] = useState<Record<string, number>>({})
  const [uniqueIPs, setUniqueIPs] = useState<string[]>([])

  useEffect(() => {
    // Retrieve data from localStorage
    const storedData = localStorage.getItem("networkData")
    if (!storedData) {
      router.push("/")
      return
    }

    try {
      const parsedData = JSON.parse(storedData) as NetworkEvent[]
      setData(parsedData)
      setAttackTypes(categorizeAttackTypes(parsedData))
      setUniqueIPs(getUniqueIPs(parsedData))
    } catch (error) {
      console.error("Error parsing stored data:", error)
      router.push("/")
    }
  }, [router])

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="grid gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Analysis of network traffic and attack patterns</p>
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
                <CardTitle className="text-sm font-medium">Attack Types</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Object.keys(attackTypes).length}</div>
                <p className="text-xs text-muted-foreground">Unique attack categories</p>
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scan Attempts</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{attackTypes["scan /usr/bin/nmap"] || 0}</div>
                <p className="text-xs text-muted-foreground">Nmap scan events detected</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="network">Network Graph</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Attack Distribution</CardTitle>
                    <CardDescription>Distribution of different attack types in the dataset</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <AttackDistributionChart data={attackTypes} />
                  </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Attack Summary</CardTitle>
                    <CardDescription>Summary of detected attack patterns</CardDescription>
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
            <TabsContent value="network">
              <Card>
                <CardHeader>
                  <CardTitle>Network Connections</CardTitle>
                  <CardDescription>Visualization of network connections and attack patterns</CardDescription>
                </CardHeader>
                <CardContent className="h-[500px] pt-6">
                  <NetworkGraph data={data} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="timeline">
              <Card>
                <CardHeader>
                  <CardTitle>Attack Timeline</CardTitle>
                  <CardDescription>Timeline of attack events over the monitored period</CardDescription>
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
                  <EventsTable data={data} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
