import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashboardCardProps {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  thumbnail?: string
  className?: string
}

export function DashboardCard({ title, description, href, icon, thumbnail, className }: DashboardCardProps) {
  return (
    <Link href={href} className="block">
      <Card className={cn("transition-all hover:shadow-md", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="h-4 w-4 text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 overflow-hidden rounded-md border">
            {thumbnail ? (
              <img src={thumbnail || "/placeholder.svg"} alt={title} className="h-32 w-full object-cover" />
            ) : (
              <div className="flex h-32 w-full items-center justify-center bg-muted">No preview</div>
            )}
          </div>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}
