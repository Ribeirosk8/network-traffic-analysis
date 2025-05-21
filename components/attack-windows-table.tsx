"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { AttackWindow } from "@/lib/types"

interface AttackWindowsTableProps {
  data: AttackWindow[]
  labelKey?: string
}

export function AttackWindowsTable({ data, labelKey = "Attack Type" }: AttackWindowsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRow = (timeWindow: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [timeWindow]: !prev[timeWindow],
    }))
  }

  const columns: ColumnDef<AttackWindow>[] = [
    {
      id: "expander",
      header: "",
      cell: ({ row }) => {
        const isExpanded = expandedRows[row.original.timeWindow] || false
        return (
          <Button variant="ghost" size="icon" onClick={() => toggleRow(row.original.timeWindow)}>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "formattedTime",
      header: "Time Window",
    },
    {
      accessorKey: "attackTypes",
      header: labelKey + "s",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">
          {row.original.attackTypes.length} types: {row.original.attackTypes.slice(0, 2).join(", ")}
          {row.original.attackTypes.length > 2 ? "..." : ""}
        </div>
      ),
    },
    {
      accessorKey: "attackCount",
      header: "Event Count",
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No time windows with multiple {labelKey.toLowerCase()}s found in this dataset.
      </div>
    )
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Collapsible
                  key={row.id}
                  open={expandedRows[row.original.timeWindow] || false}
                  onOpenChange={() => toggleRow(row.original.timeWindow)}
                >
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                  <CollapsibleContent>
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={columns.length} className="p-4">
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium">{labelKey}s in this Window:</h4>
                          <div className="grid gap-2">
                            {Object.entries(row.original.typeCounts)
                              .sort((a, b) => b[1] - a[1])
                              .map(([type, count]) => (
                                <div key={type} className="flex items-center justify-between">
                                  <span className="text-sm">{type}</span>
                                  <span className="text-sm font-medium">{count} events</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  </CollapsibleContent>
                </Collapsible>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
