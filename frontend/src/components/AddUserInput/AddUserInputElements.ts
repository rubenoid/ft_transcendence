import styled from "styled-components";

export const UserInputWrapper = styled.div`
	display: flex;
	border: 1px solid #ccc;
	border-radius: 4px 0 0 4px;

	&:focus {
		color: #fff;
		border: 1px solid #3f3fff;
		box-shadow: none;
	}
`;

export const UserTextInput = styled.input`
	background: black;
	width: 90%;
	padding: 12px 10px;
	border: 0;
	box-sizing: border-box;
	resize: vertical;
	caret-color: #fff;

	::placeholder {
		color: #fff;
		font-size: 14px;
	}

	&:focus {
		color: #fff;
		border: 0px;
		box-shadow: none;
	}
`;

export const UserInputCheck = styled.div`
	width: 10%;
	border: 0;
	background: black;
	padding: 10px;
`;
