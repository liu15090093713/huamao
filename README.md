# huamao · 今晚花毛

「同城当晚现煮花生毛豆」的点餐业务项目，包含 Web 前端与 Java 后端两套工程。

## 目录结构

```
huamao/
├── frontend/    # Next.js 16 品牌与点单首页（响应式）
├── backend/     # Spring Boot 2.7.3 多模块外卖点餐后端
└── docs/        # 项目调研文档
```

## 前端 frontend/

品牌与点单首页，包含今日开锅 / 限量 / 预计送达信息、品牌故事、商品分类筛选、
购物车加减与金额计算、满 49 元免配送费提示、本地购物车持久化等。

```bash
cd frontend
npm install
npm run dev        # 开发（脚本依赖 bash，Windows 建议在 Git Bash 中执行）
npm run build      # 生产构建
```

要求 Node.js ≥ 22.13。

## 后端 backend/

基于苍穹外卖（sky-take-out）架构改造，技术栈 Spring Boot / MyBatis / MySQL 8 / Redis，
Maven 多模块（`sky-common` / `sky-pojo` / `sky-server`）。

1. 启动依赖环境（Redis 6379 + MySQL 3307）：双击 `start-env.cmd`
2. 初始化数据库：执行 `backend/sql/huasheng_maodou.sql`（库名 `huasheng_maodou`）
3. 构建并启动：`mvn clean package -DskipTests`，双击 `start-backend.cmd`

- 后端地址：http://localhost:8081
- 接口文档：http://localhost:8081/doc.html
- 管理员账号：admin / 123456

## 前后端联调

前端已接入后端真实接口，数据链路如下：

| 前端行为 | 调用接口 | 说明 |
| --- | --- | --- |
| 加载菜单 | `GET /user/category/list?type=1`、`GET /user/dish/list` | 公开只读接口，未登录可访问；失败时自动降级为内置示例菜单并提示 |
| 提交订单 | `POST /user/shoppingCart/clean` → `POST /user/shoppingCart/add` → `POST /user/addressBook` → `POST /user/order/submit` | 订单真实写入 `orders` / `order_detail`，购物车随后清空，不发起支付 |

### 关于登录

C 端正式登录依赖微信 `code2session`，本地没有 appid/appsecret 无法完成，
因此后端提供了一个**仅在 dev profile 生效**的联调登录端点：

```
POST /user/user/dev-login   → 返回与微信登录同结构的用户端 JWT
```

对应实现：`backend/sky-server/src/main/java/com/sky/controller/user/DevUserController.java`
（标注 `@Profile("dev")`，非 dev 环境不会加载）。前端 `lib/api.ts` 在缺少令牌时会自动调用它。

### 其他为联调做的改动

- `WebMvcConfiguration`：`/user/dish/list` 与 `/user/category/list` 加入 JWT 白名单（菜单属公开数据），
  并为 `http://localhost:*` / `http://127.0.0.1:*` 增加 CORS 规则。
- 前端 API 层集中在 `frontend/lib/api.ts`，接口地址由 `NEXT_PUBLIC_API_BASE` 配置
  （见 `frontend/.env.example`），默认 `http://localhost:8081`。
- 结算抽屉新增收货信息表单（收货人 / 手机号 / 详细地址），提交前做本地校验。

### 尚未覆盖

- 微信支付、退款、OSS 图片上传仍为占位实现，未联调。
- 后端菜品无图片字段，前端商品卡片用分类色块 + 文字替代。
- 套餐分类（`type=2`）与 `/user/setmeal/list` 未接入，页面仅展示菜品。

## 注意

- `backend/sky-server/src/main/resources/application-dev.yml` 中的微信支付、
  阿里云 OSS 配置均为**占位值**，真实密钥请通过环境变量注入，切勿提交到仓库。
- `application-dev.yml` 中数据库与 Redis 的 `123456` 仅为本地开发默认口令。
- 前端的开锅时间、配送半径、每日限量与故事内容均为方案示例，上线前需替换为真实经营信息。
- 服务端启动依赖 Redis 密码与配置一致（`application-dev.yml` 中为 `123456`），
  本地 Redis 需以 `--requirepass 123456` 启动，否则后端访问 Redis 会报 `ERR Client sent AUTH`。

