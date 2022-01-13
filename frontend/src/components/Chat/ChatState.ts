import { useState } from "react";
import { User } from "../../API/API";

export const chatState = () => {
	const [otherUser, setUser] = useState<User>(undefined);
	return {
		otherUser,
		setUser,
	};
};
