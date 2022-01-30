import { useNavigate, Link } from "react-router-dom";
import React from "react";
import { Button } from "./Button";
import { RoundButton } from "../Round/RoundButton";

interface InputProps {
	to: string | number;
	children: JSX.Element | JSX.Element[];
	onClick?(): void;
}

export const LinkButton = (props: InputProps): JSX.Element => {
	const navigate = useNavigate();

	function nav(): void {
		if (props.onClick) props.onClick();
		if (typeof props.to == "number") navigate(props.to);
		else navigate(props.to);
	}

	return (
		<>
			<Button onClick={() => nav()}>{props.children}</Button>
		</>
	);
};
