import { Request, Response } from "express";
import { Task } from "../models/Task";
import { TaskService } from "../services/TaskService";

type ICreateTask = Omit<Task, "id" | "createdAt" | "completed">;
type IEditTask = Omit<Task, "id" | "createdAt">;

export class TaskController {
    async create(req: Request, res: Response) {
        try {
            if (!req.body) throw new Error("Corpo da requisição ausente");

            const { title, description } = req.body as ICreateTask;

            if (!title) throw new Error("Campo 'title' ausente no corpo da requisição");

            const taskService = new TaskService();
            const task = await taskService.create({ title, description });
            return res.status(201).json(task);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            if (!req.params) throw new Error("Parâmetros ausentes na requisição");

            const idParam = req.params.id;
            const id = Number(idParam);

            if (!idParam) throw new Error("Campo 'id' ausente no corpo da requisição");
            if (isNaN(id)) throw new Error("Campo 'id' inválido");

            const taskService = new TaskService();
            const task = await taskService.getById(id);

            if (!task) return res.status(404).json({ error: "Não foi encontrado uma tarefa com esse 'id'" });

            return res.status(200).json(task);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async edit(req: Request, res: Response) {
        try {
            if (!req.params) throw new Error("Parâmetros ausentes na requisição");

            const idParam = req.params.id;
            const id = Number(idParam);

            if (!idParam) throw new Error("Campo 'id' ausente no corpo da requisição");
            if (isNaN(id)) throw new Error("Campo 'id' inválido");

            if (!req.body) throw new Error("Corpo ausente na requisição");

            const body = req.body as IEditTask;

            if (!body.title && !body.description && body.completed === undefined)
                throw new Error(
                    "Ao menos um dos seguintes campos devem estar presente no corpo da requisição: title, description, completed",
                );

            const taskService = new TaskService();
            const task = await taskService.edit(id, body);

            return res.status(200).json(task);
        } catch (error: any) {
            return res.status(error?.cause?.code ? Number(error.cause.code) : 400).json({ error: error.message });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const filters = req.query;

            if (
                Object.keys(filters).length > 0 && // Se tem algum filtro
                !filters.completed &&
                !filters.title &&
                !filters.description &&
                !filters.createdAt
            )
                throw new Error("Insira somente filtros válidos");

            // É necessário usar filters.completed === "true" para 'converter' de string para boolean
            const completed: boolean | undefined =
                filters.completed !== undefined ? filters.completed === "true" : undefined;

            const taskService = new TaskService();
            const tasks = await taskService.getAll({ ...filters, completed });

            return res.status(200).json(tasks);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            if (!req.params) throw new Error("Parâmetros ausentes na requisição");

            const idParam = req.params.id;
            const id = Number(idParam);

            if (!idParam) throw new Error("Campo 'id' ausente no corpo da requisição");
            if (isNaN(id)) throw new Error("Campo 'id' inválido");

            const taskService = new TaskService();
            await taskService.delete(id);

            return res.status(204).send();
        } catch (error: any) {
            return res.status(error?.cause?.code ? Number(error.cause.code) : 400).json({ error: error.message });
        }
    }
}
