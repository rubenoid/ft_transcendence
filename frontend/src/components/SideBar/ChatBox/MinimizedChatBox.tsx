import React from "react";
import {
	MinimizedContainer,
	TopText,
	TopButtonsContainer,
	TopContainer,
} from "./ChatBoxElements";
import { IoMdCloseCircle as CloseIcon } from "react-icons/io";
import { VscChromeMaximize as Maximize } from "react-icons/vsc";
import { IconContainer } from "../../Utils/IconContainer";

interface InputParams {
	chatName: string;
	onClose(): void;
	onMinimizeClick(): void;
}

const MinimizedChatBox = (props: InputParams): JSX.Element => {
	return (
		<MinimizedContainer>
			<TopContainer>
				<TopText>{props.chatName}</TopText>
				<TopButtonsContainer>
					<IconContainer onClick={() => props.onMinimizeClick()}>
						<Maximize size={30} />
					</IconContainer>
					<IconContainer
						onClick={() => props.onClose()}
						color="#ff3a3a"
						hoverColor="#cc3a3a"
					>
						<CloseIcon size={30} />
					</IconContainer>
				</TopButtonsContainer>
			</TopContainer>
		</MinimizedContainer>
	);
};

export default MinimizedChatBox;
