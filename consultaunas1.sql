-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-12-2025 a las 18:38:18
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `consultaunas1`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `ID_pagos` int(11) NOT NULL,
  `FK_ID_turnos` int(11) NOT NULL,
  `Monto` int(100) NOT NULL,
  `Metodo` varchar(100) NOT NULL,
  `Fecha_pago` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal`
--

CREATE TABLE `personal` (
  `ID_personal` int(11) NOT NULL,
  `Apellido` varchar(100) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `FK_ID_servicios` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `personal`
--

INSERT INTO `personal` (`ID_personal`, `Apellido`, `Nombre`, `Email`, `FK_ID_servicios`) VALUES
(2, 'asd', 'asd', 'asd', 17);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `ID_servicios` int(11) NOT NULL,
  `Nombre_servicio` varchar(100) NOT NULL,
  `Precio` int(100) NOT NULL,
  `Duracion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`ID_servicios`, `Nombre_servicio`, `Precio`, `Duracion`) VALUES
(17, 'manicure', 10000, '1hs'),
(18, 'Pedicure', 20000, '1.5hs'),
(19, 'Esmaltado Semipermanente', 20000, '1hs'),
(20, 'Uñas Esculpidas', 25000, '2hs'),
(21, 'Piedreria', 50000, '30min'),
(22, 'Kapping', 30000, '1.5hs');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos`
--

CREATE TABLE `turnos` (
  `ID_turnos` int(11) NOT NULL,
  `FK_ID_usuarios` int(11) NOT NULL,
  `FK_ID_servicios` int(11) NOT NULL,
  `FK_ID_personal` int(11) NOT NULL,
  `Fecha` date NOT NULL,
  `Hora` time(6) NOT NULL,
  `Estado` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `ID_usuarios` int(100) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Apellido` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Telefono` int(100) NOT NULL,
  `Password` varchar(100) NOT NULL,
  `Rol` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`ID_usuarios`, `Nombre`, `Apellido`, `Email`, `Telefono`, `Password`, `Rol`) VALUES
(2, 'rosio', 'Scabini', 'asd@gmail.com', 11885, 'asd', 'blda'),
(3, 'Maria', 'Paquita', 'valeria@gmail.com', 1234567890, '1234', 'usuario'),
(4, 'cris', 'asd', 'cristianpineyro373@gmail.com', 11, '$2b$10$gUTZwb7oRraXCd/J9teMh.NgiEDljJREDy0T2ggbpCPRARTGE09WG', 'admin'),
(5, 'asd', 'hola', 'valentinamh36@gmail.com', 1166855832, '$2b$10$Fhf118pfTkZG2f9Vd2wh/u4/hCldlBfOLOse/dLwHPwUGfQZlxaVu', 'cliente');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`ID_pagos`),
  ADD KEY `Id_turnos` (`FK_ID_turnos`);

--
-- Indices de la tabla `personal`
--
ALTER TABLE `personal`
  ADD PRIMARY KEY (`ID_personal`),
  ADD KEY `ID_SERVICIOS` (`FK_ID_servicios`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`ID_servicios`);

--
-- Indices de la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`ID_turnos`),
  ADD KEY `Id_usuario` (`FK_ID_usuarios`),
  ADD KEY `Id_empleado` (`FK_ID_personal`),
  ADD KEY `ID_servicios` (`FK_ID_servicios`) USING BTREE;

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`ID_usuarios`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `personal`
--
ALTER TABLE `personal`
  MODIFY `ID_personal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `ID_servicios` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `ID_turnos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `ID_usuarios` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `pagos_tur` FOREIGN KEY (`FK_ID_turnos`) REFERENCES `turnos` (`ID_turnos`);

--
-- Filtros para la tabla `personal`
--
ALTER TABLE `personal`
  ADD CONSTRAINT `personal_ibfk_1` FOREIGN KEY (`FK_ID_servicios`) REFERENCES `servicios` (`ID_servicios`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD CONSTRAINT `turnos_em` FOREIGN KEY (`FK_ID_personal`) REFERENCES `personal` (`ID_personal`) ON DELETE CASCADE,
  ADD CONSTRAINT `turnos_sv` FOREIGN KEY (`FK_ID_servicios`) REFERENCES `servicios` (`ID_servicios`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `turnos_us` FOREIGN KEY (`FK_ID_usuarios`) REFERENCES `usuarios` (`ID_usuarios`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
