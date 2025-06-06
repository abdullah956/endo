import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.replace("/login");

    fetch("http://localhost:5000/api/todos", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setTodos)
      .catch(() => router.replace("/login"));
  }, [router]);

  async function addTodo(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return router.replace("/login");

    const res = await fetch("http://localhost:5000/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text, completed: false }),
    });

    if (res.ok) {
      const newTodo = await res.json();
      setTodos([...todos, newTodo]);
      setText("");
    }
  }

  async function toggleCompleted(id, completed) {
    const token = localStorage.getItem("token");
    if (!token) return router.replace("/login");

    const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed: !completed }),
    });

    if (res.ok) {
      const updated = await res.json();
      setTodos(todos.map((todo) => (todo._id === id ? updated : todo)));
    }
  }

  async function deleteTodo(id) {
    const token = localStorage.getItem("token");
    if (!token) return router.replace("/login");

    const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setTodos(todos.filter((todo) => todo._id !== id));
    }
  }

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1>Your Todos</h1>
        <button onClick={logout} style={logoutBtnStyle}>
          Logout
        </button>
      </div>

      <form onSubmit={addTodo} style={formStyle}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add new todo"
          required
          style={inputStyle}
        />
        <button type="submit" style={addBtnStyle}>
          Add
        </button>
      </form>

      <ul style={listStyle}>
        {todos.map((todo) => (
          <li key={todo._id} style={todoItemStyle}>
            <label
              style={{
                ...labelStyle,
                textDecoration: todo.completed ? "line-through" : "none",
                color: todo.completed ? "#888" : "#222",
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleCompleted(todo._id, todo.completed)}
                style={checkboxStyle}
              />
              {todo.text}
            </label>
            <button
              onClick={() => deleteTodo(todo._id)}
              style={deleteBtnStyle}
              aria-label={`Delete todo: ${todo.text}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const containerStyle = {
  maxWidth: "600px",
  margin: "40px auto",
  padding: "0 20px",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const logoutBtnStyle = {
  backgroundColor: "#e74c3c",
  border: "none",
  color: "white",
  padding: "8px 16px",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "600",
};

const formStyle = {
  display: "flex",
  marginBottom: "30px",
  gap: "10px",
};

const inputStyle = {
  flexGrow: 1,
  padding: "10px 15px",
  fontSize: "16px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  outline: "none",
};

const addBtnStyle = {
  backgroundColor: "#0070f3",
  border: "none",
  color: "white",
  padding: "10px 20px",
  borderRadius: "5px",
  fontSize: "16px",
  cursor: "pointer",
  fontWeight: "600",
};

const listStyle = {
  listStyle: "none",
  padding: 0,
};

const todoItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 15px",
  borderBottom: "1px solid #eee",
  borderRadius: "5px",
  marginBottom: "10px",
  backgroundColor: "#fafafa",
};

const labelStyle = {
  cursor: "pointer",
  userSelect: "none",
  flexGrow: 1,
  fontSize: "16px",
};

const checkboxStyle = {
  marginRight: "12px",
  width: "18px",
  height: "18px",
  cursor: "pointer",
};

const deleteBtnStyle = {
  backgroundColor: "#ff4d4f",
  border: "none",
  color: "white",
  borderRadius: "50%",
  width: "28px",
  height: "28px",
  fontSize: "20px",
  fontWeight: "bold",
  lineHeight: "22px",
  cursor: "pointer",
  transition: "background-color 0.2s",
};
