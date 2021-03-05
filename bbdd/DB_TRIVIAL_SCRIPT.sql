-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema TRIVIAL_DB
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema TRIVIAL_DB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `TRIVIAL_DB` DEFAULT CHARACTER SET utf8 ;
USE `TRIVIAL_DB` ;

-- -----------------------------------------------------
-- Table `TRIVIAL_DB`.`Usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `TRIVIAL_DB`.`Usuario` (
  `email` INT NOT NULL,
  `nickname` VARCHAR(40) NOT NULL,
  `monedas` INT UNSIGNED NOT NULL,
  `puntos_totales` INT UNSIGNED NOT NULL,
  `contraseña` TEXT(5000) NOT NULL,
  PRIMARY KEY (`email`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TRIVIAL_DB`.`Partida`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `TRIVIAL_DB`.`Partida` (
  `idPartida` INT NOT NULL AUTO_INCREMENT,
  `fecha` DATE NOT NULL,
  `numJugadores` TINYINT(1) UNSIGNED NOT NULL,
  `rondas` SMALLINT(2) UNSIGNED NOT NULL,
  `ganador` INT NOT NULL,
  PRIMARY KEY (`idPartida`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TRIVIAL_DB`.`Juega`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `TRIVIAL_DB`.`Juega` (
  `Usuario_email` INT NOT NULL,
  `Partida_idPartida` INT NOT NULL,
  `puntuacion` INT(3) NOT NULL,
  PRIMARY KEY (`Usuario_email`, `Partida_idPartida`),
  INDEX `fk_Usuario_has_Partida_Partida1_idx` (`Partida_idPartida` ASC) VISIBLE,
  INDEX `fk_Usuario_has_Partida_Usuario_idx` (`Usuario_email` ASC) VISIBLE,
  CONSTRAINT `fk_Usuario_has_Partida_Usuario`
    FOREIGN KEY (`Usuario_email`)
    REFERENCES `TRIVIAL_DB`.`Usuario` (`email`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Usuario_has_Partida_Partida1`
    FOREIGN KEY (`Partida_idPartida`)
    REFERENCES `TRIVIAL_DB`.`Partida` (`idPartida`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TRIVIAL_DB`.`Item`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `TRIVIAL_DB`.`Item` (
  `idItem` INT NOT NULL AUTO_INCREMENT,
  `Precio` INT(5) UNSIGNED NOT NULL,
  `Nombre` VARCHAR(45) NOT NULL,
  `esAO` TINYINT NOT NULL,
  `Tipo` VARCHAR(45) NULL,
  `Color` VARCHAR(25) NULL,
  `Imagen` MEDIUMBLOB NULL,
  PRIMARY KEY (`idItem`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TRIVIAL_DB`.`Tiene`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `TRIVIAL_DB`.`Tiene` (
  `Usuario_email` INT NOT NULL,
  `Item_idItem` INT NOT NULL,
  `equipado` TINYINT NOT NULL,
  PRIMARY KEY (`Usuario_email`, `Item_idItem`),
  INDEX `fk_Usuario_has_Item_Item1_idx` (`Item_idItem` ASC) VISIBLE,
  INDEX `fk_Usuario_has_Item_Usuario1_idx` (`Usuario_email` ASC) VISIBLE,
  CONSTRAINT `fk_Usuario_has_Item_Usuario1`
    FOREIGN KEY (`Usuario_email`)
    REFERENCES `TRIVIAL_DB`.`Usuario` (`email`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Usuario_has_Item_Item1`
    FOREIGN KEY (`Item_idItem`)
    REFERENCES `TRIVIAL_DB`.`Item` (`idItem`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TRIVIAL_DB`.`Categoría`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `TRIVIAL_DB`.`Categoría` (
  `nombre` VARCHAR(25) NOT NULL,
  `color` VARCHAR(12) NOT NULL,
  PRIMARY KEY (`nombre`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TRIVIAL_DB`.`Pregunta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `TRIVIAL_DB`.`Pregunta` (
  `idPregunta` INT NOT NULL AUTO_INCREMENT,
  `incorrecta1` VARCHAR(200) NOT NULL,
  `incorrecta2` VARCHAR(200) NOT NULL,
  `incorrecta3` VARCHAR(200) NOT NULL,
  `correcta` VARCHAR(200) NOT NULL,
  `Partida_idPartida` INT NOT NULL,
  `Categoría_nombre` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`idPregunta`, `Categoría_nombre`),
  INDEX `fk_Pregunta_Partida1_idx` (`Partida_idPartida` ASC) VISIBLE,
  INDEX `fk_Pregunta_Categoría1_idx` (`Categoría_nombre` ASC) VISIBLE,
  CONSTRAINT `fk_Pregunta_Partida1`
    FOREIGN KEY (`Partida_idPartida`)
    REFERENCES `TRIVIAL_DB`.`Partida` (`idPartida`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Pregunta_Categoría1`
    FOREIGN KEY (`Categoría_nombre`)
    REFERENCES `TRIVIAL_DB`.`Categoría` (`nombre`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `TRIVIAL_DB`.`category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `TRIVIAL_DB`.`category` (
  `category_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`category_id`));


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
