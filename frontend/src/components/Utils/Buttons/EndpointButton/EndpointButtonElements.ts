import styled from "styled-components";

type ButtonProps = {
	color?: string;
};

export const Button = styled.button<ButtonProps>`
	margin: 10px;
	background-color: ${(props: ButtonProps) =>
		props.color ? props.color : "#3f3fff"};
	color: ${(props: ButtonProps) => (props.color ? props.color : "#fff")};
	padding: 12px 20px;
	border: none;
	border-radius: 4px;
	cursor: pointer;

	&:hover {
		background-color: #abc;
	}
`;

export const RowButton = styled.button<ButtonProps>`
	padding: 5px;
	margin: 0 5px;
	background-color: ${(props: ButtonProps) =>
		props.color ? props.color : "#3f3fff"};
	color: ${(props: ButtonProps) => (props.color ? props.color : "#fff")};
	border: none;
	border-radius: 4px;
	cursor: pointer;
`;
