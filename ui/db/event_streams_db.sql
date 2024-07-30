CREATE TABLE `customers` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `email` varchar(255),
  `first_name` varchar(255),
  `last_name` varchar(255),
  `password` varchar(255),
  `phone_number` varchar(255),
  `address_line_1` varchar(255),
  `address_line_2` varchar(255),
  `city` varchar(255),
  `state` varchar(255),
  `zipcode` varchar(255),
  `ssn` varchar(255),
  `account_id` int,
  UNIQUE (email)
);

CREATE TABLE `accounts` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `open_date` date,
  `type` varchar(255)
);

ALTER TABLE `customers` ADD FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`);
