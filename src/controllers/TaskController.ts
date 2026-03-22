import { Request, Response } from "express";
import { Task } from "../models/Task";
import { TaskService } from "../services/TaskService";

type ICreateTask = Omit<Task, "id" | "createdAt" | "completed">;
type IEditTask = Omit<Task, "id" | "createdAt">;

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

    edit(req: Request, res: Response) {
        try {
            if (!req.params) throw new Error("Parâmetros ausentes na requisição");

            const idParam = req.params.id;
            const id = Number(idParam);

            if (!idParam) throw new Error("Campo 'id' ausente no corpo da requisição");
            if (isNaN(id)) throw new Error("Campo 'id' inválido");

            if (!req.body) throw new Error("Corpo ausente na requisição");

            const body = req.body as IEditTask;

            if (!body.title && !body.description && !body.completed)
                throw new Error(
                    "Ao menos um dos seguintes campos devem estar presente no corpo da requisição: title, description, completed",
                );

            const taskService = new TaskService();
            const task = taskService.edit(id, body);

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

    delete(req: Request, res: Response) {
        try {
            if (!req.params) throw new Error("Parâmetros ausentes na requisição");

            const idParam = req.params.id;
            const id = Number(idParam);

            if (!idParam) throw new Error("Campo 'id' ausente no corpo da requisição");
            if (isNaN(id)) throw new Error("Campo 'id' inválido");

            const taskService = new TaskService();
            taskService.delete(id);

            return res.status(204).send();
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
