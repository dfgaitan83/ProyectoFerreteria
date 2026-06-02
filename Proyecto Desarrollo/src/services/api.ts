const API_URL = "http://127.0.0.1:8000";

export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
}

export interface TaskCreate {
    title: string;
    description: string;
    completed: boolean;
}

export async function getTasks(): Promise<Task[]> {
    const res = await fetch(`${API_URL}/tasks`);
    return res.json() as Promise<Task[]>;
}

export async function createTask(task: TaskCreate): Promise<Task> {
    const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });
    return res.json() as Promise<Task>;
}

export async function updateTask(id: number, task: TaskCreate): Promise<Task> {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });
    return res.json() as Promise<Task>;
}

export async function deleteTask(id: number): Promise<void> {
    await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
}
