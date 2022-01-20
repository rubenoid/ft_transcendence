import styled from "styled-components";

type TextProps = {
	color?: string;
	fontSize?: string;
};

export const Text = styled.p<TextProps>`
	color: #fff;
	font-size: ${(props: TextProps) =>
		props.fontSize ? props.fontSize : "1rem"};

	@media screen and (max-width: 768px) {
		font-size: 24px;
	}

	@media screen and (max-width: 480px) {
		font-size: 18px;
	}
`;
