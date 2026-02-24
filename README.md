# AI Movie Recommendation System

A premium, cinematic movie discovery platform powered by AI recommendations.

**Live Backend**: [https://ai-movie-recommendation-qjts.onrender.com](https://ai-movie-recommendation-qjts.onrender.com)

## 🚀 Features

- **AI Recommendations**: Get personalized movie suggestions based on natural language prompts (e.g., "movies like Inception but with more action").
- **Premium Cinematic UI**: High-end dark theme inspired by premium streaming platforms like HBO, featuring smooth animations and glassmorphism.
- **Genre Filtering**: Explore movies by genre with dynamic filtering and pagination.
- **Detailed Insights**: View movie details, ratings, cast, directors, and watch high-quality trailers.
- **Personalized Experience**: Likes and Dislikes system that influences AI recommendations based on your preferences.
- **Real-time Search**: Fast, responsive search for trending and popular movies.

## 🛠️ Tech Stack

### Frontend
- **React 19**: Modern component-based architecture.
- **Tailwind CSS**: Utility-first styling for premium design.
- **Framer Motion**: Smooth, cinematic micro-animations.
- **Lucide React**: Beautiful icons.
- **React Router 7**: Robust client-side routing.

### Backend
- **Node.js & Express**: High-performance API layer.
- **MongoDB**: Flexible document-based database.
- **OpenAI GPT-4o-mini**: Advanced semantic analysis for recommendations.
- **TMDB API**: Massive database of movie metadata.

## 📦 Project Structure

```text
├── client/          # Vite-based React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page views (Home, MovieDetails, etc.)
│   │   ├── api/         # API service configurations
│   │   └── index.css    # Global styles and Tailwind config
├── server/          # Node/Express backend
│   ├── src/
│   │   ├── controllers/ # Business logic
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # External integrations (OpenAI, TMDB)
│   │   └── models/      # Database schemas
```

## 🚥 Getting Started

### Prerequisites
- Node.js installed
- MongoDB instance (local or Atlas)
- TMDB API Key
- OpenAI API Key

### Setup

1. **Clone the repository**
2. **Server Setup**:
   ```bash
   cd server
   npm install
   # Create a .env file with:
   # PORT=5000
   # MONGO_URI=your_mongodb_uri
   # JWT_SECRET=your_secret
   # TMDB_ACCESS_TOKEN=your_tmdb_token
   # OPENAI_API_KEY=your_openai_key
   npm run dev
   ```
3. **Client Setup**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 📄 License
MIT
