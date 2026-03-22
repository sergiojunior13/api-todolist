import { Router } from "express";
import { TaskController } from "../controllers/TaskController";

const taskRoutes = Router();
const taskController = new TaskController();

taskRoutes.get("/", taskController.list);
taskRoutes.post("/", taskController.create);

export { taskRoutes };
