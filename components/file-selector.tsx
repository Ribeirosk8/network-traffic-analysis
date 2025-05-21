"use client"

import { Button } from "@/components/ui/button"
import { Database, FileType } from "lucide-react"

interface FileSelectorProps {
  selectedFile: string
  onSelectFile: (file: string) => void
  isLoading: boolean
}

export function FileSelector({ selectedFile, onSelectFile, isLoading }: FileSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={selectedFile === "groundtruth" ? "default" : "outline"}
        size="sm"
        onClick={() => onSelectFile("groundtruth")}
        disabled={isLoading}
        className="flex items-center gap-1"
      >
        <Database className="h-4 w-4" />
        <span className="hidden sm:inline">Ground Truth Data</span>
        <span className="sm:hidden">GT Data</span>
      </Button>
      <Button
        variant={selectedFile === "pcap" ? "default" : "outline"}
        size="sm"
        onClick={() => onSelectFile("pcap")}
        disabled={isLoading}
        className="flex items-center gap-1"
      >
        <FileType className="h-4 w-4" />
        <span className="hidden sm:inline">PCAP Data</span>
        <span className="sm:hidden">PCAP</span>
      </Button>
    </div>
  )
}
