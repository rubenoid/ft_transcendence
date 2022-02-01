import React, { useState } from "react";
import { useBetween } from "use-between";
import { User } from "../Types/Types";

const GlobalUser = (): {
	user: User;
	setUser: React.Dispatch<React.SetStateAction<User>>;
} => {
	const [user, setUser] = useState<User>(undefined);
	return { user, setUser };
};

export const SharedGlobalUser = (): {
	user: User;
	setUser: React.Dispatch<React.SetStateAction<User>>;
} => useBetween(GlobalUser);
