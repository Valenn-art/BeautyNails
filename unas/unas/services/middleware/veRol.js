const checkRole = (req, res, next) => {
   
    const user = req.user || req.usuario; 

    if (!user) {
        return res.status(401).json({ 
            message: "Acceso denegado. Se requiere autenticación." 
        });
    }

   
    if (user.Rol && user.Rol.toLowerCase() === 'administrador' || user.Rol === '1' || user.Rol === 'admin') {
        next();
    } else {
        // El usuario está autenticado, pero no es administrador.
        console.warn(`Intento de acceso denegado a rol: ${user.Rol}`);
        return res.status(403).json({ 
            message: "Acceso denegado. Se requiere el rol de Administrador." 
        });
    }
};

module.exports = checkRole;