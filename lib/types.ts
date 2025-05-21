export interface NetworkEvent {
  "Event Type": string
  "C2S ID": string
  Source: string
  "Source Port(s)": string
  Destination: string
  "Destination Port(s)": string
  "Start Time": string
  "Stop Time": string
  Info?: string
}

export interface PcapEvent {
  No?: string
  Time: string
  Source: string
  "Source Port"?: string
  Destination: string
  "Destination Port"?: string
  Protocol?: string
  Length?: string
  Info?: string
  [key: string]: string | undefined
}

export interface AttackWindow {
  timeWindow: string
  events: NetworkEvent[]
  attackTypes: string[]
  attackCount: number
  typeCounts: Record<string, number>
  formattedTime: string
}

export type FileType = "groundtruth" | "pcap" | "unknown"
