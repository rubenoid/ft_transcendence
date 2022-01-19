import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

export type User = {
	id: number;
	userName: string;
	firstName: string;
	lastName: string;
	avatar: string;
	wins: number;
	losses: number;
	rating: number;
	// isActive: boolean;
	friends: User[];
};

export type Match = {
	id: number;
	players: User[];
	scorePlayer1: number;
	scorePlayer2: number;
};

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

export const updateHeaders = () => {
	headers.headers.Authorization = Cookies.get("AuthToken");
}

export const fetchData = async <T>(url: string): Promise<T> => {
	return await instance
		.get(url, headers)
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			console.log(error);
		});
};

export const postData = async <T>(
	url: string,
	data: object,
	extraHeaders?: object,
): Promise<T> => {
	const headersToSend = {
		headers: Object.assign(headers.headers, extraHeaders),
	};

	console.log(headersToSend);
	return await instance
		.post(url, data, headersToSend)
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			console.log(error);
		});
};

// const imgHeaders = {
// 	headers: {
// 		"contentType": "false",
// 		"processData": "false",
// 		"Access-Control-Allow-Credentials": "true",
// 		"Access-Control-Allow-Origin": "http://localhost:5000",
// 		'Content-Type': 'multipart/form-data',
// 		Authorization: Cookies.get("AuthToken"),
// 	},
// };
// export const postImg = async <T>(url: string, data: object): Promise<T> => {
// 	return await instance
// 		.post(url, data, imgHeaders)
// 		.then((response) => {
// 			return response.data;
// 		})
// 		.catch((error) => {
// 			console.log(error);
// 		});
// };
