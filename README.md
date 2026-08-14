<div align="center">

<img src="public/banner.jpg" alt="TexTale — Your WhatsApp chats, visualized" width="100%" />

<br />

# TexTale

**Your WhatsApp chats, visualized.**

Turn your WhatsApp chat exports into beautiful, interactive analytics — entirely in your browser.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-TexTale-F17141?style=for-the-badge)](https://capturemathan.github.io/textale/)
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-24201D?style=for-the-badge&logo=github)](https://capturemathan.github.io/textale/)
[![License](https://img.shields.io/badge/License-MIT-FFECAE?style=for-the-badge)](LICENSE)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📊 7 Chapters of Insights
- **Overview** — Messages, words, days, and conversation counts at a glance
- **Activity** — Heatmaps, monthly trends, and hourly patterns
- **Conversations** — Session analysis, reply speeds, and who starts the chat
- **Words** — Top words, vocabulary richness, and message length stats
- **Emojis** — Most used emojis and per-participant breakdown
- **Links** — URL sharing patterns and domain analysis
- **Records** — Longest streak, busiest day, and more superlatives

</td>
<td width="50%">

### 🛡️ Privacy First
- **100% client-side** — Your chat data never leaves your browser
- **No servers, no uploads** — All parsing and analytics run locally via Web Workers
- **No cookies, no tracking** — Zero telemetry, zero data collection
- **Ephemeral processing** — Close the tab and everything is gone

</td>
</tr>
</table>

## 🚀 Try It

1. **Export your WhatsApp chat** — Open any chat → ⋮ Menu → More → Export Chat (without media)
2. **Visit [TexTale](https://capturemathan.github.io/textale/)** — Drop your `.txt` or `.zip` file
3. **Explore** — Dive into 7 chapters of visualized insights

> Works with both **1-on-1** and **group chat** exports.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Motion (Framer Motion) |
| **Build** | Vite 7 |
| **Charts** | Custom SVG components |
| **Parsing** | Web Workers + custom parsers |
| **Hosting** | GitHub Pages |

---

## 💻 Local Development

```bash
# Clone the repo
git clone https://github.com/capturemathan/textale.git
cd textale

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173/textale/](http://localhost:5173/textale/) in your browser.

### Build for production

```bash
npm run build
```

---

## 📁 Project Structure

```
textale/
├── public/              # Static assets (favicon, robots.txt)
├── src/
│   ├── analytics/       # Analytics engine & filtering
│   ├── components/
│   │   ├── charts/      # Custom SVG chart components
│   │   ├── common/      # Shared UI components
│   │   ├── discovered/  # Post-upload discovery view
│   │   ├── explorer/    # Main layout, sidebar, navigation
│   │   ├── icons/       # SVG icon components
│   │   ├── landing/     # Landing page & upload dropzone
│   │   ├── metrics/     # Metric cards & hero displays
│   │   ├── processing/  # Processing animation view
│   │   ├── share/       # Shareable card generator
│   │   └── tabs/        # 7 analytics tab pages
│   ├── lib/             # Formatting utilities
│   ├── parser/          # WhatsApp chat parsers
│   ├── store/           # React context state management
│   ├── types/           # TypeScript type definitions
│   └── workers/         # Web Worker for background processing
├── .github/workflows/   # GitHub Actions CI/CD
├── index.html           # Entry HTML with security headers
├── vite.config.ts       # Vite configuration
└── package.json
```

---

## 🔒 Security

- **Content Security Policy** enforced via meta tags
- **Referrer Policy** set to `strict-origin-when-cross-origin`
- **X-Content-Type-Options** set to `nosniff`
- **Source maps disabled** in production builds
- **No external API calls** — zero network requests after page load
- **No `eval()`, no `dangerouslySetInnerHTML`** — safe rendering throughout

---

<div align="center">

Developed with ❤️ by [Mathan](https://capturemathan.github.io/)

</div>
