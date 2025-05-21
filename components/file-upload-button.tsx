"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface FileUploadButtonProps {
  onFileUpload: (file: File) => void
  isLoading: boolean
}

export function FileUploadButton({ onFileUpload, isLoading }: FileUploadButtonProps) {
  const { toast } = useToast()
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check if file is CSV
    if (!file.name.endsWith(".csv") && !file.name.endsWith(".tsv")) {
      toast({
        title: "Invalid file format",
        description: "Please upload a CSV or TSV file",
        variant: "destructive",
      })
      return
    }

    onFileUpload(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    // Check if file is CSV
    if (!file.name.endsWith(".csv") && !file.name.endsWith(".tsv")) {
      toast({
        title: "Invalid file format",
        description: "Please upload a CSV or TSV file",
        variant: "destructive",
      })
      return
    }

    onFileUpload(file)
  }

  return (
    <div
      className={`relative ${isDragging ? "ring-2 ring-primary" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Button
        variant="outline"
        size="sm"
        disabled={isLoading}
        className="flex items-center gap-1"
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <Upload className="h-4 w-4" />
        <span>{isLoading ? "Uploading..." : "Upload CSV"}</span>
      </Button>
      <input
        id="file-upload"
        type="file"
        accept=".csv,.tsv"
        className="hidden"
        onChange={handleFileChange}
        disabled={isLoading}
      />
    </div>
  )
}
