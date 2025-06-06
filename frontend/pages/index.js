import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  function logout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
    router.push("/login");
  }

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 10,
        textAlign: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ marginBottom: 30, color: "#333" }}>
        Welcome to My Todo App
      </h1>

      {!loggedIn ? (
        <>
          <button onClick={() => router.push("/login")} style={buttonStyle}>
            Login
          </button>
          <button
            onClick={() => router.push("/signup")}
            style={{ ...buttonStyle, marginLeft: 10 }}
          >
            Signup
          </button>
        </>
      ) : (
        <>
          <button onClick={logout} style={buttonStyle}>
            Logout
          </button>
          <button
            onClick={() => router.push("/todos")}
            style={{ ...buttonStyle, marginLeft: 10 }}
          >
            View Todos
          </button>
        </>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  fontSize: 16,
  cursor: "pointer",
  borderRadius: 5,
  border: "1px solid #0070f3",
  backgroundColor: "#0070f3",
  color: "white",
  transition: "background-color 0.3s",
};
