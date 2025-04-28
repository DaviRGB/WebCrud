import express from "express";
import cors from "cors";
import { createTables } from "./config/database.js";
import routeAssistido from "./route/RouteAssistido.js";
import comunicadosRoutes from './route/HomeRouteController.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/comunicados', comunicadosRoutes);
app.use('/uploads', express.static('uploads'));

try {
    await createTables();
} catch (err) {
    console.error('Erro ao criar tabelas:', err);
    process.exit(1);
}

const port = 8080;

app.use("/assistidos", routeAssistido);


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
