import React from "react";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import { AuthProvider } from "./util/auth";
import AuthRoute from "./util/AuthRoute";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import MenuBar from "./components/MenuBar";

function App() {
	return (
		<div>
			<AuthProvider>
				<Router>
					<Container>
						<MenuBar />
						<Route exact path="/" component={Home} />
						<AuthRoute exact path="/login" component={Login} />
						<AuthRoute exact path="/register" component={Register} />
					</Container>
				</Router>
			</AuthProvider>
		</div>
	);
}

export default App;
