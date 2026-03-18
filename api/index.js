const express = require("express");
const cookieSession = require("cookie-session");
const path = require("path");

const app = express();

app.set("trust proxy", 1);

const USERNAME = process.env.APP_USER;
const PASSWORD = process.env.APP_PASS;
const SESSION_SECRET = process.env.SESSION_SECRET;

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(
    cookieSession({
        name: "session",
        keys: [SESSION_SECRET],
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 8
    })
);

function requireAuth(req, res, next) {
    if (req.session?.user) return next();
    return res.redirect("/login");
}

app.get("/", requireAuth, (req, res) => {
    res.redirect("/home");
});

app.get("/home", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "private", "home.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === USERNAME && password === PASSWORD) {
        req.session.user = { username };
        return res.redirect("/home");
    }
    return res.redirect("/login?err=1");
});

app.post("/logout", (req, res) => {
    req.session = null;
    return res.redirect("/login");
});

app.get("/vampirul-character-network", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "private", "vampirul-character-network.html"));
});

app.get("/vampirul-character-network/style.css", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "private", "vampirul-style.css"));
});

app.get("/vampirul-character-network/script.js", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "private", "vampirul-script.js"));
});

app.get("/vampirul-character-network/data.json", requireAuth, (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.sendFile(path.join(__dirname, "..", "private", "vampirul-network-data.json"));
});

module.exports = app;