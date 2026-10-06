/* ==========================================================================
   CORE — utilitas bersama halaman publik & aplikasi
   ========================================================================== */
(function () {
  'use strict';
  const U = {};
  window.U = U;

  // ---------------- DOM & teks ----------------
  U.$ = (s, r) => (r || document).querySelector(s);
  U.$$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  U.esc = (v) => String(v === null || v === undefined ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  U.icon = (n, cls) => `<svg class="ic ${cls || ''}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  U.uid = () => {
    const a = new Uint8Array(9); crypto.getRandomValues(a);
    return Array.from(a, (b) => (b % 36).toString(36)).join('') + Date.now().toString(36).slice(-3);
  };
  U.token = () => { const a = new Uint8Array(24); crypto.getRandomValues(a); return Array.from(a, (b) => 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'[b % 56]).join('') + 'x' + Date.now().toString(36); };
  U.debounce = (fn, ms) => { let t; return function () { clearTimeout(t); const a = arguments; t = setTimeout(() => fn.apply(this, a), ms); }; };
  U.inisial = (nama) => String(nama || '?').replace(/^(bu|pak|ibu|bpk\.?)\s+/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';
  U.avClass = (s) => { let h = 0; String(s || '').split('').forEach((c) => { h = (h * 31 + c.charCodeAt(0)) | 0; }); return 'av-' + (Math.abs(h) % 6); };
  U.avatar = (nama, id, cls, foto) => `<span class="av ${cls || ''} ${U.avClass(id || nama)}">${foto ? `<img src="${U.esc(foto)}" alt="">` : U.esc(U.inisial(nama))}</span>`;
  U.hurufKata = (s) => String(s || '').toLowerCase().replace(/(^|[\s\-/(])(\p{L})/gu, (m, a, b) => a + b.toUpperCase()).trim();
  U.normWa = (v) => { let d = String(v || '').replace(/\D/g, ''); if (!d) return ''; if (d[0] === '0') d = '62' + d.slice(1); else if (d[0] === '8') d = '62' + d; return d; };
  U.tampilWa = (v) => { const d = U.normWa(v); return d ? '0' + d.slice(2).replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3') : ''; };
  U.waLink = (wa, pesan) => 'https://wa.me/' + U.normWa(wa) + (pesan ? '?text=' + encodeURIComponent(pesan) : '');

  // ---------------- Angka & tanggal ----------------
  U.rp = (n) => 'Rp' + Math.round(+n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  U.angka = (n) => Math.round(+n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  U.BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  U.BLN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  U.HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  U.HR = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  // Hari ini menurut WITA (UTC+8), berdasarkan jam perangkat
  U.today = () => { const d = new Date(Date.now() + 8 * 3600000); return d.toISOString().slice(0, 10); };
  U.nowIso = () => new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 19);
  U.ymNow = () => U.today().slice(0, 7);
  U.utc = (s) => { const p = s.split('-'); return Date.UTC(+p[0], +p[1] - 1, +(p[2] || 1)); };
  U.fromUtc = (t) => new Date(t).toISOString().slice(0, 10);
  U.addDays = (s, n) => U.fromUtc(U.utc(s) + n * 86400000);
  U.dow = (s) => new Date(U.utc(s)).getUTCDay();
  U.addMonths = (ym, n) => { let y = +ym.slice(0, 4), m = +ym.slice(5, 7) - 1 + n; y += Math.floor(m / 12); m = ((m % 12) + 12) % 12; return y + '-' + String(m + 1).padStart(2, '0'); };
  U.daysInMonth = (ym) => new Date(Date.UTC(+ym.slice(0, 4), +ym.slice(5, 7), 0)).getUTCDate();
  U.isTgl = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || ''));
  U.tgl = (s) => U.isTgl(s) ? (+s.slice(8, 10)) + ' ' + U.BLN[+s.slice(5, 7) - 1] + ' ' + s.slice(0, 4) : (s ? String(s) : '-');
  U.tglPanjang = (s) => U.isTgl(s) ? (+s.slice(8, 10)) + ' ' + U.BULAN[+s.slice(5, 7) - 1] + ' ' + s.slice(0, 4) : '-';
  U.tglHari = (s) => U.isTgl(s) ? U.HARI[U.dow(s)] + ', ' + U.tglPanjang(s) : '-';
  U.bulan = (ym) => ym ? U.BULAN[+ym.slice(5, 7) - 1] + ' ' + ym.slice(0, 4) : '-';
  U.bln = (ym) => ym ? U.BLN[+ym.slice(5, 7) - 1] + (ym.slice(0, 4) !== U.today().slice(0, 4) ? ' ' + ym.slice(2, 4) : '') : '-';
  U.daftarBulan = (list) => {
    const u = list.slice().sort();
    if (!u.length) return '-';
    if (u.length === 1) return U.bulan(u[0]);
    if (u.every((b) => b.slice(0, 4) === u[0].slice(0, 4))) {
      const n = u.map((b) => U.BULAN[+b.slice(5, 7) - 1]);
      return n.slice(0, -1).join(', ') + ' & ' + n[n.length - 1] + ' ' + u[0].slice(0, 4);
    }
    return u.map(U.bulan).join(', ');
  };
  U.umur = (tgl, acuan) => {
    if (!U.isTgl(tgl)) return '';
    const a = (acuan || U.today()).split('-').map(Number), b = tgl.split('-').map(Number);
    let y = a[0] - b[0]; if (a[1] < b[1] || (a[1] === b[1] && a[2] < b[2])) y--;
    return y >= 0 ? y + ' thn' : '';
  };
  // Lama mengajar: "2 tahun 3 bulan"
  U.masa = (dari, sampai) => {
    if (!U.isTgl(dari)) return '-';
    const s = U.isTgl(sampai) ? sampai : U.today();
    const a = dari.split('-').map(Number), b = s.split('-').map(Number);
    let bln = (b[0] - a[0]) * 12 + (b[1] - a[1]);
    if (b[2] < a[2]) { const akhir = U.daysInMonth(s.slice(0, 7)); if (!(b[2] === akhir && a[2] > akhir)) bln--; }
    if (bln < 0) return 'Belum mulai';
    if (bln === 0) return 'Kurang dari 1 bulan';
    const t = Math.floor(bln / 12), m = bln % 12;
    return [t ? t + ' tahun' : '', m ? m + ' bulan' : ''].filter(Boolean).join(' ');
  };
  U.terbilang = (n) => {
    n = Math.floor(+n || 0);
    const s = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
    const t = (x) => {
      if (x < 12) return s[x];
      if (x < 20) return t(x - 10) + ' belas';
      if (x < 100) return t(Math.floor(x / 10)) + ' puluh' + (x % 10 ? ' ' + t(x % 10) : '');
      if (x < 200) return 'seratus' + (x - 100 ? ' ' + t(x - 100) : '');
      if (x < 1000) return t(Math.floor(x / 100)) + ' ratus' + (x % 100 ? ' ' + t(x % 100) : '');
      if (x < 2000) return 'seribu' + (x - 1000 ? ' ' + t(x - 1000) : '');
      if (x < 1e6) return t(Math.floor(x / 1000)) + ' ribu' + (x % 1000 ? ' ' + t(x % 1000) : '');
      if (x < 1e9) return t(Math.floor(x / 1e6)) + ' juta' + (x % 1e6 ? ' ' + t(x % 1e6) : '');
      return t(Math.floor(x / 1e9)) + ' miliar' + (x % 1e9 ? ' ' + t(x % 1e9) : '');
    };
    const r = n === 0 ? 'nol' : t(n);
    return r.charAt(0).toUpperCase() + r.slice(1) + ' rupiah';
  };

  // ---------------- Tema warna dinamis ----------------
  const hexRgb = (h) => { h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.substr(i, 2), 16)); };
  const rgbHex = (r) => '#' + r.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const lum = (rgb) => { const c = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  U.kontras = (a, b) => { const x = lum(hexRgb(a)), y = lum(hexRgb(b)); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  U.applyTheme = (hex) => {
    if (!/^#[0-9a-f]{6}$/i.test(hex || '')) hex = '#6B2F8F';
    const c = hexRgb(hex), w = [255, 255, 255], k = [12, 4, 20];
    const v = {
      '--p': hex, '--p-50': rgbHex(mix(c, w, 0.93)), '--p-100': rgbHex(mix(c, w, 0.87)), '--p-200': rgbHex(mix(c, w, 0.74)),
      '--p-300': rgbHex(mix(c, w, 0.5)), '--p-600': rgbHex(mix(c, k, 0.12)), '--p-700': rgbHex(mix(c, k, 0.27)),
      '--p-800': rgbHex(mix(c, k, 0.4)), '--p-900': rgbHex(mix(c, k, 0.6)),
      '--on-p': U.kontras(hex, '#FFFFFF') >= 3.6 ? '#FFFFFF' : '#2B1B3D'
    };
    const st = document.documentElement.style;
    Object.keys(v).forEach((k2) => st.setProperty(k2, v[k2]));
    const m = document.querySelector('meta[name=theme-color]'); if (m) m.content = hex;
  };

  // ---------------- Penyimpanan lokal aman ----------------
  U.ls = {
    get(k, def) { try { const v = localStorage.getItem(k); return v === null ? def : JSON.parse(v); } catch (e) { return def; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* */ } }
  };
  // IndexedDB sederhana (template piagam & gambar besar)
  U.idb = (() => {
    let dbp;
    const db = () => dbp || (dbp = new Promise((res, rej) => {
      const r = indexedDB.open('ahe-ala', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('kv');
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    }));
    const tx = (mode, fn) => db().then((d) => new Promise((res, rej) => { const t = d.transaction('kv', mode); const s = t.objectStore('kv'); const r = fn(s); t.oncomplete = () => res(r && r.result); t.onerror = () => rej(t.error); }));
    return { get: (k) => tx('readonly', (s) => s.get(k)).catch(() => null), set: (k, v) => tx('readwrite', (s) => s.put(v, k)).catch(() => null), del: (k) => tx('readwrite', (s) => s.delete(k)).catch(() => null) };
  })();

  // ---------------- API ke Google Apps Script ----------------
  U.gasUrl = () => (window.APP_CONFIG && window.APP_CONFIG.GAS_URL) || '';
  U.siapApi = () => /^https:\/\/script\.google(usercontent)?\.com\//.test(U.gasUrl()) && !/GANTI_DENGAN/.test(U.gasUrl()) || /^http:\/\/(localhost|127\.0\.0\.1)/.test(U.gasUrl());
  U.api = async (action, payload, opt) => {
    opt = opt || {};
    if (!U.siapApi()) throw Object.assign(new Error('URL backend belum diisi di js/config.js'), { kode: 'CONFIG' });
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), opt.timeout || 45000);
    let res;
    try {
      res = await fetch(U.gasUrl(), {
        method: 'POST', redirect: 'follow', signal: ctrl.signal,
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(Object.assign({ action }, payload || {}))
      });
    } catch (e) {
      throw Object.assign(new Error(e.name === 'AbortError' ? 'Server terlalu lama merespons' : 'Tidak ada koneksi internet'), { kode: 'NET' });
    } finally { clearTimeout(to); }
    let j;
    try { j = await res.json(); } catch (e) { throw Object.assign(new Error('Respons server tidak valid (cek deployment Apps Script)'), { kode: 'NET' }); }
    if (!j.success) throw Object.assign(new Error(j.message || 'Terjadi kesalahan'), { kode: j.code || 'APP', data: j.data });
    return j.data;
  };
  U.apiGet = async (params, opt) => {
    if (!U.siapApi()) throw Object.assign(new Error('URL backend belum diisi di js/config.js'), { kode: 'CONFIG' });
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), (opt && opt.timeout) || 30000);
    try {
      const res = await fetch(U.gasUrl() + '?' + new URLSearchParams(params).toString(), { signal: ctrl.signal, redirect: 'follow' });
      const j = await res.json();
      if (!j.success) throw Object.assign(new Error(j.message || 'Terjadi kesalahan'), { kode: j.code || 'APP' });
      return j.data;
    } catch (e) {
      if (e.kode) throw e;
      throw Object.assign(new Error('Tidak ada koneksi internet'), { kode: 'NET' });
    } finally { clearTimeout(to); }
  };
  U.ping = () => { if (U.siapApi()) fetch(U.gasUrl() + '?action=ping', { redirect: 'follow' }).catch(() => { }); };

  // ---------------- Toast ----------------
  U.toast = (msg, type, ms) => {
    let box = document.getElementById('toasts');
    if (!box) { box = document.createElement('div'); box.id = 'toasts'; box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
    const ic = { ok: 'circle-check', bad: 'circle-alert', warn: 'triangle-alert', info: 'info' }[type || 'ok'] || 'info';
    const el = document.createElement('div');
    el.className = 'toast ' + (type || 'ok');
    el.innerHTML = U.icon(ic) + '<span>' + U.esc(msg) + '</span>';
    box.appendChild(el);
    const tutup = () => { el.classList.add('out'); setTimeout(() => el.remove(), 220); };
    el.onclick = tutup;
    setTimeout(tutup, ms || (type === 'bad' ? 5200 : 3000));
  };

  // ---------------- Modal / drawer / konfirmasi ----------------
  U.modal = (o) => {
    const ov = document.createElement('div');
    ov.className = 'ov' + (o.drawer ? ' drawer' : '');
    ov.innerHTML = `<div class="modal ${o.size || ''}" role="dialog" aria-modal="true">
      <div class="modal-head">${o.icon ? `<span class="icon-dot sm ${o.iconCls || ''}">${U.icon(o.icon)}</span>` : ''}<h3>${U.esc(o.title || '')}${o.sub ? `<div class="sub">${o.sub}</div>` : ''}</h3>
      <button class="btn btn-ghost btn-icon btn-sm" data-x aria-label="Tutup">${U.icon('x')}</button></div>
      <div class="modal-body">${o.body || ''}</div>${o.foot !== false ? `<div class="modal-foot">${o.foot || ''}</div>` : ''}</div>`;
    const prevFocus = document.activeElement;
    const close = (v) => {
      if (ov._closed) return; ov._closed = true;
      ov.classList.add('closing');
      document.removeEventListener('keydown', onKey);
      setTimeout(() => { ov.remove(); if (prevFocus && prevFocus.focus) prevFocus.focus(); }, 150);
      if (o.onClose) o.onClose(v);
    };
    const onKey = (e) => { if (e.key === 'Escape' && !o.kunci) close(); };
    document.addEventListener('keydown', onKey);
    if (!o.kunci) ov.addEventListener('mousedown', (e) => { if (e.target === ov) close(); });
    if (o.kunci) ov.querySelector('[data-x]').remove(); else ov.querySelector('[data-x]').onclick = () => close();
    document.body.appendChild(ov);
    const f = ov.querySelector('[autofocus]') || ov.querySelector('.modal-body input:not([type=hidden]):not([type=checkbox]), .modal-body select, .modal-body textarea');
    if (f && window.innerWidth > 767) setTimeout(() => f.focus(), 60);
    const api = { el: ov, body: ov.querySelector('.modal-body'), foot: ov.querySelector('.modal-foot'), close, $: (s) => ov.querySelector(s), $$: (s) => Array.from(ov.querySelectorAll(s)) };
    if (o.onOpen) o.onOpen(api);
    return api;
  };
  U.confirm = (o) => new Promise((resolve) => {
    if (typeof o === 'string') o = { text: o };
    const m = U.modal({
      title: o.title || 'Konfirmasi', icon: o.danger ? 'triangle-alert' : 'info', iconCls: o.danger ? 'bad' : '',
      body: `<p>${o.text || ''}</p>${o.ketik ? `<div class="field mt-16"><label>Ketik <b>${U.esc(o.ketik)}</b> untuk melanjutkan</label><input class="input" data-k autocomplete="off"></div>` : ''}`,
      foot: `<button class="btn btn-light" data-n>Batal</button><button class="btn ${o.danger ? 'btn-danger' : 'btn-primary'}" data-y ${o.ketik ? 'disabled' : ''}>${U.esc(o.ok || 'Ya, lanjutkan')}</button>`,
      onClose: () => resolve(false)
    });
    const y = m.$('[data-y]');
    if (o.ketik) m.$('[data-k]').oninput = (e) => { y.disabled = e.target.value.trim().toLowerCase() !== o.ketik.trim().toLowerCase(); };
    m.$('[data-n]').onclick = () => m.close();
    y.onclick = () => { resolve(true); m.close(true); };
  });
  U.prompt = (o) => new Promise((resolve) => {
    let hasil = null;
    const m = U.modal({
      title: o.title, icon: o.icon, body: `<div class="field"><label>${U.esc(o.label || '')}</label>${o.input || `<input class="input" data-v value="${U.esc(o.value || '')}" autofocus>`}</div>${o.help ? `<p class="help mt-8">${o.help}</p>` : ''}`,
      foot: `<button class="btn btn-light" data-n>Batal</button><button class="btn btn-primary" data-y>${U.esc(o.ok || 'Simpan')}</button>`,
      onClose: () => resolve(hasil)
    });
    m.$('[data-n]').onclick = () => m.close();
    m.$('[data-y]').onclick = () => { hasil = m.$('[data-v]').value; m.close(); };
    m.$('[data-v]').onkeydown = (e) => { if (e.key === 'Enter') m.$('[data-y]').click(); };
  });

  // ---------------- Gambar ----------------
  U.bacaFile = (file) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
  U.muatGambar = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('Gambar tidak dapat dibaca')); i.src = src; });
  // Kompres gambar di perangkat sebelum dikirim
  U.kompres = async (fileOrUrl, maxSisi, mutu, mime) => {
    const src = typeof fileOrUrl === 'string' ? fileOrUrl : await U.bacaFile(fileOrUrl);
    const img = await U.muatGambar(src);
    const s = Math.min(1, maxSisi / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
    const ctx = c.getContext('2d');
    if ((mime || 'image/jpeg') === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); }
    ctx.drawImage(img, 0, 0, c.width, c.height);
    const dataUrl = c.toDataURL(mime || 'image/jpeg', mutu || 0.85);
    return { dataUrl, base64: dataUrl.split(',')[1], mime: mime || 'image/jpeg', w: c.width, h: c.height };
  };
  U.pilihFile = (accept) => new Promise((res) => {
    const i = document.createElement('input'); i.type = 'file'; i.accept = accept || 'image/*';
    i.onchange = () => res(i.files[0] || null); i.click();
  });

  // ---------------- Pustaka eksternal (dimuat saat dibutuhkan) ----------------
  const CDN = {
    chart: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js',
    jspdf: 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
    autotable: 'https://cdn.jsdelivr.net/npm/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.min.js',
    xlsx: 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js'
  };
  const muat = {};
  U.script = (url) => muat[url] || (muat[url] = new Promise((res, rej) => {
    const s = document.createElement('script'); s.src = url; s.async = true;
    s.onload = res; s.onerror = () => { delete muat[url]; rej(new Error('Gagal memuat pustaka. Periksa koneksi internet.')); };
    document.head.appendChild(s);
  }));
  U.lib = {
    chart: () => U.script(CDN.chart).then(() => window.Chart),
    pdf: () => U.script(CDN.jspdf).then(() => window.jspdf.jsPDF),
    pdfTable: () => U.script(CDN.jspdf).then(() => U.script(CDN.autotable)).then(() => window.jspdf.jsPDF),
    xlsx: () => U.script(CDN.xlsx).then(() => window.XLSX)
  };
  U.unduhBlob = (blob, nama) => {
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = nama;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  };
  U.namaFile = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9 _-]/g, '').trim().replace(/\s+/g, '_');
  U.salin = async (teks) => {
    try { await navigator.clipboard.writeText(teks); return true; } catch (e) {
      const t = document.createElement('textarea'); t.value = teks; t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.focus(); t.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
      t.remove(); return ok;
    }
  };
  U.logoHtml = (set, fallback) => set && set.logo_data ? `<img src="${U.esc(set.logo_data)}" alt="Logo">` : (fallback || '<span style="font-family:var(--f-head);font-weight:900;font-size:22px">A</span>');
  U.ytId = (url) => { if (!/youtu\.?be/i.test(String(url || ''))) return ''; const m = String(url || '').match(/(?:youtu\.be\/|v=|shorts\/|embed\/|live\/)([A-Za-z0-9_-]{6,})/); return m ? m[1] : ''; };
  U.urlBaseFrontend = () => location.origin + location.pathname.replace(/[^/]*$/, '');
})();
