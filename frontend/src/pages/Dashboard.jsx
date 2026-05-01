import { useEffect, useState } from "react";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async (status = "") => {
  try {
    const url = status
      ? `https://ttm-production-bef9.up.railway.app/api/tasks?status=${status}`
      : `https://ttm-production-bef9.up.railway.app/api/tasks`;

    const res = await fetch(url, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const data = await res.json();
    setTasks(data);
  } catch (err) {
    console.log(err);
  }
};

  const createTask = async () => {
    try {
      await fetch("https://ttm-production-bef9.up.railway.app/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ title, description }),
      });

      fetchTasks();
      setTitle("");
      setDescription("");
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id) => {
    try {
      await fetch(
        `https://ttm-production-bef9.up.railway.app/api/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ status: "done" }),
        }
      );

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 STEP 2: DELETE FUNCTION
  const deleteTask = async (id) => {
    try {
      await fetch(
        `https://ttm-production-bef9.up.railway.app/api/tasks/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      <div style={{ marginBottom: 20 }}>
  <button onClick={() => fetchTasks("")}>All</button>

  <button
    onClick={() => fetchTasks("todo")}
    style={{ marginLeft: "10px" }}
  >
    Todo
  </button>

  <button
    onClick={() => fetchTasks("done")}
    style={{ marginLeft: "10px" }}
  >
    Done
  </button>
</div>

      {/* CREATE TASK */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br /><br />

        <button onClick={createTask}>Add Task</button>
      </div>

      {/* TASK LIST */}
      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            style={{
              border: "1px solid gray",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>

            {/* Step 1 */}
            <button onClick={() => updateStatus(task._id)}>
              Mark Done
            </button>

            {/* Step 2 */}
            <button
              onClick={() => deleteTask(task._id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}