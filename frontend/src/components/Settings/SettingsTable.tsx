import React from "react";
import EndpointButton from "../Utils/Buttons/EndpointButton/EndpointButton";
import {
	TableRow,
	TableCell,
	TableHeader,
	TableHeaderCell,
	Table,
} from "../Utils/Table/Table";
import { Text } from "../Utils/Text/Text";
import AddUserInput from "../AddUserInput/AddUserInput";
import { User } from "../../Types/Types";

interface InputParams {
	users: User[];
	setEndpoints: React.Dispatch<React.SetStateAction<object[]>>;
	endpoint: string;
	title: string;
	children: JSX.Element | JSX.Element[];
	stagedList: User[];
	onInputEvent(cb: User): void;
}

const SettingsTable = (props: InputParams): JSX.Element => {
	const displayToAdd = (users: User[], name: string): JSX.Element => {
		return (
			<div>
				<Text>{name}</Text>
				{users.length
					? users.map((user: User, key: number) => {
							return (
								<div key={key}>
									<Text>{user.userName}</Text>
								</div>
							);
					  })
					: ""}
			</div>
		);
	};
	const listUsers = props.users.map((user: User, key: number) => {
		return (
			<TableRow key={key}>
				<TableCell>
					<Text>{user.userName}</Text>
				</TableCell>
				<TableCell>
					<Text>{user.firstName}</Text>
				</TableCell>
				<TableCell>
					<Text>{user.lastName}</Text>
				</TableCell>
				<TableCell>
					<EndpointButton
						useSmall={true}
						endpointRef={props.setEndpoints}
						toSet={{ endpoint: props.endpoint + user.id, data: {} }}
					>
						<Text>Remove</Text>
					</EndpointButton>
				</TableCell>
			</TableRow>
		);
	});

	return (
		<>
			<Text fontSize="20px">{props.title}</Text>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHeaderCell>Username</TableHeaderCell>
						<TableHeaderCell>First Name</TableHeaderCell>
						<TableHeaderCell>Last Name</TableHeaderCell>
						<TableHeaderCell>Edit</TableHeaderCell>
					</TableRow>
				</TableHeader>
				<tbody>{listUsers}</tbody>
			</Table>
			{props.children}
			<AddUserInput
				placeholder="Type to search..."
				onValidUser={(e: User) => props.onInputEvent(e)}
			></AddUserInput>
			{props.stagedList.length ? displayToAdd(props.stagedList, "Staged") : ""}
		</>
	);
};

export default SettingsTable;
