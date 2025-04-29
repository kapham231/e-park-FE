/** @format */

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/authContext";

const PrivateRoute = () => {
	const user = useAuth();
	if (!user.token) return <Navigate to="/" />;
	return <Outlet />;
};

export default PrivateRoute;