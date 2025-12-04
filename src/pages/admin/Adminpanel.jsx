import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

export default function AdminPanel() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedServicio, setSelectedServicio] = useState(null);
  
  const [formServicio, setFormServicio] = useState({
    Nombre_servicio: '',
    Precio: '',
    Duracion: ''
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!token || !user) {
      alert("Debes iniciar sesión");
      navigate('/login');
      return;
    }
    
    if (user.Rol.toLowerCase() !== 'administrador' && user.Rol.toLowerCase() !== 'admin') {
      alert("Acceso denegado. Solo administradores.");
      navigate('/inicio');
      return;
    }
    
    cargarServicios();
  }, []);

  const cargarServicios = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://beautynails-1.onrender.com/servicios/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setServicios(data);
    } catch (err) {
      console.error("Error al cargar servicios:", err);
    }
    setLoading(false);
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert("Sesión cerrada");
    navigate('/');
  };

  const agregarServicio = async () => {
    if (!formServicio.Nombre_servicio || !formServicio.Precio || !formServicio.Duracion) {
      return alert("Completa todos los campos");
    }

    try {
      const res = await fetch('https://beautynails-1.onrender.com/nuevoServicio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formServicio)
      });

      if (!res.ok) throw new Error("Error al agregar servicio");

      alert("Servicio agregado con éxito");
      setShowModal(false);
      resetForm();
      cargarServicios();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const editarServicio = async () => {
    if (!formServicio.Nombre_servicio || !formServicio.Precio || !formServicio.Duracion) {
      return alert("Completa todos los campos");
    }

    try {
      const res = await fetch(`https://beautynails-1.onrender.com/servicios/
${selectedServicio.ID_servicios}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formServicio)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al actualizar servicio");

      alert(data.message || "Servicio actualizado con éxito");
      setShowModal(false);
      resetForm();
      cargarServicios();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const eliminarServicio = async (servicio) => {
    const mensaje = servicio.turnosFuturos > 0 
      ? `¿Estás seguro? Este servicio tiene ${servicio.turnosFuturos} turno(s) futuro(s) y ${servicio.cantidadPersonal} personal(es) asignado(s). Se cancelarán todos los turnos y se eliminará el personal asociado.`
      : `¿Estás seguro? Este servicio tiene ${servicio.cantidadPersonal} personal(es) asignado(s) que será(n) eliminado(s).`;
    
    if (!confirm(mensaje)) return;

    try {
      const res = await fetch(`http://localhost:3000/servicios/${servicio.ID_servicios}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al eliminar servicio");

      alert(data.message || "Servicio eliminado con éxito");
      cargarServicios();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const abrirModal = (tipo, servicio = null) => {
    setModalType(tipo);
    setSelectedServicio(servicio);
    
    if (servicio) {
      setFormServicio({
        Nombre_servicio: servicio.Nombre_servicio,
        Precio: servicio.Precio,
        Duracion: servicio.Duracion
      });
    } else {
      resetForm();
    }
    
    setShowModal(true);
  };

  const resetForm = () => {
    setFormServicio({ Nombre_servicio: '', Precio: '', Duracion: '' });
  };

  if (loading) {
    return <div className="loading">Cargando datos...</div>;
  }

  return (
    <div className="admin-container">
      <header className="header">
        <div className="logo" onClick={() => navigate('/')}>
          <h1>BeautyNails - Admin</h1>
        </div>
        <div className="user-info">
          <span>Hola, {user?.Nombre}</span>
          <button className="btn-admin" onClick={() => navigate('/admin/personal')}>
            Gestionar Personal
          </button>
          <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="servicios-admin-container">
          <div className="content-header">
            <h2>Gestión de Servicios</h2>
            <button className="btn-add" onClick={() => abrirModal('add')}>
              + Agregar Servicio
            </button>
          </div>

          <div className="servicios-grid-admin">
            {servicios.map(servicio => (
              <div key={servicio.ID_servicios} className="servicio-card-admin">
                <h3>{servicio.Nombre_servicio}</h3>
                
                <div className="servicio-detalles">
                  <div className="detalle-item">
                    <span className="label">Precio:</span>
                    <span className="value precio">${servicio.Precio}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="label">Duración:</span>
                    <span className="value">{servicio.Duracion}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="label">Personal:</span>
                    <span className={`value ${servicio.cantidadPersonal > 0 ? 'success' : 'danger'}`}>
                      {servicio.cantidadPersonal}
                    </span>
                  </div>
                  <div className="detalle-item">
                    <span className="label">Turnos futuros:</span>
                    <span className={`value ${servicio.turnosFuturos > 0 ? 'warning' : ''}`}>
                      {servicio.turnosFuturos}
                    </span>
                  </div>
                </div>

                <div className="card-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => abrirModal('edit', servicio)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => eliminarServicio(servicio)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {servicios.length === 0 && (
            <div className="empty-state">
              No hay servicios registrados. ¡Agrega el primero!
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>
              {modalType === 'add' ? 'Agregar Servicio' : 'Editar Servicio'}
            </h3>

            <div className="form-modal">
              <div className="form-group">
                <label>Nombre del Servicio:</label>
                <input
                  type="text"
                  value={formServicio.Nombre_servicio}
                  onChange={(e) => setFormServicio({...formServicio, Nombre_servicio: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Precio:</label>
                <input
                  type="number"
                  value={formServicio.Precio}
                  onChange={(e) => setFormServicio({...formServicio, Precio: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Duración (ej: 45 min):</label>
                <input
                  type="text"
                  value={formServicio.Duracion}
                  onChange={(e) => setFormServicio({...formServicio, Duracion: e.target.value})}
                />
              </div>

              <div className="modal-buttons">
                <button 
                  className="btn-save"
                  onClick={modalType === 'add' ? agregarServicio : editarServicio}
                >
                  Guardar
                </button>
                <button className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}