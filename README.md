# 豆米婚礼纪念网站

旧版的豆米婚礼纪念网站是在2015年开发的，那会使用了`Sailjs`作为后端框架，以及`jquery`+`bootstrap`的前端组合。

考虑到用的`Sailjs`目前已经很少用了，于是这次直接将其改造成`Nest.js`，并优化修复了一些问题，前端方面没打算修改，继续用着之前
的那些古老的工具包。

整个项目作为实验性质，因此用了一些比较新的库：

* drizzle：对接Mysql数据库（试试这个新的orm仓库，体验下来，类型上和开发上还不错，就是有个时间戳的问题，比较麻烦）
* winston：用于做日志打印
* express-xss-sanitizer：防止XSS；
* awesome-js：做敏感词过滤，杜绝输入任何敏感词汇

## 开发

* 先安装包：`pnpm i`

* 初始化本地MYSQL数据库；

```mysql
create database douMiWedding CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

use mysql;

CREATE USER 'test'@'%' IDENTIFIED BY 'test'; 

GRANT ALL ON douMiWedding.* TO 'test123'@'%';

FLUSH PRIVILEGES;

CREATE TABLE `Blessing` ( `id` serial AUTO_INCREMENT NOT NULL, `nickname` varchar(128) DEFAULT '匿名用户', `advice` varchar(512), `blessing` varchar(512), `createDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3), CONSTRAINT `Blessing_id` PRIMARY KEY(`id`), CONSTRAINT `Blessing_nickname_unique` UNIQUE(`nickname`) );
```

> 如果schema.ts写好之后，可以借助drizzle的工具生成对应的sql：`./node_modules/.bin/drizzle-kit generate:mysql`

* 启动：`pnpm start:dev`;

* 打开浏览器：`http://localhost:3000`；

## 开发遇到的问题

* [x] `ejs`使用了layout的功能，最后使用`express-ejs-layouts`解决了问题，这个包默认会在`views`目录下找`layout`文件，所以不用像网上说的那样还需要设置`app.use`。注意这个包只能使用`require`引入，否则会报错；
* [x] `drizzel`的时间戳设置问题，我如果在createdAt使用mysql的`default(CURRENT_TIMESTAMP)`，会设置进去包含时区的时间戳，但是读回来的时候确实UTC的，导致时间多了8小时，暂时没找到解法，目前我自己强制传`new Date`过去

## 部署

* 全局安装pm2：

```shell
pm2 start --name doumiwedding pnpm -- start:prod
```

> 部署相关文章参考博客：

## 待办

* [x] 暂无；
