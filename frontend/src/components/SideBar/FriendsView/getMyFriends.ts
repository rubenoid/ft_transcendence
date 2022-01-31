import { User } from "../../../Types/Types";
import { fetchData } from "../../../API/API";
import { setUserStatus, userStatus } from "../UserView/getUsers";

export async function getMyFriends(): Promise<User[]> {
	const myFriends: User[] = await fetchData("/friends/me");
	const allStatus: userStatus[] = await fetchData("/user/getAllStatus");

	for (let i = 0; i < myFriends.length; i++) {
		const user = myFriends[i];
		setUserStatus(allStatus, user);
	}
	return myFriends;
}
