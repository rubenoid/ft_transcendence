import React, { useEffect, useState } from "react";
import { AdminContainer } from "../Utils/Containers/Containers";
import { Match, Channel, User } from "../../Types/Types";
import { fetchData } from "../../API/API";
import AdminUserTables from "./AdminUserTables";
import AdminMatchTables from "./AdminMatchTable";
import AdminChatTables from "./AdminChatTable";

const AdminView = (): JSX.Element => {
	const [users, setUsers] = useState<User[]>([]);
	const [matches, setMatches] = useState<Match[]>([]);
	const [channels, setChannels] = useState<Channel[]>([]);

	useEffect(() => {
		async function getData(): Promise<void> {
			fetchData(`/user/getAllUsersNRelations`).then((user: User[]) => {
				setUsers(user);
			});
			fetchData(`/match/getAllMatches`).then((matches: Match[]) => {
				setMatches(matches);
			});
			fetchData(`/chat/all`).then((channels: Channel[]) => {
				setChannels(channels);
			});
		}
		getData();
	}, []);

	return (
		<AdminContainer>
			<h1>Admin View</h1>
			<AdminUserTables users={users}></AdminUserTables>
			<AdminMatchTables matches={matches}></AdminMatchTables>
			<AdminChatTables channels={channels}></AdminChatTables>
		</AdminContainer>
	);
};
export default AdminView;
