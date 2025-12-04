import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MisTurnos.css';

export default function MisTurnos() {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editandoTurno, setEditandoTurno] = useState(null);
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [nuevaHora, setNuevaHora] = useState('');
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!token || !user) {
      alert("Debes iniciar sesión");
      navigate('/login');
      return;
    }
    cargarTurnos();
  }, []);

  const cargarTurnos = async () => {
    try {
      const res = await fetch(`https://beautynails-1.onrender.com/turnos/mis-turnos/${user.ID_usuarios}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      console.log("Turnos cargados:", data);
      setTurnos(data);
      setLoading(false);
    } catch (err) {
      console.error("Error al cargar turnos:", err);
      setLoading(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert("Sesión cerrada");
    navigate('/');
  };

  const cancelarTurno = async (turnoId) => {
    if (!confirm("¿Estás segura de que querés cancelar este turno?")) return;

    try {
      const res = await fetch(`https://beautynails-1.onrender.com/turnos/turnosdel/${turnoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Error al cancelar turno");

      alert("Turno cancelado con éxito");
      cargarTurnos(); // Recargar la lista
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const iniciarEdicion = async (turno) => {
    setEditandoTurno(turno.ID_turnos);
    setNuevaFecha(turno.Fecha.split('T')[0]); // Formato YYYY-MM-DD
    setNuevaHora('');
    
    // Cargar horarios disponibles para esa fecha
    try {
      const res = await fetch(
        `https://beautynails-1.onrender.com/turnos/disponibles/${turno.Fecha.split('T')[0]}?personal=${turno.FK_ID_personal || 2}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const horarios = await res.json();
      setHorariosDisponibles(horarios);
    } catch (err) {
      console.error("Error al cargar horarios:", err);
    }
  };

  const guardarCambios = async (turnoId, estadoActual) => {
    if (!nuevaFecha || !nuevaHora) {
      return alert("Seleccioná una fecha y hora");
    }

    try {
      const res = await fetch(`https://beautynails-1.onrender.com/turnos/turnosup/${turnoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          Fecha: nuevaFecha,
          Hora: nuevaHora + ':00',
          Estado: estadoActual // Mantener el estado actual
        })
      });

      if (!res.ok) throw new Error("Error al actualizar turno");

      alert("Turno actualizado con éxito");
      setEditandoTurno(null);
      cargarTurnos();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const cancelarEdicion = () => {
    setEditandoTurno(null);
    setNuevaFecha('');
    setNuevaHora('');
    setHorariosDisponibles([]);
  };

  const cargarHorariosParaNuevaFecha = async (fecha, personalId) => {
    try {
      const res = await fetch(
        `https://beautynails-1.onrender.com/turnos/disponibles/${fecha}?personal=${personalId || 2}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const horarios = await res.json();
      setHorariosDisponibles(horarios);
    } catch (err) {
      console.error("Error:", err);
      setHorariosDisponibles([]);
    }
  };

  if (loading) {
    return <div className="loading">Cargando tus turnos...</div>;
  }

  return (
    <div className="mis-turnos-container">
      <header className="header">
        <div className="logo" onClick={() => navigate('/inicio')}>
          <h1>BeautyNails</h1>
        </div>
        <div className="user-info">
          
          <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="turnos-content">
        <h2>Mis Turnos</h2>

        {turnos.length === 0 ? (
          <div className="no-turnos">
            <p>No tenés turnos reservados</p>
            <button className="btn-reservar-nuevo" onClick={() => navigate('/inicio')}>
              Reservar un turno
            </button>
          </div>
        ) : (
          <div className="turnos-lista">
            {turnos.map(turno => (
              <div key={turno.ID_turnos} className="turno-card">
                {editandoTurno === turno.ID_turnos ? (
                  // MODO EDICIÓN
                  <div className="turno-edicion">
                    <h3>{turno.Nombre_servicio}</h3>
                    <div className="form-edicion">
                      <div className="form-group">
                        <label>Nueva Fecha:</label>
                        <input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={nuevaFecha}
                          onChange={(e) => {
                            setNuevaFecha(e.target.value);
                            cargarHorariosParaNuevaFecha(e.target.value, 2);
                          }}
                        />
                      </div>

                      {nuevaFecha && (
                        <div className="form-group">
                          <label>Nuevo Horario:</label>
                          <div className="horarios-grid-edicion">
                            {horariosDisponibles.map(h => (
                              <button
                                key={h}
                                className={nuevaHora === h ? 'hora-selected' : ''}
                                onClick={() => setNuevaHora(h)}
                              >
                                {h}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="botones-edicion">
                        <button 
                          className="btn-guardar" 
                          onClick={() => guardarCambios(turno.ID_turnos, turno.Estado)}
                        >
                          Guardar
                        </button>
                        <button className="btn-cancelar-edicion" onClick={cancelarEdicion}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="turno-header">
                      <h3>{turno.Nombre_servicio}</h3>
                      <span className={`estado estado-${turno.Estado.toLowerCase()}`}>
                        {turno.Estado}
                      </span>
                    </div>
                    <div className="turno-detalles">
                      <p><strong>Fecha:</strong> {new Date(turno.Fecha).toLocaleDateString('es-AR')}</p>
                      <p><strong>Hora:</strong> {turno.Hora}</p>
                      <p><strong>Duración:</strong> {turno.Duracion}</p>
                      <p><strong>Precio:</strong> ${turno.Precio}</p>
                      <p><strong>Profesional:</strong> {turno.Nombre_personal} {turno.Apellido_personal}</p>
                    </div>
                    <div className="turno-acciones">
                      <button 
                        className="btn-cambiar" 
                        onClick={() => iniciarEdicion(turno)}
                      >
                        Cambiar Horario
                      </button>
                      <button 
                        className="btn-cancelar" 
                        onClick={() => cancelarTurno(turno.ID_turnos)}
                      >
                        Cancelar Turno
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}