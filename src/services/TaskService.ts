import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { prisma } from "../config/prismaClient";
import { Task } from "../models/Task";

type ICreateTask = Omit<Task, "id" | "createdAt" | "completed">;
type IEditTask = Omit<Task, "id" | "createdAt">;
type IListFilter = {
    completed?: Task["completed"];
    title?: Task["title"];
    description?: Task["description"];
    createdAt?: Task["createdAt"];
};

export class TaskService {
    async create({ title, description }: ICreateTask): Promise<Task> {
        if (!title) throw new Error("O título da tarefa é obrigatório");
        else if (title.length <= 2) throw new Error("O título da tarefa deve conter ao menos 3 caracteres");

        const task = await prisma.task.create({
            data: {
                title,
                description,
                completed: false,
            },
        });

        return task;
    }

    async getById(id: Task["id"]) {
        if (!id || isNaN(id) || !isFinite(id)) throw new Error("'id' inválido");

        const task = await prisma.task.findUnique({ where: { id } });

        return task;
    }

    async edit(id: Task["id"], editedTask: IEditTask) {
        try {
            const newTask = await prisma.task.update({
                where: {
                    id,
                },

                data: editedTask,
            });

            return newTask;
        } catch (error: any) {
            // Código P2025 = "Registro não encontrado para a operação"
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
                throw new Error("Tarefa não encontrada.", { cause: { code: 404 } });
            }
            throw error;
        }
    }

    async getAll(filters?: IListFilter): Promise<Task[]> {
        const tasks = await prisma.task.findMany({
            where: filters,
        });

        return tasks;
    }

    async delete(id: number) {
        try {
            await prisma.task.delete({ where: { id } });
        } catch (error: any) {
            // Código P2025 = "Registro não encontrado para a operação"
            if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
                throw new Error("Tarefa não encontrada.", { cause: { code: 404 } });
            }
            throw error;
        }
    }
}
