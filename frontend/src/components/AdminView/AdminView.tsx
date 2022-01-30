import React, { useEffect, useState } from "react";
import { Label } from "../ConnectionForm/ConnectionFormElements";
import { AdminContainer } from "./AdminViewElements";
import {
	TableRow,
	AdminTableCell,
	TableHeader,
	AdminTableHeader,
	AdminTable,
} from "../Utils/Table/Table";
import { Text } from "../Utils/Text/Text";
import { Match, Channel, User } from "../../Types/Types";
import { fetchData } from "../../API/API";
import { Img, ImgContainer } from "../SideBar/MiniProfile/MiniProfileElements";
import AdminUserTables from "./AdminUserTables";
import AdminMatchTables from "./AdminMatchTable";
import AdminChatTables from "./AdminChatTable";

const AdminView = (): JSX.Element => {
	const [users, setUsers] = useState<User[]>([]);
	const [matches, setMatches] = useState<Match[]>([]);
	const [channels, setChannels] = useState<Channel[]>([]);

	useEffect(() => {
		async function getData(): Promise<void> {
			console.log("gettin all users n relations");
			fetchData(`/user/getAllUsersNRelations`).then((user: User[]) => {
				setUsers(user);
			});
			fetchData(`/match/getAllMatches`).then((matches: Match[]) => {
				setMatches(matches);
			});
			fetchData(`/chat/all`).then((channels: Channel[]) => {
				setChannels(channels);
			});
			console.log(channels);
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
