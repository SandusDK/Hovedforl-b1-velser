// server.js
import express from "express"; // Hvis du bruger ES Modules (Node v18+)
// const express = require("express"); // (alternativ, CommonJS)
import getMatchingImages from "./serverFunctions/ImageSearch.js";
import DBController from "./dbController.js";

const app = express();
const PORT = 3000;

// Instantiate and export a single dbController instance for other modules to use
const db = new DBController();
export default db;

// Middleware til at parse JSON
app.use(express.json());

// Eksempel på route
app.get("/", (req, res) => {
	res.json({ message: "API'en kører! 🚀" });
});

// Eksempel på route med data
app.get("/api/users", (req, res) => {
	res.json([
		{ id: 1, name: "Sander" },
		{ id: 2, name: "Lauridsen" },
	]);
});

// Mock example of searching for something using searchbar. Lets say Image.
app.get("/api/search", async (req, res) => {
	const query = req.query.image;
	try {
		const results = await getMatchingImages(query); // Returns image metadata
		res.json(results);
	} catch (err) {
		console.error('Error in /api/search:', err);
		res.status(500).json({ error: 'Server error' });
	}
});




// Start server
app.listen(PORT, () => {
	console.log(`Serveren kører på http://localhost:${PORT}`);
});
