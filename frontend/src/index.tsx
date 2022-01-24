import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App/App";

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user';

const store = configureStore({
	reducer: userReducer,
});

export type RootState = ReturnType<typeof store.getState>

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById("root"),
);
