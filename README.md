# CID-Cell — Collaborative Innovation & Development Cell

> Official website for the **Collaborative Innovation & Development Cell (CID-Cell)**, Department of Computer Science & Engineering. A structured platform for hands-on learning, real-world projects, and innovation-driven growth.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)

---

## Features

- **Neo-Brutalist Design** — Bold borders, solid shadows, vibrant accent colors, and playful typography
- **Fully Responsive** — Optimized for mobile, tablet, and desktop viewports
- **Multi-Page SPA** — Client-side routing with React Router v7
- **Component-Based Architecture** — Reusable, modular React components
- **Semester Roadmap Timeline** — Interactive visual timeline from Sem 1 to Capstone
- **Project Portfolio** — Filterable grid of Micro, Macro, Capstone, and Open Source projects
- **Events & Activities** — Categorized events with status indicators (Upcoming / Completed)
- **Team Page** — Showcase of CID-Cell members and leadership
- **Contact Page** — Reach out and join the community

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **Vite 6** | Build tool & dev server |
| **React Router 7** | Client-side routing |
| **Tailwind CSS 3.4** | Utility-first styling |
| **Lucide React** | Icon library |
| **PostCSS + Autoprefixer** | CSS processing |

---

## Project Structure

```
CID-Cell/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx       # Fixed navigation bar
│   │   ├── Footer.jsx       # Site footer
│   │   ├── HeroSection.jsx  # Landing hero section
│   │   ├── AboutPreview.jsx # About section preview cards
│   │   ├── Timeline.jsx     # Semester roadmap timeline
│   │   ├── VisionMission.jsx# Vision & Mission pillars
│   │   ├── KeyActivities.jsx# Activities grid
│   │   ├── Benefits.jsx     # Benefits of joining CID
│   │   ├── CTASection.jsx   # Call-to-action banner
│   │   ├── SectionHeading.jsx # Reusable section header
│   │   └── ScrollToTop.jsx  # Scroll restoration on route change
│   ├── pages/               # Route-level page components
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Projects.jsx
│   │   ├── Events.jsx
│   │   ├── Team.jsx
│   │   └── Contact.jsx
│   ├── App.jsx              # Root component with routes
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles & Tailwind layers
├── index.html               # HTML template
├── tailwind.config.js       # Tailwind configuration (Neo-Brutalist theme)
├── postcss.config.cjs       # PostCSS plugins
├── vite.config.js           # Vite configuration
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/CID-Cell.git
cd CID-Cell

# Install dependencies
npm install
```

### Development

```bash
# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview the production build locally
npm run preview
```

---

## Design System

The website follows a **Neo-Brutalist** design language:

| Token | Value | Usage |
|---|---|---|
| `bg` | `#FFFDF5` | Page background (soft cream) |
| `primary` | `#1A1A1A` | Text, borders, dark elements |
| `highlight-yellow` | `#FFDE59` | Primary accent / CTA |
| `highlight-purple` | `#C0B6F2` | Secondary accent |
| `highlight-blue` | `#87CEEB` | Info accent |
| `highlight-green` | `#98FB98` | Success accent |
| `highlight-pink` | `#FFA6C9` | Decorative accent |
| `highlight-orange` | `#FF914D` | Warning / energy accent |
| `highlight-teal` | `#7ED9CE` | Cool accent |

**Shadows:** `shadow-neo` (4px 4px solid black), `shadow-neo-lg`, `shadow-neo-sm`  
**Borders:** 2–3px solid black  
**Fonts:** Anton (headings), Inter (body)

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

---

## License

This project is private and maintained by the CID-Cell team, Department of CSE.

---

<p align="center">
  Built with ❤️ by <strong>CID-Cell</strong> — CSE Department
</p>
