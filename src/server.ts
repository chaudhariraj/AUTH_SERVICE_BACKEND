import app from "./app";
import { AppDataSource } from "./config/data-source";
import { Config } from "./config";
import logger from "./config/logger";

const startServer = async () => {
  try {
    // Initialize the database connection
    await AppDataSource.initialize();
    logger.info("Database connected successfully");

    const port = Config.PORT;
    app.listen(port, () => logger.info(`Listening on port ${port}`));
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error("Error during Data Source initialization:", error.message);
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    }
  }
};

void startServer();
