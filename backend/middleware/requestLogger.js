"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
/**
 * API Gateway - Request Logging Middleware
 *
 * Logs all incoming requests with method, path, and response status
 * Provides visibility into API traffic
 */
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    const requestId = req.headers["x-request-id"] || generateRequestId();
    // Add request ID to response headers
    res.setHeader("X-Request-ID", requestId);
    // Log incoming request
    console.log(`
┌────────────────────────────────────────────────┐
│ 📥 INCOMING REQUEST                            │
├────────────────────────────────────────────────┤
│ Request ID: ${String(requestId).padEnd(30)} │
│ Method:     ${req.method.padEnd(30)} │
│ Path:       ${req.path.padEnd(30)} │
│ IP:         ${(req.ip || "unknown").padEnd(30)} │
└────────────────────────────────────────────────┘
  `);
    // Capture response
    const originalSend = res.send;
    res.send = function (data) {
        const duration = Date.now() - startTime;
        // Determine status color/indicator
        const status = res.statusCode;
        const statusIndicator = status >= 500
            ? "❌"
            : status >= 400
                ? "⚠️"
                : status >= 300
                    ? "↪️"
                    : "✅";
        // Log response
        console.log(`
┌────────────────────────────────────────────────┐
│ 📤 OUTGOING RESPONSE                           │
├────────────────────────────────────────────────┤
│ Request ID: ${String(requestId).padEnd(30)} │
│ Status:     ${String(statusIndicator + " " + status).padEnd(30)} │
│ Duration:   ${String(duration + "ms").padEnd(30)} │
│ Method:     ${req.method.padEnd(30)} │
│ Path:       ${req.path.padEnd(30)} │
└────────────────────────────────────────────────┘
    `);
        return originalSend.call(this, data);
    };
    next();
};
exports.requestLogger = requestLogger;
/**
 * Generate unique request ID
 */
function generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
