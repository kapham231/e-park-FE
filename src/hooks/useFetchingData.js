/** @format */

import axios from "axios";
import { useState, useEffect } from "react";

export function useDataFetching(url, ...args) {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	//console.log(url, ...args);

	useEffect(() => {
		axios
			.get(url)
			.then((response) => {
				if (!response.status === 200) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				setData(response.data);
			})
			.catch((error) => {
				setError(
					error instanceof Error
						? error
						: new Error("An unknown error occurred"),
				);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [url, ...args]);

	return { data, loading, error };
}