import express from 'express';
import serverless from 'serverless-http';
import cookie from 'cookie';
import crypto from 'crypto';
import { getStore } from '@netlify/blobs';

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const store = getStore('arab-cafe');
const JORDAN_LOCALE = 'en-CA';
const TZ = 'Asia/Amman';
const SEED = {
  CATEGORY_IMAGE_FILES: {
    'مشروبات ساخنة': 'hot-coffee.png',
    'قهوة باردة': 'iced-coffee.png',
    'موهيتو': 'mojito.png',
    'آيس تي': 'iced-tea.png',
    'بودر ومشروبات آلة': 'powder.png',
    'ميلك شيك': 'milkshake.png',
    'السناك': 'snacks.png',
    'بيتزا من الفرن': 'pizza.png',
    'برغر': 'burger.png',
    'بوكسات عربية': 'box.png',
    'سلطات': 'salad.png',
    'ساندويش خفيف للإفطار': 'breakfast.png',
    'إضافات': null,
  },
  MENU_DATA: [
    { name: 'مشروبات ساخنة', slug: 'hot-coffee', sort_order: 1, show_image: true, items: [['Double Espresso',1.25],['Americano',1.25],['Filter Coffee',1.25],['Latte',2.00],['Cappuccino',2.00],['Flat White',2.25],['Dark Mocha',2.50],['White Mocha',2.50],['Arab Hot Chocolate',2.00],['Spanish Latte Hot',2.50],['Caramel Macchiato Hot',2.50],['Extra',0.25]] },
    { name: 'قهوة باردة', slug: 'iced-coffee', sort_order: 2, show_image: true, items: [['Ice Latte',2.00],['Ice Americano',1.50],['Ice White Mocha',2.50],['Ice Dark Mocha',2.50],['Ice Caramel Macchiato',2.50],['Ice Spanish Latte',2.50],['Frappe',2.50],['Extra',0.25]] },
    { name: 'موهيتو', slug: 'mojito', sort_order: 3, show_image: true, items: [['Strawberry & Mix Berries',2.00],['Peach & Mango',2.00],['Blueberry & Passion',2.00]] },
    { name: 'آيس تي', slug: 'iced-tea', sort_order: 4, show_image: true, items: [['Peach Ice Tea',2.00],['Mango & Peach Ice Tea',2.00],['Strawberry Ice Tea',2.00],['Mix Berry & Strawberry Ice Tea',2.00]] },
    { name: 'بودر ومشروبات آلة', slug: 'powder', sort_order: 5, show_image: true, items: [['Turkish Coffee',0.75],['Nescafe Machine',0.75],['Hot Chocolate Machine',0.75],['Chai Karak',0.75],['Sahlab',0.75],['Caramel Cappuccino',0.75]] },
    { name: 'ميلك شيك', slug: 'milkshake', sort_order: 6, show_image: true, items: [['Vanilla Milk Shake',2.00],['Strawberry Milk Shake',2.00],['Chocolate Milk Shake',2.00]] },
    { name: 'السناك', slug: 'snacks', sort_order: 7, show_image: true, items: [['شاورما عربي',1.50],['شاورما عربي دبل',2.50],['برغر فرنسي أو تورتيلا',2.00],['برغر سوبرم',2.35],['برغر بالكريمة',2.50],['فاهيتا دجاج',2.00],['فاهيتا لحمة',3.00],['مكسيكان',2.00],['تشيكن باربكيو',2.35],['تشيكن ألفريدو',2.25],['نونا',2.25],['ديناميت',2.35],['كوردن بلو',2.50],['تشيكن هافاو',2.25]] },
    { name: 'بيتزا من الفرن', slug: 'pizza', sort_order: 8, show_image: true, items: [['بيتزا الفريدو',2.75],['بيتزا التوست',2.75],['بيتزا بولو',2.75],['بيتزا باربكيو',2.75],['بيتزا خضار',2.50],['بيتزا سلامي',2.50],['بيتزا مارجريتا',2.00],['بيتزا الفريدو كبير',4.00],['بيتزا التوست كبير',4.00],['بيتزا بولو كبير',4.00],['بيتزا باربكيو كبير',4.00],['بيتزا خضار كبير',3.50],['بيتزا سلامي كبير',3.50],['بيتزا مارجريتا كبير',3.00]] },
    { name: 'برغر', slug: 'burger', sort_order: 9, show_image: true, items: [['سكالوب',1.50],['كلاب هاوس برغر',1.50],['كرسبي عرب تشكن',2.50],['عرب برغر 150 غ',2.50],['سماش وايت 150 غ',2.50],['ماشروم 150 غ',2.50],['عرب كلاسيك 150 غ',2.50],['برغر رانشي 150 غ',2.50],['سماش برغر 100 غ',2.00],['سكالوب كبير',2.50],['كلاب هاوس برغر كبير',2.50],['كرسبي عرب تشكن كبير',3.50],['عرب برغر كبير',3.50],['سماش وايت كبير',3.50],['ماشروم كبير',3.50],['عرب كلاسيك كبير',3.50],['برغر رانشي كبير',3.50],['سماش برغر كبير',3.00]] },
    { name: 'بوكسات عربية', slug: 'boxes', sort_order: 10, show_image: true, items: [['بوكس البطاطا',1.00],['بوكس الودجز',1.25],['بوكس البطاطا مع الجبنة',1.50],['بوكس الودجز مع الجبنة',1.75],['بوكس البرجر',2.50],['بوكس البرجر مع الكريمة',3.00],['بوكس الصوت دوغ',2.25]] },
    { name: 'سلطات', slug: 'salads', sort_order: 11, show_image: true, items: [['سلطة سيزر',1.50],['سلطة يونانية',2.00],['سلطة روكا',1.25],['سلطة تونا',2.50],['إضافة صدر دجاج',1.00]] },
    { name: 'ساندويش خفيف للإفطار', slug: 'breakfast', sort_order: 12, show_image: true, items: [['سنورة مع لبنة',0.75],['بيض',0.75],['بطاطا ساندويش',1.00],['هالابينو',1.00],['مكس أجبان',1.00],['كبدة',1.00],['جبنة فيتا',1.25],['حلوم مشوي',1.50],['تركي مع مكس أجبان',1.50],['هوت دوغ',1.50]] },
    { name: 'إضافات', slug: 'extras', sort_order: 13, show_image: false, items: [['علبة جبنة',0.25],['علبة كوكتيل',0.25],['علبة زيتون',0.25],['علبة جبنة إضافية',0.25]] }
  ]
};

function jordanNowIso() { return new Date().toLocaleString('sv-SE', { timeZone: TZ }).replace(' ', 'T'); }
function formatDay(dateStr) { return new Date(dateStr).toLocaleDateString(JORDAN_LOCALE, { timeZone: TZ }); }
function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString('sv-SE', { timeZone: TZ, hour12: false }).replace(' ', ' ');
}
function getCookies(req){ return cookie.parse(req.headers.cookie || ''); }
function json(res, data, status=200){ res.status(status).json(data); }
function safeId(){ return crypto.randomUUID(); }

async function loadState() {
  let state = await store.get('state.json', { type: 'json' });
  if (state) return state;
  let categoryId = 1, itemId = 1;
  const categories = SEED.MENU_DATA.map((cat) => ({
    id: categoryId++,
    name: cat.name,
    slug: cat.slug,
    sort_order: cat.sort_order,
    show_image: cat.show_image,
  }));
  const items = [];
  for (const cat of SEED.MENU_DATA) {
    const category = categories.find((c) => c.name === cat.name);
    const imageFile = SEED.CATEGORY_IMAGE_FILES[cat.name] || null;
    cat.items.forEach((row, idx) => {
      items.push({
        id: itemId++,
        name: row[0],
        description: row[2] || `منيو ${cat.name} - Arab Cafe`,
        price: Number(row[1]),
        available: true,
        featured: idx < 3,
        category_id: category.id,
        image_url: cat.show_image && imageFile ? `/seed/${imageFile}` : null,
        image_data_url: null,
      });
    });
  }
  state = { site_name: 'Arab Cafe', orders: [], categories, items, nextOrderId: 1, lastUpdated: jordanNowIso() };
  await saveState(state);
  return state;
}
async function saveState(state) {
  state.lastUpdated = jordanNowIso();
  await store.setJSON('state.json', state);
}

function publicMenu(state) {
  const categories = [...state.categories].sort((a,b) => a.sort_order - b.sort_order || a.id - b.id).map(cat => ({
    ...cat,
    items: state.items.filter(i => i.category_id === cat.id && i.available)
  }));
  const featured_items = state.items.filter(i => i.available && i.featured).slice(0,8);
  return { categories, featured_items, site_name: state.site_name };
}

function requireAdmin(req, res, next) {
  const cookies = getCookies(req);
  const expected = process.env.ADMIN_TOKEN || 'arab-cafe-admin-session';
  if (cookies.cafe_admin !== expected) return json(res, { error: 'Unauthorized' }, 401);
  next();
}

app.get('/api/health', (_req, res) => json(res, { ok: true }));
app.get('/api/menu', async (_req, res) => json(res, await loadState()));
app.get('/api/public-menu', async (_req, res) => json(res, publicMenu(await loadState())));
app.post('/api/orders', async (req, res) => {
  const { student_name, phone, building, notes = '', cart = [] } = req.body || {};
  if (!student_name || !phone || !Array.isArray(cart) || !cart.length || !['I','B'].includes(building)) {
    return json(res, { error: 'لازم تدخل الاسم ورقم التلفون وتختار المبنى وتختار طلب واحد على الأقل.' }, 400);
  }
  const state = await loadState();
  const orderItems = [];
  let total = 0;
  for (const entry of cart) {
    const item = state.items.find(i => i.id === Number(entry.id) && i.available);
    const qty = Number(entry.qty || 0);
    if (!item || qty < 1) continue;
    total += item.price * qty;
    orderItems.push({
      id: safeId(), menu_item_id: item.id, item_name: item.name, quantity: qty, unit_price: item.price,
    });
  }
  if (!orderItems.length) return json(res, { error: 'المنتجات المختارة غير صالحة أو غير متاحة حالياً.' }, 400);
  const order = {
    id: state.nextOrderId++, student_name, phone, building, notes, status: 'pending', total: Number(total.toFixed(2)),
    created_at: new Date().toISOString(), confirmed_at: null, ready_at: null, items: orderItems,
  };
  state.orders.unshift(order);
  await saveState(state);
  json(res, { success: true, order });
});

app.post('/api/admin/login', async (req, res) => {
  const username = String(req.body?.username || '').trim();
  const password = String(req.body?.password || '');
  const validUser = process.env.ADMIN_USERNAME || 'admin';
  const validPass = process.env.ADMIN_PASSWORD || '123456';
  if (username !== validUser || password !== validPass) return json(res, { error: 'بيانات الدخول غير صحيحة.' }, 401);
  const token = process.env.ADMIN_TOKEN || 'arab-cafe-admin-session';
  res.setHeader('Set-Cookie', cookie.serialize('cafe_admin', token, { httpOnly: true, sameSite: 'lax', path: '/', secure: true, maxAge: 60 * 60 * 24 * 30 }));
  json(res, { success: true, username });
});
app.post('/api/admin/logout', (req, res) => {
  res.setHeader('Set-Cookie', cookie.serialize('cafe_admin', '', { httpOnly: true, sameSite: 'lax', path: '/', secure: true, expires: new Date(0) }));
  json(res, { success: true });
});
app.get('/api/admin/session', requireAdmin, (_req, res) => json(res, { authenticated: true }));

app.get('/api/admin/dashboard', requireAdmin, async (req, res) => {
  const state = await loadState();
  const status = req.query.status || '';
  const orders = state.orders.filter(o => !status || o.status === status);
  const today = formatDay(new Date().toISOString());
  const salesToday = orders.filter(o => formatDay(o.created_at) === today && o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const stats = {
    pending: state.orders.filter(o => o.status === 'pending').length,
    confirmed: state.orders.filter(o => o.status === 'confirmed').length,
    ready: state.orders.filter(o => o.status === 'ready').length,
    cancelled: state.orders.filter(o => o.status === 'cancelled').length,
    total_orders: state.orders.length,
    sales_today: Number(salesToday.toFixed(2)),
  };
  json(res, { orders, stats, active_status: status || null });
});
app.get('/api/admin/menu', requireAdmin, async (_req, res) => {
  const state = await loadState();
  const items = state.items.map(item => ({ ...item, category: state.categories.find(c => c.id === item.category_id) }));
  json(res, { categories: state.categories, items });
});
app.post('/api/admin/categories', requireAdmin, async (req, res) => {
  const state = await loadState();
  const { category_name, category_slug, show_image } = req.body || {};
  if (!category_name || !category_slug) return json(res, { error: 'لازم تدخل اسم القسم وكود القسم.' }, 400);
  if (state.categories.some(c => c.name === category_name || c.slug === category_slug)) return json(res, { error: 'القسم موجود مسبقاً.' }, 400);
  state.categories.push({ id: Math.max(0,...state.categories.map(c=>c.id))+1, name: category_name, slug: category_slug, sort_order: state.categories.length + 1, show_image: String(show_image) === '1' || show_image === true });
  await saveState(state);
  json(res, { success: true });
});
app.post('/api/admin/items', requireAdmin, async (req, res) => {
  const state = await loadState();
  const { name, description = '', price, category_id, featured, image_data_url } = req.body || {};
  if (!name || !category_id) return json(res, { error: 'الرجاء تعبئة اسم الصنف والقسم.' }, 400);
  const item = { id: Math.max(0,...state.items.map(i=>i.id))+1, name, description, price: Number(price), category_id: Number(category_id), featured: String(featured) === '1' || featured === true, available: true, image_data_url: image_data_url || null, image_url: null };
  state.items.push(item);
  await saveState(state);
  json(res, { success: true, item });
});
app.post('/api/admin/items/:id', requireAdmin, async (req, res) => {
  const state = await loadState();
  const item = state.items.find(i => i.id === Number(req.params.id));
  if (!item) return json(res, { error: 'Not found' }, 404);
  Object.assign(item, {
    name: req.body.name,
    description: req.body.description || '',
    price: Number(req.body.price),
    category_id: Number(req.body.category_id),
    featured: String(req.body.featured) === '1' || req.body.featured === true,
    available: String(req.body.available) === '1' || req.body.available === true,
  });
  if (req.body.remove_image) {
    item.image_data_url = null;
    item.image_url = null;
  } else if (req.body.image_data_url) {
    item.image_data_url = req.body.image_data_url;
    item.image_url = null;
  }
  await saveState(state);
  json(res, { success: true });
});
app.post('/api/admin/items/:id/toggle', requireAdmin, async (req, res) => {
  const state = await loadState();
  const item = state.items.find(i => i.id === Number(req.params.id));
  if (!item) return json(res, { error: 'Not found' }, 404);
  item.available = !item.available;
  await saveState(state);
  json(res, { success: true, available: item.available });
});
app.post('/api/admin/items/:id/delete', requireAdmin, async (req, res) => {
  const state = await loadState();
  state.items = state.items.filter(i => i.id !== Number(req.params.id));
  await saveState(state);
  json(res, { success: true });
});
app.get('/api/admin/reports', requireAdmin, async (_req, res) => {
  const state = await loadState();
  const groups = new Map();
  state.orders.filter(o => o.status !== 'cancelled').forEach(order => {
    const day = formatDay(order.created_at);
    if (!groups.has(day)) groups.set(day, []);
    groups.get(day).push(order);
  });
  const reports_data = Array.from(groups.entries()).sort((a,b)=>b[0].localeCompare(a[0])).map(([date, orders]) => ({
    date, orders, total_amount: Number(orders.reduce((s,o)=>s+o.total,0).toFixed(2)), total_count: orders.length,
  }));
  const grand_total = Number(reports_data.reduce((s,g)=>s+g.total_amount,0).toFixed(2));
  json(res, { reports_data, grand_total });
});
app.get('/api/admin/orders/:id', requireAdmin, async (req, res) => {
  const state = await loadState();
  const order = state.orders.find(o => o.id === Number(req.params.id));
  if (!order) return json(res, { error: 'Not found' }, 404);
  json(res, { order, site_name: state.site_name });
});
app.post('/api/admin/orders/:id/cancel', requireAdmin, async (req, res) => {
  const state = await loadState();
  const order = state.orders.find(o => o.id === Number(req.params.id));
  if (!order) return json(res, { error: 'Not found' }, 404);
  order.status = 'cancelled';
  await saveState(state);
  json(res, { success: true });
});
app.post('/api/admin/orders/:id/confirm', requireAdmin, async (req, res) => {
  const state = await loadState();
  const order = state.orders.find(o => o.id === Number(req.params.id));
  if (!order) return json(res, { error: 'Not found' }, 404);
  order.status = 'confirmed'; order.confirmed_at = new Date().toISOString();
  await saveState(state);
  json(res, { success: true });
});
app.post('/api/admin/orders/:id/ready', requireAdmin, async (req, res) => {
  const state = await loadState();
  const order = state.orders.find(o => o.id === Number(req.params.id));
  if (!order) return json(res, { error: 'Not found' }, 404);
  order.status = 'ready'; order.ready_at = new Date().toISOString();
  await saveState(state);
  json(res, { success: true });
});
app.post('/api/admin/orders/delete-all', requireAdmin, async (_req, res) => {
  const state = await loadState();
  state.orders = [];
  state.nextOrderId = 1;
  await saveState(state);
  json(res, { success: true });
});

export const handler = serverless(app);
