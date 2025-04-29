import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../auth/authContext";
import PrivateRoute from "./PrivateRoute";
import WelcomePage from "../pages/welcome.tsx";
import AdminLogin from "../Admin/pages/login";
import UserLogin from "../User/pages/userlogin";
import AdminMainPage from "../Admin/pages/mainpage";
import StaffMainPage from "../Staff/pages/mainpage";
import ManagerMainPage from "../Manager/pages/mainpage";
import UserHomepage from "../User/pages/userhomepage";

const AppRoutes = () => {
	const { token } = useAuth();
	// Route configurations go here

	const routesForPublic = [
		{
			path: "*",
			element: <WelcomePage />,
		},
	];

	const routesForAuthenticatedOnly = [
		{
			path: "/",
			element: <PrivateRoute />,
			children: [
				{
					path: "/admin/*",
					element: <AdminMainPage />,
				},
				{
					path: "/staff/*",
					element: <StaffMainPage />,
				},
				{
					path: "/manager/*",
					element: <ManagerMainPage />,
				},
				{
					path: "/user/*",
					element: <UserHomepage />,
				}
			],
		},
	];

	const routesForNotAuthenticatedOnly = [
		{
			path: "/operator/login",
			element: <AdminLogin />,
		},
		{
			path: "/user/login",
			element: <UserLogin />,
		}
	];

	const router = createBrowserRouter(Object.assign(
		routesForPublic,
		(!token ? routesForNotAuthenticatedOnly : []),
		routesForAuthenticatedOnly,
	));

	return <RouterProvider router={router} />;
};

export default AppRoutes;

