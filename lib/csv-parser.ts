export interface NetworkEvent {
  eventType: string
  c2sId: string
  source: string
  sourcePorts: string
  destination: string
  destinationPorts: string
  startTime: string
  stopTime: string
}

export function parseCSVData(csvText: string): NetworkEvent[] {
  const lines = csvText.trim().split("\n")

  // Skip header line
  const dataLines = lines.slice(1)

  return dataLines.map((line) => {
    const columns = line.split("\t")

    return {
      eventType: columns[0]?.trim() || "",
      c2sId: columns[1]?.trim() || "",
      source: columns[2]?.trim() || "",
      sourcePorts: columns[3]?.trim() || "",
      destination: columns[4]?.trim() || "",
      destinationPorts: columns[5]?.trim() || "",
      startTime: columns[6]?.trim() || "",
      stopTime: columns[7]?.trim() || "",
    }
  })
}

export function categorizeAttackTypes(events: NetworkEvent[]): Record<string, number> {
  const attackTypes: Record<string, number> = {}

  events.forEach((event) => {
    const type = event.eventType
    if (type) {
      attackTypes[type] = (attackTypes[type] || 0) + 1
    }
  })

  return attackTypes
}

export function getUniqueIPs(events: NetworkEvent[]): string[] {
  const ips = new Set<string>()

  events.forEach((event) => {
    if (event.source && event.source !== "255.255.255.255") {
      ips.add(event.source)
    }
    if (event.destination && event.destination !== "255.255.255.255") {
      ips.add(event.destination)
    }
  })

  return Array.from(ips)
}

export function getTimeRange(events: NetworkEvent[]): { start: Date; end: Date } {
  let start = new Date()
  let end = new Date(0) // January 1, 1970

  events.forEach((event) => {
    if (event.startTime) {
      const startDate = new Date(event.startTime)
      if (startDate < start) {
        start = startDate
      }
    }

    if (event.stopTime) {
      const stopDate = new Date(event.stopTime)
      if (stopDate > end) {
        end = stopDate
      }
    }
  })

  return { start, end }
}
