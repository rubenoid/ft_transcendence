import styled from "styled-components";

export const ChatBoxContainer = styled.div`
	grid-area: chatBox;
	display: flex;
	flex-direction: column;
	width: 100%;
	background-color: #fff;
	border: 2px solid #04aa6d;
`;

export const TopContainer = styled.div`
	background-color: #393b4c;
	min-height: 40px;
	width: 100%;
	display: flex;
	justify-content: space-between;
`;

export const TopText = styled.p`
	font-size: 30px;
	padding-left: 10px;
	padding-right: 10px;
	color: white;
`;

export const ChatContainer = styled.div`
	background-color: white;
	height: 500px;
	width: 100%;
	overflow-y: scroll;
`;

export const InputContainer = styled.div`
	position: relative;
	display: flex;
	width: 100%;
	background: #393b4c;
`;

export const MsgContainer = styled.div`
	padding: 8px;
	margin: 8px;
	border-radius: 5px;
	width: fit-content;
	max-width: 250px;
	background-color: blue;
`;

export const MsgContainerOther = styled.div`
	padding: 8px;
	margin: 8px;
	border-radius: 5px;
	width: fit-content;
	max-width: 250px;
	background-color: grey;
`;

export const MsgText = styled.p`
	word-break: break-all;
	color: black;
	@media screen and (max-width: 768px) {
		font-size: 24px;
	}

	@media screen and (max-width: 480px) {
		font-size: 18px;
	}
`;

export const SendIconContainer = styled.div`
	background-color: #04aa6d;
	height: 100%;
	padding: 2px 2px 2px 2px;
	position: absolute;
	right: 0;
	font-size: 1.6rem;
	color: #fff;
	cursor: pointer;

	&:hover {
		color: #393b4c;
		transition: all ease-in-out;
	}
`;

export const TopButtonsContainer = styled.div`
	display: flex;
`;
