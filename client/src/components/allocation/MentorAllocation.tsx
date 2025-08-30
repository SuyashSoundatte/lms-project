import { useState, useEffect, useMemo } from "react";
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
import { DataTableAdvanced } from "@/components/ui/data-table-advanced";
import { AllocationControls } from "@/components/allocation/AllocationControal";
import { getAllMentors } from "@/services/GetAll/getall";
import { ArrowUpDown, Users, Heart, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  user_id: number;
  teacher_name?: string;
  lname?: string;
  email?: string;
  phone?: string;
}

interface AllocatedMentor extends User {
  allocated_standard: string;
  allocated_division: string;
  allocated_date: string;
}

export function MentorAllocation() {
  const [unallocatedMentors, setUnallocatedMentors] = useState<User[]>([]);
  const [allocatedMentors, setAllocatedMentors] = useState<AllocatedMentor[]>(
    []
  );
  const [selectedUnallocated, setSelectedUnallocated] = useState<
    string | false
  >(false);
  const [selectedAllocated, setSelectedAllocated] = useState<string | false>(
    false
  );
  const [unallocPage, setUnallocPage] = useState(1);
  const [unallocPageSize, setUnallocPageSize] = useState(10);
  const [allocPage, setAllocPage] = useState(1);
  const [allocPageSize, setAllocPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isAllocating, setIsAllocating] = useState(false);
  const { toast } = useToast();

  const paginate = <T,>(data: T[], page: number, size: number): T[] =>
    data.slice((page - 1) * size, page * size);

  const fetchUnallocatedUsers = async () => {
    try {
      setIsLoading(true);
      const response = await getAllMentors();

      if (Array.isArray(response.data)) {
        setUnallocatedMentors(response.data);

        if (response.data.length > 0) {
          toast.success(`Loaded ${response.data.length} unallocated mentors`);
        } else {
          toast.info("No unallocated mentors found");
        }
      } else {
        toast.error(response.message || "Unexpected response format");
      }
    } catch (error) {
      toast.error("Failed to fetch mentors");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnallocatedUsers();
  }, []);

  const createColumns = (
    isAllocated: boolean
  ): ColumnDef<User | AllocatedMentor>[] => [
    {
      id: "select",
      header: "Select",
      cell: ({ row }) => {
        const id = row.original.user_id.toString();
        const selected = isAllocated ? selectedAllocated : selectedUnallocated;
        const setSelected = isAllocated
          ? setSelectedAllocated
          : setSelectedUnallocated;
        const isChecked = selected === id;

        return (
          <Checkbox
            checked={isChecked}
            onCheckedChange={(value) => {
              if (value) {
                setSelected(id);
                isAllocated
                  ? setSelectedUnallocated(false)
                  : setSelectedAllocated(false);
              } else {
                setSelected(false);
              }
            }}
            aria-label="Select row"
            className={isChecked ? "ring-2 ring-primary" : ""}
          />
        );
      },
    },
    {
      accessorKey: "user_id",
      header: "ID",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("user_id")}</div>
      ),
    },
    {
      id: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const mentor = row.original;
        return (
          <div
            className={
              selectedUnallocated === mentor.user_id.toString() ||
              selectedAllocated === mentor.user_id.toString()
                ? "font-semibold text-primary"
                : ""
            }
          >
            {mentor.teacher_name ?? ""} {mentor.lname ?? ""}
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    ...(isAllocated
      ? [
          {
            accessorKey: "allocated_standard",
            header: "Standard",
          },
          {
            accessorKey: "allocated_division",
            header: "Division",
          },
          {
            accessorKey: "allocated_date",
            header: "Allocated On",
            cell: ({ row }: { row: any }) => {
              const date = (row.original as AllocatedMentor).allocated_date;
              return (
                <div className="text-sm">
                  {date ? new Date(date).toLocaleDateString() : "N/A"}
                </div>
              );
            },
          },
        ]
      : []),
  ];

  const handleAllocate = async ({
    standard,
    division,
  }: {
    standard: string;
    division: string;
  }) => {
    if (!standard || !division) {
      toast.error("Please select standard and division");
      return;
    }

    if (!selectedUnallocated) {
      toast.error("Please select a mentor to allocate");
      return;
    }

    setIsAllocating(true);
    try {
      const mentor = unallocatedMentors.find(
        (m) => m.user_id.toString() === selectedUnallocated
      );
      if (!mentor) throw new Error("Selected mentor not found");

      const newMentor: AllocatedMentor = {
        ...mentor,
        allocated_standard: standard,
        allocated_division: division,
        allocated_date: new Date().toISOString(),
      };

      setAllocatedMentors((prev) => [...prev, newMentor]);
      setUnallocatedMentors((prev) =>
        prev.filter((m) => m.user_id.toString() !== selectedUnallocated)
      );
      setSelectedUnallocated(false);
      toast.success(`Mentor allocated to Std ${standard} - Div ${division}`);
    } catch (err: any) {
      toast.error(err.message || "Allocation failed");
    } finally {
      setIsAllocating(false);
    }
  };

  const handleDeallocate = async () => {
    if (!selectedAllocated) {
      toast.error("Please select a mentor to deallocate");
      return;
    }

    setIsAllocating(true);
    try {
      const mentor = allocatedMentors.find(
        (m) => m.user_id.toString() === selectedAllocated
      );
      if (!mentor) throw new Error("Selected mentor not found");

      const {
        allocated_standard,
        allocated_division,
        allocated_date,
        ...rest
      } = mentor;
      setUnallocatedMentors((prev) => [...prev, rest]);
      setAllocatedMentors((prev) =>
        prev.filter((m) => m.user_id.toString() !== selectedAllocated)
      );
      setSelectedAllocated(false);
      toast.success("Mentor deallocated");
    } catch (err: any) {
      toast.error(err.message || "Deallocation failed");
    } finally {
      setIsAllocating(false);
    }
  };

  const unallocatedColumns = useMemo(
    () => createColumns(false),
    [selectedUnallocated, selectedAllocated]
  );
  const allocatedColumns = useMemo(
    () => createColumns(true),
    [selectedUnallocated, selectedAllocated]
  );
  const paginatedUnallocated = useMemo(
    () => paginate(unallocatedMentors, unallocPage, unallocPageSize),
    [unallocatedMentors, unallocPage, unallocPageSize]
  );
  const paginatedAllocated = useMemo(
    () => paginate(allocatedMentors, allocPage, allocPageSize),
    [allocatedMentors, allocPage, allocPageSize]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading mentors...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AllocationControls
        selectedCount={
          selectedUnallocated !== false
            ? 1
            : selectedAllocated !== false
            ? 1
            : 0
        }
        allocationType="mentor"
        onAllocate={handleAllocate}
        onDeallocate={handleDeallocate}
        isLoading={isAllocating}
        showAllocationFields={selectedUnallocated !== false}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Available Mentors ({unallocatedMentors.length})
          </CardTitle>
          <CardDescription>Mentors available for allocation</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableAdvanced
            columns={unallocatedColumns}
            data={paginatedUnallocated}
            totalCount={unallocatedMentors.length}
            currentPage={unallocPage}
            pageSize={unallocPageSize}
            onPageChange={setUnallocPage}
            onPageSizeChange={setUnallocPageSize}
            searchPlaceholder="Search available mentors..."
            title="Unallocated"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Assigned Mentors ({allocatedMentors.length})
          </CardTitle>
          <CardDescription>Mentors already assigned to classes</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableAdvanced
            columns={allocatedColumns}
            data={paginatedAllocated}
            totalCount={allocatedMentors.length}
            currentPage={allocPage}
            pageSize={allocPageSize}
            onPageChange={setAllocPage}
            onPageSizeChange={setAllocPageSize}
            searchPlaceholder="Search allocated mentors..."
            title="Allocated"
          />
        </CardContent>
      </Card>
    </div>
  );
}
