# NYC Chatbot v0

A clean, Google-like chat UI that can answer NYC-local questions with weather context. Built with Next.js, Google Gemini AI, and Open-Meteo weather data.

## 🚀 Features

- **Weather-Aware Responses**: Get Central Park weather forecasts and activity suggestions
- **AI-Powered**: Uses Google Gemini AI for intelligent, contextual responses
- **Clean UI**: Google-like search interface with modern design
- **Real-time Weather**: Live weather data from Open-Meteo API
- **Weekend Focus**: Optimized for weekend planning in Central Park

## 🏗️ Architecture

```
[Next.js UI] —> [Edge/Serverless API route] —> [Gemini API]
                                  └——> [Open‑Meteo /v1/forecast]
```

## 📋 Prerequisites

- Node.js 18+ 
- Google Gemini API key
- Open-Meteo API (free, no key required)

## 🛠️ Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd nyc-weekender
   npm install
   ```

2. **Environment Configuration:**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

3. **Get Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy it to your `.env.local` file

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

The app supports these query types:

- **Weather Queries**: "What's the weather in Central Park this weekend?"
- **Planning Queries**: "What should I plan for Central Park this weekend?"
- **General Queries**: "What's going on in Central Park this weekend?"

## 📊 API Endpoints

- `GET /api/weather` - Fetch Central Park weather forecast
- `POST /api/chat` - Process chat messages with Gemini AI

## 🔧 Configuration

Environment variables in `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key
WEATHER_PROVIDER=open_meteo
OPEN_METEO_BASE=https://api.open-meteo.com
NYC_TIMEZONE=America/New_York
DEFAULT_LAT=40.7812
DEFAULT_LON=-73.9665
MODEL_ID=gemini-2.0-flash
```

## 🎯 v0 Scope

- ✅ Google Gemini AI integration
- ✅ Open-Meteo weather API
- ✅ Weather-aware activity suggestions
- ✅ Clean, responsive UI
- ✅ Central Park weekend focus

## 🚧 Coming in v0.1

- NYC Parks Events integration
- Real event data from NYC Open Data
- Enhanced activity recommendations
- Sources attribution

## 🏃‍♂️ Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts      # Chat API with Gemini
│   │   └── weather/route.ts   # Weather API
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page
├── components/
│   ├── Search.tsx             # Search interface
│   └── Result.tsx             # Results display
└── lib/
    ├── prompts.ts              # AI prompt templates
    └── time.ts                 # Time utilities
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Google Gemini AI for intelligent responses
- Open-Meteo for weather data
- NYC Parks for Central Park information
- Next.js team for the amazing framework

## 📞 Support

For issues and questions:
- Check the [project spec](project_spec.md)
- Review [improvements backlog](improvements.md)
- Open an issue on GitHub

---

**Built with ❤️ for NYC weekend planning**
