import { Request, Response, Router } from "express";
import { StatusCode } from "../util/status-code.js";
import type { CommitsQuery} from "../util/type.js";
import { buildInsightsFromRepo } from "../server/server_insights.js";

const router = Router();

router.get("/", async (req: Request<{}, {}, {}, CommitsQuery>, res: Response) => {
  try {
    const data = await buildInsightsFromRepo(req.query);
    res.json(data);
  } catch (err) {
    console.error("Erro ao gerar insights:", err);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ error: "Erro ao gerar insights" });
  }
});

export default router;
