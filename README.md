# UNIP Frontend

**Universal NLP Intelligence Platform - React Dashboard**

Modern, responsive web application built with React, Vite, and TailwindCSS for analyzing text using advanced NLP capabilities.

## 🚀 Features

- **Text Input Analysis** - Paste or type text for instant analysis
- **File Upload** - Support for TXT, CSV, and PDF files
- **Real-time Results** - View sentiment, keywords, topics, and summaries
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Enterprise Security** - Input sanitization, XSS prevention, rate limiting

## 📋 Prerequisites

- Node.js 18+ or higher
- npm or yarn

## 🛠️ Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env and configure API URL
VITE_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

## 🏗️ Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── analysis/
│   │   │   ├── TextInput.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── ResultsDisplay.jsx
│   │   │   ├── SentimentCard.jsx
│   │   │   ├── KeywordsCard.jsx
│   │   │   ├── TopicsCard.jsx
│   │   │   └── SummaryCard.jsx
│   │   └── layout/
│   │       ├── Header.jsx
│   │       ├── Footer.jsx
│   │       └── Layout.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── AnalyzePage.jsx
│   │   └── ApiDocsPage.jsx
│   ├── services/
│   │   └── api.js              # API client
│   ├── utils/
│   │   ├── constants.js        # Constants
│   │   ├── helpers.js          # Helper functions
│   │   └── security.js         # Security utilities
│   ├── styles/
│   │   └── index.css           # TailwindCSS styles
│   ├── router.jsx              # React Router setup
│   ├── App.jsx
│   └── main.jsx                # Entry point
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Features

### Pages

1. **Home Page** (`/`)
   - Overview of platform features
   - Quick links to analysis and API docs

2. **Analyze Page** (`/analyze`)
   - Text input for manual analysis
   - File upload support (TXT, CSV, PDF)
   - Results display with visualizations

3. **API Documentation** (`/api-docs`)
   - API endpoint documentation
   - Request/response examples
   - Interactive examples

### Components

- **TextInput** - Textarea with validation and character count
- **FileUpload** - Secure file upload with type/size validation
- **ResultsDisplay** - Organized display of analysis results
- **SentimentCard** - Sentiment visualization with confidence score
- **KeywordsCard** - Keyword chips with scores
- **TopicsCard** - Topic clusters with keywords
- **SummaryCard** - Text summary display

## 🔒 Security Features

- **Input Sanitization** - XSS and injection prevention
- **File Validation** - Type, size, and content checks
- **Rate Limiting** - Client-side request throttling
- **Error Handling** - Secure error messages (no internal details exposed)
- **CSP Headers** - Content Security Policy implementation

## 🎨 Styling

Built with TailwindCSS for:
- Responsive design (mobile-first)
- Consistent UI components
- Dark/light mode support (future)
- Custom color palette

## 🧪 Testing

```bash
npm run lint
```

## ⚙️ Configuration

### Environment Variables

- `VITE_API_URL` - Backend API URL (default: `http://localhost:8000`)
- `VITE_APP_NAME` - Application name (default: `UNIP`)

### Vite Config

Edit `vite.config.js` to customize:
- Development server settings
- Build options
- Proxy configuration

### TailwindCSS Config

Edit `tailwind.config.js` to customize:
- Color palette
- Breakpoints
- Typography

## 🐛 Troubleshooting

### API Connection Issues
- Ensure backend is running on `http://localhost:8000`
- Check CORS settings in backend
- Verify `VITE_API_URL` in `.env`

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📝 License

Copyright © 2025 UNIP. All rights reserved.
