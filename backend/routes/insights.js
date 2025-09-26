import { Router } from "express";
import OpenAI from "openai";

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Gera insights a partir de commits
router.post("/insights", async (req, res) => {
  try {
    const { commits } = req.body;
    if (!commits || commits.length === 0) {
      return res.status(400).json({ error: "Nenhum commit enviado" });
    }

    const commitMessages = commits.map(c => c.commit.message).join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um analista de produtividade de desenvolvedores." },
        { role: "user", content: `Analise esses commits e me dê insights sobre padrões de produtividade:\n${commitMessages}` }
      ],
    });

    res.json({ insights: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
