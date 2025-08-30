"use client";

import { useEffect, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Users, UserCheck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DataTableAdvanced } from "../ui/data-table-advanced";
import { AllocationControls } from "@/components/allocation/AllocationControal";
import {
  getAllUnallocatedStudents,
  getAllocatedStudents,
} from "@/services/GetAll/getall";
import type { Student } from "@/lib/types/parent";
import { allocateStudentsByStdDiv } from "@/services/allocate/student-allocate";

interface AllocatedStudent extends Student {
  allocated_class?: string;
  allocated_date?: string;
}

export function StudentAllocation() {
  const [allUnallocatedStudents, setAllUnallocatedStudents] = useState<
    Student[]
  >([]);
  const [allAllocatedStudents, setAllAllocatedStudents] = useState<
    AllocatedStudent[]
  >([]);
  const [selectedUnallocated, setSelectedUnallocated] = useState<string[]>([]);
  const [selectedAllocated, setSelectedAllocated] = useState<string[]>([]);

  const [unallocPageSize, setUnallocPageSize] = useState(10);
  const [allocPageSize, setAllocPageSize] = useState(10);

  const [isLoading, setIsLoading] = useState(true);
  const [isAllocating, setIsAllocating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchAllUnallocated(), fetchAllAllocated()]);
    };
    fetchData();
  }, []);

  const fetchAllUnallocated = async () => {
    try {
      setIsLoading(true);
      const response = await getAllUnallocatedStudents();
      if (response.data) {
        setAllUnallocatedStudents(response.data);
        toast.success(`Loaded ${response.data.length} unallocated students`);
      }
    } catch {
      toast.error("Error fetching unallocated students");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllAllocated = async () => {
    try {
      setIsLoading(true);
      const response = await getAllocatedStudents();
      console.log(response);
      if (response.data) {
        setAllAllocatedStudents(response.data);
        toast.success(`Loaded ${response.data.length} allocated students`);
      }
    } catch {
      toast.error("Error fetching allocated students");
    } finally {
      setIsLoading(false);
    }
  };

  const createColumns = (
    isAllocated: boolean
  ): ColumnDef<Student | AllocatedStudent>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => {
        const id = row.original.student_id.toString();
        const isSelected = row.getIsSelected();
        const setSelected = isAllocated
          ? setSelectedAllocated
          : setSelectedUnallocated;
        const selected = isAllocated ? selectedAllocated : selectedUnallocated;

        return (
          <Checkbox
            checked={isSelected}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
              setSelected(
                value ? [...selected, id] : selected.filter((sid) => sid !== id)
              );
            }}
          />
        );
      },
    },
    {
      accessorKey: "roll_no",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Roll No <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "student_name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "std",
      header: "Standard",
    },
    {
      accessorKey: "father_phone",
      header: "Father's Phone",
    },
    ...(isAllocated
      ? [
          {
            id: "class",
            header: "Class",
            accessorFn: (row: any) => `${row.std}-${row.div}`,
            cell: ({ row }: { row: any }) => (
              <Badge variant="outline">{`${row.original.std}-${row.original.div}`}</Badge>
            ),
          },
        ]
      : []),
  ];

  const handleAllocate = async (allocationData: {
    standard: string;
    division: string;
  }) => {
    setIsAllocating(true);
    try {
      // Convert selected student IDs from string to number
      const studentIds = selectedUnallocated.map((id) => parseInt(id));

      // Call the API to allocate students
      const response = await allocateStudentsByStdDiv(
        studentIds,
        allocationData.division,
        allocationData.standard
      );

      if (response.data) {
        // Update local state only after successful API call
        const className = `${allocationData.standard}-${allocationData.division}`;
        const toAllocate = allUnallocatedStudents.filter((s) =>
          selectedUnallocated.includes(s.student_id.toString())
        );

        const updated: AllocatedStudent[] = toAllocate.map((s) => ({
          ...s,
          std: allocationData.standard,
          div: allocationData.division,
          allocated_class: className,
          allocated_date: new Date().toISOString(),
        }));

        setAllAllocatedStudents((prev) => [...updated, ...prev]);
        setAllUnallocatedStudents((prev) =>
          prev.filter(
            (s) => !selectedUnallocated.includes(s.student_id.toString())
          )
        );
        setSelectedUnallocated([]);

        toast.success(
          response.data.message ||
            `Allocated ${updated.length} students to ${className}`
        );

        // Refresh data to ensure consistency with backend
        await Promise.all([fetchAllUnallocated(), fetchAllAllocated()]);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to allocate students"
      );
    } finally {
      setIsAllocating(false);
    }
  };

  const handleDeallocate = async () => {
    setIsAllocating(true);
    try {
      const toDeallocate = allAllocatedStudents.filter((s) =>
        selectedAllocated.includes(s.student_id.toString())
      );

      setAllUnallocatedStudents((prev) => [
        ...prev,
        ...toDeallocate.map(
          ({ allocated_class, allocated_date, ...rest }) => rest
        ),
      ]);

      setAllAllocatedStudents((prev) =>
        prev.filter((s) => !selectedAllocated.includes(s.student_id.toString()))
      );

      setSelectedAllocated([]);
      toast.success(`Deallocated ${toDeallocate.length} students`);
    } catch {
      toast.error("Failed to deallocate students");
    } finally {
      setIsAllocating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading students...</span>
      </div>
    );
  }

  // Calculate total selected count for allocation controls
  const totalSelectedCount =
    selectedUnallocated.length + selectedAllocated.length;

  return (
    <div className="space-y-6">
      <AllocationControls
        selectedCount={totalSelectedCount}
        allocationType="student"
        onAllocate={handleAllocate}
        onDeallocate={handleDeallocate}
        isLoading={isAllocating}
        // Show allocation fields only when unallocated students are selected
        showAllocationFields={selectedUnallocated.length > 0}
      />

      {/* Show selection info */}
      {(selectedUnallocated.length > 0 || selectedAllocated.length > 0) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-4 text-sm">
              {selectedUnallocated.length > 0 && (
                <Badge variant="default">
                  {selectedUnallocated.length} unallocated selected (for
                  allocation)
                </Badge>
              )}
              {selectedAllocated.length > 0 && (
                <Badge variant="secondary">
                  {selectedAllocated.length} allocated selected (for
                  deallocation)
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unallocated Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Unallocated Students ({allUnallocatedStudents.length})
          </CardTitle>
          <CardDescription>
            Students not yet assigned to any class
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allUnallocatedStudents.length > 0 ? (
            <DataTableAdvanced<Student, unknown>
              columns={createColumns(false)}
              data={allUnallocatedStudents}
              loading={isLoading}
              totalCount={allUnallocatedStudents.length}
              pageSize={unallocPageSize}
              currentPage={1} // Not used for client-side pagination
              onPageChange={() => {}} // Not used for client-side pagination
              onPageSizeChange={setUnallocPageSize}
              // No onSearch prop = client-side search and pagination
              searchPlaceholder="Search unallocated students by name or roll number..."
            />
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No unallocated students found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Allocated Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Allocated Students ({allAllocatedStudents.length})
          </CardTitle>
          <CardDescription>
            Students already assigned to a class
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allAllocatedStudents.length > 0 ? (
            <DataTableAdvanced<AllocatedStudent, unknown>
              columns={createColumns(true)}
              data={allAllocatedStudents}
              loading={isLoading}
              totalCount={allAllocatedStudents.length}
              pageSize={allocPageSize}
              currentPage={1} // Not used for client-side pagination
              onPageChange={() => {}} // Not used for client-side pagination
              onPageSizeChange={setAllocPageSize}
              // No onSearch prop = client-side search and pagination
              searchPlaceholder="Search allocated students by name or roll number..."
            />
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No allocated students found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
