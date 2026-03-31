window.CAFE = {
  async api(path, options = {}) {
    const response = await fetch(path, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
    let data = {};
    try { data = await response.json(); } catch (e) {}
    if (!response.ok) throw new Error(data.error || 'صار خطأ غير متوقع');
    return data;
  },
  money(value) { return `${Number(value || 0).toFixed(2)} د.أ`; },
  dt(value) {
    return new Date(value).toLocaleString('sv-SE', { timeZone: 'Asia/Amman', hour12: false }).replace(' ', ' ');
  },
  date(value) {
    return new Date(value).toLocaleDateString('en-CA', { timeZone: 'Asia/Amman' });
  },
  flash(message, type = 'success') {
    const box = document.getElementById('flash-box');
    if (!box) return alert(message);
    box.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show rounded-4 shadow-sm" role="alert">${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`;
  },
  ensureBase(title = 'Arab Cafe', home = '/') {
    document.title = title;
    const holder = document.getElementById('site-shell');
    if (!holder) return;
    holder.innerHTML = `
      <nav class="navbar navbar-expand-lg premium-nav sticky-top">
        <div class="container nav-shell">
          <a class="navbar-brand d-flex align-items-center gap-3 m-0" href="${home}">
            <img src="/seed/logo.png" class="brand-logo" alt="Arab Cafe Logo">
            <div><div class="fw-black brand-title">ARAB CAFE</div></div>
          </a>
        </div>
      </nav>
      <main class="pb-5"><div class="container pt-3" id="flash-box"></div><div id="page-content"></div></main>`;
  },
  readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};
