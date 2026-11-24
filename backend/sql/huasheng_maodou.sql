-- ============================================================
-- 花生毛豆外卖点餐系统 数据库初始化脚本
-- 表结构与 sky-take-out（苍穹外卖）一致
-- 适用 MySQL 5.7+ / 8.x
-- ============================================================

CREATE DATABASE IF NOT EXISTS huasheng_maodou DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE huasheng_maodou;

DROP TABLE IF EXISTS order_detail;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS shopping_cart;
DROP TABLE IF EXISTS address_book;
DROP TABLE IF EXISTS setmeal_dish;
DROP TABLE IF EXISTS setmeal;
DROP TABLE IF EXISTS dish_flavor;
DROP TABLE IF EXISTS dish;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS employee;

-- 员工表
CREATE TABLE employee
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    name        VARCHAR(32)  NOT NULL COMMENT '姓名',
    username    VARCHAR(32)  NOT NULL COMMENT '用户名',
    password    VARCHAR(64)  NOT NULL COMMENT '密码',
    phone       VARCHAR(11)  NOT NULL COMMENT '手机号',
    sex         VARCHAR(2)   NOT NULL COMMENT '性别',
    id_number   VARCHAR(18)  NOT NULL COMMENT '身份证号',
    status      INT          NOT NULL DEFAULT 1 COMMENT '账号状态 1正常 0锁定',
    create_time DATETIME     NOT NULL COMMENT '创建时间',
    update_time DATETIME     NOT NULL COMMENT '更新时间',
    create_user BIGINT       NOT NULL COMMENT '创建人',
    update_user BIGINT       NOT NULL COMMENT '修改人',
    UNIQUE KEY idx_username (username)
) ENGINE = InnoDB COMMENT = '员工信息表';

-- 分类表
CREATE TABLE category
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    type        INT      NOT NULL COMMENT '类型 1商品分类 2套餐分类',
    name        VARCHAR(32) NOT NULL COMMENT '分类名称',
    sort        INT      NOT NULL DEFAULT 0 COMMENT '顺序',
    status      INT      NOT NULL DEFAULT 0 COMMENT '分类状态 0禁用 1启用',
    create_time DATETIME NOT NULL COMMENT '创建时间',
    update_time DATETIME NOT NULL COMMENT '更新时间',
    create_user BIGINT   NOT NULL COMMENT '创建人',
    update_user BIGINT   NOT NULL COMMENT '修改人'
) ENGINE = InnoDB COMMENT = '商品及套餐分类';

-- 商品表
CREATE TABLE dish
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    name        VARCHAR(32)   NOT NULL COMMENT '商品名称',
    category_id BIGINT        NOT NULL COMMENT '分类id',
    price       DECIMAL(10, 2) NOT NULL COMMENT '价格',
    image       VARCHAR(255)  NOT NULL COMMENT '图片',
    description VARCHAR(255)  NOT NULL COMMENT '描述信息',
    status      INT           NOT NULL DEFAULT 1 COMMENT '0停售 1起售',
    create_time DATETIME      NOT NULL COMMENT '创建时间',
    update_time DATETIME      NOT NULL COMMENT '更新时间',
    create_user BIGINT        NOT NULL COMMENT '创建人',
    update_user BIGINT        NOT NULL COMMENT '修改人'
) ENGINE = InnoDB COMMENT = '商品表';

-- 商品口味表
CREATE TABLE dish_flavor
(
    id      BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    dish_id BIGINT       NOT NULL COMMENT '商品id',
    name    VARCHAR(32)  NOT NULL COMMENT '口味名称',
    value   VARCHAR(255) NOT NULL COMMENT '口味数据list'
) ENGINE = InnoDB COMMENT = '商品口味关系表';

-- 套餐表
CREATE TABLE setmeal
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    category_id BIGINT         NOT NULL COMMENT '分类id',
    name        VARCHAR(32)    NOT NULL COMMENT '套餐名称',
    price       DECIMAL(10, 2) NOT NULL COMMENT '套餐价格',
    status      INT            NOT NULL DEFAULT 1 COMMENT '0停用 1启用',
    description VARCHAR(255)   NOT NULL COMMENT '描述信息',
    image       VARCHAR(255)   NOT NULL COMMENT '图片',
    create_time DATETIME       NOT NULL COMMENT '创建时间',
    update_time DATETIME       NOT NULL COMMENT '更新时间',
    create_user BIGINT         NOT NULL COMMENT '创建人',
    update_user BIGINT         NOT NULL COMMENT '修改人'
) ENGINE = InnoDB COMMENT = '套餐表';

-- 套餐商品关系表
CREATE TABLE setmeal_dish
(
    id        BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    setmeal_id BIGINT         NOT NULL COMMENT '套餐id',
    dish_id    BIGINT         NOT NULL COMMENT '商品id',
    name       VARCHAR(32)    NOT NULL COMMENT '商品名称(冗余)',
    price      DECIMAL(10, 2) NOT NULL COMMENT '商品原价(冗余)',
    copies     INT            NOT NULL COMMENT '份数'
) ENGINE = InnoDB COMMENT = '套餐商品关系表';

-- 用户表
CREATE TABLE user
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    openid      VARCHAR(45)  NOT NULL COMMENT '微信用户唯一标识',
    name        VARCHAR(32)  NULL COMMENT '姓名',
    phone       VARCHAR(11)  NULL COMMENT '手机号',
    sex         VARCHAR(2)   NULL COMMENT '性别 0女 1男',
    id_number   VARCHAR(18)  NULL COMMENT '身份证号',
    avatar      VARCHAR(500) NULL COMMENT '头像',
    create_time DATETIME     NOT NULL COMMENT '注册时间',
    UNIQUE KEY idx_openid (openid)
) ENGINE = InnoDB COMMENT = '用户表';

-- 地址簿表
CREATE TABLE address_book
(
    id            BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    user_id       BIGINT       NOT NULL COMMENT '用户id',
    consignee     VARCHAR(50)  NOT NULL COMMENT '收货人',
    sex           VARCHAR(2)   NOT NULL COMMENT '性别 0女 1男',
    phone         VARCHAR(11)  NOT NULL COMMENT '手机号',
    province_code VARCHAR(12)  NULL COMMENT '省级区划编号',
    province_name VARCHAR(32)  NULL COMMENT '省级名称',
    city_code     VARCHAR(12)  NULL COMMENT '市级区划编号',
    city_name     VARCHAR(32)  NULL COMMENT '市级名称',
    district_code VARCHAR(12)  NULL COMMENT '区级区划编号',
    district_name VARCHAR(32)  NULL COMMENT '区级名称',
    detail        VARCHAR(200) NULL COMMENT '详细地址',
    label         VARCHAR(100) NULL COMMENT '标签',
    is_default    TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '是否默认 0否 1是',
    KEY idx_user_id (user_id)
) ENGINE = InnoDB COMMENT = '地址簿';

-- 购物车表
CREATE TABLE shopping_cart
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    name        VARCHAR(32)    NOT NULL COMMENT '名称',
    image       VARCHAR(255)   NULL COMMENT '图片',
    user_id     BIGINT         NOT NULL COMMENT '用户id',
    dish_id     BIGINT         NULL COMMENT '商品id',
    setmeal_id  BIGINT         NULL COMMENT '套餐id',
    dish_flavor VARCHAR(50)    NULL COMMENT '口味',
    number      INT            NOT NULL COMMENT '数量',
    amount      DECIMAL(10, 2) NOT NULL COMMENT '金额',
    create_time DATETIME       NOT NULL COMMENT '创建时间'
) ENGINE = InnoDB COMMENT = '购物车表';

-- 订单表
CREATE TABLE orders
(
    id                     BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    number                 VARCHAR(50)    NULL COMMENT '订单号',
    status                 INT            NOT NULL DEFAULT 1 COMMENT '订单状态 1待付款 2待接单 3已接单 4派送中 5已完成 6已取消 7退款',
    user_id                BIGINT         NOT NULL COMMENT '下单用户id',
    address_book_id        BIGINT         NOT NULL COMMENT '地址id',
    order_time             DATETIME       NOT NULL COMMENT '下单时间',
    checkout_time          DATETIME       NULL COMMENT '结账时间',
    pay_method             INT            NOT NULL DEFAULT 1 COMMENT '支付方式 1微信 2支付宝',
    pay_status             TINYINT        NOT NULL DEFAULT 0 COMMENT '支付状态 0未支付 1已支付 2退款',
    amount                 DECIMAL(10, 2) NOT NULL COMMENT '实收金额',
    remark                 VARCHAR(100)   NULL COMMENT '备注',
    phone                  VARCHAR(11)    NULL COMMENT '手机号',
    address                VARCHAR(255)   NULL COMMENT '地址',
    user_name              VARCHAR(32)    NULL COMMENT '用户名',
    consignee              VARCHAR(32)    NULL COMMENT '收货人',
    cancel_reason          VARCHAR(255)   NULL COMMENT '订单取消原因',
    rejection_reason       VARCHAR(255)   NULL COMMENT '订单拒绝原因',
    cancel_time            DATETIME       NULL COMMENT '订单取消时间',
    estimated_delivery_time DATETIME      NULL COMMENT '预计送达时间',
    delivery_status        TINYINT        NOT NULL DEFAULT 1 COMMENT '配送状态 1立即送出 0选择具体时间',
    delivery_time          DATETIME       NULL COMMENT '送达时间',
    pack_amount            INT            NOT NULL DEFAULT 0 COMMENT '打包费',
    tableware_number       INT            NOT NULL DEFAULT 0 COMMENT '餐具数量',
    tableware_status       TINYINT        NOT NULL DEFAULT 1 COMMENT '餐具数量状态 1按餐量提供 0选择具体数量',
    KEY idx_user_id (user_id),
    KEY idx_order_time (order_time)
) ENGINE = InnoDB COMMENT = '订单表';

-- 订单明细表
CREATE TABLE order_detail
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    name        VARCHAR(32)    NOT NULL COMMENT '名称',
    image       VARCHAR(255)   NULL COMMENT '图片',
    order_id    BIGINT         NOT NULL COMMENT '订单id',
    dish_id     BIGINT         NULL COMMENT '商品id',
    setmeal_id  BIGINT         NULL COMMENT '套餐id',
    dish_flavor VARCHAR(50)    NULL COMMENT '口味',
    number      INT            NOT NULL COMMENT '数量',
    amount      DECIMAL(10, 2) NOT NULL COMMENT '金额',
    KEY idx_order_id (order_id)
) ENGINE = InnoDB COMMENT = '订单明细表';

-- ============================================================
-- 初始数据
-- ============================================================

-- 管理员账号 admin / 123456 (密码为 MD5)
INSERT INTO employee (id, name, username, password, phone, sex, id_number, status, create_time, update_time, create_user, update_user)
VALUES (1, '管理员', 'admin', 'e10adc3949ba59abbe56e057f20f883e', '13812312345', '1', '110101199001010047', 1,
        NOW(), NOW(), 1, 1);

-- 商品分类
INSERT INTO category (id, type, name, sort, status, create_time, update_time, create_user, update_user) VALUES
    (1, 1, '水煮花生', 1, 1, NOW(), NOW(), 1, 1),
    (2, 1, '水煮毛豆', 2, 1, NOW(), NOW(), 1, 1),
    (3, 1, '卤味熟食', 3, 1, NOW(), NOW(), 1, 1),
    (4, 1, '礼盒装', 4, 1, NOW(), NOW(), 1, 1),
    (5, 2, '组合套餐', 5, 1, NOW(), NOW(), 1, 1);

-- 商品
INSERT INTO dish (id, name, category_id, price, image, description, status, create_time, update_time, create_user, update_user) VALUES
    (1, '五香水煮花生', 1, 12.00, '', '精选当季新花生，五香入味，颗粒饱满', 1, NOW(), NOW(), 1, 1),
    (2, '麻辣水煮花生', 1, 14.00, '', '麻辣鲜香，追剧下酒两相宜', 1, NOW(), NOW(), 1, 1),
    (3, '盐水花生', 1, 10.00, '', '原味盐水煮制，回味清甜', 1, NOW(), NOW(), 1, 1),
    (4, '原味水煮毛豆', 2, 10.00, '', '鲜嫩毛豆，清香爽口', 1, NOW(), NOW(), 1, 1),
    (5, '香辣毛豆', 2, 12.00, '', '香辣入味，夜市同款', 1, NOW(), NOW(), 1, 1),
    (6, '蒜香毛豆', 2, 12.00, '', '蒜香浓郁，越吃越香', 1, NOW(), NOW(), 1, 1),
    (7, '花生毛豆双拼', 3, 15.00, '', '一份价格两种美味', 1, NOW(), NOW(), 1, 1),
    (8, '家庭分享礼盒', 4, 45.00, '', '花生+毛豆+双拼，家庭聚餐必备', 1, NOW(), NOW(), 1, 1),
    (9, '宴客礼盒装', 4, 68.00, '', '高端礼盒，走亲访友有面子', 1, NOW(), NOW(), 1, 1);

-- 商品口味
INSERT INTO dish_flavor (id, dish_id, name, value) VALUES
    (1, 1, '规格', '[\"1斤装\",\"2斤装\",\"5斤装\"]'),
    (2, 2, '辣度', '[\"微辣\",\"中辣\",\"特辣\"]'),
    (3, 4, '规格', '[\"1斤装\",\"2斤装\",\"5斤装\"]'),
    (4, 5, '辣度', '[\"微辣\",\"中辣\",\"特辣\"]');

-- 套餐
INSERT INTO setmeal (id, category_id, name, price, status, description, image, create_time, update_time, create_user, update_user) VALUES
    (1, 5, '追剧小食套餐', 25.00, 1, '五香花生1斤 + 原味毛豆1斤', '', NOW(), NOW(), 1, 1),
    (2, 5, '家庭聚会套餐', 58.00, 1, '花生毛豆双拼2份 + 香辣毛豆1斤 + 家庭分享礼盒1份', '', NOW(), NOW(), 1, 1);

-- 套餐-商品关系
INSERT INTO setmeal_dish (id, setmeal_id, dish_id, name, price, copies) VALUES
    (1, 1, 1, '五香水煮花生', 12.00, 1),
    (2, 1, 4, '原味水煮毛豆', 10.00, 1),
    (3, 2, 7, '花生毛豆双拼', 15.00, 2),
    (4, 2, 5, '香辣毛豆', 12.00, 1),
    (5, 2, 8, '家庭分享礼盒', 45.00, 1);
