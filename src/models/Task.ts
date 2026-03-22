export class Task {
    id: number;
    title: string;
    description: string | undefined;
    completed: boolean;
    createdAt: Date;

    constructor(title: string, description?: string) {
        this.title = title;
        this.description = description;

        this.completed = false;
        this.createdAt = new Date();
        this.id = Math.random() * 1000;
    }
}
