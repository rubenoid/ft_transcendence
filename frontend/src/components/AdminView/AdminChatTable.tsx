import React from "react";
import { Text } from "../Utils/Text/Text";
import {
	TableRow,
	AdminTableCell,
	TableHeader,
	AdminTableHeader,
	AdminTable,
} from "../Utils/Table/Table";
import { Channel, User, Message } from "../../Types/Types";
import { Label } from "../Utils/Label/Label";

interface InputParams {
	channels: Channel[];
}

const AdminMatchTable = (props: InputParams): JSX.Element => {
	const channellist = props.channels.map((channels: Channel, key: number) => {
		return (
			<TableRow key={key}>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{channels.id}
					</Text>
				</AdminTableCell>
				<AdminTableCell>
					<Text fontSize="10" color="black">
						{channels.name}
					</Text>
				</AdminTableCell>
				<AdminTableCell>
					{channels.isProtected ? <Text>Protected</Text> : ""}
					{channels.isPublic && !channels.isProtected ? (
						<Text color="black">public</Text>
					) : (
						""
					)}
					{!channels.isPublic ? (
						<Text fontSize="10" color="black">
							private
						</Text>
					) : (
						""
					)}
				</AdminTableCell>
				<AdminTableCell>
					{!channels.isPublic ? (
						<Text fontSize="10" color="black">
							Na
						</Text>
					) : (
						<Text fontSize="10" color="black">
							{channels.owner}
						</Text>
					)}
				</AdminTableCell>
				<AdminTableCell>
					{!channels.isPublic ? (
						<Text fontSize="10" color="black">
							Na
						</Text>
					) : (
						<>
							{channels.admins.map((user: User, key: number) => {
								return <p key={key}>{user.userName}</p>;
							})}
						</>
					)}
				</AdminTableCell>
				<AdminTableCell>
					<>
						{channels.messages.map((msg: Message, key: number) => {
							return (
								<Text color="black" key={key}>
									{msg.data}
								</Text>
							);
						})}
					</>
				</AdminTableCell>
			</TableRow>
		);
	});
	return (
		<>
			<Label>
				<Text fontSize="20px" color="black">
					Channels and chats
				</Text>
			</Label>
			<AdminTable>
				<TableHeader>
					<TableRow>
						<AdminTableHeader>id</AdminTableHeader>
						<AdminTableHeader>name</AdminTableHeader>
						<AdminTableHeader>privacy level</AdminTableHeader>
						<AdminTableHeader>owner</AdminTableHeader>
						<AdminTableHeader>admins</AdminTableHeader>
						<AdminTableHeader>messages</AdminTableHeader>
					</TableRow>
				</TableHeader>
				<tbody>{props.channels ? channellist : null}</tbody>
			</AdminTable>
		</>
	);
};

export default AdminMatchTable;
