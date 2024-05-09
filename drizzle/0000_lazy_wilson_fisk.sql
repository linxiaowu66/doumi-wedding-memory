CREATE TABLE `Blessing` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`nickname` varchar(128) DEFAULT '匿名用户',
	`advice` varchar(512),
	`blessing` varchar(512),
	`createDate` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `Blessing_id` PRIMARY KEY(`id`),
	CONSTRAINT `Blessing_nickname_unique` UNIQUE(`nickname`)
);
