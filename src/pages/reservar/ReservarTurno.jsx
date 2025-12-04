import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ReservarTurno.css';

export default function ReservarTurno() {
  const [fecha, setFecha] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [horaSeleccionada, setHoraSeleccionada] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const servicio = location.state?.servicio;

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // ✅ Verificar autenticación y datos del servicio
  useEffect(() => {
    if (!token) {
      alert("Debes iniciar sesión para reservar un turno");
      navigate('/login');
      return;
    }
    if (!servicio) {
      alert("No se seleccionó ningún servicio");
      navigate('/inicio');
    }
  }, [token, servicio, navigate]);

  // ✅ Cargar horarios disponibles cuando se selecciona una fecha
  useEffect(() => {
    if (fecha && token) {
      setLoading(true);
      fetch(`https://beautynails-1.onrender.com/turnos/disponibles/${fecha}?personal=2`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(data => {
          console.log("Horarios disponibles:", data);
          setHorarios(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error al cargar horarios:", err);
          setHorarios([]);
          setLoading(false);
        });
    }
  }, [fecha, token]);

  const reservar = async () => {
    if (!horaSeleccionada) return alert("Elegí un horario");
    if (!fecha) return alert("Elegí una fecha");

    // ✅ Obtener IDs correctos
    const FK_ID_usuarios = user?.ID_usuarios;
    const FK_ID_servicios = servicio?.ID_servicios; // ⬅️ ID real de la BD
    const FK_ID_personal = 2; // ID del personal

    console.log("Datos a enviar:", {
      FK_ID_usuarios,
      FK_ID_servicios,
      FK_ID_personal,
      Fecha: fecha,
      Hora: horaSeleccionada
    });

    // Validación
    if (!FK_ID_usuarios || !FK_ID_servicios || !FK_ID_personal) {
      console.error("Falta una ID:", {
        usuario: FK_ID_usuarios,
        servicio: FK_ID_servicios,
        personal: FK_ID_personal
      });
      return alert("Error: Faltan datos necesarios. Por favor, intenta nuevamente.");
    }

    setLoading(true);
    try {
      const res = await fetch('https://beautynails-1.onrender.com/turnos/crearturnos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          FK_ID_usuarios,
          FK_ID_servicios,
          FK_ID_personal,
          Fecha: fecha,
          Hora: horaSeleccionada + ':00', // ⬅️ Formato TIME completo
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Error al crear turno');
      }

      alert("¡Turno reservado con éxito!");
      navigate('/mis-turnos');
    } catch (err) {
      console.error("Error al reservar:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!servicio) return null;

  return (
    <div className="reservar-container">
      <div className="reservar-card">
        <h2>Reservar {servicio.Nombre_servicio}</h2>
        <p>Precio: ${servicio.Precio} | Duración: {servicio.Duracion}</p>

        <div className="form-group">
          <label>Fecha</label>
          <input 
            type="date" 
            min={new Date().toISOString().split('T')[0]} 
            value={fecha} 
            onChange={e => setFecha(e.target.value)} 
          />
        </div>

        {fecha && (
          <div className="form-group">
            <label>Horarios disponibles</label>
            {loading ? (
              <p>Cargando horarios...</p>
            ) : (
              <div className="horarios-grid">
                {horarios.length > 0 ? horarios.map(h => (
                  <button
                    key={h}
                    className={horaSeleccionada === h ? 'selected' : ''}
                    onClick={() => setHoraSeleccionada(h)}
                  >
                    {h}
                  </button>
                )) : <p>No hay horarios disponibles para esta fecha</p>}
              </div>
            )}
          </div>
        )}

        <button 
          className="btn-reservar" 
          onClick={reservar} 
          disabled={loading || !horaSeleccionada}
        >
          {loading ? "Reservando..." : "Confirmar Turno"}
        </button>
      </div>
    </div>
  );
}