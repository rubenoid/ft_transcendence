import styled from 'styled-components';
import {Link as LinkR} from 'react-router-dom';

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

type TextProps = {
	color?: string;
	fontSize?: string;
};

export const TextContainer = styled.div`
	margin-bottom: 15px;
`;

export const Text = styled.p`
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

export const List = styled.ul`
	width: 100%;
	display: block;
	padding: 10px 0 0 0;
	list-style-type: none;
`;

export const LongList = styled.ul`
	width: 100%;
	margin: 10px 0;
	list-style-type: none;
	height: 100%;
	display: block;
	padding: 10px 0;
	position: relative;
`;

export const Item = styled.li`
	list-style-type: none;
	width: 100%;
	padding: 5px 0;
`;

export const RoundButton = styled.button`
	height: 50px;
	width: 50px;
	text-align: center;
	background-color: #444;
	color: white;
	border-radius: 50px;
	border: 2px solid #04aa6d;
	cursor: pointer;

	&:hover {
		background-color: #abc;
	}
`;

export const Table = styled.table`
	width: 100%;
`;

export const TableHeader = styled.thead`
	background-color: #04aa6d;
`;

export const TableHeaderCell = styled.th`
	text-align: left;
`;

export const TableRow = styled.tr``;
export const TableCell = styled.td``;

export const TableBody = styled.tbody``;

export const ButtonContainer = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	border-radius: 5px;
	background-color: #444;
	transform: translate(-50%, -50%);
	padding: 50px;
	opacity: 0.9;
`;

export const Button = styled.button`
	margin: 10px;
	background-color: #04aa6d;
	color: white;
	padding: 12px 20px;
	border: none;
	border-radius: 4px;
	cursor: pointer;

	&:hover {
		background-color: #abc;
	}
`;

type BoxProps = {
	height?: string;
};

export const WidgetContainer = styled.div<BoxProps>`
	justify-content: center;
	text-align: center;
	height: 100%;
	width: 100%;
	background-color: #393b4c;
	padding: 20px;
`;

export const Link = styled.a`
	text-decoration: none;
	color: #fff;
`;
