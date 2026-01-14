# Kishan Mitra - AI-Powered Farmer Assistant

An intelligent agricultural platform providing real-time crop recommendations, weather insights, soil analysis, and market prices for farmers across India.

## Features

- AI-powered crop recommendations based on location and soil conditions
- Real-time weather data and 7-day forecasts
- Soil health analysis and groundwater monitoring
- Market prices from 36 Indian states and union territories
- Multilingual chatbot assistant
- Pesticide and fertilizer information

## Technology Stack

**Backend:**
- Java 17 with Spring Boot 3.5
- Google Gemini AI for recommendations
- OpenWeatherMap API for weather data
- AgMarknet integration for market prices

**Frontend:**
- React 18 with TypeScript
- Vite build tool
- Tailwind CSS for styling
- Recharts for data visualization
- Shadcn UI components

## Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Set environment variables:
```bash
export GEMINI_API_KEY=your_key_here
export OPENWEATHERMAP_API_KEY=your_key_here
export GOOGLE_TRANSLATE_API_KEY=your_key_here
```

3. Run the application:
```bash
mvn spring-boot:run
```

Backend will start at: http://localhost:8080

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd kisaan-mitra-final-master
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file:
```bash
VITE_API_BASE_URL=http://localhost:8080
```

4. Start development server:
```bash
npm run dev
```

Frontend will start at: http://localhost:3000

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

**Backend:** Deployed on Render using Docker
**Frontend:** Deployed on Vercel

## Environment Variables

### Backend

Required variables:
- `GEMINI_API_KEY` - Primary AI service key
- `OPENWEATHERMAP_API_KEY` - Weather data API key
- `GOOGLE_TRANSLATE_API_KEY` - Translation service key
- `PORT` - Server port (default: 8080)
- `SPRING_PROFILES_ACTIVE` - Active profile (production/development)

Optional fallback keys:
- `GEMINI_SECONDARY_API_KEY` - Backup AI key
- `OPENAI_API_KEY` - Alternative AI service
- `DEEPSEEK_API_KEY` - Additional AI fallback

### Frontend

Required variables:
- `VITE_API_BASE_URL` - Backend API URL

## API Endpoints

### Core Endpoints

```
GET  /api/all-data?lat={lat}&lon={lon}&lang={lang}
GET  /api/summary?lat={lat}&lon={lon}&lang={lang}
POST /api/chatbot
GET  /api/market-prices?state={state}&commodity={commodity}
GET  /api/market-options
```

### Setup Endpoints

```
GET  /api/setup/location?lat={lat}&lon={lon}
GET  /api/setup/languages
```

## Project Structure

```
farmers-AI-assistant/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/         # Java source code
│   ├── src/main/resources/    # Configuration files
│   ├── Dockerfile             # Backend container config
│   └── pom.xml               # Maven dependencies
├── kisaan-mitra-final-master/ # React frontend
│   ├── src/                  # React components
│   ├── public/               # Static assets
│   ├── Dockerfile            # Frontend container config
│   └── package.json          # NPM dependencies
└── DEPLOYMENT.md             # Deployment guide
```

## Development

### Prerequisites

- Java 17 or higher
- Maven 3.9 or higher
- Node.js 18 or higher
- npm or yarn

### Building

**Backend:**
```bash
cd backend
mvn clean package
```

**Frontend:**
```bash
cd kisaan-mitra-final-master
npm run build
```

### Docker Build

**Backend:**
```bash
cd backend
docker build -t kishan-mitra-backend .
docker run -p 8080:8080 kishan-mitra-backend
```

**Frontend:**
```bash
cd kisaan-mitra-final-master
docker build -t kishan-mitra-frontend .
docker run -p 80:80 kishan-mitra-frontend
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on GitHub.
