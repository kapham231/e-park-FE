/** @format */

import { useNavigate } from "react-router-dom";
import AuthContext from "./authContext";
import axios from "axios";
// import useToken from "../hooks/useToken";
import { useEffect, useState } from "react";

const baseURL = process.env.REACT_APP_API_BASE_URL;

const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(() => localStorage.getItem('token') || sessionStorage.getItem('token'));
	const [userId, setUserId] = useState(() => localStorage.getItem('userId') || sessionStorage.getItem('userId'));
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(!!userId);
	const navigate = useNavigate();

	// Fetch user data when userId is available but user object isn't
	useEffect(() => {
		console.log("userId", userId);
		if (userId && !user && token) {
			setLoading(true);
			axios
				.get(`${baseURL}/api/generalUser/getId/${userId}`)
				.then(res => {
					const { success, message, data } = res.data;
					setUser(data);
				})
				.catch(error => {
					console.error('Failed to fetch user data:', error);
					logOut();
				})
				.finally(() => {
					setLoading(false);
				});
		}
	}, [userId, user, token]);

	const loginAction = (data, handleError) => {
		console.log(data);
		// console.log(handleError);
		const { remember } = data;
		setLoading(true);
		axios
			.post("/api/generalUser/login", data)
			.then((res) => {
				const { success, message, data } = res.data;
				if (success) {
					const { user, accessToken } = data;

					if (remember) {
						localStorage.setItem('token', accessToken);
						localStorage.setItem('userId', user._id);
					} else {
						sessionStorage.setItem('token', accessToken);
						sessionStorage.setItem('userId', user._id);
					}
					// Update state
					setToken(accessToken);
					setUserId(user._id);
					setUser(user);

					if (user.__t === "PlaygroundManager") {
						navigate("/manager/event-management", { state: { user } });
					} else if (user.__t === "Staff") {
						navigate("/staff/event", { state: { user } });
					} else if (user.__t === "Customer") {
						navigate("/user/homepage", { state: { user } });
					} else {
						navigate("/admin/user-management", { state: { user } });
					}
				} else {
					handleError(message);
				}
			})
			.catch((err) => {
				handleError(err);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const logOut = () => {
		// Reset state
		setToken(null);
		setUserId(null);
		setUser(null);

		console.log("Logout");

		localStorage.removeItem("token");
		localStorage.removeItem("userId");
		localStorage.removeItem("isGuest");
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("userId");
		sessionStorage.removeItem("isGuest");
		navigate("/");
	};

	return (
		<AuthContext.Provider value={{ token, user, loading, loginAction, logOut }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;