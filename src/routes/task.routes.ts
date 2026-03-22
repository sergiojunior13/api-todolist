import { Router } from "express";
import { TaskController } from "../controllers/TaskController";

const taskRoutes = Router();
const taskController = new TaskController();

taskRoutes.get("/", taskController.list);
taskRoutes.get("/:id", taskController.getById);
taskRoutes.post("/", taskController.create);

export { taskRoutes };
