import styled from "styled-components";

type IconProps = {
	color?: string;
	hoverColor?: string;
};

export const IconContainer = styled.div<IconProps>`
	margin: 0;
	cursor: pointer;
	color: ${(props: IconProps) => (props.color ? props.color : "#3f3fff")};
	:hover {
		color: ${(props: IconProps) =>
			props.hoverColor ? props.hoverColor : "#3f3fff"};
	}
`;
