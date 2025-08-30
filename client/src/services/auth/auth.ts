import { useState, useCallback, useEffect } from "react";
import axios, { AxiosError } from "axios";
import type { AxiosResponse } from "axios";

// Define admin roles
type AdminRole = "SuperAdmin" | "ClassTeacher" | "Teacher" | "Staff";

// Student type
interface Student {
  student_id: number;
  fname: string;
  mname: string;
  lname: string;
  address: string;
  gender: string;
  dob: string;
  email: string;
  father_name: string;
  father_occu: string;
  mother_name: string;
  mother_occu: string;
  father_phone: string;
  mother_phone: string;
  student_cast: string;
  cast_group: string;
  course: string;
  admission_date: string;
  profile_photo: string;
  div: string;
  std: string;
  roll_no: string;
}

// Staff user type with roles
interface StaffUser {
  id: number;
  fname: string;
  mname: string;
  lname: string;
  address: string;
  gender: string;
  dob: string;
  email: string;
  phone: string;
  role: AdminRole;
  userType: "staff";
}

// Auth response wrappers
interface AuthResponse<T> {
  statuscode: number;
  message: string;
  status: boolean;
  data: T;
}

interface ParentLoginResponse {
  student: Student;
  token: string;
}

interface StaffLoginResponse {
  user: StaffUser;
  token: string;
  roles: AdminRole[];
}

interface ParentLoginCredentials {
  phone: string;
  password: string;
}

interface StaffLoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: StaffUser | null;
  student: Student | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  loginAsStaff: (credentials: StaffLoginCredentials) => Promise<void>;
  loginAsParent: (credentials: ParentLoginCredentials) => Promise<void>;
  logout: () => void;
  userType: "staff" | "parent" | null;
  userRoles: AdminRole[] | null;
}

const API = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/",
  VERSION: import.meta.env.VITE_API_VERSION || "api/v1",
};

const api = axios.create({
  baseURL: `${API.BASE_URL}${API.VERSION}`,
  headers: { "Content-Type": "application/json" },
});

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [userType, setUserType] = useState<"staff" | "parent" | null>(() => {
    const storedUserType = localStorage.getItem("userType");
    return storedUserType as "staff" | "parent" | null;
  });
  const [userRoles, setUserRoles] = useState<AdminRole[] | null>(() => {
    const storedRoles = localStorage.getItem("userRoles");
    return storedRoles ? JSON.parse(storedRoles) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAuthToken = useCallback((newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
    }
    setToken(newToken);
  }, []);

  const updateUserRoles = useCallback((roles: AdminRole[] | null) => {
    if (roles) {
      localStorage.setItem("userRoles", JSON.stringify(roles));
    } else {
      localStorage.removeItem("userRoles");
    }
    setUserRoles(roles);
  }, []);

  const loginAsStaff = useCallback(
    async (credentials: StaffLoginCredentials) => {
      setIsLoading(true);
      setError(null);
      try {
        const response: AxiosResponse<AuthResponse<StaffLoginResponse>> =
          await api.post("/login", credentials);

        const user = response.data.data.user; 
        const token = response.data.data.token; 

        updateAuthToken(token);

        localStorage.setItem("userType", "staff");
        localStorage.setItem("user", JSON.stringify(user)); 

        setUser(user);
        setStudent(null);
        setUserType("staff");
        updateUserRoles([user.role]);

        // console.log(user); /
      } catch (err) {
        handleAuthError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [updateAuthToken, updateUserRoles]
  );

  const loginAsParent = useCallback(
    async (credentials: ParentLoginCredentials) => {
      setIsLoading(true);
      setError(null);
      try {
        const response: AxiosResponse<AuthResponse<ParentLoginResponse>> =
          await api.post("/parentLogin", credentials);
        const { data } = response.data;
        updateAuthToken(data.token);
        localStorage.setItem("userType", "parent");
        setStudent(data.student);
        setUser(null);
        setUserType("parent");
        updateUserRoles(null); // Parents don't have admin roles
        localStorage.setItem("student", JSON.stringify(data.student));
      } catch (err) {
        handleAuthError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [updateAuthToken, updateUserRoles]
  );

  const logout = useCallback(() => {
    updateAuthToken(null);
    localStorage.removeItem("userType");
    localStorage.removeItem("userRoles");
    localStorage.removeItem("user");
    setUser(null);
    setStudent(null);
    setUserType(null);
    setUserRoles(null);
    localStorage.removeItem("student");
    localStorage.removeItem("teacherClasses");
  }, [updateAuthToken]);

  const handleAuthError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<AuthResponse<any>>;
      setError(axiosError.response?.data?.message || "Authentication failed");
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("An unknown error occurred");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserType = localStorage.getItem("userType") as
      | "staff"
      | "parent"
      | null;
    const storedRoles = localStorage.getItem("userRoles");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUserType && storedUser) {
      updateAuthToken(storedToken);
      setUserType(storedUserType);
      updateUserRoles(storedRoles ? JSON.parse(storedRoles) : null);
      setUser(JSON.parse(storedUser));
    }
  }, [updateAuthToken, updateUserRoles]);

  return {
    user,
    student,
    token,
    isLoading,
    error,
    loginAsStaff,
    loginAsParent,
    logout,
    userType,
    userRoles,
  };
}
