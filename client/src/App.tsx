// src/App.tsx
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import { TeacherProvider } from "./context/TeacherContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TeacherProvider>
        <AppRoutes />
      </TeacherProvider>
    </AuthProvider>
  );
};

export default App;
