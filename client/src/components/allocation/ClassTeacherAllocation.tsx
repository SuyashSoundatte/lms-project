"use client"
import { useState, useEffect, useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AllocationControls } from "@/components/allocation/AllocationControal"
import {
  getUnallocatedClassTeachers,
  getAllocatedClassTeachers,
} from "@/services/GetAll/getall"
import {
  ArrowUpDown,
  Users,
  GraduationCap,
  Loader2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { assignClassTeacherByStdDiv, deassign } from "@/services/allocate/allocate"
import { DataTableAdvanced } from "@/components/ui/data-table-advanced"

interface BaseTeacher {
  user_id: number
  email?: string
}

interface AllocatedTeacher extends BaseTeacher {
  ct_allocation_id: number
  teacher_name: string
  std: string
  div: string
  phone?: string
}

interface UnallocatedTeacher extends BaseTeacher {
  teacher_name: string
  phone: string
  email: string
  dob: string
}

export function ClassTeacherAllocation() {
  const [unallocatedTeachers, setUnallocatedTeachers] = useState<UnallocatedTeacher[]>([])
  const [allocatedTeachers, setAllocatedTeachers] = useState<AllocatedTeacher[]>([])

  const [selectedUnallocated, setSelectedUnallocated] = useState<string | false>(false)
  const [selectedAllocated, setSelectedAllocated] = useState<string | false>(false)

  const [unallocPage, setUnallocPage] = useState(1)
  const [unallocPageSize, setUnallocPageSize] = useState(10)
  const [allocPage, setAllocPage] = useState(1)
  const [allocPageSize, setAllocPageSize] = useState(10)

  const [isLoading, setIsLoading] = useState(true)
  const [isAllocating, setIsAllocating] = useState(false)
  const { toast } = useToast()

  const transformUnallocatedData = (data: any[]): UnallocatedTeacher[] =>
    data.map((t) => ({
      user_id: t.user_id,
      teacher_name: t.teacher_name,
      email: t.email,
      phone: t.phone,
      dob: t.dob,
    }))

  const transformAllocatedData = (data: any[]): AllocatedTeacher[] =>
    data.map((t) => ({
      ct_allocation_id: t.ct_allocation_id,
      user_id: t.user_id,
      teacher_name: t.teacher_name,
      std: t.std,
      div: t.div,
      email: t.email,
      phone: t.phone,
    }))

  const fetchUnallocatedTeachers = async () => {
    try {
      const response = await getUnallocatedClassTeachers()
      if (response.status && response.data) {
        setUnallocatedTeachers(transformUnallocatedData(response.data))
      } else {
        toast.error(response.message || "Failed to fetch unallocated teachers")
      }
    } catch {
      toast.error("Failed to fetch unallocated teachers")
    }
  }

  const fetchAllocatedTeachers = async () => {
    try {
      const response = await getAllocatedClassTeachers()
      if (response.status && response.data) {
        setAllocatedTeachers(transformAllocatedData(response.data))
      } else {
        toast.error(response.message || "Failed to fetch allocated teachers")
      }
    } catch {
      toast.error("Failed to fetch allocated teachers")
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      await Promise.all([fetchUnallocatedTeachers(), fetchAllocatedTeachers()])
      setSelectedUnallocated(false)
      setSelectedAllocated(false)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const paginate = <T,>(data: T[], page: number, size: number): T[] =>
    data.slice((page - 1) * size, page * size)

  const createColumns = (isAllocated: boolean): ColumnDef<UnallocatedTeacher | AllocatedTeacher>[] => [
    {
      id: "select",
      header: "Select",
      cell: ({ row }) => {
        const id = row.original.user_id.toString();
        const selected = isAllocated ? selectedAllocated : selectedUnallocated;
        const setSelected = isAllocated ? setSelectedAllocated : setSelectedUnallocated;

        const isChecked = selected === id;

        return (
          <Checkbox
            checked={isChecked}
            onCheckedChange={(value) => {
              if (value) {
                setSelected(id)
                isAllocated ? setSelectedUnallocated(false) : setSelectedAllocated(false)
              } else {
                setSelected(false)
              }
            }}
            aria-label="Select row"
            className={isChecked ? "ring-2 ring-primary" : ""}
          />
        )
      },
    },
    {
      accessorKey: "user_id",
      header: "ID",
      cell: ({ row }) => <div className="font-medium">{row.getValue("user_id")}</div>,
    },
    {
      id: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const teacher = row.original
        return (
          <div className={(selectedUnallocated === teacher.user_id.toString() ||
            selectedAllocated === teacher.user_id.toString())
            ? "font-semibold text-primary"
            : ""}>
            {"teacher_name" in teacher ? teacher.teacher_name : "N/A"}
          </div>
        )
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <div className={(selectedUnallocated === row.original.user_id.toString() ||
          selectedAllocated === row.original.user_id.toString())
          ? "font-semibold" : ""}>
          {row.getValue("phone")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className={(selectedUnallocated === row.original.user_id.toString() ||
          selectedAllocated === row.original.user_id.toString())
          ? "font-semibold" : ""}>
          {row.getValue("email")}
        </div>
      ),
    },
    ...(isAllocated
      ? [
        {
          id: "class",
          header: "Class",
          cell: ({ row }: { row: any }) => {
            const t = row.original as AllocatedTeacher
            return (
              <Badge className={selectedAllocated === t.user_id.toString()
                ? "bg-primary text-primary-foreground"
                : "bg-purple-100 text-purple-800 font-semibold"}>
                {t.std} - {t.div}
              </Badge>
            )
          },
        },
      ]
      : []),
  ]

  const handleAllocate = async (data: { standard: string; division: string }) => {
    if (selectedUnallocated === false) {
      toast.error("Please select a teacher to allocate")
      return
    }

    if (!data.standard || !data.division) {
      toast.error("Please select both standard and division")
      return
    }

    setIsAllocating(true)
    try {
      const teacher = unallocatedTeachers.find(t => t.user_id.toString() === selectedUnallocated)
      if (!teacher) throw new Error("Selected teacher not found")

      const response = await assignClassTeacherByStdDiv(
        teacher.user_id,
        data.standard,
        data.division
      )

      if (response.data) {
        toast.success("Class teacher assigned successfully")
        await Promise.all([fetchUnallocatedTeachers(), fetchAllocatedTeachers()])
        setSelectedUnallocated(false)
      } else {
        throw new Error("Allocation failed")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to allocate class teacher")
    } finally {
      setIsAllocating(false)
    }
  }

  const handleDeallocate = async () => {
    if (!selectedAllocated) {
      toast.error("Please select a teacher to deallocate");
      return;
    }

    setIsAllocating(true);
    try {
      const teacher = allocatedTeachers.find(
        (t) => t.user_id.toString() === selectedAllocated
      );
      if (!teacher) throw new Error("Selected teacher not found");

      const response = await deassign(teacher.ct_allocation_id);

      if (response.data) {
        toast.success("Teacher deallocated successfully");
        await Promise.all([fetchUnallocatedTeachers(), fetchAllocatedTeachers()]);
        setSelectedAllocated(""); // or null — depends on your type setup
      } else {
        throw new Error("Deallocation failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to deallocate teacher");
    } finally {
      setIsAllocating(false);
    }
  };


  const unallocatedColumns = useMemo(() => createColumns(false), [selectedUnallocated, selectedAllocated])
  const allocatedColumns = useMemo(() => createColumns(true), [selectedUnallocated, selectedAllocated])

  const paginatedUnallocated = useMemo(() =>
    paginate(unallocatedTeachers, unallocPage, unallocPageSize),
    [unallocatedTeachers, unallocPage, unallocPageSize]
  )

  const paginatedAllocated = useMemo(() =>
    paginate(allocatedTeachers, allocPage, allocPageSize),
    [allocatedTeachers, allocPage, allocPageSize]
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading teachers...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AllocationControls
        selectedCount={selectedUnallocated !== false ? 1 : selectedAllocated !== false ? 1 : 0}
        allocationType="class-teacher"
        onAllocate={handleAllocate}
        onDeallocate={handleDeallocate}
        isLoading={isAllocating}
        showAllocationFields={selectedUnallocated !== false}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Available Teachers ({unallocatedTeachers.length})
          </CardTitle>
          <CardDescription>Teachers available for class teacher assignment</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableAdvanced
            columns={unallocatedColumns}
            data={paginatedUnallocated}
            totalCount={unallocatedTeachers.length}
            currentPage={unallocPage}
            pageSize={unallocPageSize}
            onPageChange={setUnallocPage}
            onPageSizeChange={setUnallocPageSize}
            searchPlaceholder="Search available teachers..."
            title="Unallocated"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Assigned Class Teachers ({allocatedTeachers.length})
          </CardTitle>
          <CardDescription>Teachers assigned as class teachers</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableAdvanced
            columns={allocatedColumns}
            data={paginatedAllocated}
            totalCount={allocatedTeachers.length}
            currentPage={allocPage}
            pageSize={allocPageSize}
            onPageChange={setAllocPage}
            onPageSizeChange={setAllocPageSize}
            searchPlaceholder="Search assigned class teachers..."
            title="Allocated"
          />
        </CardContent>
      </Card>
    </div>
  )
}