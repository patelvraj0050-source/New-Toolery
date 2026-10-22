# ⚡ Toolery — Next-Gen 3D Media & Document Studio

> **A publication-grade creative and document engineering suite built with React 19, Three.js 3D acceleration, BiRefNet neural segmentation, Vector PDF engines, and native Supabase cloud persistence.**

---

## 🌟 Key Highlights & Engineering Features

### 1. 🎯 Publication-Grade AI Background Removal
- **BiRefNet / RMBG Deep Learning Model**: Runs client-side via WebAssembly & WebGPU/WebGL using `@imgly/background-removal`.
- **Zero Loss Precision**: Accurately isolates fine hair strands, pet fur, transparent glass edges, jewelry, and complex vehicle reflections.
- **Interactive Before / After Inspection Slider**: Drag and compare the original image side-by-side with the cutout with neon split indicators.
- **Background Replacement Suite**:
  - Transparent Alpha 32-bit PNG (with checkerboard preview)
  - Studio Color Swatches (Pure White, Studio Black, Slate, Emerald, Coral, Royal Blue)
  - Designer Gradients (Cyber Neon, Sunset Glow, Dark Studio, Emerald Velvet)
  - Cinematic Background Blur (keep original scene with depth-of-field blur)
  - Custom Background Image upload
- **Photorealistic 3D Drop Shadows**: Custom shadow blur, angle, and opacity for commercial e-commerce product presentation.
- **1-Click Pre-loaded Samples**: Test instantly on fashion portraits, sneakers, or sports cars.

### 2. 📄 Bi-directional Word to PDF & PDF to Word
- **Word (.docx) to PDF**: Parses headings, formatting, tables, and typography with `mammoth` and renders vector-grade PDFs with `pdf-lib` and `jspdf`.
- **PDF to Word (.docx)**: Extracts document pages and reconstructs styled Microsoft Word `.docx` documents.
- **Merge PDF**: Drag-and-drop multi-file combination with page count tracking.
- **Split PDF**: Visual page range extraction (`1-3, 5, 8-10`).
- **Protect PDF**: Configures password encryption and permission flags.

### 3. 🖼️ Image Engineering Suite
- **Smart Compressor**: Reduces file size by up to 80% with real-time compression ratio calculation (WebP, JPEG, PNG).
- **Aspect Resizer**: Scale dimensions with aspect ratio lock and social media presets (Instagram Post, Story, YouTube Thumbnail, Banner).
- **Multi-lingual OCR**: Extracts text in English, Hindi (हिन्दी), Gujarati (ગુજરાતી), French, German, and Spanish with 1-click clipboard copy.

### 4. 🤖 AI Document Intelligence
- Chat with any uploaded PDF document.
- Generate executive summaries and extract deadlines/action items.
- Ingestion metrics: word count, page bounds, and structural integrity.

### 5. 🗄️ Native Supabase Cloud Database Integration
- **PostgreSQL Database**: Stores user history, file metadata, conversion actions, and cloud buckets.
- **Ready-to-run SQL Schema**: Complete `supabase/schema.sql` with Row Level Security (RLS) policies.
- **Interactive Setup Modal**: In-app credentials configuration with live connection test and schema copy.
- **Offline / Local Storage Fallback**: Runs smoothly whether Supabase credentials are configured or running offline.

### 6. ✨ 3D Animational & Aesthetic Minimalist Design
- **Three.js WebGL Particle Sphere**: Interactive 3D particle canvas reacting to cursor physics and parallax depth.
- **3D Perspective Tilt Cards**: Cards tilt in 3D space with dynamic specular light glare tracking mouse movement.
- **Global Command Palette**: Instant `⌘K` or `Ctrl+K` spotlight search across all tools and settings.
- **Neo-Dark Minimalist Luxury**: Obsidian pearl palette, frosted glassmorphism, iridescent accents, and smooth micro-interactions.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
# Install dependencies
npm install
```

### Running the Application
To run both the React frontend and Express backend:

**Terminal 1 (Frontend):**
```bash
npm run dev
# Vite runs at: http://localhost:5173
```

**Terminal 2 (Backend Server):**
```bash
npm run server
# Express backend runs at: http://localhost:5000
```

### Building for Production
```bash
npm run build
```

---

## 🗄️ Supabase Configuration

1. Create a free project at [supabase.com](https://supabase.com).
2. Open your Supabase Dashboard → **SQL Editor** → **New Query**.
3. Copy and run the contents of [`supabase/schema.sql`](./supabase/schema.sql).
4. Go to **Project Settings** → **API** to copy:
   - **Project URL**
   - **anon / public key**
5. Enter them either in:
   - In-app **"Connect Supabase"** modal (click top navbar or settings button)
   - Or create a `.env` file from `.env.example`:
     ```env
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     PORT=5000
     ```

---

## 📂 Project Structure

```
TOOLERY-master/
├── server/
│   └── server.js                # Express REST backend (PDF & Word vector engine, AI endpoints)
├── src/
│   ├── components/
│   │   ├── BeforeAfterSlider.jsx# Interactive comparison slider with draggable handle
│   │   ├── CommandPalette.jsx   # Quick ⌘K spotlight search modal
│   │   ├── Footer.jsx           # Modern luxury footer with categorised tools
│   │   ├── Navbar.jsx           # Sticky glassmorphic navbar with Supabase status
│   │   ├── SupabaseModal.jsx    # Live connection tester & schema exporter
│   │   ├── ThreeBackground.jsx  # Interactive Three.js 3D particle canvas
│   │   ├── TiltCard.jsx         # 3D perspective tilt card with specular glare
│   │   └── Toast.jsx            # Floating glassmorphic notifications
│   ├── lib/
│   │   ├── imageProcessor.js    # BiRefNet neural background removal & composites
│   │   ├── pdfProcessor.js      # Word-to-PDF, PDF-to-Word, Merge, Split, Protect
│   │   └── supabase.js          # Supabase client, tables sync & local fallback
│   ├── pages/
│   │   ├── AI.jsx               # AI Document Intelligence & Q&A Studio
│   │   ├── Contact.jsx          # Support & feedback portal
│   │   ├── Dashboard.jsx        # User analytics, recent files & activity stream
│   │   ├── Home.jsx             # 3D interactive hero, live cutout demo & tool cards
│   │   ├── Image.jsx            # Publication background remover, compressor, resizer, OCR
│   │   ├── Login.jsx            # Supabase auth sign-in with local fallback
│   │   ├── PDF.jsx              # Word-to-PDF & PDF engineering studio
│   │   ├── Settings.jsx         # Supabase credentials & cache management
│   │   └── Signup.jsx           # Account creation with Supabase sync
│   ├── App.jsx                  # Main application routing and modal wiring
│   ├── index.css                # Tailwind directives & 3D styling variables
│   └── main.jsx                 # React root bootstrap
├── supabase/
│   └── schema.sql               # Ready-to-run PostgreSQL schema with RLS policies
├── .env.example                 # Sample environment variables
├── package.json                 # Dependencies & scripts
├── tailwind.config.js           # Design system configuration
└── vite.config.js               # Vite bundler configuration with backend proxy
```

---

## 🛡️ License
Open source & community friendly. Built for speed, precision, and privacy.
