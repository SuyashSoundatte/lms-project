import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuthContext } from "./AuthContext";
import { apiRequest, METHOD } from "@/services/api/api";

interface ClassData {
  class_id: number;
  std: string;
  div: string;
  isAssigned?: boolean;
  total_students?: number;
}

interface TeacherContextType {
  classes: ClassData[];
  loading: boolean;
  error: string | null;
  setClasses: (classes: ClassData[]) => void;
  refreshClasses: () => void;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export const TeacherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userType } = useAuthContext();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    if (!user || userType !== "staff") return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest<ClassData[]>({
        method: METHOD.GET,
        url: `/GetUserDataByRole/${user.id}/${user.role}`,
        requiresAuth: true,
      });

      const classList = response.data || [];
      setClasses(classList);
      localStorage.setItem("teacherClasses", JSON.stringify(classList));
    } catch (err: any) {
      // console.error(err);
      setError(err.message || "Failed to fetch class data");
    } finally {
      setLoading(false);
    }
  }, [user, userType]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedClasses = localStorage.getItem("teacherClasses");
    if (storedClasses) {
      setClasses(JSON.parse(storedClasses));
      setLoading(false);
    }
    fetchClasses(); // Always refetch in background
  }, [fetchClasses]);

  return (
    <TeacherContext.Provider
      value={{
        classes,
        setClasses,
        loading,
        error,
        refreshClasses: fetchClasses,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
};

export const useTeacherContext = () => {
  const context = useContext(TeacherContext);
  if (!context)
    throw new Error("useTeacherContext must be used within a TeacherProvider");
  return context;
};
