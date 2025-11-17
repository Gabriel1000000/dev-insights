import "dotenv/config";
import app from "./app.js";
import { config } from "./config/config.js";

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`);
});
