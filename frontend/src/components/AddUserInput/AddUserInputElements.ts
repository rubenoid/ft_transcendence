import styled from "styled-components";

export const UserInputWrapper = styled.div`
	display: flex;
	border: 1px solid #ccc;
	border-radius: 4px 0 0 4px;

	&:focus {
		color: #fff;
		border: 1px solid #04aa6d;
		box-shadow: none;
	}
`;

export const UserTextInput = styled.input`
	background: rgba(0, 255, 0, 0.1);
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
	background: rgba(0, 255, 0, 0.1);
	padding: 10px;
`;
