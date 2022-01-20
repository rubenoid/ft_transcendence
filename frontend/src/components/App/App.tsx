import { GlobalStyle } from "./App.styles";
import React from "react";
import HeroSection from "../HeroSection/HeroSection";

const AppElement = (): JSX.Element => {
	return (
		<>
			<GlobalStyle />
			<HeroSection />
		</>
	);
};

export default AppElement;
