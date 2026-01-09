# Car Management System - Frontend

The frontend application for the Car Management System, built with React, Vite, and TailwindCSS.

## 🛠 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Rich Text Editor**: CKEditor 5

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- Backend API running on port 5000

### Installation

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

### Running the Application

- **Development Mode**:
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:3000`.

## 📂 Project Structure

```
frontend/
├── src/
│   ├── api/             # API client configuration and endpoints
│   ├── components/      # Reusable UI components
│   ├── pages/           # Main page views (Dashboard, Car Models, etc.)
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Entry point
├── public/              # Static assets
├── index.html           # HTML entry point
├── tailwind.config.js   # Tailwind configuration
└── vite.config.js       # Vite configuration
```

## 🌟 Features

- **Dashboard**: Overview of system statistics.
- **Car Model Management**: Grid view, CRUD operations, image uploads, and rich text editing.
- **Commission Report**: Detailed commission calculations, filtering, and CSV export.

## 🔌 API Integration

The frontend communicates with the backend API at `http://localhost:5000`.
Ensure the backend is running before starting the frontend.