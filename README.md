# Deltasoft - IT Outsourcing Company Website

A modern, responsive website for Deltasoft IT Outsourcing Company, built with React (frontend), Node.js (backend), and MongoDB (database).

## Features

- Modern, clean design inspired by professional telecommunications websites
- Responsive layout that works on all devices
- React-based frontend with component-based architecture
- Node.js/Express backend API
- MongoDB database for data persistence
- Custom color scheme: #b7e400 (lime green), #000001 (black), and white

## Tech Stack

- **Frontend**: React 18
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Styling**: CSS3 with custom properties

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. Install all dependencies:
```bash
npm run install-all
```

2. Set up environment variables:
```bash
cd backend
cp .env.example .env
```

Edit `.env` and update the MongoDB connection string if needed:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/deltasoft
NODE_ENV=development
```

3. Start MongoDB (if running locally):
```bash
# On Windows
mongod

# On macOS/Linux
sudo systemctl start mongod
```

### Running the Application

Run both frontend and backend concurrently:
```bash
npm run dev
```

Or run them separately:

**Backend:**
```bash
npm run server
```

**Frontend:**
```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
deltasoft/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Hero.js
│   │   │   ├── Services.js
│   │   │   └── Footer.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
└── package.json
```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/services` - Get all services
- `POST /api/services` - Create a service
- `GET /api/projects` - Get all projects
- `GET /api/projects/featured` - Get featured projects
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions

## Color Scheme

- Primary Green: `#b7e400`
- Primary Black: `#000001`
- Primary White: `#ffffff`

## Development

The frontend uses React with Create React App. The backend uses Express with MongoDB via Mongoose.

## License

Copyright © 2026 Deltasoft. All rights reserved.

