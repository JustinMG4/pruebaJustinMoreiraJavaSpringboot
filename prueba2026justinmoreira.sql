-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-04-2026 a las 20:52:18
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
-- Base de datos: `prueba2026justinmoreira`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `accounts`
--

CREATE TABLE `accounts` (
  `id` binary(16) NOT NULL,
  `account_number` varchar(255) NOT NULL,
  `account_type` enum('AHORRO','CORRIENTE') NOT NULL,
  `balance` decimal(38,2) DEFAULT NULL,
  `status` enum('ACTIVA','CERRADA','SUSPENDIDA') NOT NULL,
  `client_id` binary(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `accounts`
--

INSERT INTO `accounts` (`id`, `account_number`, `account_type`, `balance`, `status`, `client_id`) VALUES
(0x0fd663b04eaa4743a2005c3bfa62b30c, '7733315160', 'AHORRO', 1200.00, 'ACTIVA', 0x3ed82fa73a5e48808fec4856a0de14c7),
(0x67f9caf945e347099bff61272a41ebe5, '3250032974', 'CORRIENTE', 0.00, 'CERRADA', 0x3ed82fa73a5e48808fec4856a0de14c7),
(0x87df241e757d4e248c338b001bb01216, '3094482784', 'AHORRO', 100.00, 'ACTIVA', 0xcb43b14f8899449da3b03fec58ac6a95),
(0xc7cc3ff4061a4fcd9114efbf78bc74c1, '5745750953', 'CORRIENTE', 0.00, 'CERRADA', 0x3ed82fa73a5e48808fec4856a0de14c7),
(0xe67a587cf9d241048d0d2ac551c39b66, '1778259963', 'CORRIENTE', 90.00, 'ACTIVA', 0x3ed82fa73a5e48808fec4856a0de14c7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `client`
--

CREATE TABLE `client` (
  `password` varchar(255) NOT NULL,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED') NOT NULL,
  `id` binary(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `client`
--

INSERT INTO `client` (`password`, `status`, `id`) VALUES
('$2a$10$08QHDzKZVElPx64k214lJ./S3qzFYyQMt8QBe5Umm5KrK83X6js7K', 'ACTIVE', 0x3ed82fa73a5e48808fec4856a0de14c7),
('$2a$10$ovUb/YdDysnrMsroy3JmduhQ73pU7nzpxQdbPRSVEM4eDOODf5bD.', 'INACTIVE', 0x57b42ab8aca14669b32a53b4242ea7c6),
('$2a$10$624IbaQxSbzpdO3oZq9c.e4NarHuIe3As8/lW08tqWzP8HxjLhSxi', 'ACTIVE', 0x6a0f22151f90438589c353edf29cc75d),
('$2a$10$v84RPwhgPqeroztz.tJPv.w5TVni/uguGQ57da9tMkMXJnYS0kffK', 'ACTIVE', 0xba6a9078dd2c4dd3861f15bb4250f725),
('$2a$10$dcD/XK.F.GhJYKMJNkPjU.W7HWTms6ekZsxF2B8HcH8OWJu4XxVoO', 'ACTIVE', 0xcb43b14f8899449da3b03fec58ac6a95),
('$2a$10$KFpkT7VCzde1zvcGV7ejFenJ9JfF3nHbwTURnq/LUx6tcA6zlTPKy', 'ACTIVE', 0xd15e5875ea5b4a879bf99ab843991140);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `person`
--

CREATE TABLE `person` (
  `id` binary(16) NOT NULL,
  `age` int(11) NOT NULL,
  `direction` varchar(255) NOT NULL,
  `identification_number` varchar(255) NOT NULL,
  `is_male` bit(1) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `person`
--

INSERT INTO `person` (`id`, `age`, `direction`, `identification_number`, `is_male`, `name`, `phone_number`) VALUES
(0x3ed82fa73a5e48808fec4856a0de14c7, 21, 'Amazonas y NNUU', '2350498463', b'1', 'Mariana Montalvo Perez', '0987654321'),
(0x57b42ab8aca14669b32a53b4242ea7c6, 18, 'Palmas', '111111111', b'1', 'Juan Perez', '0982321323'),
(0x6a0f22151f90438589c353edf29cc75d, 19, 'Otavalo sn y principal', '2100394521', b'1', 'Leyner Rivera', '0987654321'),
(0xba6a9078dd2c4dd3861f15bb4250f725, 21, 'Los Rosales', '2350497548', b'1', 'Justin Moreira', '0969712436'),
(0xcb43b14f8899449da3b03fec58ac6a95, 18, '13 junio y Equinoccial', '234985453', b'1', 'Juan Osorio', '098874587'),
(0xd15e5875ea5b4a879bf99ab843991140, 19, 'Otavalo sn y principal', '2350498765', b'1', 'Jose Lema', '098254785');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `transactions`
--

CREATE TABLE `transactions` (
  `id` binary(16) NOT NULL,
  `date` date NOT NULL,
  `type` enum('CREDITO','DEBITO') NOT NULL,
  `amount` decimal(38,2) NOT NULL,
  `account_id` binary(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `transactions`
--

INSERT INTO `transactions` (`id`, `date`, `type`, `amount`, `account_id`) VALUES
(0x00000000000000000000000000000000, '2026-03-01', 'DEBITO', 50.00, 0x0fd663b04eaa4743a2005c3bfa62b30c),
(0x0162e2f0569b4744b58dd61973b9b731, '2026-04-09', 'DEBITO', 50.00, 0x0fd663b04eaa4743a2005c3bfa62b30c),
(0x1230c72fb6a246ffa54af47c4fbc53b4, '2026-04-09', 'CREDITO', 100.00, 0xe67a587cf9d241048d0d2ac551c39b66),
(0x1493f011f4af48308f4b491063d18ee0, '2026-04-09', 'DEBITO', 500.00, 0x0fd663b04eaa4743a2005c3bfa62b30c),
(0x6ce224c085c748a5b13151cdbc8227f3, '2026-04-09', 'CREDITO', 100.00, 0x87df241e757d4e248c338b001bb01216),
(0x733cf3d23c744508a41eb6d822312995, '2026-04-09', 'DEBITO', 500.00, 0x0fd663b04eaa4743a2005c3bfa62b30c),
(0x8c1018d520674efca257f937eca11150, '2026-04-09', 'DEBITO', 10.00, 0xe67a587cf9d241048d0d2ac551c39b66),
(0xcbbeeb5a15c64a75963c052d0fa05c16, '2026-04-09', 'DEBITO', 50.00, 0x0fd663b04eaa4743a2005c3bfa62b30c),
(0xd69d78d42ed240fcac82927fb1d7cce5, '2026-04-09', 'DEBITO', 500.00, 0x0fd663b04eaa4743a2005c3bfa62b30c),
(0xdbc18bcdd3304719ae4061803a0d76f7, '2026-04-09', 'CREDITO', 100.00, 0x0fd663b04eaa4743a2005c3bfa62b30c),
(0xe064e90456ac43678b19d7cfef2e49e3, '2026-04-09', 'CREDITO', 1000.00, 0x0fd663b04eaa4743a2005c3bfa62b30c),
(0xee84dfa3999549c8a187d24b3b23e681, '2026-04-09', 'DEBITO', 500.00, 0x0fd663b04eaa4743a2005c3bfa62b30c),
(0xfb648b0054cc46b7a9363ba5cebcf0f9, '2026-04-09', 'CREDITO', 200.00, 0x0fd663b04eaa4743a2005c3bfa62b30c),
(0xfe97c62667654fabbe87f021e3bf0a22, '2026-04-09', 'CREDITO', 2000.00, 0x0fd663b04eaa4743a2005c3bfa62b30c);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK6kplolsdtr3slnvx97xsy2kc8` (`account_number`),
  ADD KEY `FK7sxph7s1d2n5r03esemaqnai8` (`client_id`);

--
-- Indices de la tabla `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `person`
--
ALTER TABLE `person`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK46v03hbccs0qbqsp6xussaam7` (`identification_number`);

--
-- Indices de la tabla `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK20w7wsg13u9srbq3bd7chfxdh` (`account_id`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `FK7sxph7s1d2n5r03esemaqnai8` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`);

--
-- Filtros para la tabla `client`
--
ALTER TABLE `client`
  ADD CONSTRAINT `FKr1e0j10i9v9i52l6tqfa69nj0` FOREIGN KEY (`id`) REFERENCES `person` (`id`);

--
-- Filtros para la tabla `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `FK20w7wsg13u9srbq3bd7chfxdh` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
