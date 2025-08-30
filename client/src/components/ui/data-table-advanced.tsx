"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Settings2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableAdvancedProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  searchPlaceholder?: string;
  title?: string;
  totalCount?: number;
  pageSize?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSearch?: (search: string) => void;
}

export function DataTableAdvanced<TData, TValue>({
  columns,
  data,
  loading = false,
  searchPlaceholder = "Search by name or roll number...",
  title,
  totalCount = 0,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  onPageSizeChange,
  onSearch,
}: DataTableAdvancedProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [searchValue, setSearchValue] = React.useState("");
  const [filteredData, setFilteredData] = React.useState<TData[]>(data);

  // Handle client-side filtering when onSearch is not provided - focus on name and roll number
  React.useEffect(() => {
    if (!onSearch && searchValue) {
      const filtered = data.filter((item: any) => {
        const studentName = String(item.student_name || "").toLowerCase();
        const rollNo = String(item.roll_no || "").toLowerCase();
        const searchTerm = searchValue.toLowerCase();

        return studentName.includes(searchTerm) || rollNo.includes(searchTerm);
      });
      setFilteredData(filtered);
    } else if (!onSearch) {
      setFilteredData(data);
    }
  }, [data, searchValue, onSearch]);

  // Handle search with debounce for external search
  React.useEffect(() => {
    if (onSearch) {
      const timer = setTimeout(() => {
        onSearch(searchValue);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchValue, onSearch]);

  // Use filtered data for display
  const displayData = onSearch ? data : filteredData;
  const displayTotalCount = onSearch ? totalCount : filteredData.length;

  const table = useReactTable({
    data: displayData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    // Only use manual pagination when external search is provided
    manualPagination: !!onSearch,
    pageCount: onSearch ? Math.ceil(totalCount / pageSize) : undefined,
  });

  const totalPages = onSearch
    ? Math.ceil(totalCount / pageSize)
    : Math.ceil(displayTotalCount / pageSize);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className="max-w-sm"
          />
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) =>
              onPageSizeChange?.(Number.parseInt(value))
            }
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <Settings2 className="mr-2 h-4 w-4" />
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing{" "}
          {onSearch
            ? (currentPage - 1) * pageSize + 1
            : Math.min(
                table.getState().pagination.pageIndex * pageSize + 1,
                displayTotalCount
              )}{" "}
          to{" "}
          {onSearch
            ? Math.min(currentPage * pageSize, totalCount)
            : Math.min(
                (table.getState().pagination.pageIndex + 1) * pageSize,
                displayTotalCount
              )}{" "}
          of {onSearch ? totalCount : displayTotalCount} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (onSearch) {
                onPageChange?.(currentPage - 1);
              } else {
                table.previousPage();
              }
            }}
            disabled={
              onSearch
                ? currentPage <= 1 || loading
                : !table.getCanPreviousPage() || loading
            }
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            <span className="text-sm">Page</span>
            <span className="text-sm font-medium">
              {onSearch
                ? currentPage
                : table.getState().pagination.pageIndex + 1}
            </span>
            <span className="text-sm">of</span>
            <span className="text-sm font-medium">{totalPages}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (onSearch) {
                onPageChange?.(currentPage + 1);
              } else {
                table.nextPage();
              }
            }}
            disabled={
              onSearch
                ? currentPage >= totalPages || loading
                : !table.getCanNextPage() || loading
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
