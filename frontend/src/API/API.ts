import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

const instance: AxiosInstance = axios.create({
	baseURL: "http://localhost:5000",
});

const headers = {
	headers: {
		"Access-Control-Allow-Credentials": "true",
		"Access-Control-Allow-Origin": "http://localhost:5000",
		Authorization: Cookies.get("AuthToken"),
	},
};

export const updateHttpHeaders = (): Promise<void> => {
	headers.headers.Authorization = Cookies.get("AuthToken");
	return null;
};

export const fetchData = async <T>(url: string): Promise<T> => {
	return await instance
		.get(url, headers)
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			// console.log("Error:", error);
			throw "Error";
		});
};

export const postData = async <T>(
	url: string,
	data: object,
	extraHeaders?: object,
): Promise<T> => {
	let headersToSend: object;

	if (extraHeaders) {
		headersToSend = {
			headers: { ...headers.headers, extraHeaders },
		};
	} else headersToSend = headers;
	return await instance
		.post(url, data, headersToSend)
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			// console.log(error);
		});
};
