"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const preferences_route_1 = __importDefault(require("./routes/preferences.route"));
const ai_trip_route_1 = __importDefault(require("./routes/ai-trip.route"));
const itinerary_route_1 = __importDefault(require("./routes/itinerary.route"));
const trip_route_1 = __importDefault(require("./routes/trip.route"));
const places_route_1 = __importDefault(require("./routes/places.route"));
const map_route_1 = __importDefault(require("./routes/map.route"));
const requestLogger_1 = require("./middleware/requestLogger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// ═══════════════════════════════════════════════════════════════
// API GATEWAY MIDDLEWARE STACK
// ═══════════════════════════════════════════════════════════════
app.use(requestLogger_1.requestLogger); // Log all requests
// Security
app.use((0, helmet_1.default)());
// CORS
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://your-domain.com']
        : ['http://localhost:3000', 'http://localhost:19006'],
    credentials: true
}));
// Body parsing
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ═══════════════════════════════════════════════════════════════
// HEALTH CHECK ENDPOINT
// ═══════════════════════════════════════════════════════════════
app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "WayFinder API is running 🚀",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        uptime: process.uptime()
    });
});
// Definning the route
app.use("/api/auth", auth_route_1.default);
app.use("/api/preferences", preferences_route_1.default);
app.use("/api/ai-trips", ai_trip_route_1.default);
app.use("/api/itinerary", itinerary_route_1.default);
app.use("/api/trips", trip_route_1.default);
app.use("/api/places", places_route_1.default);
app.use("/api/map", map_route_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`,
    });
});
//* Global error handler
app.use((err, req, res, next) => {
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
exports.default = app;
