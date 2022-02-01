import React, { useState } from "react";
import { fetchData } from "../../API/API";
import {
	UserInputWrapper,
	UserTextInput,
	UserInputCheck,
} from "./AddUserInputElements";
import { User } from "../../Types/Types";
import { TiDelete, TiTickOutline } from "react-icons/ti";

type InputParams = {
	onValidUser(cb: User): void;
	placeholder?: string;
	removeOnEnter?: boolean;
};

const AddUserInput = (props: InputParams): JSX.Element => {
	const [text, setText] = useState("");
	const [isValidUser, setIsValidUser] = useState<User>(undefined);

	function checkValidity(data: string): void {
		setText(data);
		fetchData(`/user/getByUserName/${data}`)
			.then((res: string | User) => {
				if (typeof res == "object") setIsValidUser(res);
				else setIsValidUser(undefined);
			})
			.catch((er) => {
				setIsValidUser(undefined);
			});
	}

	function enterCheck(keyCode: string): void {
		if (keyCode == "Enter" && isValidUser != undefined) {
			props.onValidUser(isValidUser);
			if (props.removeOnEnter != false) {
				setText("");
				setIsValidUser(undefined);
			}
		}
	}

	return (
		<UserInputWrapper>
			<UserTextInput
				placeholder={props.placeholder}
				onKeyDown={(e) => {
					enterCheck(e.key);
				}}
				onChange={(e) => {
					checkValidity(e.target.value);
				}}
				value={text}
			/>
			<UserInputCheck>
				{isValidUser ? (
					<TiTickOutline style={{ color: "white" }} size={24} />
				) : (
					<TiDelete style={{ color: "white" }} size={24} />
				)}
			</UserInputCheck>
		</UserInputWrapper>
	);
};

export default AddUserInput;
