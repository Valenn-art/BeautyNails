const jwt = require('jsonwebtoken');


const JWT_SECRET = process.env.JWT_SECRET;
const checkAuth = (req, res, next) => {
    try {
        // 1. Obtener el token del header Authorization
        // El formato usual es: Authorization: Bearer <TOKEN>
        const tokenHeader = req.headers.authorization;

        if (!tokenHeader) {
            return res.status(401).json({ 
                message: 'Fallo de autenticación: Token no proporcionado.' 
            });
        }
        
        // Separamos "Bearer" de la parte del token
        const token = tokenHeader.split(' ')[1]; 
        
        if (!token) {
             return res.status(401).json({ 
                message: 'Fallo de autenticación: Formato de token inválido.' 
            });
        }

        // 2. Verificar la validez del token
        // jwt.verify decodifica y verifica la firma en un solo paso
        const decodedToken = jwt.verify(token, JWT_SECRET);

        // 3. Adjuntar la información del usuario al request
        // Esta información proviene del "payload" del token (lo que firmaste al hacer login)
        // Y es usada por el siguiente middleware (checkRole) para la autorización.
        req.user = decodedToken; 
        
        // Si todo es exitoso, pasamos al siguiente middleware/función del controlador
        next(); 

    } catch (error) {
        // Captura errores comunes como Token Expirado, Firma Inválida, o problemas de formato
        console.error("Error en checkAuth:", error.message);
        
        let errorMessage = 'Fallo de autenticación.';
        if (error.name === 'TokenExpiredError') {
            errorMessage = 'El token ha expirado.';
        } else if (error.name === 'JsonWebTokenError') {
             errorMessage = 'Token inválido o corrupto.';
        }

        return res.status(401).json({ 
            message: errorMessage 
        });
    }
};

module.exports = checkAuth;