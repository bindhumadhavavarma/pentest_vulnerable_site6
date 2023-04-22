import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from './store/store';
import  ThemeContext  from "./context/ThemeContext"; 
import UserContextProvider from "./context/UserContext";
ReactDOM.render(
		<Provider store = {store}>
                <BrowserRouter>
                    <ThemeContext>
                        <UserContextProvider>
                        <App />

                        </UserContextProvider>
                    </ThemeContext>  
                </BrowserRouter>  
        </Provider>	,
  document.getElementById("root")
);