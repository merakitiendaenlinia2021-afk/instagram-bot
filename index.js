const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());

const VERIFY_TOKEN = "mi_token_seguro";
const ACCESS_TOKEN = "AQUI_VA_TU_TOKEN";

// Verificación webhook
app.get("/webhook", (req, res) => {
  if (req.query["hub.verify_token"] === VERIFY_TOKEN) {
    return res.send(req.query["hub.challenge"]);
  }
  res.sendStatus(403);
});

// Escuchar comentarios
app.post("/webhook", async (req, res) => {
  const entry = req.body.entry;

  if (!entry) return res.sendStatus(200);

  for (const e of entry) {
    const change = e.changes?.[0]?.value;

    if (change?.text) {
      const texto = change.text.toLowerCase();

      let respuesta = "";

      if (texto.includes("precio")) {
        respuesta = "Hola 👋 escríbeme al DM y te doy el precio 🔥";
      }

      if (texto.includes("info")) {
        respuesta = "Claro 🙌 revisa el link de arriba";
      }

      if (respuesta) {
        await fetch(`https://graph.facebook.com/v19.0/${change.id}/replies`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message: respuesta })
        });
      }
    }
  }

  res.sendStatus(200);
});

app.listen(3000, () => console.log("Bot activo"));
