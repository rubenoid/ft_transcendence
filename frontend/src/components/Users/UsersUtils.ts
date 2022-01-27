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