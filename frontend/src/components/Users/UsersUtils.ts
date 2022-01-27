import { detailedUser, userStatus } from '../../Types/Types';
import { fetchData } from '../../API/API';

export async function getFoundUsers() {
	const foundUsers: detailedUser[] = await fetchData("/user/all");
	const usersStatus: userStatus[] = await fetchData("/user/getAllStatus");

	for (let i = 0; i < usersStatus.length; i++) {
		const userStatus = usersStatus[i];
		const found = foundUsers.find((user) => user.id == userStatus.id);
		if (found) {
			found.status = userStatus.status;
		}
	}
	return foundUsers;
}

export async function getMyFriends() {
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

export async function setUsersStatus(users: detailedUser[]) {
	const usersStatus: userStatus[] = await fetchData("/user/getAllStatus");

	for (let i = 0; i < usersStatus.length; i++) {
		const userStatus = usersStatus[i];
		const found = users.find((user) => user.id == userStatus.id);
		if (found) {
			found.status = userStatus.status;
		}
	}
}

export function updateUserStatus(users: detailedUser[], status: userStatus): boolean {
	const found = users.find((user) => user.id == status.id);
	if (found) {
		found.status = status.status;
		return true;
	}
	return false;
}
