import styled from "styled-components";

export const ChatBoxContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	background-color: black;
	border: 2px solid #3f3fff;
`;

export const TopContainer = styled.div`
	min-height: 40px;
	width: 100%;
	display: flex;
	background-color: black;
	justify-content: space-between;
`;

export const TopText = styled.p`
	font-size: 30px;
	padding-left: 10px;
	padding-right: 10px;
	color: white;
`;

export const ChatContainer = styled.div`
	background-color: black;
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
	background-color: gray;
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

export const MsgOwnerText = styled.p`
	word-break: break-all;
	color: white;

	@media screen and (max-width: 768px) {
		font-size: 16px;
	}

	@media screen and (max-width: 480px) {
		font-size: 12px;
	}
`;

export const SendIconContainer = styled.div`
	background-color: #3f3fff;
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
	margin-right: 3px;
	display: flex;
	gap: 10px;
	align-items: center;
`;

export const MinimizedContainer = styled.div`
	width: 100%;
	height: 5vh;
	border: 1px solid #3f3fff;
	display: flex;
	justify-content: space-between;
`;

export const SideBarContent = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;
