const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
    res.redirect("/home");
});

app.get("/home", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "home.html"));
});

app.get("/vampirul-character-network", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "vampirul-character-network.html"));
});

app.get("/vampirul-network-data.json", (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.sendFile(path.join(process.cwd(), "public", "vampirul-network-data.json"));
});

module.exports = app;