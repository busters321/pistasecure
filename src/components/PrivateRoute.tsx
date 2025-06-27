// src/components/PrivateRoute.tsx
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { user, loading } = useAuth();

    if (loading) return null; // or show a spinner

    return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
