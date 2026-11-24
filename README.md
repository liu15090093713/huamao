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

## 注意

- `backend/sky-server/src/main/resources/application-dev.yml` 中的微信支付、
  阿里云 OSS 配置均为**占位值**，真实密钥请通过环境变量注入，切勿提交到仓库。
- `application-dev.yml` 中数据库与 Redis 的 `123456` 仅为本地开发默认口令。
- 前端的开锅时间、配送半径、每日限量、商品价格与故事内容均为方案示例，
  上线前需替换为真实经营信息；「提交预订单」目前为前端演示，不发起真实支付。
- 前后端接口尚未联调：前端可在 `frontend/app/page.tsx` 的 `submitDemoOrder()`
  中接入后端下单接口，并将 `products` 替换为菜品接口返回的数据。
