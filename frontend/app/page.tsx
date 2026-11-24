"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: "今晚必点" | "花生" | "毛豆";
  price: number;
  original?: number;
  weight: string;
  serves: string;
  note: string;
  badge?: string;
  tone: string;
  icon: string;
};

const products: Product[] = [
  { id: 1, name: "新客花毛双拼", category: "今晚必点", price: 29.9, original: 36, weight: "花生250g + 毛豆250g", serves: "1–2人", note: "一次吃到两种鲜，口味可选", badge: "首单推荐", tone: "sun", icon: "双" },
  { id: 2, name: "一家人分享盆", category: "今晚必点", price: 49.9, original: 58, weight: "花生500g + 毛豆500g", serves: "3–4人", note: "一家人围坐，刚好一大盆", badge: "本店销冠", tone: "leaf", icon: "家" },
  { id: 3, name: "朋友局畅吃盆", category: "今晚必点", price: 69.9, original: 82, weight: "三味组合1500g", serves: "5–6人", note: "看球、喝酒、朋友聚会不冷场", badge: "聚会装", tone: "chili", icon: "聚" },
  { id: 4, name: "五香水煮花生", category: "花生", price: 14.9, weight: "500g", serves: "1–2人", note: "八角桂皮慢煮，绵糯入味", tone: "peanut", icon: "香" },
  { id: 5, name: "麻辣水煮花生", category: "花生", price: 16.9, weight: "500g", serves: "1–2人", note: "香麻在前，回辣在后", tone: "chili", icon: "辣" },
  { id: 6, name: "盐水脆嫩毛豆", category: "毛豆", price: 12.9, weight: "500g", serves: "1–2人", note: "清香微咸，保留豆子的甜", tone: "leaf", icon: "鲜" },
  { id: 7, name: "蒜香毛豆", category: "毛豆", price: 14.9, weight: "500g", serves: "1–2人", note: "蒜香浓郁，越剥越上瘾", tone: "jade", icon: "蒜" },
];

const categories = ["全部", "今晚必点", "花生", "毛豆"] as const;

function money(value: number) {
  return value.toFixed(value % 1 === 0 ? 0 : 1);
}

export default function Home() {
  const [category, setCategory] = useState<(typeof categories)[number]>("全部");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem("huamao-cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("huamao-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visible = products.filter((item) => category === "全部" || item.category === category);
  const cartItems = useMemo(() => products.filter((item) => cart[item.id]).map((item) => ({ ...item, quantity: cart[item.id] })), [cart]);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal >= 49 || subtotal === 0 ? 0 : 5;

  function add(id: number) {
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
    setToast("已放进今晚这一锅");
  }

  function change(id: number, delta: number) {
    setCart((current) => {
      const next = Math.max(0, (current[id] || 0) + delta);
      const updated = { ...current, [id]: next };
      if (!next) delete updated[id];
      return updated;
    });
  }

  function jumpToMenu() {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  }

  function submitDemoOrder() {
    if (!cartCount) return;
    setCartOpen(false);
    setToast("预订单已生成 · 演示版本");
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="今晚花毛首页">
          <span className="brand-mark">花毛</span>
          <span><strong>今晚花毛</strong><small>现煮 · 同城送</small></span>
        </a>
        <nav aria-label="主导航"><a href="#menu">今晚菜单</a><a href="#story">我们这一锅</a><a href="#promise">鲜煮承诺</a></nav>
        <div className="header-actions">
          <span className="live-pill"><i /> 今日营业中</span>
          <button className="cart-button" onClick={() => setCartOpen(true)}>今晚这一锅{cartCount > 0 && <b>{cartCount}</b>}</button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-photo" aria-hidden="true" /><div className="hero-scrim" />
        <div className="hero-content">
          <p className="eyebrow"><span>今日鲜煮</span> 第一锅 17:30 出锅</p>
          <h1>今晚这一锅，<br /><em>刚刚好。</em></h1>
          <p className="hero-copy">花生一颗颗挑，毛豆一遍遍洗。当天煮、当天送，<br />把一盆热气送到附近人的夜晚。</p>
          <div className="hero-actions">
            <button className="primary" onClick={jumpToMenu}>抢今晚第一锅 <span>→</span></button>
            <button className="secondary" onClick={() => setStoryOpen(true)}>看 40 秒开锅故事</button>
          </div>
          <div className="hero-proof"><div><strong>当天</strong><span>采买鲜煮</span></div><div><strong>3 km</strong><span>附近配送</span></div><div><strong>50 份</strong><span>今日限量</span></div></div>
        </div>
        <aside className="pot-card">
          <div className="steam-lines"><i /><i /><i /></div><span className="pot-kicker">NEXT POT · 下一锅</span><strong>19:10</strong><p>现在下单，预计 19:40 前送达</p><div className="batch-bar"><span /></div><small>本锅余量约 18 份</small>
        </aside>
        <div className="scroll-cue">往下，挑今晚的搭子 <span>↓</span></div>
      </section>

      <section className="trust-strip" id="promise">
        <p>一锅鲜，靠的是看得见的细节</p>
        <div className="trust-items"><span><b>01</b> 当天挑洗</span><span><b>02</b> 分锅现煮</span><span><b>03</b> 日期批次可见</span><span><b>04</b> 花生过敏原提示</span></div>
      </section>

      <section className="menu-section" id="menu">
        <div className="section-head">
          <div><p className="eyebrow dark">TONIGHT&apos;S MENU · 今晚菜单</p><h2>不卖复杂，<br />只把几样煮到位。</h2></div>
          <p className="section-intro">第一次来，选双拼；一家人，点分享盆；朋友多，直接上畅吃盆。每份都标清重量，不让“份”变成猜谜。</p>
        </div>
        <div className="category-row" role="tablist" aria-label="商品分类">
          {categories.map((item) => <button key={item} role="tab" aria-selected={category === item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <div className="product-layout">
          <aside className="menu-image-card"><div className="menu-photo" /><div className="menu-image-copy"><span>今晚推荐</span><strong>一半花生，<br />一半毛豆。</strong><p>不用纠结，第一口就吃到两种鲜。</p></div></aside>
          <div className="product-grid">
            {visible.map((item) => (
              <article className="product-card" key={item.id}>
                <div className={`product-visual ${item.tone}`}><span>{item.icon}</span>{item.badge && <b>{item.badge}</b>}</div>
                <div className="product-info">
                  <div className="product-title-row"><h3>{item.name}</h3><span>{item.serves}</span></div>
                  <p>{item.note}</p><small>{item.weight} · 今日现煮批次</small>
                  <div className="product-buy-row"><div className="price"><i>¥</i>{money(item.price)} {item.original && <del>¥{item.original}</del>}</div>
                    {cart[item.id] ? <div className="stepper" aria-label={`${item.name}数量`}><button onClick={() => change(item.id, -1)}>−</button><span>{cart[item.id]}</span><button onClick={() => change(item.id, 1)}>＋</button></div> : <button className="add-button" onClick={() => add(item.id)} aria-label={`添加${item.name}`}>＋</button>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="story-section" id="story">
        <div className="story-photo" role="img" aria-label="在家庭厨房里认真清洗花生与毛豆" />
        <div className="story-copy">
          <p className="eyebrow dark">ONE POT, ONE EVENING · 一锅的一天</p><h2>没有祖传秘方，<br />只有每天重复的小事。</h2>
          <blockquote>“下午三点，水开始烧。花生一颗颗挑，毛豆一遍遍洗。我们不想把它做成放很久的零食，只想煮成附近人今晚餐桌上的一盆热气。”</blockquote>
          <div className="timeline"><div><time>15:00</time><span>挑洗当日食材</span></div><div><time>17:30</time><span>第一锅出锅</span></div><div><time>22:00</time><span>售完收摊</span></div></div>
          <button className="text-button" onClick={jumpToMenu}>去挑今晚这一锅 <span>↗</span></button>
        </div>
      </section>

      <section className="scene-section">
        <div className="scene-intro"><p className="eyebrow dark">FOR REAL MOMENTS · 为真实的夜晚</p><h2>好吃，也要有人一起吃。</h2></div>
        <div className="scene-grid">
          <article><span>01</span><h3>两个人追剧</h3><p>不用点满一桌，双拼刚好陪完两集。</p><button onClick={() => add(1)}>选新客双拼 →</button></article>
          <article><span>02</span><h3>一家人聊聊天</h3><p>放在桌中间，剥着剥着话就多了。</p><button onClick={() => add(2)}>选分享盆 →</button></article>
          <article><span>03</span><h3>朋友来看球</h3><p>嘴不能闲，气氛也不能断。</p><button onClick={() => add(3)}>选畅吃盆 →</button></article>
        </div>
      </section>

      <section className="final-cta"><div><p>今晚 17:30 第一锅</p><h2>热气已经起来了。</h2></div><button className="primary light" onClick={jumpToMenu}>现在点一盆 <span>→</span></button></section>
      <footer><div className="brand footer-brand"><span className="brand-mark">花毛</span><strong>今晚花毛</strong></div><p>现煮花生毛豆 · 家庭作坊自营 · 附近配送</p><p className="legal">营业时间 15:00–22:00　｜　过敏原提示：本店产品含花生</p></footer>

      <button className={`mobile-cart ${cartCount ? "show" : ""}`} onClick={() => setCartOpen(true)}><span><b>{cartCount}</b> 件 · ¥{money(subtotal)}</span><strong>去结算 →</strong></button>

      {cartOpen && <div className="overlay" role="dialog" aria-modal="true" aria-label="购物车">
        <button className="overlay-bg" aria-label="关闭购物车" onClick={() => setCartOpen(false)} />
        <aside className="cart-drawer">
          <div className="drawer-head"><div><small>TONIGHT&apos;S POT</small><h2>今晚这一锅</h2></div><button onClick={() => setCartOpen(false)} aria-label="关闭">×</button></div>
          {cartItems.length ? <>
            <div className="cart-list">{cartItems.map((item) => <div className="cart-line" key={item.id}><div className={`mini-visual ${item.tone}`}>{item.icon}</div><div><strong>{item.name}</strong><small>{item.weight}</small><b>¥{money(item.price)}</b></div><div className="stepper"><button onClick={() => change(item.id, -1)}>−</button><span>{item.quantity}</span><button onClick={() => change(item.id, 1)}>＋</button></div></div>)}</div>
            <div className="delivery-note"><span>附近配送</span><strong>{delivery ? `¥${delivery}` : "已免配送费"}</strong>{subtotal < 49 && <small>再点 ¥{money(49 - subtotal)} 免配送费</small>}</div>
            <div className="cart-total"><span>合计</span><strong><i>¥</i>{money(subtotal + delivery)}</strong></div><button className="checkout" onClick={submitDemoOrder}>提交预订单 <span>→</span></button><p className="demo-note">演示版本不会发起真实支付</p>
          </> : <div className="empty-cart"><span>一锅</span><h3>今晚还没选好</h3><p>先挑一份花毛双拼，尝尝两种鲜。</p><button onClick={() => { setCartOpen(false); jumpToMenu(); }}>去看菜单</button></div>}
        </aside>
      </div>}

      {storyOpen && <div className="story-modal" role="dialog" aria-modal="true" aria-label="开锅故事"><button className="overlay-bg" aria-label="关闭故事" onClick={() => setStoryOpen(false)} /><div className="story-modal-card"><button className="modal-close" onClick={() => setStoryOpen(false)}>×</button><div className="story-video-placeholder"><span>15:00</span><strong>水开始烧。</strong><i>开锅故事 · 影像位置</i></div><p>这里预留品牌短片位置。正式上线时替换为真实的挑洗、入锅、出锅和装盒过程。</p></div></div>}
      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}
