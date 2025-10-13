// server.js
import express from "express"; // Hvis du bruger ES Modules (Node v18+)
// const express = require("express"); // (alternativ, CommonJS)

const app = express();
const PORT = 3000;

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

// Start server
app.listen(PORT, () => {
	console.log(`Serveren kører på http://localhost:${PORT}`);
});
