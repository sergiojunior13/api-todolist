import { Task } from "../models/Task";

let tasks: Task[] = [];

type ICreateTask = Omit<Task, "id" | "createdAt" | "completed">;
type IEditTask = Omit<Task, "id" | "createdAt">;
type IListFilter = {
    completed?: Task["completed"];
    title?: Task["title"];
    description?: Task["description"];
    createdAt?: Task["createdAt"];
};

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

    list(filters?: IListFilter) {
        // Retornando uma cópia de tasks ao invés da referência, para evitar modificações indevidas
        if (!filters) return [...tasks];

        const filtersEntries = Object.entries(filters);

        const filteredTasks = tasks.filter((task) =>
            // Filtra as tarefas em que todos os campos da tarefa sejam IGUAIS aos campos dos filtros
            /* É necessário converte o task[field] para String para que a comparação funcione,
            já que os filtros são do tipo String. Por exemplo, para resolver isso: true == "true" (Dá false)
            */
            filtersEntries.every(([field, value]) => String(task[field as keyof Task]) === value),
        );

        return filteredTasks;
    }

    delete(id: Task["id"]) {
        const prevTasksLength = tasks.length;

        tasks = tasks.filter((t) => t.id !== id);

        // Isso significa que nenhum elemento foi efetivamente removido, ou seja, que não existia uma task com esse id
        if (tasks.length === prevTasksLength) throw new Error("Não existe nenhuma tarefa com esse 'id'");
    }
}
