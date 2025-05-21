"use client"

import type React from "react"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileSelector } from "@/components/file-selector"

interface DashboardLayoutProps {
  children: React.ReactNode
  selectedFile: string
  onSelectFile: (file: string) => void
  onFileUpload: (file: File) => void
  isLoading: boolean
  fileName?: string | null
}

export function DashboardLayout({
  children,
  selectedFile,
  onSelectFile,
  onFileUpload,
  isLoading,
  fileName,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden border-r bg-background md:block md:w-64">
        <ScrollArea className="h-screen">
          <SidebarNavigation />
        </ScrollArea>
      </div>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0">
          <ScrollArea className="h-screen">
            <SidebarNavigation />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            size="icon"
            aria-label="Toggle Menu"
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <div className="flex-1" />
          <FileSelector
            selectedFile={selectedFile}
            onSelectFile={onSelectFile}
            onFileUpload={onFileUpload}
            isLoading={isLoading}
          />
        </header>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
