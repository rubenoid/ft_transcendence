import React from "react";
import { MinimizedContainer, TopText } from "./ChatBoxElements";
import { FaWindowMinimize } from "react-icons/fa";

interface InputParams {
	chatName: string;
	onClose(): void;
	onMinimizeClick(): void;
}

const MinimizedChatBox = (props: InputParams): JSX.Element => {
	return (
		<MinimizedContainer>
			<TopText>{props.chatName}</TopText>
			<div style={{ display: "flex" }}>
				<TopText onClick={() => props.onMinimizeClick()}>
					<FaWindowMinimize />
				</TopText>
				<TopText onClick={() => props.onClose()}>✕</TopText>
			</div>
		</MinimizedContainer>
	);
};

export default MinimizedChatBox;
