import app from "./app";
import { Config } from "./config";

const startServer = () => {
  try {
    const port = Config.PORT;
    // eslint-disable-next-line no-console
    app.listen(port, () => console.log(`Listeing on port ${port}`));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    process.exit(1);
  }
};

startServer();
