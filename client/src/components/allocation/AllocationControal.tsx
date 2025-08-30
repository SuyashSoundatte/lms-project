import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  UserCheck,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { CLASS_DIVISION_MAP, STD_OPTIONS } from "@/lib/constants/classes";

type AllocationType = "student" | "teacher" | "class-teacher" | "mentor";

interface AllocationData {
  standard: string;
  division: string;
  subject?: string;
}

interface AllocationControlsProps {
  selectedCount: number;
  allocationType: AllocationType;
  onAllocate: (allocationData: AllocationData) => void;
  onDeallocate: () => void;
  isLoading?: boolean;
  showAllocationFields?: boolean;
}

export function AllocationControls({
  selectedCount,
  allocationType,
  onAllocate,
  onDeallocate,
  isLoading = false,
  showAllocationFields = true,
}: AllocationControlsProps) {
  const [allocationData, setAllocationData] = useState<AllocationData>({
    standard: "",
    division: "",
    subject: "",
  });

  const isSingleSelect = allocationType !== "student";
  const isInvalidSelection = isSingleSelect && selectedCount > 1;

  const handleAllocate = () => {
    if (isInvalidSelection) return;
    onAllocate(allocationData);
    setAllocationData({ standard: "", division: "", subject: "" });
  };

  const isMissingFields = () => {
    if (!showAllocationFields) return false;
    switch (allocationType) {
      case "student":
      case "class-teacher":
      case "mentor":
        return !allocationData.standard || !allocationData.division;
      case "teacher":
        return (
          !allocationData.subject ||
          !allocationData.standard ||
          !allocationData.division
        );
      default:
        return false;
    }
  };

  const availableDivisions = allocationData.standard
    ? CLASS_DIVISION_MAP[allocationData.standard] || []
    : [];

  const renderStandardSelect = (
    <div className="space-y-2">
      <Label htmlFor="standard">Standard</Label>
      <Select
        value={allocationData.standard}
        onValueChange={
          (value) =>
            setAllocationData((prev) => ({
              ...prev,
              standard: value,
              division: "",
            })) // Reset division on standard change
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select standard" />
        </SelectTrigger>
        <SelectContent>
          {STD_OPTIONS.map((std) => (
            <SelectItem key={std} value={std}>
              {std}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const renderDivisionSelect = (
    <div className="space-y-2">
      <Label htmlFor="division">Division</Label>
      <Select
        value={allocationData.division}
        onValueChange={(value) =>
          setAllocationData((prev) => ({ ...prev, division: value }))
        }
        disabled={!allocationData.standard}
      >
        <SelectTrigger>
          <SelectValue
            placeholder={
              !allocationData.standard
                ? "Select standard first"
                : "Select division"
            }
          />
        </SelectTrigger>
        <SelectContent>
          {availableDivisions.map((div) => (
            <SelectItem key={div} value={div}>
              {div}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const renderSubjectSelect = (
    <div className="space-y-2">
      <Label htmlFor="subject">Subject</Label>
      <Select
        value={allocationData.subject}
        onValueChange={(value) =>
          setAllocationData((prev) => ({ ...prev, subject: value }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select subject" />
        </SelectTrigger>
        <SelectContent>
          {[
            "Mathematics",
            "Science",
            "English",
            "History",
            "Geography",
            "Physics",
            "Chemistry",
            "Biology",
          ].map((subject) => (
            <SelectItem key={subject} value={subject.toLowerCase()}>
              {subject}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const renderAllocationFields = () => {
    switch (allocationType) {
      case "student":
      case "class-teacher":
      case "mentor":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderStandardSelect}
            {renderDivisionSelect}
          </div>
        );
      case "teacher":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderSubjectSelect}
            {renderStandardSelect}
            {renderDivisionSelect}
          </div>
        );
      default:
        return null;
    }
  };

  const getActionIcon = () => {
    const icons = {
      student: <Users className="h-4 w-4" />,
      teacher: <BookOpen className="h-4 w-4" />,
      "class-teacher": <UserCheck className="h-4 w-4" />,
      mentor: <Users className="h-4 w-4" />,
    };
    return icons[allocationType] || <ArrowRight className="h-4 w-4" />;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getActionIcon()} Allocation Controls
        </CardTitle>
        <CardDescription>
          {selectedCount > 0 ? (
            <>
              <Badge variant="secondary" className="mr-2">
                {selectedCount} selected
              </Badge>
              {isInvalidSelection && (
                <span className="text-sm text-red-500">
                  Only one selection allowed for this role
                </span>
              )}
            </>
          ) : (
            "Select items from the tables to begin allocation or deallocation"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAllocationFields && renderAllocationFields()}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={handleAllocate}
            disabled={
              selectedCount === 0 ||
              isLoading ||
              isInvalidSelection ||
              (showAllocationFields && isMissingFields())
            }
            className="flex items-center gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            Allocate
          </Button>
          <Button
            variant="outline"
            onClick={onDeallocate}
            disabled={selectedCount === 0 || isLoading}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Deallocate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
