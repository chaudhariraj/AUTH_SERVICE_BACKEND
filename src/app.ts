import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser"; 
import logger from "./config/logger";
import { HttpError } from "http-errors";
import authRouter from "./routes/auth";
import "reflect-metadata";

const app = express();
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.use("/auth", authRouter);

// Error handling middleware
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  console.log("Global error ",err);
  
  logger.error(err.message);
  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        msg: err.message,
        path: "",
        location: "",
      },
    ],
  });
});

export default app;
