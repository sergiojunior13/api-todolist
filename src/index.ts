import express from "express";

const app = express();
const PORT = 3333;

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ mensagem: "API funcionando!" });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
