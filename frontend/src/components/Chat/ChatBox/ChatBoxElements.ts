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
`;

export const ChatContainer = styled.div`
	background-color: #000;
	height: 100%;
	width: 100%;
`;

export const InputContainer = styled.div`
	border-radius: 5px;
	position: relative;
	display: flex;
	width: 100%;
	background: #393b4c;
`;
