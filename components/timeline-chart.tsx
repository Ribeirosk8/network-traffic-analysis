"use client"

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { processTimelineData } from "@/lib/data-utils"
import type { NetworkEvent } from "@/lib/types"

interface TimelineChartProps {
  data: NetworkEvent[]
}

export function TimelineChart({ data }: TimelineChartProps) {
  // Process data for timeline
  const timelineData = processTimelineData(data)

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={timelineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            label={{ value: "Time", position: "insideBottomRight", offset: -5 }}
          />
          <YAxis label={{ value: "Event Count", angle: -90, position: "insideLeft" }} />
          <Tooltip
            labelFormatter={(value) => `Time: ${new Date(value).toLocaleTimeString()}`}
            formatter={(value: number, name: string) => {
              if (name === "total") return [`${value} events`, "Total"]
              return [`${value} events`, name]
            }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          {/* Add lines for the top 3 attack types */}
          {Object.keys(
            data.reduce(
              (acc, event) => {
                acc[event["Event Type"]] = (acc[event["Event Type"]] || 0) + 1
                return acc
              },
              {} as Record<string, number>,
            ),
          )
            .sort((a, b) => {
              const countA = data.filter((e) => e["Event Type"] === a).length
              const countB = data.filter((e) => e["Event Type"] === b).length
              return countB - countA
            })
            .slice(0, 3)
            .map((attackType, index) => (
              <Line
                key={attackType}
                type="monotone"
                dataKey={attackType}
                stroke={`hsl(${(index + 1) * 120}, 70%, 50%)`}
                strokeWidth={1.5}
                dot={{ r: 3 }}
              />
            ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
