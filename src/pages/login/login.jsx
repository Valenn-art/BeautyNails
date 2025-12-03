import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://beautynails-1.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email, Password: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      alert("Bienvenida a BeautyNails");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/inicio");
    } catch (error) {
      alert(`${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="login-box">
        <h1 className="auth-title">BeautyNails</h1>
        <p className="auth-subtitle">Iniciá sesión para reservar tu turno</p>

        <div className="login-form">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            placeholder="ejemplo@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
            required
          />

          <button onClick={handleLogin} disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </div>

        <div className="divider"></div>

        <p className="auth-switch">
          ¿No tenés cuenta?{" "}
          <span onClick={() => navigate("/registro")}>Registrate</span>
        </p>
      </div>
    </div>
  );
}