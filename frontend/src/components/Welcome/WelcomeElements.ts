import styled from "styled-components";

export const ImgContainer = styled.div`
	background-color: #abc;
	border-radius: 50%;
	width: 200px;
	align-self: flex-end;
	margin: 10px;
`;

export const Img = styled.img`
	border-radius: 50%;
	width: 45%;
	height: auto;
`;

export const ParentDiv = styled.div`
	// display: flex;
`;

export const ChildDiv = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	margin: -25px 0 0 -25px;
`;

export const Ulist = styled.ul`
	display: flex;
	flex-flow: row wrap;
	list-style: none;
	margin: 32px 0;
`;

export const ListItem = styled.li`
	margin: 0 10px;
	flex-basis: calc(50% - 20px);
	padding: 30px;
`;
