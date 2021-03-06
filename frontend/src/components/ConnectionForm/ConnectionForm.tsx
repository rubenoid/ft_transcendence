import React from "react";
import { FormContainer } from "./ConnectionFormElements";
import { RegistrationContainer } from "./ConnectionFormElements";
import { Text } from "../Utils/Text/Text";
import { Link } from "../Utils/Link/Link";

const ConnectionForm = (): JSX.Element => {
	return (
		<RegistrationContainer>
			<FormContainer>
				<Link href="http://localhost:5000/auth/login">
					<Text color="#3f3fff">42</Text>
				</Link>
			</FormContainer>
		</RegistrationContainer>
	);
};

export default ConnectionForm;
