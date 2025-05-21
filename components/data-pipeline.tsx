"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Database, HardDrive, BarChart3 } from "lucide-react"

export function DataPipeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Pipeline</CardTitle>
        <CardDescription>How data flows through the Network Analysis system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          <PipelineStage
            title="Ingest"
            description="Collect and preprocess network data"
            icon={<Database className="h-10 w-10" />}
            color="bg-blue-100 dark:bg-blue-950"
            textColor="text-blue-600 dark:text-blue-400"
          />
          <div className="flex h-8 w-8 items-center justify-center md:h-auto md:w-8">
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
          </div>
          <PipelineStage
            title="Store"
            description="Index and store processed data"
            icon={<HardDrive className="h-10 w-10" />}
            color="bg-green-100 dark:bg-green-950"
            textColor="text-green-600 dark:text-green-400"
          />
          <div className="flex h-8 w-8 items-center justify-center md:h-auto md:w-8">
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
          </div>
          <PipelineStage
            title="Analyze"
            description="Visualize and analyze network patterns"
            icon={<BarChart3 className="h-10 w-10" />}
            color="bg-purple-100 dark:bg-purple-950"
            textColor="text-purple-600 dark:text-purple-400"
          />
        </div>
      </CardContent>
    </Card>
  )
}

interface PipelineStageProps {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  textColor: string
}

function PipelineStage({ title, description, icon, color, textColor }: PipelineStageProps) {
  return (
    <div className="flex flex-1 flex-col items-center text-center">
      <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full ${color}`}>
        <div className={textColor}>{icon}</div>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
