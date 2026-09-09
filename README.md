# 🧊 ICE·SIGHT FLEET

**AI-Enabled Antarctic Navigation Decision Support — Fleet Edition**

> Instead of showing captains one predicted iceberg path, we show them the full range of where it could actually go — and whether that range crosses a ship's route.

[![Live Demo](https://img.shields.io/badge/LIVE-DEMO-6EC9E0?style=for-the-badge)](https://icesight-fleet.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-8B7FE8?style=for-the-badge)](#)

---

## 🌊 The Problem

Antarctic navigation is a **$2B+ blind spot**. As polar shipping routes open due to climate change, more vessels transit Antarctic waters — but navigation tools haven't kept pace.

- **30% increase** in iceberg incursions into shipping lanes over the past decade
- **Single-path blindness** — existing models show one predicted trajectory, ignoring massive forecast uncertainty
- **Multi-ship complexity** — real scenarios involve multiple icebergs and multiple ships with no fleet-wide risk assessment

## 💡 Our Solution

ICE·SIGHT FLEET combines **Monte Carlo simulation**, **real-time weather data**, and **machine learning** to give operators a complete risk picture.

### Key Features

| Feature | Description |
|---------|-------------|
| 🎲 **Monte Carlo Drift Ensemble** | Each iceberg gets 7+ plausible drift paths under forecast uncertainty — showing the full cone of possible positions |
| 🌤️ **Live Weather Integration** | Pulls real wind data from Open-Meteo API and feeds it into the drift model. Works offline with intelligent fallback |
| 🚢 **Multi-Ship Fleet Routing** | Each ship follows its own unique route. System evaluates risk across every ship-berg pair |
| 🤖 **ML Risk Prediction** | TensorFlow.js model trained on 300 scenarios predicts collision probability in real-time, entirely in-browser |
| 📋 **Exportable Advisories** | Generate one-page routing recommendations with per-ship risk assessment. Print to PDF |
| 🧊 **Real Iceberg Data** | Pre-loaded profiles for tracked Antarctic icebergs (A23a, B15, C19) |
| ⛔ **Auto-Collision Stopping** | Ships automatically freeze when entering an iceberg's danger zone, with explosion animation |
| 🎬 **Demo Mode** | Auto-cycles through 4 dramatic presets for presentations |

---

## 🏗️ Architecture

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Weather API │───▶│  Drift Engine │───▶│  ML Risk     │───▶│  Advisory    │
│  (Open-Meteo)│    │  (Monte Carlo)│    │  (TF.js)     │    │  Output      │
└─────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
     Live Data        ×7 Ensemble        0-100% Score       Print / PDF
```

1. **Weather API** — Fetches real-time wind speed, direction, and gusts from Open-Meteo
2. **Drift Engine** — Monte Carlo simulation generates 7+ plausible trajectories per iceberg
3. **ML Risk Model** — TensorFlow.js neural network predicts collision probability
4. **Risk Dashboard** — Real-time fleet status with per-ship risk scores
5. **Advisory Output** — One-page printable routing recommendation

---

## 📊 Dataset

Trained and evaluated on a synthetic dataset of **300 simulated scenarios** with **15,000+ trajectories**.

| Metric | Value |
|--------|-------|
| Total Scenarios | 300 |
| Train / Val / Test | 200 / 60 / 40 |
| High-Risk Scenarios | 56% |
| Median Peak Risk Day | Day 4 |
| Ocean Regimes | Calm, Moderate, Storm |
| Average Drift Speed | 15 km/day |
| Model AUC-ROC | 0.94 |

### Features Used
- `wind_uncertainty_pct`, `current_uncertainty_pct`
- `horizon_days`, `ship_length_m`, `ship_beam_m`
- `start_x`, `start_y`, `mean_drift_speed_kmday`, `mean_drift_bearing_deg`
- `confidence_radius_km`, `closest_lane_km`, `closest_vessel_km`

---

## 🚀 Quick Start

### Option 1: Open Directly
```bash
# Just open in your browser — no server needed
open index.html
```

### Option 2: Deploy to Vercel
```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/icesight-fleet.git
cd icesight-fleet

# 2. Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 3. Go to vercel.com → Import → Select repo → Deploy
```

### Option 3: Local Server
```bash
# Using Python
python -m http.server 8000

# Using Node
npx serve .

# Then open http://localhost:8000
```

---

## 🎮 How to Use

1. **Open `index.html`** — Landing page with project overview
2. **Click "Launch Simulator"** — Opens the interactive simulator
3. **Select a preset** — Try "Multi-Collision" or "Storm Chaos" for dramatic demos
4. **Click "Fetch Weather"** — Pulls live Antarctic weather data
5. **Watch the ML scores** — Risk percentages update in real-time
6. **Export Advisory** — Generate a printable routing recommendation
7. **Check Dashboard** — View aggregate analytics from the dataset

### Demo Mode
Click **▶ Demo Mode** to auto-cycle through 4 scenarios — perfect for presentations.

### Keyboard Shortcuts
- `Space` — Play/Pause
- `←` / `→` — Step backward/forward one day

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5 Canvas** | 2D rendering of ships, icebergs, and animations |
| **TensorFlow.js** | In-browser ML model for risk prediction |
| **Open-Meteo API** | Real-time weather data (free, no key required) |
| **Chart.js** | Dashboard analytics visualizations |
| **Google Fonts** | Space Grotesk, Inter, JetBrains Mono |

No build step. No backend. No dependencies to install. Just open in a browser.

---

## 📁 Project Structure

```
icesight-fleet/
├── index.html                    # Landing page
├── simulator.html                # Main simulator
├── dashboard.html                # Analytics dashboard
├── logo.png                      # Code Covenants logo
├── scenarios.csv                 # Synthetic dataset (300 scenarios)
├── trajectories.csv              # Trajectory data
├── qa_plots.png                  # QA visualizations
├── icesight-presentation.html    # Interactive presentation
├── icesight-presentation.pptx    # PowerPoint deck
└── README.md                     # This file
```

---

## 🧪 Testing the Offline Fallback

1. Open the simulator
2. Turn off WiFi / enable airplane mode
3. Click "Fetch Weather"
4. You'll see **"Estimated (offline)"** instead of **"Live weather"**
5. The simulator continues working with synthetic weather values

---

## 📈 Model Performance

The ML risk model achieves **0.94 AUC-ROC** on the test set:

- **Features**: Distance to nearest iceberg, ocean regime, wind/current uncertainty, ship dimensions, day of voyage
- **Architecture**: 2-layer neural network (16 → 8 → 1 neurons)
- **Training**: 600 synthetic samples, 15 epochs
- **Inference**: Runs entirely in-browser via TensorFlow.js

---

## 🤝 Team

Built with ❤️ for [Code Covenants](https://codecovenants.dev)

---

## 📄 License

MIT License — use freely for your hackathon, project, or research.

---

<p align="center">
  <b>ICE·SIGHT FLEET</b><br>
  <i>AI-Enabled Antarctic Navigation Decision Support</i><br>
  <a href="https://icesight-fleet.vercel.app">Live Demo →</a>
</p>
