import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './inicio.css';

const Inicio = () => {
    const navigate = useNavigate();
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        // Verificar si hay usuario logueado
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
        
        // Cargar servicios
        fetch('https://beautynails-1.onrender.com/servicios')
            .then(res => res.json())
            .then(data => {
                console.log("Servicios cargados:", data);
                setServicios(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar servicios:", err);
                setLoading(false);
            });
    }, []);

    const handleAgendar = (servicio) => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            alert("Debes iniciar sesión para agendar un turno");
            navigate('/login');
            return;
        }
        
        navigate('/reservar', { state: { servicio } });
    };

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        alert("Sesión cerrada");
        navigate('/');
    };

    if (loading) {
        return (
            <div className="inicio-container">
                <header className="header">
                    <div className="logo" onClick={() => navigate('/')}>
                        <h1>BeautyNails</h1>
                    </div>
                </header>
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <p>Cargando servicios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="inicio-container">
            <header className="header">
                <div className="logo" onClick={() => navigate('/')}>
                    <h1>BeautyNails</h1>
                </div>
                
                {user ? (
                    <div className="user-info">
                        
                        <button className="btn-mis-turnos" onClick={() => navigate('/mis-turnos')}>
                            Mis Turnos
                        </button>
                        <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
                            Cerrar Sesión
                        </button>
                    </div>
                ) : (
                    <nav className="nav-buttons">
                        <button className="btn-login" onClick={() => navigate('/login')}>
                            Iniciar Sesión
                        </button>
                        <button className="btn-register" onClick={() => navigate('/registro')}>
                            Registrarse
                        </button>
                    </nav>
                )}
            </header>

            <section className="servicios">
                <h2 className="servicios-title">Nuestros Servicios</h2>
                <div className="servicios-grid">
                    {servicios.map((servicio) => (
                        <div key={servicio.ID_servicios} className="servicio-card">
                            <div className="servicio-image">
                                <img 
                                    src={`/public/img/${servicio.Nombre_servicio.toLowerCase().replace(/\s+/g, '')}.jpeg`} 
                                    alt={servicio.Nombre_servicio}
                                    onError={(e) => {
                                        e.target.src = '/public/img/default.jpg';
                                    }}
                                /> 
                            </div>
                            <div className="servicio-info">
                                <h3>{servicio.Nombre_servicio}</h3>
                                <div className="servicio-details">
                                    <span className="precio">${servicio.Precio}</span>
                                    <span className="duracion">⏱ {servicio.Duracion}</span>
                                </div>
                                <button 
                                    className="btn-agendar" 
                                    onClick={() => handleAgendar(servicio)}
                                >
                                    Agendar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Inicio;