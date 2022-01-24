import React, { useEffect, useState } from "react";
import { Button, RowButton } from "./EndpointButtonElements";

interface toSend {
	endpoint: string;
	data: object;
}

type InputParams = {
	endpointRef: React.Dispatch<React.SetStateAction<toSend[]>>;
	toSet: toSend;
	children: JSX.Element | JSX.Element[];
	useSmall?: boolean;
};

const EndpointButton = (props: InputParams): JSX.Element => {
	const [isEnabled, setIsEnabled] = useState(false);

	function handleChange(): void {
		console.log("Changing state!", !isEnabled);
		if (!isEnabled) {
			props.endpointRef((prevState) => {
				return [...prevState, props.toSet];
			});
		} else {
			props.endpointRef((prevState) => {
				console.log(prevState, props.toSet);
				const idx = prevState.findIndex(
					(x) =>
						x.endpoint == props.toSet.endpoint &&
						JSON.stringify(x.data) == JSON.stringify(props.toSet.data),
				);
				if (idx == -1) {
					console.log("error, endpoint not found");
					return prevState;
				}
				console.log("found and destroyed");
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
					color={isEnabled ? "grey" : "#04aa6d"}
					onClick={handleChange}
				>
					{props.children}
				</RowButton>
			) : (
				<Button color={isEnabled ? "grey" : "#04aa6d"} onClick={handleChange}>
					{props.children}
				</Button>
			)}
		</>
	);
};

export default EndpointButton;
