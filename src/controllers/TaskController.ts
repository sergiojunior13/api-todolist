import { Request, Response } from "express";
import { Task } from "../models/Task";
import { TaskService } from "../services/TaskService";

type ICreateTask = Omit<Task, "id" | "createdAt" | "completed">;

export class TaskController {
    create(req: Request, res: Response) {
        try {
            if (!req.body) throw new Error("Corpo da requisição ausente");

            const { title, description } = req.body as ICreateTask;

            if (!title) throw new Error("Campo 'title' ausente no corpo da requisição");

            const taskService = new TaskService();
            const task = taskService.create({ title, description });

            return res.status(201).json(task);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    getById(req: Request, res: Response) {
        try {
            if (!req.params) throw new Error("Parâmetros ausentes na requisição");

            const idParam = req.params.id;
            const id = Number(idParam);

            if (!idParam) throw new Error("Campo 'id' ausente no corpo da requisição");
            if (isNaN(id)) throw new Error("Campo 'id' inválido");

            const taskService = new TaskService();
            const task = taskService.getById(id);

            if (!task) return res.status(404).json({ error: "Não foi encontrado uma tarefa com esse 'id'" });

            return res.status(200).json(task);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    list(req: Request, res: Response) {
        try {
            const taskService = new TaskService();
            const tasks = taskService.list();

            return res.status(200).json(tasks);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
