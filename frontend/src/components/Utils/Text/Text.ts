import styled from "styled-components";

type TextProps = {
	color?: string;
	fontSize?: string;
};

export const Text = styled.p<TextProps>`
	color: ${(props: TextProps) => (props.color ? props.color : "#fff")};
	font-size: ${(props: TextProps) =>
		props.fontSize ? props.fontSize : "1rem"};

	@media screen and (max-width: 768px) {
		font-size: 24px;
	}

	@media screen and (max-width: 480px) {
		font-size: 18px;
	}
`;

export const Header = styled.h1<TextProps>`
	color: white;
	font-size: x-large;
	font-style: bold;
	bottom: 2rem;
	padding: 0.5rem;
	font-family: sans-serif;
`;

export const HeaderTwo = styled.h1<TextProps>`
	color: white;
	font-size: 24px;
	font-style: bold;
	bottom: 2rem;
	padding: 0.5rem;
	font-family: sans-serif;
`;
