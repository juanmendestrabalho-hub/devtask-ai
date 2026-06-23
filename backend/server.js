
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/ia", async (req, res) => {
  const { texto } = req.body;

  try {
    const resposta = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Classifique essa tarefa em JSON com prioridade (alta, media, baixa) e categoria: ${texto}`
          }
        ]
      })
    });

    const data = await resposta.json();

    res.json(data.choices[0].message.content);

  } catch (err) {
    res.status(500).json({ erro: "Erro na IA" });
  }
});

app.listen(3000, () => console.log("Servidor rodando..."));
