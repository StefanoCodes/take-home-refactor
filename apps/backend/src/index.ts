import express, { type Application } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";

const app: Application = express();
const PORT = process.env.BACKEND_PORT || 4291;

// Middleware
app.use(
	cors({
		origin: process.env.BETTER_AUTH_URL!,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		credentials: true,
	}),
);
app.use(express.json());

const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100,
	standardHeaders: "draft-8",
	legacyHeaders: false,
	message: {
		error: "Too many requests, please try again later.",
		status: 429,
		statusText: "Too Many Requests",
	},
});

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 20,
	standardHeaders: "draft-8",
	legacyHeaders: false,
	message: {
		error: "Too many authentication attempts, please try again later.",
		status: 429,
		statusText: "Too Many Requests",
	},
});

if (process.env.NODE_ENV === "production") {
	app.use("/api", globalLimiter);
	app.use("/api/auth", authLimiter);
}

// Mount all API routes
app.use("/api", routes);

// ============================================================================
// SERVER STARTUP
// ============================================================================

app.listen(PORT, () => {
	console.log(`\n🚀 Backend server running at http://localhost:${PORT}\n`);
});

export default app;
