import { detailedUser, userStatus } from "../../../Types/Types";
import { fetchData } from "../../../API/API";

export async function getMyFriends(): Promise<detailedUser[]> {
	const friends: detailedUser[] = await fetchData("/friends/me");
	const usersStatus: userStatus[] = await fetchData("/user/getAllStatus");

	for (let i = 0; i < usersStatus.length; i++) {
		const userStatus = usersStatus[i];
		const found = friends.find((user) => user.id == userStatus.id);
		if (found) {
			found.status = userStatus.status;
		}
	}
	return friends;
}
