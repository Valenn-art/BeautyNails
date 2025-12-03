import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from './pages/login/login.jsx';
import Register from "./pages/register/register.jsx";
import Inicio from "./pages/inicio/inicio.jsx";
import ReservarTurno from './pages/reservar/ReservarTurno';
import MisTurnos from './pages/mis-turnos/MisTurnos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Inicio />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/registro" element={<Register />}/>
        <Route path="/inicio" element={<Inicio />}/>
        <Route path="/reservar" element={<ReservarTurno />} />
        <Route path="/mis-turnos" element={<MisTurnos />} />
      </Routes>
    </Router>
  );
}

export default App;