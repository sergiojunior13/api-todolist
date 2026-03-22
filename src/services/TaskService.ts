import { Task } from "../models/Task";

const tasks: Task[] = [];

type ICreateTask = Omit<Task, "id" | "createdAt" | "completed">;
type IEditTask = Omit<Task, "id" | "createdAt">;

export class TaskService {
    create({ title, description }: ICreateTask) {
        const task = new Task(title, description);

        if (!title) throw new Error("O título da tarefa é obrigatório");
        else if (title.length <= 2) throw new Error("O título da tarefa deve conter ao menos 3 caracteres");

        tasks.push(task);

        return task;
    }

    getById(id: Task["id"]) {
        if (!id || isNaN(id) || !isFinite(id)) throw new Error("'id' inválido");

        const task = tasks.find((t) => t.id === id);

        if (!task) return null;

        return task;
    }

    edit(id: Task["id"], editedTask: IEditTask) {
        const taskIndex = tasks.findIndex((t) => t.id === id);

        if (taskIndex === -1) throw new Error("Não existe uma tarefa com esse 'id'");

        tasks[taskIndex]! = { ...tasks[taskIndex]!, ...editedTask };

        return tasks[taskIndex];
    }

    list() {
        // Retornando uma cópia de tasks ao invés da referência, para evitar modificações indevidas
        return [...tasks];
    }
}
