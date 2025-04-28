import express from "express";
import {
  create,
  findAll,
  findByCPF,
  updateAssistido,
  deletar,
} from "../controller/AssistidoController.js";

const router = express.Router();

router.post("/", create);
router.get("/", findAll);
router.get("/:cpf", findByCPF);
router.put("/:cpf", updateAssistido);
router.delete("/:cpf", deletar);

export default router;
