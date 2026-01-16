# Bogor Junior FS - Frontend

React + Vite web application for Bogor Junior Football School Management System.

## Features

- **Authentication**: Login system with JWT
- **Member Portal**: Profile, attendance, payment, achievements
- **Admin Dashboard**: Member management, attendance tracking, analytics
- **Branch Admin**: Branch-specific management
- **Public Pages**: Schedule, articles, match results
- **Responsive**: Mobile-first design with Tailwind CSS

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Notifications**: SweetAlert2

## Prerequisites

- Node.js >= 18.x
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bogorjunior-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development server:
```bash
npm run dev
```

Open `http://localhost:5173`

## Build for Production

```bash
npm run build
```

Output: `dist/` folder ready for deployment

## Deployment

### Quick Deployment
For quick deployment to Hostinger, see [QUICK_DEPLOY.md](QUICK_DEPLOY.md)

### Detailed Guide
For comprehensive deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

### Production Configuration:

**Frontend Domain**: `dev.bogorjuniorfs.com`  
**Backend API**: `api.bogorjuniorfs.com`

File [.env.production](.env.production) already configured:
```bash
VITE_API_URL=https://api.bogorjuniorfs.com
VITE_APP_NAME=Bogor Junior FS
```

## Project Structure

```
bogorjunior-frontend/
├── src/
│   ├── main.jsx              # Entry point
│   ├── App.jsx               # Root component
│   ├── components/           # Reusable components
│   ├── pages/                # Page components
│   │   ├── member/           # Member portal pages
│   │   ├── admin/            # Admin pages
│   │   ├── branch-admin/     # Branch admin pages
│   │   └── public/           # Public pages
│   ├── layouts/              # Layout components
│   ├── services/             # API services
│   ├── context/              # React Context
│   ├── hooks/                # Custom hooks
│   └── utils/                # Utility functions
├── public/                   # Static assets
├── .env.example              # Environment variables template
├── .env.production           # Production config (ready to use)
├── .htaccess                 # Apache config for SPA routing
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS config
└── package.json
```

## Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

## Environment Variables

### Local Development (`.env`):
```bash
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Bogor Junior FS
```

### Production (`.env.production`):
```bash
VITE_API_URL=https://api.bogorjuniorfs.com
VITE_APP_NAME=Bogor Junior FS
```

## License

Proprietary
