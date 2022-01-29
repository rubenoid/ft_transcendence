import React from "react";
import { User } from "../../Types/Types";
import { Text } from "../Utils/Text/Text";
import {
	TableRow,
	AdminTableCell,
	TableHeader,
	AdminTableHeader,
	AdminTable,
} from "../Utils/Table/Table";
import { detailedUser } from "../../Types/Types";
import { ImgContainer, Img } from "../Profile/ProfileElements";
import { Label } from "../ConnectionForm/ConnectionFormElements";

interface InputParams {
	users: User[];
}

const AdminUserTable = (props: InputParams): JSX.Element => {
	const userlist = props.users.map((users: detailedUser, key: number) => {
		return (
			<TableRow key={key}>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{users.id}
					</Text>
				</AdminTableCell>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{users.userName}
					</Text>
				</AdminTableCell>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{users.firstName}
					</Text>
				</AdminTableCell>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{users.lastName}
					</Text>
				</AdminTableCell>
				<AdminTableCell>
					<ImgContainer>
						<Img
							src={"http://localhost:5000/" + users.avatar}
							alt="profileImg"
							width="300"
							height="300"
						/>
					</ImgContainer>
				</AdminTableCell>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{users.wins}
					</Text>
				</AdminTableCell>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{users.losses}
					</Text>
				</AdminTableCell>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{users.rating}
					</Text>
				</AdminTableCell>
				<AdminTableCell>
					{users.twoFactorSecret == "" ? (
						<Text fontSize="10" color="black">
							No
						</Text>
					) : (
						<Text fontSize="10" color="black">
							Yes
						</Text>
					)}
				</AdminTableCell>
				<AdminTableCell>
					{users.friends.map((user: User, key: number) => {
						return <p key={key}>{user.userName}</p>;
					})}
				</AdminTableCell>
				<AdminTableCell>
					{users.blockedUsers.map((user: User, key: number) => {
						return <p key={key}>{user.userName}</p>;
					})}
				</AdminTableCell>
			</TableRow>
		);
	});

	return (
		<>
			<Label>
				<Text fontSize="20px" color="black">
					Users
				</Text>
			</Label>
			<AdminTable>
				<TableHeader>
					<TableRow>
						<AdminTableHeader>id</AdminTableHeader>
						<AdminTableHeader>Username</AdminTableHeader>
						<AdminTableHeader>First Name</AdminTableHeader>
						<AdminTableHeader>Last Name</AdminTableHeader>
						<AdminTableHeader>avatar</AdminTableHeader>
						<AdminTableHeader>wins</AdminTableHeader>
						<AdminTableHeader>losses</AdminTableHeader>
						<AdminTableHeader>rating</AdminTableHeader>
						<AdminTableHeader>2FA Enabled</AdminTableHeader>
						<AdminTableHeader>friends</AdminTableHeader>
						<AdminTableHeader>blockedUsers</AdminTableHeader>
					</TableRow>
				</TableHeader>
				<tbody>{props.users ? userlist : null}</tbody>
			</AdminTable>
		</>
	);
};

export default AdminUserTable;
