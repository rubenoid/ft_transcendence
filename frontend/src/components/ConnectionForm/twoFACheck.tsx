import React, { useEffect } from "react";
import { useState } from "react";
import { FormContainer, Form, Label, Button } from "./ConnectionFormElements";
import { postData, fetchData } from "../../API/API";
import QRCode from "qrcode.react";
import { useNavigate, Link } from "react-router-dom";
import { SharedConnectionStatus } from "../../App/ConnectionStatus";
import { Item } from "../Utils/List/List";
import { TextInput } from "../Utils/TextInput/TextInput";
import { Text } from "../Utils/Text/Text";

const TwoFACheck = (): JSX.Element => {
	const navigate = useNavigate();
	const [inputtedTwoFA, setinputtedTwoFA] = useState<string>(undefined);
	const { setIsConnected } = SharedConnectionStatus();

	useEffect(() => {
		if (inputtedTwoFA && inputtedTwoFA.length != 6) return;
		postData(`/auth/inputAccessCode`, {
			usertoken: inputtedTwoFA,
		}).then((validated: boolean) => {
			if (validated == true) {
				fetchData("auth/logedin").then(() => {
					setIsConnected(true);
					navigate("/", { replace: true });
				});
			}
		});
	}, [inputtedTwoFA]);

	return (
		<FormContainer>
			<Form>
				<Label>
					<Text fontSize="20px">Enter your 2FA code</Text>
				</Label>
				<TextInput
					type="text"
					onChange={(e) => {
						setinputtedTwoFA(e.target.value);
					}}
				/>
			</Form>
		</FormContainer>
	);
};

export default TwoFACheck;
