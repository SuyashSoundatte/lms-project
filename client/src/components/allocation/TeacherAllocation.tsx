import { useState, useEffect, useCallback } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { AllocationControls } from "@/components/allocation/AllocationControal"
import {
  getUnallocatedTeachers,
  getAllocatedTeachers,
  type User,
} from "@/services/GetAll/getall"
import { assignTeacherSubjects, deassign } from "@/services/allocate/allocate"
import { ArrowUpDown, UserCheck, Users, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AllocatedTeacher extends User {
  teacher_allocation_id?: number
  allocation_id?: number
  allocationId?: number
  teacherAllocationId?: number
  teacher_allocate_id?: number
  teacherAllocateId?: number
  id?: number
  std: string
  div: string
  subjects: string
  allocated_date?: string
}

export function TeacherAllocation() {
  const [unallocatedTeachers, setUnallocatedTeachers] = useState<User[]>([])
  const [allocatedTeachers, setAllocatedTeachers] = useState<AllocatedTeacher[]>([])
  const [selectedUnallocated, setSelectedUnallocated] = useState<string[]>([])
  const [selectedAllocated, setSelectedAllocated] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAllocating, setIsAllocating] = useState(false)

  const { toast } = useToast()

  const handleUnallocatedSelectionChange = useCallback((ids: string[]) => {
    setSelectedUnallocated(ids)
  }, [])

  const handleAllocatedSelectionChange = useCallback((ids: string[]) => {
    setSelectedAllocated(ids)
  }, [])

  useEffect(() => {
    fetchTeacherData()
  }, [])

  const fetchTeacherData = async () => {
    setIsLoading(true)
    await Promise.all([fetchUnallocatedTeachers(), fetchAllocatedTeachers()])
    setSelectedUnallocated([])
    setSelectedAllocated([])
    setIsLoading(false)
  }

  const fetchUnallocatedTeachers = async () => {
    try {
      const response = await getUnallocatedTeachers()
      if (response.status && response.data) {
        setUnallocatedTeachers(response.data)
      } else {
        toast.error(response.message || "Failed to fetch unallocated teachers")
      }
    } catch (error: any) {
      // console.error("Error fetching unallocated teachers:", error)
      toast.error("Failed to fetch unallocated teachers")
    }
  }

  const fetchAllocatedTeachers = async () => {
    try {
      const response = await getAllocatedTeachers()
      if (response.status && response.data) {
        setAllocatedTeachers(response.data  as AllocatedTeacher[])
      } else {
        toast.error(response.message || "Failed to fetch allocated teachers")
      }
    } catch (error: any) {
      // console.error("Error fetching allocated teachers:", error)
      toast.error("Failed to fetch allocated teachers")
    }
  }

  const createColumns = (isAllocated: boolean): ColumnDef<User | AllocatedTeacher>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "name",
      accessorFn: (row) => `${row.teacher_name}`.trim(),
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const teacher = row.original
        return (
          <div>
            <div className="font-medium">{teacher.teacher_name?.trim() || 'N/A'}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="text-sm">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    ...(isAllocated
      ? [
        {
          accessorKey: "subjects",
          header: "Subject",
          cell: ({ row }: { row: any }) => (
            <Badge className="bg-blue-100 text-blue-800">{row.getValue("subjects")}</Badge>
          ),
        },
        {
          id: "class",
          header: "Class",
          cell: ({ row }: { row: any }) => {
            const teacher = row.original as AllocatedTeacher
            return (
              <Badge className="bg-purple-100 text-purple-800 font-semibold">
                {teacher.std} - {teacher.div}
              </Badge>
            )
          },
        },
        // {
        //   accessorKey: "allocated_date",
        //   header: "Allocation Date",
        //   cell: ({ row }: { row: any }) => (
        //     <div className="text-sm">{new Date(row.getValue("allocated_date")).toLocaleDateString()}</div>
        //   ),
        // },
      ]
      : []),
  ]

  const handleAllocate = async (allocationData: any) => {
    if (selectedUnallocated.length !== 1) {
      toast.error("Please select one teacher to allocate")
      return
    }

    if (!allocationData.subject || !allocationData.standard || !allocationData.division) {
      toast.error("Please select subject, standard and division")
      return
    }

    setIsAllocating(true)
    try {
      const teacher = unallocatedTeachers.find((teacher) =>
        selectedUnallocated.includes(teacher.user_id.toString())
      )
      if (!teacher) throw new Error("Selected teacher not found")

      await assignTeacherSubjects(
        teacher.user_id,
        allocationData.subject,
        allocationData.standard,
        allocationData.division
      )
      toast.success("Teacher allocated successfully")
      await fetchTeacherData()
    } catch (error: any) {
      // console.error("Allocation failed:", error)
      toast.error(error.message || "Failed to allocate teacher")
    } finally {
      setIsAllocating(false)
    }
  }

  const getAllocationId = (teacher: AllocatedTeacher) =>
    teacher.teacher_allocation_id ??
    teacher.allocation_id ??
    teacher.allocationId ??
    teacher.teacherAllocationId ??
    teacher.teacher_allocate_id ??
    teacher.teacherAllocateId ??
    teacher.id

  const getAllocatedRowId = (teacher: AllocatedTeacher) => {
    const allocationId = getAllocationId(teacher)
    if (allocationId) return allocationId.toString()

    return `${teacher.user_id}-${teacher.std}-${teacher.div}-${teacher.subjects}`
  }

  const handleDeallocate = async () => {
    if (selectedAllocated.length !== 1) {
      toast.error("Please select one allocated teacher to deallocate")
      return
    }

    setIsAllocating(true)
    try {
      const teacher = allocatedTeachers.find(
        (teacher) => selectedAllocated[0] === getAllocatedRowId(teacher)
      )
      if (!teacher) throw new Error("Selected teacher not found")

      const allocationId = getAllocationId(teacher)
      if (!allocationId) throw new Error("Allocation ID not found for selected teacher")

      await deassign(allocationId)
      toast.success("Teacher deallocated successfully")
      await fetchTeacherData()
    } catch (error: any) {
      toast.error(error.message || "Failed to deallocate teacher")
    } finally {
      setIsAllocating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading teachers...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AllocationControls
        selectedCount={selectedUnallocated.length + selectedAllocated.length}
        allocationType="teacher"
        onAllocate={handleAllocate}
        onDeallocate={handleDeallocate}
        isLoading={isAllocating}
      />

      <div className="space-y-6">
        {/* Unallocated Teachers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Unallocated Teachers ({unallocatedTeachers.length})
            </CardTitle>
            <CardDescription>Teachers not yet assigned to subjects/classes</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable<User | AllocatedTeacher, unknown>
              columns={createColumns(false)}
              data={unallocatedTeachers}
              getRowId={(teacher) => teacher.user_id.toString()}
              onSelectionChange={handleUnallocatedSelectionChange}
              searchPlaceholder="Search unallocated teachers..."
            />
          </CardContent>
        </Card>

        {/* Allocated Teachers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Allocated Teachers ({allocatedTeachers.length})
            </CardTitle>
            <CardDescription>Teachers assigned to subjects and classes</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable<User | AllocatedTeacher, unknown>
              columns={createColumns(true)}
              data={allocatedTeachers}
              getRowId={(teacher) => getAllocatedRowId(teacher as AllocatedTeacher)}
              onSelectionChange={handleAllocatedSelectionChange}
              searchPlaceholder="Search allocated teachers..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
