/**
 * 后端接口封装（Spring Boot / sky-take-out 风格）
 *
 * 约定：
 * - 所有接口返回 { code, msg, data }，code === 1 表示成功
 * - 用户端需要登录态，令牌放在 `authentication` 请求头
 * - 菜单（分类 / 菜品）为公开接口，无需登录
 */

const API_BASE =
  (typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_API_BASE) ||
  "http://localhost:8081";

export { API_BASE };

const TOKEN_KEY = "huamao-user-token";
const ADDRESS_KEY = "huamao-address-id";

type Result<T> = { code: number; msg: string | null; data: T };

export type ApiCategory = {
  id: number;
  type: number;
  name: string;
  sort: number;
  status: number;
};

export type ApiDishFlavor = {
  id: number;
  dishId: number;
  name: string;
  value: string;
};

export type ApiDish = {
  id: number;
  name: string;
  categoryId: number;
  price: number;
  image?: string | null;
  description?: string | null;
  status?: number;
  categoryName?: string | null;
  flavors?: ApiDishFlavor[];
};

export type ApiAddress = {
  id: number;
  consignee: string;
  phone: string;
  detail: string;
  label?: string | null;
  isDefault?: number;
};

export type ApiOrderSubmitVO = {
  id: number;
  orderNumber: string;
  orderAmount: number;
  orderTime?: string;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function readToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function writeToken(token: string) {
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* 隐私模式下忽略 */
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init.headers as Record<string, string>) || {}),
  };
  const token = readToken();
  if (token) headers.authentication = token;

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  } catch {
    throw new ApiError(`无法连接后端（${API_BASE}），请确认服务已启动`, 0);
  }

  if (response.status === 401) {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
    throw new ApiError("登录态已失效，请刷新后重试", 401);
  }

  let payload: Result<T> | null = null;
  try {
    payload = (await response.json()) as Result<T>;
  } catch {
    throw new ApiError(`后端返回了非 JSON 响应（HTTP ${response.status}）`, response.status);
  }

  if (!response.ok) {
    throw new ApiError(payload?.msg || `请求失败（HTTP ${response.status}）`, response.status);
  }
  if (!payload || payload.code !== 1) {
    throw new ApiError(payload?.msg || "请求失败", response.status);
  }
  return payload.data;
}

/** 菜品分类（type=1 为菜品分类，type=2 为套餐分类） */
export async function fetchCategories(type = 1): Promise<ApiCategory[]> {
  const list = await request<ApiCategory[]>(`/user/category/list?type=${type}`);
  return (list || []).filter((item) => item.status === 1);
}

/** 起售中的菜品，不传 categoryId 则返回全部 */
export async function fetchDishes(categoryId?: number): Promise<ApiDish[]> {
  const query = categoryId ? `?categoryId=${categoryId}` : "";
  const list = await request<ApiDish[]>(`/user/dish/list${query}`);
  return list || [];
}

/**
 * 本地联调登录（免微信授权，仅后端 dev profile 提供）
 * 正式环境应替换为微信 code2session 登录
 */
export async function devLogin(): Promise<string> {
  const data = await request<{ id: number; openid: string; token: string }>(
    "/user/user/dev-login",
    { method: "POST" },
  );
  writeToken(data.token);
  return data.token;
}

export async function ensureUserToken(): Promise<string> {
  const cached = readToken();
  if (cached) return cached;
  return devLogin();
}

/** 商品加购：后端每次加 1 份，这里按数量循环调用 */
export async function addToBackendCart(dishId: number, quantity: number): Promise<void> {
  for (let i = 0; i < quantity; i += 1) {
    await request("/user/shoppingCart/add", {
      method: "POST",
      body: JSON.stringify({ dishId }),
    });
  }
}

export async function clearBackendCart(): Promise<void> {
  await request("/user/shoppingCart/clean", { method: "DELETE" });
}

/** 复用默认地址，没有则新建 */
export async function ensureAddress(input: {
  consignee: string;
  phone: string;
  detail: string;
}): Promise<number> {
  const list = await request<ApiAddress[]>("/user/addressBook/list");
  const matched = (list || []).find(
    (item) => item.phone === input.phone && item.detail === input.detail,
  );
  if (matched) return matched.id;

  await request("/user/addressBook", {
    method: "POST",
    body: JSON.stringify({
      consignee: input.consignee,
      phone: input.phone,
      sex: "1",
      detail: input.detail,
      label: "家",
      isDefault: (list || []).length ? 0 : 1,
    }),
  });

  const after = await request<ApiAddress[]>("/user/addressBook/list");
  const created = (after || [])
    .filter((item) => item.phone === input.phone && item.detail === input.detail)
    .pop();
  if (!created) throw new ApiError("地址保存成功但未能读取，请重试");
  try {
    window.localStorage.setItem(ADDRESS_KEY, String(created.id));
  } catch {
    /* ignore */
  }
  return created.id;
}

function formatDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

/** 提交订单：真实写入 orders / order_detail，不发起支付 */
export async function submitOrder(input: {
  addressBookId: number;
  amount: number;
  remark?: string;
  packAmount?: number;
}): Promise<ApiOrderSubmitVO> {
  const estimated = new Date(Date.now() + 40 * 60 * 1000);
  return request<ApiOrderSubmitVO>("/user/order/submit", {
    method: "POST",
    body: JSON.stringify({
      addressBookId: input.addressBookId,
      payMethod: 1,
      remark: input.remark || "",
      estimatedDeliveryTime: formatDateTime(estimated),
      deliveryStatus: 1,
      tablewareNumber: 0,
      tablewareStatus: 1,
      packAmount: input.packAmount ?? 0,
      amount: input.amount,
    }),
  });
}
