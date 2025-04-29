/** @format */

import { useState } from "react";

export default function useToken({ sessionKey }) {
	const getToken = () => {
		return sessionStorage.getItem(sessionKey);
	};

	const [token, setToken] = useState(getToken());

	const saveToken = (userToken) => {
		sessionStorage.setItem(sessionKey, JSON.stringify(userToken));
		setToken(userToken);
	};

	return {
		setToken: saveToken,
		token,
	};
}