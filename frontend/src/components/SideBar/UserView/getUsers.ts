import { User } from "../../../Types/Types";
import { fetchData } from "../../../API/API";

export interface userStatus {
	id: number;
	status: string;
}

export function setUserStatus(usersStatus: userStatus[], user: User): void {
	const found = usersStatus.find((currentUser) => currentUser.id == user.id);
	if (found) {
		user.status = found.status;
	}
}

export async function getAllUsers(): Promise<User[]> {
	const allUsers: User[] = await fetchData("/user/all");
	const allStatus: userStatus[] = await fetchData("/user/getAllStatus");

	for (let i = 0; i < allUsers.length; i++) {
		const user = allUsers[i];
		setUserStatus(allStatus, user);
	}
	return allUsers;
}
