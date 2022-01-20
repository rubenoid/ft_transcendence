import styled from "styled-components";

export const TextInput = styled.input`
	background: rgba(0, 255, 0, 0.1);
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
		border: 1px solid #04aa6d;
		box-shadow: none;
	}
`;
