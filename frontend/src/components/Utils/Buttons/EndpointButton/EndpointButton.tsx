import React, { useState } from "react";
import { Button, RowButton } from "./EndpointButtonElements";
import { ToSend } from "../../../../Types/Types";

type InputParams = {
	endpointRef: React.Dispatch<React.SetStateAction<ToSend[]>>;
	toSet: ToSend;
	children: JSX.Element | JSX.Element[];
	useSmall?: boolean;
};

const EndpointButton = (props: InputParams): JSX.Element => {
	const [isEnabled, setIsEnabled] = useState(false);

	function handleChange(): void {
		if (!isEnabled) {
			props.endpointRef((prevState) => {
				return [...prevState, props.toSet];
			});
		} else {
			props.endpointRef((prevState) => {
				const idx = prevState.findIndex(
					(x) =>
						x.endpoint == props.toSet.endpoint &&
						JSON.stringify(x.data) == JSON.stringify(props.toSet.data),
				);
				if (idx == -1) {
					return prevState;
				}
				prevState.splice(idx, 1);
				return [...prevState];
			});
		}
		setIsEnabled(!isEnabled);
	}

	return (
		<>
			{props.useSmall ? (
				<RowButton
					color={isEnabled ? "grey" : "#3f3fff"}
					onClick={handleChange}
				>
					{props.children}
				</RowButton>
			) : (
				<Button color={isEnabled ? "grey" : "#3f3fff"} onClick={handleChange}>
					{props.children}
				</Button>
			)}
		</>
	);
};

export default EndpointButton;
