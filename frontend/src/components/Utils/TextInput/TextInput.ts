import styled from "styled-components";

export const TextInput = styled.input`
	background: black;
	width: 100%;
	padding: 12px 10px;
	border: 1px solid #ccc;
	border-radius: 4px;
	box-sizing: border-box;
	resize: vertical;
	caret-color: #fff;

	::placeholder {
		color: #fff;
		font-size: 14px;
	}

	&:focus {
		color: #fff;
		border: 1px solid #3f3fff;
		box-shadow: none;
	}
`;
