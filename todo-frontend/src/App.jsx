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

  const pendientes = filteredTasks.filter((t) => !t.completed).length;
  const completadas = filteredTasks.filter((t) => t.completed).length;

  return (
    <>
      {/* Encabezado con identidad de la ferretería */}
      <header className="app-header">
        <h1>Ferretería El Constructor</h1>
        <p>GESTIÓN DE TAREAS OPERATIVAS</p>
      </header>

      <div className="container">

        {/* Buscador */}
        <p className="section-title">Buscar tarea</p>
        <input
          type="text"
          placeholder="Buscar por nombre de tarea..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        {/* Contador de estado */}
        <div className="task-stats">
          <span className="stat-pending">Pendientes: <strong>{pendientes}</strong></span>
          <span className="stat-done">Completadas: <strong>{completadas}</strong></span>
        </div>

        {/* Formulario de Crear */}
        <p className="section-title" style={{ marginTop: "1.2rem" }}>Nueva tarea</p>
        <form onSubmit={handleAddTask} className="form">
          <input
            placeholder="Ej: Revisar stock de tornillos Stanley..."
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <input
            placeholder="Ej: Bodega nivel 2, sección B"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
          <button className="btn-primary">Agregar</button>
        </form>

        {/* Formulario de Editar */}
        {editingTask && (
          <form onSubmit={handleUpdateTask} className="form edit-form">
            <h3 style={{ color: "#6b2a08", marginBottom: "0.6rem" }}>
              Editando tarea
            </h3>
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
              Marcar como completada
            </label>
            <div className="form-buttons">
              <button className="btn-primary">Guardar cambios</button>
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

        <hr style={{ borderColor: "#d4c0b0", margin: "1.2rem 0" }} />

        {/* Lista de Tareas */}
        <p className="section-title">
          Tareas operativas ({filteredTasks.length})
        </p>
        <div className="task-list">
          {filteredTasks.length === 0 && (
            <p style={{ color: "#5a4a40", fontStyle: "italic", textAlign: "center", padding: "1rem" }}>
              No hay tareas registradas. Agregue una tarea arriba.
            </p>
          )}
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
    </>
  );
}

export default App;
