/*
    con este script creamos base de datos
    se asume que permite un solo correo y numero de telefono
    por contacto
*/

CREATE DATABASE telephonecontacts;

CREATE TABLE `telephonecontacts`.`contacts` ( `id` INT(11) NOT NULL AUTO_INCREMENT , 
`name` VARCHAR(50) NOT NULL ,
 `telephone` VARCHAR(50) NOT NULL , 
 `email` VARCHAR(30) NOT NULL , 
 `born` VARCHAR(15) NOT NULL , 
 `status` VARCHAR(20) NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB; 