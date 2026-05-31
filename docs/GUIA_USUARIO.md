# Guía de Usuario — Gestor de Tareas Ferretería El Constructor

Esta guía explica cómo interactuar con el frontend del Gestor de Tareas desde el navegador.

---

## Requisitos previos

Antes de abrir el frontend, asegúrate de que **ambos servidores estén corriendo**:

### 1. Iniciar el backend (FastAPI)

En una terminal, desde la carpeta `ToDoAPI/`:

```powershell
python -m uvicorn main:app --reload
```

Debes ver el mensaje `Application startup complete.` El backend queda en `http://127.0.0.1:8000`.

### 2. Iniciar el frontend (React + Vite)

En una segunda terminal, desde la carpeta `todo-frontend/`:

```powershell
npm run dev
```

> **Si aparece error de política de ejecución en PowerShell**, ejecuta primero:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```
> Escribe `S` cuando lo pida y vuelve a correr `npm run dev`.

El frontend queda disponible en `http://localhost:5173`. Ábrelo en tu navegador.

---

## Interfaz principal

Al abrir la aplicación verás tres zonas:

```
┌─────────────────────────────────────────────────┐
│         Ferretería El Constructor               │
│         GESTIÓN DE TAREAS OPERATIVAS            │
└─────────────────────────────────────────────────┘

[ Buscar por nombre de tarea...                  ]

Pendientes: 4    Completadas: 1

[ Nueva tarea ]
  Título       Descripción              [ Agregar ]

─────────────────────────────────────────────────

Tareas operativas (5)
┌─────────────────────────────────────┬──────────┐
│ Nombre de la tarea                  │  Editar  │
│ Descripción                         │ Eliminar │
└─────────────────────────────────────┴──────────┘
```

---

## Acciones disponibles

### Crear una tarea

1. En la sección **"Nueva tarea"**, escribe el nombre en el campo **Título**.
   - Ejemplo: `Revisar stock de tornillos Stanley`
2. Opcionalmente agrega una **Descripción** con detalles.
   - Ejemplo: `Bodega nivel 2, sección B`
3. Haz clic en **Agregar**.
4. La tarea aparece inmediatamente en la lista.

---

### Buscar una tarea

1. Escribe en el campo **"Buscar por nombre de tarea..."** en la parte superior.
2. La lista se filtra en tiempo real — solo se muestran las tareas cuyo título contiene el texto escrito.
3. Borra el texto para volver a ver todas las tareas.

---

### Editar una tarea

1. En la tarjeta de la tarea que quieres modificar, haz clic en **Editar** (botón ámbar).
2. Aparece un formulario de edición debajo del buscador con los datos actuales.
3. Modifica el **Título**, la **Descripción**, y/o marca la casilla **"Marcar como completada"**.
4. Haz clic en **Guardar cambios** para confirmar.
5. O haz clic en **Cancelar** para descartar los cambios.

---

### Marcar una tarea como completada

1. Haz clic en **Editar** sobre la tarea.
2. Activa la casilla **"Marcar como completada"**.
3. Haz clic en **Guardar cambios**.
4. La tarjeta se mostrará con tono atenuado y el título tachado, indicando que está finalizada.

Para desmarcarla, repite el proceso y desmarca la casilla.

---

### Eliminar una tarea

1. En la tarjeta de la tarea, haz clic en **Eliminar** (botón oscuro).
2. La tarea se elimina de inmediato, sin confirmación adicional.

> **Nota:** esta acción es permanente. Una vez eliminada, la tarea no se puede recuperar.

---

## Datos de prueba precargados

El sistema viene con 5 tareas de ejemplo para la ferretería:

| # | Tarea | Descripción | Estado |
|---|---|---|---|
| 1 | Revisar stock de tornillos Stanley | Bodega nivel 2, sección B. Mínimo requerido: 200 unidades. | Pendiente |
| 2 | Contactar proveedor Cemex | Solicitar cotización para pedido de 50 bultos de cemento 50kg. | Pendiente |
| 3 | Actualizar precios pinturas Pintuco | Revisar lista de precios vigente y actualizar catálogo de la tienda. | **Completada** |
| 4 | Recibir pedido amoladoras Bosch | Llegada programada el viernes. Verificar cantidades y estado del embalaje. | Pendiente |
| 5 | Inventario herramientas eléctricas | Contar taladros, sierras y amoladoras. Registrar serie de cada equipo. | Pendiente |

Puedes editar, completar o eliminar estos datos de prueba libremente.

---

## Documentación técnica de la API

Con el backend corriendo, accede a la documentación interactiva generada por FastAPI:

- **Swagger UI:** `http://127.0.0.1:8000/docs`
- **ReDoc:** `http://127.0.0.1:8000/redoc`

Desde Swagger puedes probar cada endpoint directamente en el navegador, sin necesidad de Postman.
