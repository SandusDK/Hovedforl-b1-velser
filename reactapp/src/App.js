import { Router, Routes, Route } from "react-router-dom";
import "./App.css";
import MainPage from "./pages/MainPage";
import VlogPage from "./pages/VlogPage";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Main />} />
			<Route path="/vlog/:id" element={<VlogPage />} />
		</Routes>
	);
}

export default App;
