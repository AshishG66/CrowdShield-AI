import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import healthRoutes from "./routes/health.routes";
import venueRoutes from "./routes/venue.routes";
import eventRoutes from "./routes/event.routes";
import crowdReadingRoutes from "./routes/crowd_reading.routes";
import predictionRoutes from "./routes/prediction.routes";
import incidentRoutes from "./routes/incident.routes";
import reportRoutes from "./routes/report.routes";
import errorHandler from "./middleware/errorHandler";
import swaggerSpec from "./config/swagger";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(cookieParser());

// Configure Helmet to support Swagger UI loading scripts
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(morgan("dev"));

// Serve Swagger Interactive API Documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/health", healthRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/crowd-readings", crowdReadingRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/reports", reportRoutes);

// Global error handler middleware
app.use(errorHandler);

export default app;
