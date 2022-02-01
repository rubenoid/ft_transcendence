import React from "react";
import { AiOutlineSend as SendIcon } from "react-icons/ai";
import { SendIconContainer } from "./SendButtonElements";

const SendButton = (): JSX.Element => {
	return (
		<SendIconContainer
			onClick={() => {
				// console.log("clicked on send");
			}}
		>
			<SendIcon />
		</SendIconContainer>
	);
};

export default SendButton;
