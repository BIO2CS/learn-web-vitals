import React, { useEffect } from "react";
// import logo from "./logo.svg";
import "./App.css";
import { getCLS, getFID, getLCP } from "web-vitals";
import AutoCarousel from "./web-vitals-patterns/AutoCarousel";

function App() {
	useEffect(() => {
		getCLS(console.log);
		getFID(console.log);
		getLCP(console.log);
	}, []);
	return (
		<div className="App">
			<AutoCarousel />
		</div>
	);
}

export default App;
