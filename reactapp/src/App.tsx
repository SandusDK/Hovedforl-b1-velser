import { Router, Routes, Route } from "react-router-dom";
import "./App.css";
import MainPage from "./pages/MainPage";
import VlogPage from "./pages/VlogPage";
import { useState } from "react";
import { VlogPageData } from "./types/Vlog";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
	const [vlogs, setVlogs] = useState<VlogPageData[]>([]);
	return (
		<Routes>
			<Route
				path="/"
				element={<MainPage vlogs={vlogs} setVlogs={setVlogs} />}
			/>
			<Route path="/vlog/:id" element={<VlogPage vlogs={vlogs} />} />
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
}

export default App;
