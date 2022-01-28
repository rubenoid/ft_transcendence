import styled from 'styled-components';

type IconProps = {
    color?: string;
    hoverColor?: string;
}

export const IconContainer = styled.div<IconProps>`
    cursor: pointer;
    color: ${(props: IconProps) =>
		props.color ? props.color : "black"};
	:hover{
    color: ${(props: IconProps) =>
		props.hoverColor ? props.hoverColor : "#04aa6d"};
	}
`;