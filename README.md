
# Undead Literature Networks

> A private research repository and web platform for network-based distant reading of vampiric and revenant figures across transnational literary traditions — from Romanian *strigoi* to the Gothic canon.

**Founded by** Anca-Simina Martin & Andrei-Nicolae Martin-Căluțiu · Sibiu, Romania

---

## What this is

*Undead Literature Networks* is a long-term digital humanities research project. Its goal is to build a growing archive of structured, interactive analyses of undead figures — vampires, revenants, strigoi — drawn from literary texts across languages, periods, and traditions.

Each analysis in the archive takes a primary text, extracts its character interaction data, and turns it into an interactive network graph. Researchers can explore who speaks to whom, how often, in what configurations, which communities form, and how narrative identity (including shapeshifting figures like the vampire) can be modelled computationally.

This repository powers the platform that hosts those analyses. It is password-protected — the research data is not public — and is designed to grow: new analyses are added as new texts are processed.

---

## The archive

### Analysis 01 — *Vampirul* (Al. Biciurescu & G.M. Amza) `LIVE`

The first entry in the archive. *Vampirul* is an early Romanian vampire novel, and this analysis maps its full character network — every speaking character, every relationship, every scene of co-presence — into an interactive force-directed graph.

**What the visualisation includes:**

* Every character as a node, sized by dialogue count
* Edges weighted by direct dialogue and co-presence separately
* Community detection — which characters cluster together narratively
* A character drawer with connections, vocabulary profile, centrality metrics, and sentiment
* A vampire identity system — the novel's vampire appears under multiple names and personas, which can be explored separately or merged into a single unified node
* Filters by dialogue count, relationship weight, and relationship type
* SVG and PNG export

**Route:** `/vampirul-character-network`

---


## Platform features

* 🔐 **Password-protected access** — session-based auth, no public exposure of research data
* 🏠 **Home portal** — landing page listing all analyses with live/in-progress/planned status
* 🕸️ **Interactive D3.js network graphs** — force-directed layout with zoom, pan, drag
* 🎛️ **Dynamic filters** — dialogue count, relationship weight, relationship type
* 👥 **Character drawer** — connections, vocabulary, community, identity tabs per node
* 📤 **SVG / PNG export** — download any network view
* 🧛 **Vampire identity merge** — collapse multi-persona characters into a unified node

---

## Project structure

```
.
├── api/
│   └── index.js                          # Express app — routes & auth middleware
├── private/                              # Auth-gated files (never served without login)
│   ├── home.html                         # Portal landing page
│   ├── vampirul-character-network.html   # Analysis 01 visualisation
│   └── network_data.json                 # Graph data for Analysis 01
├── public/                               # Publicly served static files
│   ├── login.html                        # Login page
│   └── favicon.png                       # Site favicon
├── server.js                             # Entry point — starts the HTTP server
├── package.json
├── .env.example                          # Required environment variables (template)
└── .env                                  # Your local secrets — never commit this
```

---

## Getting started

### Prerequisites

* [Node.js](https://nodejs.org/) v18 or higher
* npm

### Installation

```bash
git clone https://github.com/andreimartincalutiu/vampirul-network-analysis.git
cd vampirul-network-analysis
npm install
```

### Configuration

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
APP_USER=your_username
APP_PASS=your_password
SESSION_SECRET=a_long_random_secret_string
NODE_ENV=development
PORT=3000
```

> ⚠️ Never commit `.env` to version control. Make sure it is listed in `.gitignore`.

### Running locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000/) — you will be redirected to the login page.

---

## Routes

| Method   | Path                                      | Auth | Description                        |
| -------- | ----------------------------------------- | :--: | ---------------------------------- |
| `GET`  | `/login`                                |  No  | Login page                         |
| `POST` | `/login`                                |  No  | Authenticate and create session    |
| `POST` | `/logout`                               | Yes | Destroy session, redirect to login |
| `GET`  | `/home`                                 | Yes | Portal landing page                |
| `GET`  | `/vampirul-character-network`           | Yes | Analysis 01 — Vampirul network    |
| `GET`  | `/vampirul-character-network/data.json` | Yes | Graph data for Analysis 01         |

Each new analysis added to the archive gets its own route pair following the same pattern.

---

## Adding a new analysis

To add a second analysis to the archive:

1. Place the HTML visualisation file in `private/` — e.g. `private/dracula-character-network.html`
2. Place its data file in `private/` — e.g. `private/dracula_network_data.json`
3. Add two routes to `api/index.js`:

```js
app.get("/dracula-character-network", requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "private", "dracula-character-network.html"));
});
app.get("/dracula-character-network/data.json", requireAuth, (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.sendFile(path.join(__dirname, "..", "private", "dracula_network_data.json"));
});
```

4. Add a card for it in the `analyses` array in `private/home.html`

---

## Data format

Each analysis is driven by a JSON file with this structure:

```json
{
  "metadata": {
    "title": "...",
    "total_nodes": 42,
    "total_edges": 130,
    "total_communities": 6
  },
  "nodes": [
    {
      "id": "character_id",
      "label": "Character Name",
      "dialogue_count": 38,
      "community": 1,
      "gender": "M",
      "meta_identity": "Vampirul",
      "identity_type": "avatar"
    }
  ],
  "edges": [
    {
      "source": "character_a",
      "target": "character_b",
      "weight": 12,
      "direct": 8,
      "copresence": 4
    }
  ]
}
```

An enriched version with vocabulary profiles per character (`vocabulary_profile`, `mtld`, `ttr`, `top_words`, etc.) unlocks the Vocabulary tab in the character drawer.

---

## Deployment

The app deploys on any Node-compatible platform (Vercel, Railway, Render). Set `APP_USER`, `APP_PASS`, `SESSION_SECRET`, and `NODE_ENV=production` as environment variables in your platform dashboard. When `NODE_ENV=production`, session cookies are automatically `secure: true` (HTTPS only).

---

## Security notes

* Credentials are compared server-side against environment variables
* All private files are gated behind `requireAuth` middleware — nothing in `private/` is reachable without a valid session
* Session cookies use `httpOnly`, `sameSite: lax`, and `secure` in production
* Sessions expire after 8 hours

---

## License

[GNU General Public License v3.0](https://claude.ai/chat/LICENSE)

---

## Contact

Research inquiries and access requests: [andreinicolae@tuta.io](mailto:andreinicolae@tuta.io)
