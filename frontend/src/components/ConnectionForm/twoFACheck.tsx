import React, { useEffect } from "react";
import { useState } from "react";
import { FormContainer, Form, RegistrationContainer } from "./ConnectionFormElements";
import { Label } from "../Utils/Label/Label";
import { postData, fetchData } from "../../API/API";
import { useNavigate } from "react-router-dom";
import { SharedConnectionStatus } from "../../App/ConnectionStatus";
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
		<RegistrationContainer>
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
		</RegistrationContainer>
	);
};

export default TwoFACheck;
