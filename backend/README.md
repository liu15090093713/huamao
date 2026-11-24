# 花生毛豆外卖点餐系统 (huasheng-maodou-takeout)

基于苍穹外卖（sky-take-out）架构改造的「水煮花生 / 水煮毛豆」在线点餐系统，
面向家庭作坊水煮花生毛豆业务的线上化需求：商品展示、购物车、下单、订单管理、
营业数据统计等。

## 技术栈

- Spring Boot 2.7.3 / MyBatis / MySQL 8 / Redis / knife4j(Swagger)
- Java 8、Maven 多模块（sky-common / sky-pojo / sky-server）

## 本地部署

1. 启动依赖环境（Redis 6379 + MySQL 3307，复用 sky-take-out 的运行时）：
   双击 start-env.cmd
2. 初始化数据库：在 MySQL 中执行 sql/huasheng_maodou.sql
   （root/123456，127.0.0.1:3307）
3. 构建并启动后端：
   mvn clean package -DskipTests
   双击 start-backend.cmd

- 后端地址：http://localhost:8081
- 接口文档：http://localhost:8081/doc.html
- 管理员账号：admin / 123456

## 已初始化商品（示例数据）

- 水煮花生：五香水煮花生、麻辣水煮花生、盐水花生
- 水煮毛豆：原味水煮毛豆、香辣毛豆、蒜香毛豆
- 卤味熟食：花生毛豆双拼
- 礼盒装：家庭分享礼盒、宴客礼盒装
- 组合套餐：追剧小食套餐、家庭聚会套餐

## 说明

- 阿里云 OSS 与微信支付为占位配置，图片上传、支付/退款接口需自行补充真实密钥。
- 数据库：huasheng_maodou（3307 实例，Redis 使用 11 号库，与 sky-take-out 隔离）。
