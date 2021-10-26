import React, { useEffect } from "react";
// import logo from "./logo.svg";
import "./App.css";
import { getCLS, getFID, getLCP } from "web-vitals";
import Carousel from "./web-vitals-patterns/Carousel";

function App() {
	useEffect(() => {
		getCLS(console.log);
		getFID(console.log);
		getLCP(console.log);
	}, []);
	return (
		<div className="App">
			<Carousel />
		</div>
	);
}

export default App;
