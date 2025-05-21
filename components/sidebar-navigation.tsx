"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  AlertTriangle,
  BarChart3,
  Clock,
  Database,
  Gauge,
  Globe,
  Home,
  Network,
  Search,
  Server,
  Settings,
  Shield,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarNavigation({ className }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <div className="flex items-center gap-2 px-2">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold tracking-tight">Network Analyzer</h2>
          </div>
          <div className="px-2 pt-4">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
        <div className="px-4">
          <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">Overview</h2>
          <div className="space-y-1">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/" ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/network"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/network" ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Network className="h-4 w-4" />
              Network Graph
            </Link>
            <Link
              href="/timeline"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/timeline" ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Clock className="h-4 w-4" />
              Timeline
            </Link>
            <Link
              href="/attacks"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/attacks" ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <AlertTriangle className="h-4 w-4" />
              Attack Types
            </Link>
          </div>
        </div>
        <div className="px-4">
          <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">Data Pipeline</h2>
          <div className="space-y-1">
            <Link
              href="/ingest"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/ingest" ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Database className="h-4 w-4" />
              Ingest
            </Link>
            <Link
              href="/store"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/store" ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Server className="h-4 w-4" />
              Store
            </Link>
            <Link
              href="/analyze"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/analyze" ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <BarChart3 className="h-4 w-4" />
              Analyze
            </Link>
          </div>
        </div>
        <div className="px-4">
          <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">Security</h2>
          <div className="space-y-1">
            <Link
              href="/security/overview"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/security/overview" ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Shield className="h-4 w-4" />
              Security Overview
            </Link>
            <Link
              href="/security/detection"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/security/detection" ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Zap className="h-4 w-4" />
              Detection & Response
            </Link>
            <Link
              href="/security/geo"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/security/geo" ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Globe className="h-4 w-4" />
              Geo Analysis
            </Link>
          </div>
        </div>
        <div className="px-4">
          <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">Settings</h2>
          <div className="space-y-1">
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/settings" ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <Link
              href="/data-quality"
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/data-quality" ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <Gauge className="h-4 w-4" />
              Data Quality
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
