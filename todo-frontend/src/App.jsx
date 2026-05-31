import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./services/api";
import "./index.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    completed: false,
  });

  const [editingTask, setEditingTask] = useState(null);

  async function loadTasks() {
    const data = await getTasks();
    setTasks(data);
  }

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getTasks();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  async function handleAddTask(e) {
    e.preventDefault();
    await createTask(newTask);
    setNewTask({ title: "", description: "", completed: false });
    loadTasks();
  }

  async function handleUpdateTask(e) {
    e.preventDefault();
    await updateTask(editingTask.id, editingTask);
    setEditingTask(null);
    loadTasks();
  }

  async function handleDeleteTask(id) {
    await deleteTask(id);
    loadTasks();
  }

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Gestor de Tareas</h1>

      {/* Buscador. */}
      <input
        type="text"
        placeholder="Buscar tarea..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {/* Formulario de Crear. */}
      <form onSubmit={handleAddTask} className="form">
        <input
          placeholder="Título"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <input
          placeholder="Descripción"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <button className="btn-primary">Agregar</button>
      </form>

      {/* Formulario de Editar. */}
      {editingTask && (
        <form onSubmit={handleUpdateTask} className="form edit-form">
          <h3>Editando tarea</h3>
          <input
            value={editingTask.title}
            onChange={(e) =>
              setEditingTask({ ...editingTask, title: e.target.value })
            }
          />
          <input
            value={editingTask.description}
            onChange={(e) =>
              setEditingTask({ ...editingTask, description: e.target.value })
            }
          />
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={editingTask.completed}
              onChange={(e) =>
                setEditingTask({ ...editingTask, completed: e.target.checked })
              }
            />
            Completada
          </label>
          <div className="form-buttons">
            <button className="btn-primary">Guardar</button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setEditingTask(null)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <hr />

      {/* Lista de Tareas. */}
      <div className="task-list">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`task-card ${task.completed ? "completed" : ""}`}
          >
            <div className="task-info">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </div>
            <div className="task-buttons">
              <button
                className="btn-edit"
                onClick={() => setEditingTask(task)}
              >
                Editar
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDeleteTask(task.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
