import React, { useState } from "react";
import { useBetween } from "use-between";

const ConnectionStatus = (): {
	isConnected: boolean;
	setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
} => {
	const [isConnected, setIsConnected] = useState<boolean>(undefined);
	return { isConnected, setIsConnected };
};

export const SharedConnectionStatus = (): {
	isConnected: boolean;
	setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
} => useBetween(ConnectionStatus);
