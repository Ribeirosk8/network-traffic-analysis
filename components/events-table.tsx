"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { NetworkEvent } from "@/lib/types"

interface EventsTableProps {
  data: NetworkEvent[]
  fileType?: string
}

export function EventsTable({ data, fileType = "groundtruth" }: EventsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const columns: ColumnDef<NetworkEvent>[] = [
    {
      accessorKey: "Event Type",
      header: fileType === "pcap" ? "Protocol/Event" : "Event Type",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.getValue("Event Type")}>
          {row.getValue("Event Type")}
        </div>
      ),
    },
    {
      accessorKey: "C2S ID",
      header: "ID",
    },
    {
      accessorKey: "Source",
      header: "Source IP",
    },
    {
      accessorKey: "Source Port(s)",
      header: "Source Ports",
    },
    {
      accessorKey: "Destination",
      header: "Destination IP",
    },
    {
      accessorKey: "Destination Port(s)",
      header: "Destination Ports",
    },
    {
      accessorKey: "Start Time",
      header: "Time",
    },
  ]

  // Add Info column for PCAP data if available
  if (fileType === "pcap" && data.length > 0 && data[0]["Info"]) {
    columns.push({
      accessorKey: "Info",
      header: "Info",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate" title={row.getValue("Info")}>
          {row.getValue("Info")}
        </div>
      ),
    })
  }

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter events..."
          value={(table.getColumn("Event Type")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("Event Type")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length,
          )}{" "}
          of {table.getFilteredRowModel().rows.length} events
        </div>
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}
