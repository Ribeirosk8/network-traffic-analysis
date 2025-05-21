"use client"

import { useEffect, useRef } from "react"
import type { NetworkEvent } from "@/lib/types"

interface NetworkGraphProps {
  data: NetworkEvent[]
  fileType?: string
}

export function NetworkGraph({ data, fileType = "groundtruth" }: NetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !data.length) return

    const canvas = document.createElement("canvas")
    canvas.width = containerRef.current.clientWidth
    canvas.height = containerRef.current.clientHeight
    containerRef.current.innerHTML = ""
    containerRef.current.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Extract unique IPs
    const ips = new Set<string>()
    data.forEach((event) => {
      if (event["Source"] && event["Source"] !== "255.255.255.255") {
        ips.add(event["Source"])
      }
      if (event["Destination"] && event["Destination"] !== "255.255.255.255") {
        ips.add(event["Destination"])
      }
    })

    // Create nodes for each IP
    const nodes = new Map<string, { x: number; y: number; radius: number; color: string }>()
    const ipArray = Array.from(ips)

    // Position nodes in a circle
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) * 0.8

    ipArray.forEach((ip, index) => {
      const angle = (index / ipArray.length) * Math.PI * 2
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      // Determine if this is an internal IP (172.28.x.x)
      const isInternal = ip.startsWith("172.28.")

      nodes.set(ip, {
        x,
        y,
        radius: isInternal ? 8 : 10,
        color: isInternal ? "hsl(var(--primary))" : "hsl(var(--destructive))",
      })
    })

    // Draw connections
    ctx.lineWidth = 1

    // Count connections for line thickness
    const connections = new Map<string, { count: number; types: Set<string> }>()

    data.forEach((event) => {
      if (
        event["Source"] &&
        event["Destination"] &&
        event["Source"] !== "255.255.255.255" &&
        event["Destination"] !== "255.255.255.255"
      ) {
        const key = `${event["Source"]}-${event["Destination"]}`
        if (!connections.has(key)) {
          connections.set(key, { count: 0, types: new Set() })
        }
        const connection = connections.get(key)!
        connection.count++
        connection.types.add(event["Event Type"])
      }
    })

    // Draw edges
    connections.forEach(({ count, types }, key) => {
      const [source, target] = key.split("-")
      const sourceNode = nodes.get(source)
      const targetNode = nodes.get(target)

      if (sourceNode && targetNode) {
        ctx.beginPath()
        ctx.moveTo(sourceNode.x, sourceNode.y)
        ctx.lineTo(targetNode.x, targetNode.y)

        // Determine color based on event type
        const hasMultipleTypes = types.size > 1

        if (hasMultipleTypes) {
          ctx.strokeStyle = "rgba(147, 51, 234, 0.6)" // Purple for multiple attack types
        } else {
          const eventType = Array.from(types)[0]

          if (fileType === "pcap") {
            // PCAP-specific coloring
            if (eventType === "TCP") {
              ctx.strokeStyle = "rgba(59, 130, 246, 0.6)" // Blue for TCP
            } else if (eventType === "UDP") {
              ctx.strokeStyle = "rgba(16, 185, 129, 0.6)" // Green for UDP
            } else if (eventType === "ICMP") {
              ctx.strokeStyle = "rgba(245, 158, 11, 0.6)" // Amber for ICMP
            } else if (eventType === "HTTP" || eventType === "HTTPS") {
              ctx.strokeStyle = "rgba(139, 92, 246, 0.6)" // Purple for HTTP/S
            } else if (eventType === "DNS") {
              ctx.strokeStyle = "rgba(236, 72, 153, 0.6)" // Pink for DNS
            } else if (eventType.includes("scan")) {
              ctx.strokeStyle = "rgba(234, 179, 8, 0.6)" // Yellow for scans
            } else {
              ctx.strokeStyle = "rgba(107, 114, 128, 0.4)" // Gray for others
            }
          } else {
            // Ground Truth-specific coloring
            if (eventType.includes("scan")) {
              ctx.strokeStyle = "rgba(234, 179, 8, 0.6)" // Yellow for scans
            } else if (eventType.includes("attack")) {
              ctx.strokeStyle = "rgba(239, 68, 68, 0.6)" // Red for attacks
            } else if (eventType.includes("phishing")) {
              ctx.strokeStyle = "rgba(249, 115, 22, 0.6)" // Orange for phishing
            } else if (eventType.includes("c2")) {
              ctx.strokeStyle = "rgba(147, 51, 234, 0.6)" // Purple for C2
            } else if (eventType.includes("ddos")) {
              ctx.strokeStyle = "rgba(6, 182, 212, 0.6)" // Cyan for DDoS
            } else {
              ctx.strokeStyle = "rgba(107, 114, 128, 0.4)" // Gray for others
            }
          }
        }

        // Line width based on connection count
        ctx.lineWidth = Math.min(Math.max(1, count / 2), 5)

        ctx.stroke()
      }
    })

    // Draw nodes
    nodes.forEach((node, ip) => {
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
      ctx.fillStyle = node.color
      ctx.fill()

      // Draw IP labels
      ctx.fillStyle = "#000"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Truncate IP for display
      const displayIp = ip.split(".").slice(-2).join(".")
      ctx.fillText(displayIp, node.x, node.y + node.radius + 12)
    })

    // Draw legend
    let legendItems = []

    if (fileType === "pcap") {
      legendItems = [
        { color: "hsl(var(--primary))", label: "Internal IP" },
        { color: "hsl(var(--destructive))", label: "External IP" },
        { color: "rgba(59, 130, 246, 0.6)", label: "TCP" },
        { color: "rgba(16, 185, 129, 0.6)", label: "UDP" },
        { color: "rgba(245, 158, 11, 0.6)", label: "ICMP" },
        { color: "rgba(139, 92, 246, 0.6)", label: "HTTP/S" },
        { color: "rgba(236, 72, 153, 0.6)", label: "DNS" },
      ]
    } else {
      legendItems = [
        { color: "hsl(var(--primary))", label: "Internal IP" },
        { color: "hsl(var(--destructive))", label: "External IP" },
        { color: "rgba(234, 179, 8, 0.6)", label: "Scan" },
        { color: "rgba(239, 68, 68, 0.6)", label: "Attack" },
        { color: "rgba(249, 115, 22, 0.6)", label: "Phishing" },
        { color: "rgba(147, 51, 234, 0.6)", label: "Multiple Types/C2" },
        { color: "rgba(6, 182, 212, 0.6)", label: "DDoS" },
      ]
    }

    const legendX = 20
    let legendY = 20

    ctx.font = "12px Arial"
    ctx.textAlign = "left"
    ctx.textBaseline = "middle"

    legendItems.forEach((item) => {
      ctx.fillStyle = item.color
      ctx.fillRect(legendX, legendY, 15, 15)

      ctx.fillStyle = "#000"
      ctx.fillText(item.label, legendX + 25, legendY + 7.5)

      legendY += 25
    })
  }, [data, fileType])

  return <div ref={containerRef} className="w-full h-full" />
}
