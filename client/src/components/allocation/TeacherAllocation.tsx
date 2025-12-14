import { useState, useEffect } from "react"
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
import { ArrowUpDown, UserCheck, Users, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AllocatedTeacher extends User {
  std: string
  div: string
  subjects: string
  allocated_date?: string
}

export function TeacherAllocation() {
  const [unallocatedTeachers, setUnallocatedTeachers] = useState<User[]>([])
  const [allocatedTeachers, setAllocatedTeachers] = useState<AllocatedTeacher[]>([])
  const [selectedUnallocated, setSelectedUnallocated] = useState<string[]>([])
  const [_, setSelectedAllocated] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAllocating, setIsAllocating] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    fetchUnallocatedTeachers()
    fetchAllocatedTeachers()
  }, [])

  const fetchUnallocatedTeachers = async () => {
    try {
      setIsLoading(true)
      const response = await getUnallocatedTeachers()
      if (response.status && response.data) {
        setUnallocatedTeachers(response.data)
        toast.success(`Loaded ${response.data.length} unallocated teachers successfully`)
      } else {
        toast.error(response.message || "Failed to fetch unallocated teachers")
      }
    } catch (error: any) {
      // console.error("Error fetching unallocated teachers:", error)
      toast.error("Failed to fetch unallocated teachers")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAllocatedTeachers = async () => {
    try {
      setIsLoading(true)
      const response = await getAllocatedTeachers()
      if (response.status && response.data) {
        setAllocatedTeachers(response.data  as AllocatedTeacher[])
        toast.success(`Loaded ${response.data.length} allocated teachers successfully`)
      } else {
        toast.error(response.message || "Failed to fetch allocated teachers")
      }
    } catch (error: any) {
      // console.error("Error fetching allocated teachers:", error)
      toast.error("Failed to fetch allocated teachers")
    } finally {
      setIsLoading(false)
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
    setIsAllocating(true)
    try {
      const teachersToAllocate = unallocatedTeachers.filter((teacher) =>
        selectedUnallocated.includes(teacher.user_id.toString()),
      )

      const allocatedClass = `${allocationData.standard}-${allocationData.division}`
      const updatedTeachers: AllocatedTeacher[] = teachersToAllocate.map((teacher) => ({
        ...teacher,
        std: allocationData.standard,
        div: allocationData.division,
        subjects: allocationData.subject,
        allocated_class: allocatedClass,
        allocated_date: new Date().toISOString().split("T")[0],
      }))

      setAllocatedTeachers((prev) => [...prev, ...updatedTeachers])
      setUnallocatedTeachers((prev) =>
        prev.filter((teacher) => !selectedUnallocated.includes(teacher.user_id.toString())),
      )
      setSelectedUnallocated([])

      toast.success(`Successfully allocated ${updatedTeachers.length} teachers`)
    } catch (error) {
      // console.error("Allocation failed:", error)
      toast.error("Failed to allocate teachers")
    } finally {
      setIsAllocating(false)
    }
  }

  const handleDeallocate = async () => {
    // setIsAllocating(true)
    // try {
    //   const teachersToDeallocate = allocatedTeachers.filter((teacher) =>
    //     selectedAllocated.includes(teacher.user_id.toString()),
    //   )

    //   const unallocated = teachersToDeallocate.map((teacher) => {
    //     const { subjects, a, allocated_date, ...rest } = teacher
    //     return rest
    //   })

    //   setUnallocatedTeachers((prev) => [...prev, ...unallocated])
    //   setAllocatedTeachers((prev) =>
    //     prev.filter((teacher) => !selectedAllocated.includes(teacher.user_id.toString())),
    //   )
    //   setSelectedAllocated([])

    //   toast.success(`Successfully deallocated ${unallocated.length} teachers`)
    // } catch (error) {
    //   console.error("Deallocation failed:", error)
    //   toast.error("Failed to deallocate teachers")
    // } finally {
    //   setIsAllocating(false)
    // }
    // console.log("deallocate teachers")
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
        selectedCount={selectedUnallocated.length}
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
            <DataTable
              columns={createColumns(false)}
              data={unallocatedTeachers}
              onSelectionChange={setSelectedUnallocated}
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
            <DataTable
              columns={createColumns(true)}
              data={allocatedTeachers}
              onSelectionChange={setSelectedAllocated}
              searchPlaceholder="Search allocated teachers..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
