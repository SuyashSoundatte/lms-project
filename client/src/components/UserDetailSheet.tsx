"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Users,
  Edit3,
  Save,
  X,
  UserCircle,
  BookOpen,
  Home,
  Camera,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import the correct types from your service
import type {
  User as ServiceUser,
  Student as ServiceStudent,
  Student,
} from "@/services/GetAll/getall";

interface UserDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  user: ServiceUser | null;
  onSave: (updatedUser: ServiceUser) => Promise<void>;
}

interface StudentDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  student: ServiceStudent | null;
  onSave: (updatedStudent: ServiceStudent) => Promise<void>;
}

export function UserDetailSheet({
  isOpen,
  onClose,
  user,
  onSave,
}: UserDetailSheetProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<ServiceUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize edited user when user prop changes
  useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
      setEditMode(false);
      setErrors({});
      setHasChanges(false);
    }
  }, [user]);

  if (!editedUser) return null;

  const handleInputChange = (
    field: keyof ServiceUser,
    value: string | number
  ) => {
    setEditedUser((prev) => (prev ? { ...prev, [field]: value } : null));
    setHasChanges(true);
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editedUser?.fname?.trim()) {
      newErrors.fname = "First name is required";
    }
    if (!editedUser?.lname?.trim()) {
      newErrors.lname = "Last name is required";
    }
    if (!editedUser?.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedUser.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!editedUser?.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(editedUser.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!editedUser?.role) {
      newErrors.role = "Role is required";
    }
    if (!editedUser?.gender) {
      newErrors.gender = "Gender is required";
    }
    if (!editedUser?.address?.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!editedUser || !validateForm()) return;

    setSaving(true);
    try {
      await onSave(editedUser);
      setEditMode(false);
      setHasChanges(false);
      setErrors({});
    } catch (error) {
      // console.error("Error saving user:", error)
      setErrors({ general: "Failed to save user. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditedUser({ ...user });
      setEditMode(false);
      setErrors({});
      setHasChanges(false);
    }
  };

  const getInitials = (fname: string, lname: string) => {
    return `${fname?.[0] || ""}${lname?.[0] || ""}`.toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Principal":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Teacher":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Admin":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Librarian":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "Counselor":
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl lg:max-w-3xl p-0 flex flex-col h-full overflow-hidden"
      >
        {/* Fixed Header */}
        <div className="flex-shrink-0 border-b bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {editMode ? "Edit User Profile" : "User Profile"}
              </SheetTitle>
              <SheetDescription className="text-gray-600 mt-1 text-sm sm:text-base">
                {editMode
                  ? "Update user information and details"
                  : "View comprehensive user information"}
              </SheetDescription>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!editMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditMode(true)}
                  className="gap-2 text-xs sm:text-sm"
                >
                  <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* User Avatar and Basic Info */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-white shadow-lg">
                <AvatarFallback className="text-lg sm:text-xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {getInitials(editedUser.fname, editedUser.lname)}
                </AvatarFallback>
              </Avatar>
              {editMode && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                {editedUser.fname} {editedUser.mname} {editedUser.lname}
              </h3>
              <p className="text-gray-600 flex items-center gap-1 mt-1 text-sm truncate">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                {editedUser.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  className={getRoleColor(editedUser.role)}
                  variant="outline"
                >
                  {editedUser.role}
                </Badge>
                {hasChanges && editMode && (
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    Unsaved Changes
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 h-0">
          <div className="p-4 sm:p-6 space-y-6">
            {/* Error Alert */}
            {errors.general && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            {/* Personal Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserCircle className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fname" className="text-sm font-medium">
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fname"
                          value={editedUser.fname}
                          onChange={(e) =>
                            handleInputChange("fname", e.target.value)
                          }
                          placeholder="Enter first name"
                          className={errors.fname ? "border-red-500" : ""}
                        />
                        {errors.fname && (
                          <p className="text-sm text-red-500">{errors.fname}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lname" className="text-sm font-medium">
                          Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="lname"
                          value={editedUser.lname}
                          onChange={(e) =>
                            handleInputChange("lname", e.target.value)
                          }
                          placeholder="Enter last name"
                          className={errors.lname ? "border-red-500" : ""}
                        />
                        {errors.lname && (
                          <p className="text-sm text-red-500">{errors.lname}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mname" className="text-sm font-medium">
                        Middle Name
                      </Label>
                      <Input
                        id="mname"
                        value={editedUser.mname || ""}
                        onChange={(e) =>
                          handleInputChange("mname", e.target.value)
                        }
                        placeholder="Enter middle name (optional)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Gender <span className="text-red-500">*</span>
                      </Label>
                      <RadioGroup
                        value={editedUser.gender}
                        onValueChange={(value) =>
                          handleInputChange("gender", value)
                        }
                        className="flex flex-wrap gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Male" id="male" />
                          <Label htmlFor="male" className="text-sm">
                            Male
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Female" id="female" />
                          <Label htmlFor="female" className="text-sm">
                            Female
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Other" id="other" />
                          <Label htmlFor="other" className="text-sm">
                            Other
                          </Label>
                        </div>
                      </RadioGroup>
                      {errors.gender && (
                        <p className="text-sm text-red-500">{errors.gender}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Full Name
                        </Label>
                        <p className="text-base font-medium mt-1">
                          {editedUser.fname} {editedUser.mname}{" "}
                          {editedUser.lname}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Gender
                        </Label>
                        <p className="text-base mt-1">{editedUser.gender}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          User ID
                        </Label>
                        <p className="text-base mt-1">#{editedUser.user_id}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Role
                        </Label>
                        <div className="mt-1">
                          <Badge
                            className={getRoleColor(editedUser.role)}
                            variant="outline"
                          >
                            {editedUser.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedUser.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="Enter email address"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        value={editedUser.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="Enter phone number"
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium">
                        Address <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="address"
                        value={editedUser.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder="Enter full address"
                        rows={3}
                        className={errors.address ? "border-red-500" : ""}
                      />
                      {errors.address && (
                        <p className="text-sm text-red-500">{errors.address}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <Label className="text-sm font-medium text-gray-500">
                          Email
                        </Label>
                        <p className="text-base break-all">
                          {editedUser.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Phone
                        </Label>
                        <p className="text-base">{editedUser.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <Label className="text-sm font-medium text-gray-500">
                          Address
                        </Label>
                        <p className="text-base break-words">
                          {editedUser.address}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode ? (
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">
                      Role <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={editedUser.role}
                      onValueChange={(value) =>
                        handleInputChange("role", value)
                      }
                    >
                      <SelectTrigger
                        className={errors.role ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Teacher">Teacher</SelectItem>
                        <SelectItem value="Principal">Principal</SelectItem>
                        <SelectItem value="Librarian">Librarian</SelectItem>
                        <SelectItem value="Counselor">Counselor</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <p className="text-sm text-red-500">{errors.role}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Users className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Role
                      </Label>
                      <div className="mt-1">
                        <Badge
                          className={getRoleColor(editedUser.role)}
                          variant="outline"
                        >
                          {editedUser.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Member Since
                    </Label>
                    <p className="text-base">
                      {editedUser.created_at
                        ? format(
                            new Date(editedUser.created_at),
                            "MMMM dd, yyyy 'at' h:mm a"
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bottom spacing for mobile */}
            <div className="h-20 sm:h-4" />
          </div>
        </ScrollArea>

        {/* Fixed Footer - Only show in edit mode */}
        {editMode && (
          <div className="flex-shrink-0 border-t bg-gray-50 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="w-full sm:w-auto gap-2 order-1 sm:order-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function StudentDetailSheet({
  isOpen,
  onClose,
  student,
  onSave,
}: StudentDetailSheetProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedStudent, setEditedStudent] = useState<ServiceStudent | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize edited student when student prop changes
  useEffect(() => {
    if (student) {
      setEditedStudent({ ...student });
      setEditMode(false);
      setErrors({});
      setHasChanges(false);
    }
  }, [student]);

  if (!editedStudent) return null;
  const handleInputChange = (field: keyof Student, value: string | number) => {
    setEditedStudent((prev) => (prev ? { ...prev, [field]: value } : null));
    setHasChanges(true);
    // Clear error for this field when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editedStudent?.fname?.trim()) {
      newErrors.fname = "First name is required";
    }
    if (!editedStudent?.lname?.trim()) {
      newErrors.lname = "Last name is required";
    }
    if (!editedStudent?.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editedStudent.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!editedStudent?.roll_no?.trim()) {
      newErrors.roll_no = "Roll number is required";
    }
    if (!editedStudent?.std?.trim()) {
      newErrors.std = "Standard is required";
    }
    if (!editedStudent?.div?.trim()) {
      newErrors.div = "Division is required";
    }
    if (!editedStudent?.course) {
      newErrors.course = "Course is required";
    }
    if (!editedStudent?.gender) {
      newErrors.gender = "Gender is required";
    }
    if (!editedStudent?.father_phone?.trim()) {
      newErrors.father_phone = "Father's phone is required";
    }
    if (!editedStudent?.mother_phone?.trim()) {
      newErrors.mother_phone = "Mother's phone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!editedStudent || !validateForm()) return;

    setSaving(true);
    try {
      await onSave(editedStudent);
      setEditMode(false);
      setHasChanges(false);
      setErrors({});
    } catch (error) {
      // console.error("Error saving student:", error)
      setErrors({ general: "Failed to save student. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (student) {
      setEditedStudent({ ...student });
      setEditMode(false);
      setErrors({});
      setHasChanges(false);
    }
  };

  const getInitials = (fname: string, lname: string) => {
    return `${fname?.[0] || ""}${lname?.[0] || ""}`.toUpperCase();
  };

  const getCourseColor = (course: string) => {
    switch (course) {
      case "Science":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Commerce":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Arts":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "General":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl lg:max-w-3xl p-0 flex flex-col h-full overflow-hidden"
      >
        {/* Fixed Header */}
        <div className="flex-shrink-0 border-b bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {editMode ? "Edit Student Profile" : "Student Profile"}
              </SheetTitle>
              <SheetDescription className="text-gray-600 mt-1 text-sm sm:text-base">
                {editMode
                  ? "Update student information and academic details"
                  : "View comprehensive student information"}
              </SheetDescription>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!editMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditMode(true)}
                  className="gap-2 text-xs sm:text-sm"
                >
                  <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              )}
            </div>
          </div>

          {/* Student Avatar and Basic Info */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-white shadow-lg">
                <AvatarImage src={editedStudent.profile_photo || ""} />
                <AvatarFallback className="text-lg sm:text-xl font-semibold bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                  {getInitials(editedStudent.fname, editedStudent.lname)}
                </AvatarFallback>
              </Avatar>
              {editMode && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                {editedStudent.fname} {editedStudent.mname}{" "}
                {editedStudent.lname}
              </h3>
              <p className="text-gray-600 flex items-center gap-1 mt-1 text-sm truncate">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                {editedStudent.email}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="outline" className="bg-gray-100">
                  Class {editedStudent.std}-{editedStudent.div}
                </Badge>
                <Badge
                  className={getCourseColor(editedStudent.course)}
                  variant="outline"
                >
                  {editedStudent.course}
                </Badge>
                {hasChanges && editMode && (
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    Unsaved Changes
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1 h-0">
          <div className="p-4 sm:p-6 space-y-6">
            {/* Error Alert */}
            {errors.general && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            {/* Personal Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserCircle className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fname" className="text-sm font-medium">
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="fname"
                          value={editedStudent.fname}
                          onChange={(e) =>
                            handleInputChange("fname", e.target.value)
                          }
                          placeholder="Enter first name"
                          className={errors.fname ? "border-red-500" : ""}
                        />
                        {errors.fname && (
                          <p className="text-sm text-red-500">{errors.fname}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lname" className="text-sm font-medium">
                          Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="lname"
                          value={editedStudent.lname}
                          onChange={(e) =>
                            handleInputChange("lname", e.target.value)
                          }
                          placeholder="Enter last name"
                          className={errors.lname ? "border-red-500" : ""}
                        />
                        {errors.lname && (
                          <p className="text-sm text-red-500">{errors.lname}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mname" className="text-sm font-medium">
                        Middle Name
                      </Label>
                      <Input
                        id="mname"
                        value={editedStudent.mname || ""}
                        onChange={(e) =>
                          handleInputChange("mname", e.target.value)
                        }
                        placeholder="Enter middle name (optional)"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedStudent.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="Enter email address"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Gender <span className="text-red-500">*</span>
                      </Label>
                      <RadioGroup
                        value={editedStudent.gender}
                        onValueChange={(value) =>
                          handleInputChange("gender", value)
                        }
                        className="flex flex-wrap gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Male" id="male" />
                          <Label htmlFor="male" className="text-sm">
                            Male
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Female" id="female" />
                          <Label htmlFor="female" className="text-sm">
                            Female
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Other" id="other" />
                          <Label htmlFor="other" className="text-sm">
                            Other
                          </Label>
                        </div>
                      </RadioGroup>
                      {errors.gender && (
                        <p className="text-sm text-red-500">{errors.gender}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="cast_group"
                        className="text-sm font-medium"
                      >
                        Category
                      </Label>
                      <Input
                        id="cast_group"
                        value={editedStudent.cast_group}
                        onChange={(e) =>
                          handleInputChange("cast_group", e.target.value)
                        }
                        placeholder="Enter category"
                      />
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Full Name
                        </Label>
                        <p className="text-base font-medium mt-1">
                          {editedStudent.fname} {editedStudent.mname}{" "}
                          {editedStudent.lname}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Email
                        </Label>
                        <p className="text-base mt-1 break-all">
                          {editedStudent.email}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Gender
                        </Label>
                        <p className="text-base mt-1">{editedStudent.gender}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Student ID
                        </Label>
                        <p className="text-base mt-1">
                          #{editedStudent.student_id}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Roll Number
                        </Label>
                        <p className="text-base mt-1">
                          {editedStudent.roll_no}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Category
                        </Label>
                        <p className="text-base mt-1">
                          {editedStudent.cast_group}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="std" className="text-sm font-medium">
                          Standard <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="std"
                          value={editedStudent.std}
                          onChange={(e) =>
                            handleInputChange("std", e.target.value)
                          }
                          placeholder="Enter standard"
                          className={errors.std ? "border-red-500" : ""}
                        />
                        {errors.std && (
                          <p className="text-sm text-red-500">{errors.std}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="div" className="text-sm font-medium">
                          Division <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="div"
                          value={editedStudent.div}
                          onChange={(e) =>
                            handleInputChange("div", e.target.value)
                          }
                          placeholder="Enter division"
                          className={errors.div ? "border-red-500" : ""}
                        />
                        {errors.div && (
                          <p className="text-sm text-red-500">{errors.div}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="roll_no"
                          className="text-sm font-medium"
                        >
                          Roll Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="roll_no"
                          value={editedStudent.roll_no}
                          onChange={(e) =>
                            handleInputChange("roll_no", e.target.value)
                          }
                          placeholder="Enter roll number"
                          className={errors.roll_no ? "border-red-500" : ""}
                        />
                        {errors.roll_no && (
                          <p className="text-sm text-red-500">
                            {errors.roll_no}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="course" className="text-sm font-medium">
                        Course <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={editedStudent.course}
                        onValueChange={(value) =>
                          handleInputChange("course", value)
                        }
                      >
                        <SelectTrigger
                          className={errors.course ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Science">Science</SelectItem>
                          <SelectItem value="Commerce">Commerce</SelectItem>
                          <SelectItem value="Arts">Arts</SelectItem>
                          <SelectItem value="General">General</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.course && (
                        <p className="text-sm text-red-500">{errors.course}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <GraduationCap className="h-5 w-5 text-gray-500" />
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Class
                          </Label>
                          <p className="text-base font-medium">
                            Standard {editedStudent.std} - Division{" "}
                            {editedStudent.div}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <BookOpen className="h-5 w-5 text-gray-500" />
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Course
                          </Label>
                          <div className="mt-1">
                            <Badge
                              className={getCourseColor(editedStudent.course)}
                              variant="outline"
                            >
                              {editedStudent.course}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Admission Date
                          </Label>
                          <p className="text-base">
                            {editedStudent.admission_date
                              ? format(
                                  new Date(editedStudent.admission_date),
                                  "MMMM dd, yyyy"
                                )
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Parent Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Home className="h-5 w-5" />
                  Parent Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="father_phone"
                        className="text-sm font-medium"
                      >
                        Father's Phone <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="father_phone"
                        value={editedStudent.father_phone}
                        onChange={(e) =>
                          handleInputChange("father_phone", e.target.value)
                        }
                        placeholder="Enter father's phone"
                        className={errors.father_phone ? "border-red-500" : ""}
                      />
                      {errors.father_phone && (
                        <p className="text-sm text-red-500">
                          {errors.father_phone}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="mother_phone"
                        className="text-sm font-medium"
                      >
                        Mother's Phone <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="mother_phone"
                        value={editedStudent.mother_phone}
                        onChange={(e) =>
                          handleInputChange("mother_phone", e.target.value)
                        }
                        placeholder="Enter mother's phone"
                        className={errors.mother_phone ? "border-red-500" : ""}
                      />
                      {errors.mother_phone && (
                        <p className="text-sm text-red-500">
                          {errors.mother_phone}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Father's Phone
                        </Label>
                        <p className="text-base">
                          {editedStudent.father_phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Mother's Phone
                        </Label>
                        <p className="text-base">
                          {editedStudent.mother_phone}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bottom spacing for mobile */}
            <div className="h-20 sm:h-4" />
          </div>
        </ScrollArea>

        {/* Fixed Footer - Only show in edit mode */}
        {editMode && (
          <div className="flex-shrink-0 border-t bg-gray-50 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="w-full sm:w-auto gap-2 order-1 sm:order-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
