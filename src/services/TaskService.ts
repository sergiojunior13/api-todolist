import { Task } from "../models/Task";

const tasks: Task[] = [];

type ICreateTask = Omit<Task, "id" | "createdAt" | "completed">;

export class TaskService {
    create({ title, description }: ICreateTask) {
        const task = new Task(title, description);

        if (!title) throw new Error("O título da tarefa é obrigatório");
        else if (title.length <= 2) throw new Error("O título da tarefa deve conter ao menos 3 caracteres");

        tasks.push(task);

        return task;
    }

    list() {
        // Retornando uma cópia de tasks ao invés da referência, para evitar modificações indevidas
        return [...tasks];
    }
}
