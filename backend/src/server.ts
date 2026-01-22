import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route"
import preferencesRoutes from "./routes/preferences.route"
import aiTripRoutes from "./routes/ai-trip.route"
import itineraryRoutes from "./routes/itinerary.route"
import tripRoutes from "./routes/trip.route"
import placesRoutes from "./routes/places.route"
import mapRoutes from "./routes/map.route"
import { requestLogger } from "./middleware/requestLogger";


dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// ═══════════════════════════════════════════════════════════════
// API GATEWAY MIDDLEWARE STACK
// ═══════════════════════════════════════════════════════════════
app.use(requestLogger); // Log all requests
// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:19006'],
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ═══════════════════════════════════════════════════════════════
// HEALTH CHECK ENDPOINT
// ═══════════════════════════════════════════════════════════════

app.get("/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "WayFinder API is running 🚀",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime()
  });
});


// Definning the route
app.use("/api/auth", authRoutes)
app.use("/api/preferences", preferencesRoutes)
app.use("/api/ai-trips", aiTripRoutes)
app.use("/api/itinerary", itineraryRoutes)
app.use("/api/trips", tripRoutes)
app.use("/api/places", placesRoutes)
app.use("/api/map", mapRoutes)



// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

//* Global error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  // Use a proper logging library instead of console.error for production
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error! Please try again later",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      details: err,
    }),
  });
});



// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                 🚀 Wonderlust Backend                      ║
╚═══════════════════════════════════════════════════════════╝

🌐 Server Details:
   Port       : ${PORT}
   Environment: ${process.env.NODE_ENV || "development"}
   
📊 Features Enabled:
   ✅ API Gateway (request routing & middleware)
   ✅ Request Logging (with Request IDs)
   ✅ Authentication (JWT verification)
   ✅ Rate Limiting (per-user/IP)
   ✅ Event System (async side effects)
   ✅ Resend Email Integration
   
🔗 Quick Links:
   Health Check : http://localhost:${PORT}/health
   API Docs     : http://localhost:${PORT}/api/*
   
🚀 Ready to accept requests!

  `);
});

export default app;