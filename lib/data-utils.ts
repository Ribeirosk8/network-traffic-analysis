import type { NetworkEvent, PcapEvent, AttackWindow } from "@/lib/types"

// Fetch the CSV file from the provided URL
export async function fetchAndParseCSV(url?: string) {
  try {
    const csvUrl =
      url ||
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/GroundTruth%20%281%29-EbVXgH0tplYpLx33wnDtZP98AGayKL.csv"

    const response = await fetch(csvUrl, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`)
    }

    const text = await response.text()

    if (!text || typeof text !== "string" || text.trim() === "") {
      throw new Error("Received empty or invalid CSV data")
    }

    // Determine file type and parse accordingly
    const isPcapFile =
      text.includes("Time") && text.includes("Source") && text.includes("Destination") && !text.includes("Event Type")

    if (isPcapFile) {
      return parsePcapData(text)
    } else {
      return parseGroundTruthData(text)
    }
  } catch (error) {
    console.error("Error fetching or parsing CSV:", error)
    // Return empty default values instead of throwing
    return {
      events: [],
      attackWindows: [],
      attackTypes: {},
      uniqueIPs: [],
      protocols: {},
      fileType: "unknown",
    }
  }
}

// Parse Ground Truth CSV data
function parseGroundTruthData(csvText: string) {
  if (!csvText || typeof csvText !== "string") {
    console.error("Invalid CSV text provided to parser")
    return {
      events: [],
      attackWindows: [],
      attackTypes: {},
      uniqueIPs: [],
      fileType: "groundtruth",
    }
  }

  try {
    const lines = csvText.trim().split("\n")
    if (lines.length <= 1) {
      console.warn("CSV contains no data rows")
      return {
        events: [],
        attackWindows: [],
        attackTypes: {},
        uniqueIPs: [],
        fileType: "groundtruth",
      }
    }

    const headers = lines[0].split("\t").map((header) => header.trim())

    const events: NetworkEvent[] = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split("\t").map((value) => value.trim())
      if (values.length === headers.length) {
        const row: any = {}
        headers.forEach((header, index) => {
          row[header] = values[index]
        })
        events.push(row as NetworkEvent)
      }
    }

    // Analyze attack types
    const attackTypes = analyzeAttackTypes(events)

    // Find 1-minute windows with at least 3 attack types
    const attackWindows = findAttacksInTimeWindow(events)

    // Get unique IPs
    const uniqueIPs = getUniqueIPs(events)

    return {
      events,
      attackWindows,
      attackTypes,
      uniqueIPs,
      fileType: "groundtruth",
    }
  } catch (error) {
    console.error("Error parsing Ground Truth CSV:", error)
    return {
      events: [],
      attackWindows: [],
      attackTypes: {},
      uniqueIPs: [],
      fileType: "groundtruth",
    }
  }
}

// Parse PCAP CSV data
function parsePcapData(csvText: string) {
  if (!csvText || typeof csvText !== "string") {
    console.error("Invalid PCAP CSV text provided to parser")
    return {
      events: [],
      attackWindows: [],
      attackTypes: {},
      uniqueIPs: [],
      protocols: {},
      fileType: "pcap",
    }
  }

  try {
    const lines = csvText.trim().split("\n")
    if (lines.length <= 1) {
      console.warn("PCAP CSV contains no data rows")
      return {
        events: [],
        attackWindows: [],
        attackTypes: {},
        uniqueIPs: [],
        protocols: {},
        fileType: "pcap",
      }
    }

    // Determine delimiter
    let delimiter = ","
    if (lines[0].includes("\t")) {
      delimiter = "\t"
    } else if (lines[0].includes(";")) {
      delimiter = ";"
    }

    const headers = lines[0].split(delimiter).map((header) => header.trim())

    const pcapEvents: PcapEvent[] = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(delimiter).map((value) => value.trim())
      if (values.length === headers.length) {
        const row: any = {}
        headers.forEach((header, index) => {
          row[header] = values[index]
        })
        pcapEvents.push(row as PcapEvent)
      }
    }

    // Convert PCAP events to network events format for compatibility
    const events = convertPcapToNetworkEvents(pcapEvents)

    // Analyze protocols
    const protocols = analyzePcapProtocols(pcapEvents)

    // Analyze attack types (based on protocols and patterns)
    const attackTypes = inferAttackTypes(pcapEvents)

    // Find 1-minute windows with at least 3 different protocols/attack types
    const attackWindows = findPcapAttackWindows(pcapEvents)

    // Get unique IPs
    const uniqueIPs = getPcapUniqueIPs(pcapEvents)

    return {
      events,
      pcapEvents,
      attackWindows,
      attackTypes,
      uniqueIPs,
      protocols,
      fileType: "pcap",
    }
  } catch (error) {
    console.error("Error parsing PCAP CSV:", error)
    return {
      events: [],
      attackWindows: [],
      attackTypes: {},
      uniqueIPs: [],
      protocols: {},
      fileType: "pcap",
    }
  }
}

// Convert PCAP events to NetworkEvent format for compatibility
function convertPcapToNetworkEvents(pcapEvents: PcapEvent[]): NetworkEvent[] {
  return pcapEvents.map((event) => {
    // Determine event type based on protocol and patterns
    let eventType = event.Protocol || "unknown"

    // Check for potential attack patterns
    if (event.Info && typeof event.Info === "string") {
      const info = event.Info.toLowerCase()
      if (info.includes("syn") && !info.includes("ack")) {
        eventType = "scan /syn scan"
      } else if (info.includes("reset") || info.includes("rst")) {
        eventType = "potential attack /reset"
      } else if (info.includes("malformed")) {
        eventType = "malformed packet"
      } else if (info.includes("retransmission")) {
        eventType = "potential ddos"
      }
    }

    // Check for unusual ports that might indicate attacks
    const destPort = event["Destination Port"] ? Number.parseInt(event["Destination Port"]) : 0
    if ([21, 22, 23, 25, 80, 443, 445, 3389].includes(destPort)) {
      if (event.Protocol === "TCP" && event.Info && event.Info.includes("SYN")) {
        eventType = "scan /port scan"
      }
    }

    return {
      "Event Type": eventType,
      "C2S ID": event.No || "",
      Source: event["Source"] || "",
      "Source Port(s)": event["Source Port"] || "",
      Destination: event["Destination"] || "",
      "Destination Port(s)": event["Destination Port"] || "",
      "Start Time": event["Time"] || "",
      "Stop Time": event["Time"] || "",
      Info: event["Info"] || "",
    }
  })
}

// Analyze protocols in PCAP data
function analyzePcapProtocols(pcapEvents: PcapEvent[]): Record<string, number> {
  const protocols: Record<string, number> = {}

  pcapEvents.forEach((event) => {
    const protocol = event.Protocol || "Unknown"
    if (!protocols[protocol]) {
      protocols[protocol] = 0
    }
    protocols[protocol]++
  })

  return protocols
}

// Infer attack types from PCAP data
function inferAttackTypes(pcapEvents: PcapEvent[]): Record<string, number> {
  const attackTypes: Record<string, number> = {}

  pcapEvents.forEach((event) => {
    let attackType = "normal traffic"

    // Check protocol
    if (event.Protocol === "TCP") {
      if (event.Info && event.Info.includes("SYN") && !event.Info.includes("ACK")) {
        attackType = "scan /syn scan"
      } else if (event.Info && (event.Info.includes("RST") || event.Info.includes("Reset"))) {
        attackType = "potential attack /reset"
      }
    } else if (event.Protocol === "ICMP") {
      attackType = "scan /ping scan"
    } else if (event.Protocol === "DNS") {
      if (event.Info && event.Info.includes("query")) {
        attackType = "reconnaissance /dns query"
      }
    } else if (event.Protocol === "HTTP") {
      if (event.Info && (event.Info.includes("GET") || event.Info.includes("POST"))) {
        attackType = "web traffic"
      }
    } else if (event.Protocol === "ARP") {
      attackType = "network discovery"
    }

    // Check for unusual ports
    const destPort = event["Destination Port"] ? Number.parseInt(event["Destination Port"]) : 0
    if (destPort === 0 || destPort > 49151) {
      attackType = "suspicious port usage"
    }

    if (!attackTypes[attackType]) {
      attackTypes[attackType] = 0
    }
    attackTypes[attackType]++
  })

  return attackTypes
}

// Find attack windows in PCAP data
function findPcapAttackWindows(pcapEvents: PcapEvent[]): AttackWindow[] {
  // Group events by minute
  const timeWindows = new Map<string, PcapEvent[]>()

  pcapEvents.forEach((event) => {
    if (!event.Time) return

    // Parse time - handle different formats
    let time: Date
    if (event.Time.includes("/")) {
      // Handle date format like MM/DD/YYYY HH:MM:SS
      time = new Date(event.Time)
    } else {
      // Handle timestamp format like HH:MM:SS.mmm
      const today = new Date()
      const [hours, minutes, seconds] = event.Time.split(":").map(Number)
      time = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, seconds || 0)
    }

    const minuteKey = `${time.getFullYear()}-${time.getMonth()}-${time.getDate()}-${time.getHours()}-${time.getMinutes()}`

    if (!timeWindows.has(minuteKey)) {
      timeWindows.set(minuteKey, [])
    }

    timeWindows.get(minuteKey)!.push(event)
  })

  // Find windows with at least 3 different protocols
  const windowsWithMultipleProtocols: AttackWindow[] = []

  timeWindows.forEach((events, timeKey) => {
    const protocols = new Set(events.map((event) => event.Protocol))

    if (protocols.size >= 3) {
      // Count events by protocol in this window
      const typeCounts: Record<string, number> = {}
      events.forEach((event) => {
        const protocol = event.Protocol || "Unknown"
        if (!typeCounts[protocol]) {
          typeCounts[protocol] = 0
        }
        typeCounts[protocol]++
      })

      // Format time for display
      const [year, month, day, hour, minute] = timeKey.split("-").map(Number)
      const formattedTime = new Date(year, month, day, hour, minute).toLocaleString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })

      // Convert to NetworkEvent format for compatibility
      const networkEvents = events.map((event) => ({
        "Event Type": event.Protocol || "unknown",
        "C2S ID": event.No || "",
        Source: event["Source"] || "",
        "Source Port(s)": event["Source Port"] || "",
        Destination: event["Destination"] || "",
        "Destination Port(s)": event["Destination Port"] || "",
        "Start Time": event["Time"] || "",
        "Stop Time": event["Time"] || "",
      }))

      windowsWithMultipleProtocols.push({
        timeWindow: timeKey,
        events: networkEvents,
        attackTypes: Array.from(protocols),
        attackCount: events.length,
        typeCounts,
        formattedTime,
      })
    }
  })

  return windowsWithMultipleProtocols
}

// Get unique IPs from PCAP data
function getPcapUniqueIPs(pcapEvents: PcapEvent[]): string[] {
  const ips = new Set<string>()

  pcapEvents.forEach((event) => {
    if (event["Source"] && event["Source"] !== "255.255.255.255") {
      ips.add(event["Source"])
    }
    if (event["Destination"] && event["Destination"] !== "255.255.255.255") {
      ips.add(event["Destination"])
    }
  })

  return Array.from(ips)
}

// Convert string time to Date object
function parseTime(timeStr: string): Date {
  const [date, time] = timeStr.split(" ")
  const [month, day, year] = date.split("/")
  const [hour, minute] = time.split(":")

  return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute))
}

// Find attacks within a 1-minute window
function findAttacksInTimeWindow(data: NetworkEvent[]): AttackWindow[] {
  // Sort data by start time
  data.sort((a, b) => parseTime(a["Start Time"]).getTime() - parseTime(b["Start Time"]).getTime())

  // Group events by minute
  const timeWindows = new Map<string, NetworkEvent[]>()

  data.forEach((event) => {
    const startTime = parseTime(event["Start Time"])
    const minuteKey = `${startTime.getFullYear()}-${startTime.getMonth()}-${startTime.getDate()}-${startTime.getHours()}-${startTime.getMinutes()}`

    if (!timeWindows.has(minuteKey)) {
      timeWindows.set(minuteKey, [])
    }

    timeWindows.get(minuteKey)!.push(event)
  })

  // Find windows with at least 3 different attack types
  const windowsWithMultipleAttacks: AttackWindow[] = []

  timeWindows.forEach((events, timeKey) => {
    const attackTypes = new Set(events.map((event) => event["Event Type"]))

    if (attackTypes.size >= 3) {
      // Count events by type in this window
      const typeCounts: Record<string, number> = {}
      events.forEach((event) => {
        const type = event["Event Type"]
        if (!typeCounts[type]) {
          typeCounts[type] = 0
        }
        typeCounts[type]++
      })

      // Format time for display
      const [year, month, day, hour, minute] = timeKey.split("-").map(Number)
      const formattedTime = new Date(year, month, day, hour, minute).toLocaleString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })

      windowsWithMultipleAttacks.push({
        timeWindow: timeKey,
        events: events,
        attackTypes: Array.from(attackTypes),
        attackCount: events.length,
        typeCounts,
        formattedTime,
      })
    }
  })

  return windowsWithMultipleAttacks
}

// Analyze attack types in the dataset
function analyzeAttackTypes(data: NetworkEvent[]): Record<string, number> {
  const attackTypes: Record<string, number> = {}

  data.forEach((event) => {
    const type = event["Event Type"]
    if (!attackTypes[type]) {
      attackTypes[type] = 0
    }
    attackTypes[type]++
  })

  return attackTypes
}

// Get unique IPs from the dataset
function getUniqueIPs(events: NetworkEvent[]): string[] {
  const ips = new Set<string>()

  events.forEach((event) => {
    if (event["Source"] && event["Source"] !== "255.255.255.255") {
      ips.add(event["Source"])
    }
    if (event["Destination"] && event["Destination"] !== "255.255.255.255") {
      ips.add(event["Destination"])
    }
  })

  return Array.from(ips)
}

// Process data for timeline visualization
export function processTimelineData(events: NetworkEvent[]) {
  // Create a map to count events by time
  const timeMap = new Map<string, Record<string, number>>()

  events.forEach((event) => {
    if (event["Start Time"]) {
      const date = parseTime(event["Start Time"])
      const timeKey = date.getTime().toString()

      if (!timeMap.has(timeKey)) {
        timeMap.set(timeKey, {})
      }

      const typeMap = timeMap.get(timeKey)!
      const eventType = event["Event Type"]

      if (!typeMap[eventType]) {
        typeMap[eventType] = 0
      }

      typeMap[eventType]++
    }
  })

  // Convert map to array and sort by time
  return Array.from(timeMap.entries())
    .map(([time, typeCounts]) => ({
      time: Number(time),
      ...typeCounts,
      total: Object.values(typeCounts).reduce((sum, count) => sum + count, 0),
    }))
    .sort((a, b) => a.time - b.time)
}
