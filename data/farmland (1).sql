-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 02, 2025 at 07:03 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `farmland`
--

-- --------------------------------------------------------

--
-- Table structure for table `plant`
--

CREATE TABLE `plant` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `subname` varchar(255) NOT NULL,
  `duration` int NOT NULL,
  `img` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `plant`
--

INSERT INTO `plant` (`id`, `name`, `subname`, `duration`, `img`) VALUES
(1, 'Cabai', 'Buahnya dapat digolongkan sebagai sayuran, rempah, atau bumbu, tergantung bagaimana pemanfaatannya.', 150, '/img/plant/cabai.jpg'),
(2, 'Bayam', 'Tumbuhan yang biasa ditanam untuk dikonsumsi daunnya sebagai sayuran hijau.', 30, '/img/plant/bayam.png'),
(3, 'Pakcoy', 'Sayuran ini mudah tumbuh di dataran rendah maupun dataran tinggi.', 45, '/img/plant/pakcoy.png'),
(4, 'Kangkung', 'Jenis sayur-sayuran dan dibudidayakan sebagai tanaman hortikultura', 30, '/img/plant/kangkung.png'),
(5, 'Daun Bawang', 'Sayuran dari kelompok bawang yang banyak digunakan dalam masakan.', 70, '/img/plant/daunbawang.png');

-- --------------------------------------------------------

--
-- Table structure for table `plant_task`
--

CREATE TABLE `plant_task` (
  `id` int NOT NULL,
  `plant_id` int NOT NULL,
  `day` int NOT NULL,
  `task` varchar(1024) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `plant_task`
--

INSERT INTO `plant_task` (`id`, `plant_id`, `day`, `task`) VALUES
(1, 1, 21, 'Pindahkan Tanaman Cabai Ke Pot Yang Lebih Besar'),
(2, 1, 35, 'Berikan Pupuk Ke Tanaman'),
(3, 1, 63, 'Berikan Pupuk Ke Tanaman'),
(4, 1, 91, 'Berikan Pupuk Ke Tanaman'),
(5, 1, 119, 'Berikan Pupuk Ke Tanaman'),
(6, 1, 147, 'Berikan Pupuk Ke Tanaman'),
(7, 2, 0, 'Semai Pot Dengan 5 Biji Tanaman Bayam'),
(8, 2, 7, 'Pindahkan Tanaman Bayam Ke Pot Yang Lebih Besar'),
(9, 2, 14, 'Berikan Pupuk Ke Tanaman'),
(10, 2, 21, 'Berikan Pupuk Ke Tanaman'),
(11, 2, 28, 'Berikan Pupuk Ke Tanaman'),
(12, 3, 0, 'Semai 1 atau 2 Biji Pakcoy Ke Dalam Pot'),
(13, 3, 14, 'Pindahkan Pakcoy ke Pot Yang Lebih Besar'),
(14, 3, 28, 'Berikan Pupuk Ke Tanaman'),
(15, 4, 0, 'Semai Biji Kangkung Ke Dalam Pot Yang besar untuk Meminimalisir Pergerakan Akar'),
(16, 4, 28, 'Berikan Pupuk Ke Tanaman'),
(17, 5, 0, 'Semai Biji Daun Bawang Ke Dalam Pot'),
(18, 5, 14, 'Pindahkan Daun Bawang Ke Pot Yang Lebih Besar'),
(19, 5, 14, 'Jika Ada Daun Bawang Yang kering Bersihkan'),
(20, 5, 21, 'Berikan Pupuk Ke Tanaman'),
(21, 5, 28, 'Jika Ada Daun Bawang Yang kering Bersihkan'),
(22, 5, 35, 'Jika Ada Daun Bawang Yang kering Bersihkan'),
(23, 5, 35, 'Berikan Pupuk Ke Tanaman'),
(24, 5, 42, 'Jika Ada Daun Bawang Yang kering Bersihkan'),
(25, 5, 49, 'Jika Ada Daun Bawang Yang kering Bersihkan'),
(26, 5, 49, 'Berikan Pupuk Ke Tanaman'),
(27, 5, 56, 'Jika Ada Daun Bawang Yang kering Bersihkan'),
(28, 5, 63, 'Jika Ada Daun Bawang Yang kering Bersihkan'),
(29, 5, 63, 'Berikan Pupuk Ke Tanaman'),
(30, 5, 70, 'Tanaman Sudah Siap Di Panen, Jangan Potong Hingga Akarnya Cukup Daunnya Agar Dapat Dipanen Tiap Bulannya'),
(31, 5, 70, 'Jangan Lupa Siram Tanamannya Setiap Hari Dan Pupuk 2 Minggu Sekali');

-- --------------------------------------------------------

--
-- Table structure for table `user_plant`
--

CREATE TABLE `user_plant` (
  `id` int NOT NULL,
  `plant_id` int NOT NULL,
  `time` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_plant`
--

INSERT INTO `user_plant` (`id`, `plant_id`, `time`) VALUES
(36, 1, 23);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `plant`
--
ALTER TABLE `plant`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `plant_task`
--
ALTER TABLE `plant_task`
  ADD PRIMARY KEY (`id`),
  ADD KEY `plant_task_ibfk_1` (`plant_id`);

--
-- Indexes for table `user_plant`
--
ALTER TABLE `user_plant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `plant_task_ibfk_1` (`plant_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `plant`
--
ALTER TABLE `plant`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `plant_task`
--
ALTER TABLE `plant_task`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `user_plant`
--
ALTER TABLE `user_plant`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `plant_task`
--
ALTER TABLE `plant_task`
  ADD CONSTRAINT `plant_task_ibfk_1` FOREIGN KEY (`plant_id`) REFERENCES `plant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_plant`
--
ALTER TABLE `user_plant`
  ADD CONSTRAINT `user_plant_ibfk_1` FOREIGN KEY (`plant_id`) REFERENCES `plant` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
