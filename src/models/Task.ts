export class Task {
    id: number;
    title: string;
    description: string | null;
    completed: boolean;
    createdAt: Date;

    constructor(title: string, description?: string | null) {
        this.title = title;
        this.description = description || null;

        this.completed = false;
        this.createdAt = new Date();
        this.id = Math.random() * 1000;
    }
}
