//routes/dataEntryPostgresRoutes.ts
import { Router } from "express";
import {
  list,
  create,
  update,
  remove,
} from "../controllers/dataEntryPostgresController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/", list);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
