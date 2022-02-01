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
					<TopText onClick={() => props.onMinimizeClick()}>
						<IconContainer>
							<Maximize size={30} />
						</IconContainer>
					</TopText>
					<TopText onClick={() => props.onClose()}>
						<IconContainer color="#ff3a3a" hoverColor="#cc3a3a">
							<CloseIcon size={30} />
						</IconContainer>
					</TopText>
				</TopButtonsContainer>
			</TopContainer>
		</MinimizedContainer>
	);
};

export default MinimizedChatBox;
