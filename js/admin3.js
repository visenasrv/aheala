/* ==========================================================================
   ADMIN (3/3) — Hari Libur & prompt poster, Kelola Landing Page, Pengaturan
   ========================================================================== */
(function () {
  'use strict';
  const { $, $$, esc, icon } = U;
  const A = App;
  const R = Rules;
  const D = () => A.S.data;

  // ======================================================================
  // HARI LIBUR KHUSUS + PROMPT POSTER CHATGPT
  // ======================================================================
  A.page('libur', {
    title: 'Hari Libur', crumb: 'Hari Libur Khusus',
    render(view) {
      const d = D();
      const ui = A.ui.libur = A.ui.libur || { ym: U.ymNow(), tab: 'datang', edit: null, prompt: null, rasio: '1:1' };
      const t = U.today();
      const semua = (d.libur || []).slice().sort((a, b) => a.tglMulai.localeCompare(b.tglMulai));
      const datang = semua.filter((l) => (l.tglMasuk || l.tglSelesai) >= t), arsip = semua.filter((l) => (l.tglMasuk || l.tglSelesai) < t).reverse();
      const list = ui.tab === 'datang' ? datang : arsip;
      if (!ui.prompt && datang[0]) ui.prompt = datang[0].id;
      const e = ui.edit ? Object.assign({}, ui.edit) : { id: '', keterangan: '', tglMulai: '', tglSelesai: '', tglMasuk: '', tampilLanding: 'ya' };
      // Kalender
      const n = U.daysInMonth(ui.ym), awal = (U.dow(ui.ym + '-01') + 6) % 7;
      let sel = '';
      for (let i = 0; i < awal; i++) sel += '<div class="d out"></div>';
      const masukSet = new Set(semua.map((l) => l.tglMasuk).filter(Boolean));
      for (let i = 1; i <= n; i++) {
        const tg = ui.ym + '-' + String(i).padStart(2, '0'); const w = U.dow(tg); const lb = R.libur(tg);
        const cls = lb ? 'lib' : (w === 0 || w === 6) ? 'we' : masukSet.has(tg) ? 'back' : '';
        sel += `<div class="d ${cls} ${tg === t ? 'today' : ''}" title="${esc(lb ? lb.keterangan : '')}">${i}<small>${lb ? 'Libur' : (w === 0 || w === 6) ? '' : masukSet.has(tg) ? 'Masuk' : '• Les'}</small></div>`;
      }
      const pl = semua.find((l) => l.id === ui.prompt);
      view.innerHTML = `<div class="page-head"><div><h1>Hari Libur Khusus</h1><p>Hari libur tidak dihitung pada absen guru, rekap kehadiran, dan peringatan tidak masuk. Buat prompt poster pengumuman sekali klik.</p></div>
        <div class="actions"><button class="btn btn-primary" id="l-baru">${icon('plus')} Tambah Libur</button></div></div>
        <div class="split"><div class="stack">
          <div class="card"><div class="card-head"><h3>${icon('calendar')} Kalender les</h3><div class="row-gap"><button class="btn btn-light btn-icon btn-sm" data-ym="-1" aria-label="Bulan sebelumnya">${icon('chevron-left')}</button><b style="min-width:120px;text-align:center">${U.bulan(ui.ym)}</b><button class="btn btn-light btn-icon btn-sm" data-ym="1" aria-label="Bulan berikutnya">${icon('chevron-right')}</button></div></div>
            <div class="card-body"><div class="row-gap mb-12 small muted"><span>Hari les: <b>${R.hariLesBulan(ui.ym).length}</b></span><span>·</span><span>Libur khusus: <b>${Array.from({ length: n }, (_, i) => ui.ym + '-' + String(i + 1).padStart(2, '0')).filter((x) => R.libur(x) && U.dow(x) % 6 !== 0).length}</b> hari</span></div>
              <div class="cal">${['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((x) => `<div class="dn">${x}</div>`).join('')}${sel}</div>
              <div class="legend mt-12"><span><i style="background:#fff;border:1px solid var(--line)"></i>Hari les</span><span><i style="background:var(--accent-700)"></i>Libur khusus</span><span><i style="background:var(--p-50)"></i>Akhir pekan</span><span><i style="background:var(--ala-50)"></i>Masuk kembali</span></div></div></div>
          <div class="row-gap"><h3 style="flex:1">Daftar hari libur</h3><div class="tabs"><button class="tab ${ui.tab === 'datang' ? 'on' : ''}" data-tab="datang">Mendatang <span class="n">${datang.length}</span></button><button class="tab ${ui.tab === 'arsip' ? 'on' : ''}" data-tab="arsip">Arsip <span class="n">${arsip.length}</span></button></div></div>
          ${list.length ? list.map((l, i) => { const nh = hitungHari(l); return `<div class="card card-pad" style="${ui.tab === 'datang' && i === 0 ? 'border-left:4px solid var(--accent)' : ''}">
            <div class="row-gap">${ui.tab === 'datang' && i === 0 ? '<span class="chip chip-acc">Terdekat</span>' : ''}<span class="chip">${nh} hari les diliburkan</span>${l.tampilLanding === 'ya' ? `<span class="chip chip-ala">${icon('eye')} Tampil di landing</span>` : ''}</div>
            <h3 class="mt-8" style="${ui.tab === 'arsip' ? 'text-decoration:line-through;color:var(--text-2)' : ''}">${esc(l.keterangan)}</h3>
            <div class="small mt-8">${icon('calendar', 'ic-sm')} ${esc(l.tglSelesai && l.tglSelesai !== l.tglMulai ? U.tglPanjang(l.tglMulai) + ' – ' + U.tglPanjang(l.tglSelesai) : U.tglHari(l.tglMulai))}${l.tglMasuk ? ` · <b style="color:var(--ala-700)">Masuk ${esc(U.tglHari(l.tglMasuk))}</b>` : ''}</div>
            <div class="row-gap mt-12"><button class="btn btn-primary btn-sm" data-pr="${l.id}">${icon('sparkles')} Buat Prompt Poster</button><span class="spacer"></span><button class="btn btn-light btn-sm" data-ed="${l.id}">${icon('pencil')} Edit</button><button class="btn btn-danger-ghost btn-sm" data-del="${l.id}">${icon('trash-2')} Hapus</button></div></div>`; }).join('') : `<div class="card">${A.kosong('calendar-x', ui.tab === 'datang' ? 'Belum ada libur mendatang' : 'Arsip kosong', 'Tambahkan libur seperti Idul Fitri, libur semester, atau kegiatan lembaga.')}</div>`}
        </div>
        <div class="stack">
          <div class="card card-pad"><h3 class="mb-12">${icon('calendar-x')} ${e.id ? 'Edit libur' : 'Tambah libur baru'}</h3><form class="form-stack" id="flibur">
            <div class="field"><label>Keterangan / nama libur <span class="req">*</span></label><input class="input" name="keterangan" value="${esc(e.keterangan)}" maxlength="120" placeholder="Contoh: Libur Idul Fitri"></div>
            <div class="grid-2"><div class="field"><label>Tanggal mulai <span class="req">*</span></label><input class="input" type="date" name="tglMulai" value="${esc(e.tglMulai)}"></div><div class="field"><label>Tanggal selesai</label><input class="input" type="date" name="tglSelesai" value="${esc(e.tglSelesai)}"></div></div>
            <div class="field"><label>Tanggal masuk kembali</label><input class="input" type="date" name="tglMasuk" value="${esc(e.tglMasuk)}"><span class="help" id="l-saran"></span></div>
            <label class="switch"><input type="checkbox" name="tampil" ${e.tampilLanding === 'ya' ? 'checked' : ''}><span class="track"></span><span class="small strong">Tampilkan pengumuman di landing page</span></label>
            <div class="note-box">${icon('shield-check')}<span>Tanggal libur otomatis dikecualikan dari hari les: absen guru ditutup, tidak dihitung di rekap, dan tidak memicu peringatan tidak masuk.</span></div>
            <div class="row-gap">${e.id ? `<button type="button" class="btn btn-light" data-batal>Batal</button>` : ''}<button class="btn btn-primary spacer" type="submit">${icon('save')} Simpan Hari Libur</button></div></form></div>
          <div class="card card-pad" style="border:2px solid var(--p-100)"><div class="row-gap mb-12"><span class="icon-dot acc">${icon('wand-sparkles')}</span><div style="flex:1"><h3>Prompt Poster Pengumuman</h3><div class="small muted">Salin, lalu tempel di ChatGPT untuk membuat poster</div></div></div>
            ${pl ? `<div class="seg full mb-12"><button class="${ui.rasio === '1:1' ? 'on' : ''}" data-rasio="1:1">${icon('image')} 1:1 Feed</button><button class="${ui.rasio === '9:16' ? 'on' : ''}" data-rasio="9:16">9:16 Status/Story</button></div>
              <div class="small strong mb-12">Untuk: ${esc(pl.keterangan)}</div><textarea class="input" id="l-prompt" rows="12" readonly style="font-size:13px">${esc(buatPrompt(pl, ui.rasio))}</textarea>
              <div class="row-gap mt-12"><button class="btn btn-accent spacer" id="l-salin">${icon('copy')} Salin Prompt</button><a class="btn btn-light" href="https://chatgpt.com/" target="_blank" rel="noopener">${icon('external-link')} Buka ChatGPT</a></div>
              <p class="tiny muted mt-8">Tip: setelah poster jadi, tempel logo lembaga di pojok kiri atas yang sudah dikosongkan.</p>`
              : A.kosong('sparkles', 'Pilih hari libur', 'Tekan "Buat Prompt Poster" pada salah satu hari libur.')}</div>
        </div></div>`;
      const f = $('#flibur');
      const saran = () => { const s = f.tglSelesai.value || f.tglMulai.value; if (!U.isTgl(s)) { $('#l-saran').textContent = ''; return; } let x = U.addDays(s, 1), g = 0; while ((U.dow(x) === 0 || U.dow(x) === 6) && g++ < 7) x = U.addDays(x, 1); $('#l-saran').innerHTML = `Saran: <a href="#" id="l-pakai">${esc(U.tglHari(x))}</a>`; $('#l-pakai').onclick = (ev) => { ev.preventDefault(); f.tglMasuk.value = x; }; };
      f.tglMulai.onchange = () => { if (!f.tglSelesai.value || f.tglSelesai.value < f.tglMulai.value) f.tglSelesai.value = f.tglMulai.value; saran(); };
      f.tglSelesai.onchange = saran; saran();
      f.onsubmit = (ev) => {
        ev.preventDefault();
        const l = { id: e.id || U.uid(), keterangan: f.keterangan.value.trim(), tglMulai: f.tglMulai.value, tglSelesai: f.tglSelesai.value || f.tglMulai.value, tglMasuk: f.tglMasuk.value, tampilLanding: f.tampil.checked ? 'ya' : 'tidak' };
        if (!l.keterangan || !l.tglMulai) return U.toast('Isi keterangan dan tanggal mulai', 'warn');
        if (l.tglSelesai < l.tglMulai) return U.toast('Tanggal selesai tidak boleh sebelum tanggal mulai', 'warn');
        A.mut((dd) => { dd.libur = dd.libur.filter((x) => x.id !== l.id).concat([Object.assign({ createdAt: U.nowIso() }, l)]); });
        A.kirim({ op: 'upsertLibur', libur: l, _label: 'Hari libur' });
        ui.edit = null; ui.prompt = l.id; ui.ym = l.tglMulai.slice(0, 7);
        U.toast('Hari libur disimpan · prompt poster siap disalin'); A.render();
      };
      const bt = $('[data-batal]'); if (bt) bt.onclick = () => { ui.edit = null; A.render(); };
      $('#l-baru').onclick = () => { ui.edit = null; A.render(); setTimeout(() => $('#flibur').keterangan.focus(), 50); };
      $$('[data-ym]').forEach((b) => b.onclick = () => { ui.ym = U.addMonths(ui.ym, +b.dataset.ym); A.render(); });
      $$('[data-tab]').forEach((b) => b.onclick = () => { ui.tab = b.dataset.tab; A.render(); });
      $$('[data-pr]').forEach((b) => b.onclick = () => { ui.prompt = b.dataset.pr; A.render(); if (window.innerWidth < 1100) setTimeout(() => $('#l-prompt').scrollIntoView({ behavior: 'smooth', block: 'center' }), 60); });
      $$('[data-ed]').forEach((b) => b.onclick = () => { ui.edit = semua.find((l) => l.id === b.dataset.ed); A.render(); $('#flibur').scrollIntoView({ behavior: 'smooth', block: 'center' }); });
      $$('[data-del]').forEach((b) => b.onclick = async () => {
        const l = semua.find((x) => x.id === b.dataset.del);
        if (!(await U.confirm({ title: 'Hapus ' + l.keterangan + '?', text: 'Tanggal tersebut kembali dihitung sebagai hari les.', ok: 'Hapus', danger: true }))) return;
        A.mut((dd) => { dd.libur = dd.libur.filter((x) => x.id !== l.id); });
        A.kirim({ op: 'deleteLibur', id: l.id, _label: 'Hapus libur' });
      });
      $$('[data-rasio]').forEach((b) => b.onclick = () => { ui.rasio = b.dataset.rasio; A.render(); });
      const sl = $('#l-salin'); if (sl) sl.onclick = async () => { if (await U.salin($('#l-prompt').value)) U.toast('Prompt disalin — tempel di ChatGPT'); };
    }
  });
  function hitungHari(l) { let n = 0, d = l.tglMulai, g = 0; while (d <= (l.tglSelesai || l.tglMulai) && g++ < 400) { const w = U.dow(d); if (w !== 0 && w !== 6) n++; d = U.addDays(d, 1); } return n; }
  function buatPrompt(l, rasio) {
    const set = D().settings;
    const rentang = l.tglSelesai && l.tglSelesai !== l.tglMulai ? `mulai ${U.tglHari(l.tglMulai)} sampai ${U.tglHari(l.tglSelesai)}` : `pada ${U.tglHari(l.tglMulai)}`;
    return [
      'Buatkan poster pengumuman libur les untuk anak-anak, gaya ceria namun tetap resmi dan rapi.',
      `Rasio ${rasio}${rasio === '9:16' ? ' (vertikal untuk status WhatsApp / story)' : ' (persegi untuk feed Instagram / Facebook / WhatsApp)'}.`,
      `Warna utama ${set.warna_utama || '#6B2F8F'}, warna pendukung oranye dan kuning lembut, latar terang.`,
      'Judul besar: "PENGUMUMAN LIBUR"',
      `Nama lembaga: ${set.nama_lembaga || set.nama_aplikasi}${set.nama_unit ? ' (' + set.nama_unit + ')' : ''}`,
      `Isi: "Kegiatan Les Baca & Berhitung diliburkan dalam rangka ${l.keterangan},`,
      `${rentang}.${l.tglMasuk ? `\nLes masuk kembali pada ${U.tglHari(l.tglMasuk)}.` : ''}"`,
      'Sediakan ruang kosong di pojok kiri atas untuk logo lembaga.',
      'Tambahkan ilustrasi anak-anak belajar membaca dan berhitung yang ramah.',
      set.wa_admin ? `Di bagian bawah tulis kontak kecil: "Info: ${U.tampilWa(set.wa_admin)}".` : '',
      'Pastikan semua teks berbahasa Indonesia, ejaan tepat, mudah dibaca, tanpa teks tambahan lain.'
    ].filter(Boolean).join('\n');
  }

  // ======================================================================
  // KELOLA LANDING PAGE (simpan otomatis + pratinjau langsung)
  // ======================================================================
  const NAMA_SEKSI = { hero: 'Banner Utama', statistik: 'Jumlah Murid', metode: 'Metode Pembelajaran', program: 'Program & Level', pengumuman: 'Pengumuman Libur', galeri: 'Galeri Foto Kegiatan', video: 'Video Kegiatan', lokasi: 'Lokasi & Peta', kontak: 'Footer Kontak' };
  const DESK_SEKSI = { hero: 'Foto banner, judul, slogan, poin unggulan', statistik: 'Angka murid Baca & Berhitung (otomatis)', metode: 'Kartu keunggulan metode belajar', program: 'Penjelasan program Baca & Berhitung', pengumuman: 'Otomatis dari menu Hari Libur', galeri: 'Foto dari HP atau link', video: 'Link YouTube / Facebook', lokasi: 'Alamat, jam les, peta Google Maps', kontak: 'Tombol WhatsApp & media sosial' };
  const IKON_METODE = ['book-open', 'calculator', 'heart', 'smile', 'star', 'puzzle', 'users', 'award', 'school', 'sparkles'];
  const isiSeksi = (s) => { try { return typeof s.isi === 'string' ? JSON.parse(s.isi || '{}') : (s.isi || {}); } catch (e) { return {}; } };
  let frameSiap = false;
  const kirimPratinjau = U.debounce(() => {
    const fr = $('#lp-frame'); if (!fr || !frameSiap) return;
    const d = D(), t = U.today();
    const sp = { ahe: 0, ala: 0, alumni: 0, guru: (d.guru || []).filter((g) => !g.tglKeluar || g.tglKeluar > t).length }; const alumni = new Set();
    R.siswaTerdaftar().forEach((s) => R.programs(s.id).forEach((p) => { if (p.status === 'aktif') sp[p.program === 'ala' ? 'ala' : 'ahe']++; if (p.status === 'lulus') alumni.add(s.id); })); sp.alumni = alumni.size;
    fr.contentWindow.postMessage({ type: 'ahe-preview', data: { statistik: sp, settings: d.settings, sections: d.landing, galeri: (d.galeri || []).filter((g) => g.tampil !== 'tidak'), libur: (d.libur || []).filter((l) => l.tampilLanding === 'ya' && (l.tglMasuk || l.tglSelesai) >= t) } }, location.origin);
  }, 250);
  window.addEventListener('message', (e) => { if (e.origin === location.origin && e.data && e.data.type === 'ahe-preview-ready') { frameSiap = true; kirimPratinjau(); } });
  const simpanSeksi = U.debounce(() => {
    A.kirim({ op: 'saveLanding', sections: D().landing, _label: 'Landing page' });
    const st = $('#lp-status'); if (st) st.innerHTML = `${icon('circle-check', 'ic-sm')} Tersimpan otomatis ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
  }, 900);
  function ubahSeksi(id, fn) {
    A.mut((d) => { const s = d.landing.find((x) => x.id === id); if (s) fn(s); }, { render: false });
    simpanSeksi(); kirimPratinjau();
  }
  A.page('landing', {
    title: 'Landing Page', crumb: 'Kelola Landing Page',
    render(view) {
      const d = D();
      const ui = A.ui.landing = A.ui.landing || { buka: 'hero', mode: 'desktop' };
      // Bagian baru yang belum ada di data lama ditambahkan otomatis
      if (d.landing && !d.landing.some((s) => s.id === 'statistik')) d.landing.push({ id: 'statistik', urutan: '1.5', tampil: 'ya', judul: 'Bersama Kami Anak Makin Percaya Diri', subjudul: 'Jumlah murid yang sedang belajar membaca dan berhitung bersama kami saat ini.', isi: '{}' });
      const seksi = (d.landing || []).slice().sort((a, b) => (+a.urutan || 0) - (+b.urutan || 0));
      view.innerHTML = `<div class="page-head"><div><h1>Kelola Landing Page</h1><p>Atur urutan, tampil/sembunyi, teks, foto, dan video halaman publik. Perubahan tersimpan otomatis.</p></div>
        <div class="actions"><span class="small muted" id="lp-status">${icon('cloud', 'ic-sm')} Simpan otomatis aktif</span><a class="btn btn-light" href="index.html" target="_blank" rel="noopener">${icon('external-link')} Lihat Halaman Publik</a></div></div>
        <div class="split" style="grid-template-columns:minmax(0,1fr)"><div class="stack" id="lp-list">${seksi.map((s, i) => `<div class="card" data-sek="${s.id}">
          <div class="sec-row"><div class="row-gap" style="gap:2px;flex-direction:column"><button class="btn btn-ghost btn-icon btn-xs" data-up="${s.id}" ${i === 0 ? 'disabled' : ''} aria-label="Naikkan">${icon('chevron-up')}</button><button class="btn btn-ghost btn-icon btn-xs" data-down="${s.id}" ${i === seksi.length - 1 ? 'disabled' : ''} aria-label="Turunkan">${icon('chevron-down')}</button></div>
            <span class="no">${String(i + 1).padStart(2, '0')}</span><div class="t"><b>${NAMA_SEKSI[s.id] || s.id}</b><div class="tiny muted ellipsis">${DESK_SEKSI[s.id] || ''}</div></div>
            <label class="switch" title="Tampilkan"><input type="checkbox" data-tampil="${s.id}" ${s.tampil !== 'tidak' ? 'checked' : ''}><span class="track"></span></label>
            <button class="btn btn-ghost btn-icon btn-sm" data-buka="${s.id}" aria-label="Edit bagian">${icon(ui.buka === s.id ? 'chevron-up' : 'pencil')}</button></div>
          ${ui.buka === s.id ? `<div class="card-body" style="border-top:1px solid var(--line-2)" id="ed-${s.id}"></div>` : ''}</div>`).join('')}</div>
          <div class="card d-only" style="position:sticky;top:80px;align-self:start"><div class="card-head"><h3>${icon('eye')} Pratinjau langsung</h3><div class="seg"><button class="${ui.mode === 'desktop' ? 'on' : ''}" data-mode="desktop">Desktop</button><button class="${ui.mode === 'hp' ? 'on' : ''}" data-mode="hp">HP</button></div></div>
            <div style="padding:12px;background:var(--surface-2)"><div class="browser-bar"><i></i><i></i><i></i><span class="tiny muted ellipsis" style="margin-left:8px">Pratinjau · perubahan langsung terlihat</span></div>
              <div style="overflow:hidden;border:1px solid var(--line-2);border-radius:0 0 14px 14px;background:#fff;height:640px;position:relative" id="lp-box"><iframe id="lp-frame" title="Pratinjau landing page" class="preview-frame" style="border-radius:0;transform-origin:0 0"></iframe></div></div></div>
        </div>`;
      // Tata letak dua kolom di layar lebar
      if (window.innerWidth >= 1100) $('.split', view).style.gridTemplateColumns = 'minmax(0,1fr) minmax(0,1.1fr)';
      // Pratinjau
      frameSiap = false;
      const fr = $('#lp-frame');
      if (fr && window.innerWidth >= 1024) {
        const box = $('#lp-box');
        const lebar = ui.mode === 'hp' ? 390 : 1280;
        const skala = Math.min(1, box.clientWidth / lebar);
        fr.style.width = lebar + 'px'; fr.style.height = (640 / skala) + 'px'; fr.style.transform = `scale(${skala})`;
        if (ui.mode === 'hp') { fr.style.marginLeft = Math.max(0, (box.clientWidth - lebar * skala) / 2) + 'px'; }
        fr.src = 'index.html?preview=1';
      }
      $$('[data-mode]').forEach((b) => b.onclick = () => { ui.mode = b.dataset.mode; A.render(); });
      $$('[data-buka]').forEach((b) => b.onclick = () => { ui.buka = ui.buka === b.dataset.buka ? '' : b.dataset.buka; A.render(); });
      $$('[data-tampil]').forEach((c) => c.onchange = () => { ubahSeksi(c.dataset.tampil, (s) => { s.tampil = c.checked ? 'ya' : 'tidak'; }); U.toast(NAMA_SEKSI[c.dataset.tampil] + (c.checked ? ' ditampilkan' : ' disembunyikan')); });
      const pindah = (id, arah) => {
        const urut = seksi.map((s) => s.id); const i = urut.indexOf(id); const j = i + arah;
        if (j < 0 || j >= urut.length) return;
        [urut[i], urut[j]] = [urut[j], urut[i]];
        A.mut((dd) => { dd.landing.forEach((s) => { s.urutan = String(urut.indexOf(s.id) + 1); }); });
        simpanSeksi(); kirimPratinjau();
      };
      $$('[data-up]').forEach((b) => b.onclick = () => pindah(b.dataset.up, -1));
      $$('[data-down]').forEach((b) => b.onclick = () => pindah(b.dataset.down, 1));
      const ed = ui.buka && $('#ed-' + ui.buka);
      if (ed) editorSeksi(ed, d.landing.find((s) => s.id === ui.buka));
    }
  });
  function editorSeksi(el, s) {
    const x = isiSeksi(s);
    const umum = `<div class="field"><label>Judul bagian</label><input class="input" data-k="judul" value="${esc(s.judul)}"></div><div class="field"><label>Subjudul</label><textarea class="input" data-k="subjudul" rows="2">${esc(s.subjudul)}</textarea></div>`;
    const bind = () => {
      $$('[data-k]', el).forEach((i) => i.oninput = () => ubahSeksi(s.id, (z) => { z[i.dataset.k] = i.value; }));
      $$('[data-x]', el).forEach((i) => i.oninput = () => ubahSeksi(s.id, (z) => { const o = isiSeksi(z); o[i.dataset.x] = i.dataset.lines ? i.value.split('\n').map((v) => v.trim()).filter(Boolean) : i.value; z.isi = JSON.stringify(o); }));
    };
    if (s.id === 'hero') {
      el.innerHTML = `<div class="form-stack">${umum.replace('Judul bagian', 'Judul utama (H1)')}
        <div class="field"><label>Lencana di atas judul</label><input class="input" data-x="badge" value="${esc(x.badge || '')}"></div>
        <div class="field"><label>Poin unggulan (satu per baris)</label><textarea class="input" data-x="poin" data-lines="1" rows="3">${esc((x.poin || []).join('\n'))}</textarea></div>
        <div class="field"><label>Foto banner (sampul)</label><div class="row-gap">${x.fotoUrl ? `<img src="${esc(x.fotoUrl)}" alt="" referrerpolicy="no-referrer" style="width:100%;max-width:360px;aspect-ratio:12/5;object-fit:cover;border-radius:12px">` : '<span class="small muted">Belum ada (memakai foto galeri pertama, atau latar warna utama)</span>'}</div>
          <span class="help">${icon('info', 'ic-sm')} Pakai foto <b>mendatar (landscape)</b>, idealnya 1920×800 px. Banner memenuhi lebar layar laptop & HP; bagian tengah foto selalu terlihat.</span>
          <div class="row-gap mt-8"><button class="btn btn-soft btn-sm" data-up-hero>${icon('upload')} Unggah dari HP/Komputer</button><button class="btn btn-light btn-sm" data-link-hero>${icon('link')} Pakai link</button>${x.fotoUrl ? `<button class="btn btn-danger-ghost btn-sm" data-hapus-hero>${icon('trash-2')} Hapus</button>` : ''}</div></div></div>`;
      bind();
      $('[data-up-hero]', el).onclick = async () => { const r = await unggahFoto(false, 2000); if (r) { ubahSeksi('hero', (z) => { const o = isiSeksi(z); o.fotoUrl = r.url; z.isi = JSON.stringify(o); }); A.render(); } };
      $('[data-link-hero]', el).onclick = async () => { const u = await U.prompt({ title: 'Link foto sampul', label: 'Alamat gambar (https://…)', icon: 'link', ok: 'Pakai' }); if (u && /^https?:\/\//.test(u)) { ubahSeksi('hero', (z) => { const o = isiSeksi(z); o.fotoUrl = u.trim(); z.isi = JSON.stringify(o); }); A.render(); } };
      const h = $('[data-hapus-hero]', el); if (h) h.onclick = () => { ubahSeksi('hero', (z) => { const o = isiSeksi(z); o.fotoUrl = ''; z.isi = JSON.stringify(o); }); A.render(); };
    } else if (s.id === 'metode') {
      const k = x.kartu || [];
      el.innerHTML = `<div class="form-stack">${umum}${k.map((c, i) => `<div class="card soft card-pad" data-kartu="${i}"><div class="row-gap mb-12"><b style="flex:1">Kartu ${i + 1}</b><select class="input" data-ki="ikon" style="width:auto;min-height:36px">${IKON_METODE.map((ic) => `<option ${c.ikon === ic ? 'selected' : ''}>${ic}</option>`).join('')}</select><button class="btn btn-danger-ghost btn-icon btn-sm" data-hapus-k="${i}">${icon('trash-2')}</button></div>
        <div class="field"><input class="input" data-ki="judul" value="${esc(c.judul)}" placeholder="Judul"></div><div class="field mt-8"><textarea class="input" data-ki="deskripsi" rows="2" placeholder="Deskripsi">${esc(c.deskripsi)}</textarea></div></div>`).join('')}
        <button class="btn btn-soft" data-tambah-k>${icon('plus')} Tambah kartu</button></div>`;
      bind();
      const simpanK = () => ubahSeksi('metode', (z) => { const o = isiSeksi(z); o.kartu = $$('[data-kartu]', el).map((c) => ({ ikon: $('[data-ki=ikon]', c).value, judul: $('[data-ki=judul]', c).value, deskripsi: $('[data-ki=deskripsi]', c).value })); z.isi = JSON.stringify(o); });
      $$('[data-ki]', el).forEach((i) => { i.oninput = simpanK; i.onchange = simpanK; });
      $$('[data-hapus-k]', el).forEach((b) => b.onclick = () => { ubahSeksi('metode', (z) => { const o = isiSeksi(z); o.kartu.splice(+b.dataset.hapusK, 1); z.isi = JSON.stringify(o); }); A.render(); });
      $('[data-tambah-k]', el).onclick = () => { ubahSeksi('metode', (z) => { const o = isiSeksi(z); (o.kartu = o.kartu || []).push({ ikon: 'star', judul: 'Keunggulan baru', deskripsi: '' }); z.isi = JSON.stringify(o); }); A.render(); };
    } else if (s.id === 'program') {
      el.innerHTML = `<div class="form-stack">${umum}<div class="field"><label>Penjelasan Les Baca (Ahe)</label><textarea class="input" data-x="ahe" rows="3">${esc(x.ahe || '')}</textarea></div><div class="field"><label>Penjelasan Les Berhitung (Ala)</label><textarea class="input" data-x="ala" rows="3">${esc(x.ala || '')}</textarea></div>
        <p class="help">${icon('info', 'ic-sm')} Daftar level (Baca 1–7; Berhitung 1–6 & 7–16) ditampilkan otomatis.</p></div>`;
      bind();
    } else if (s.id === 'statistik') {
      el.innerHTML = `<div class="form-stack">${umum}<div class="note-box">${icon('info')}<span>Angka <b>murid Les Baca</b>, <b>murid Les Berhitung</b>, <b>alumni</b>, dan <b>guru</b> dihitung otomatis dari data siswa aktif — selalu terbaru tanpa perlu diubah manual.</span></div></div>`;
      bind();
    } else if (s.id === 'pengumuman') {
      const l = (D().libur || []).filter((z) => z.tampilLanding === 'ya' && (z.tglMasuk || z.tglSelesai) >= U.today());
      el.innerHTML = `<div class="note-box">${icon('info')}<span>Bagian ini otomatis menampilkan libur yang dicentang "Tampilkan di landing page". ${l.length ? 'Saat ini: <b>' + esc(l[0].keterangan) + '</b>.' : 'Saat ini tidak ada.'} <a href="#/libur">Kelola hari libur</a></span></div>`;
    } else if (s.id === 'galeri' || s.id === 'video') {
      const jenis = s.id === 'galeri' ? 'foto' : 'video';
      const items = (D().galeri || []).filter((g) => g.jenis === jenis).sort((a, b) => (+a.urutan || 0) - (+b.urutan || 0));
      el.innerHTML = `<div class="form-stack">${umum}
        ${jenis === 'foto' ? `<div class="row-gap"><span class="chip chip-ahe">${items.length} foto</span><span class="spacer"></span><button class="btn btn-primary btn-sm" data-up-foto>${icon('upload')} Unggah foto</button><button class="btn btn-light btn-sm" data-link-foto>${icon('link')} Tambah dari link</button></div>
          <p class="help">${icon('info', 'ic-sm')} Foto dikompres otomatis (maks 1600 px) sebelum disimpan ke Google Drive.</p>
          <div class="thumbs">${items.map((g) => `<div class="thumb"><img src="${esc(g.url)}" alt="" loading="lazy" referrerpolicy="no-referrer"><button class="x" data-del-g="${g.id}" aria-label="Hapus">${icon('trash-2', 'ic-sm')}</button><input value="${esc(g.judul)}" data-cap="${g.id}" placeholder="Keterangan foto"></div>`).join('')}</div>`
        : `<div class="row-gap"><input class="input" id="v-url" placeholder="Tempel link YouTube / Facebook" style="flex:1"><button class="btn btn-primary" data-add-v>${icon('plus')} Tambah</button></div>
          <p class="help">Contoh: youtube.com/watch?v=…, youtu.be/…, youtube.com/shorts/…, atau link video Facebook.</p>
          <div class="note-box warn">${icon('triangle-alert')}<span><b>Video Facebook</b> hanya bisa diputar di website bila: (1) privasi postingannya <b>Publik</b> (ikon 🌐), (2) diunggah di <b>Halaman/Page</b> atau profil yang mengizinkan sematan, bukan di grup tertutup. Pratinjau di bawah menunjukkan apakah video bisa diputar. Paling andal: unggah juga ke <b>YouTube</b> lalu pakai link YouTube.</span></div>
          <div class="stack-sm">${items.map((g) => { const yt = U.ytId(g.url); return `<div class="row-gap card soft card-pad" style="padding:10px">${yt ? `<img src="https://i.ytimg.com/vi/${yt}/default.jpg" alt="" style="width:80px;border-radius:8px">` : `<span class="icon-dot">${icon('facebook')}</span>`}
            <div style="flex:1;min-width:0"><span class="chip chip-sm ${yt ? 'chip-bad' : 'chip-info'}">${yt ? 'YouTube' : 'Facebook'}</span><input class="input mt-8" style="min-height:36px" value="${esc(g.judul)}" data-cap="${g.id}" placeholder="Judul video"><div class="tiny muted ellipsis mt-8">${esc(g.url)}</div>
              ${yt ? '' : `<details class="mt-8"><summary class="small strong" style="cursor:pointer">Cek apakah video bisa diputar</summary><div class="fb-cek mt-8"><iframe loading="lazy" title="Pratinjau video Facebook" src="${esc(U.fbEmbed(g.url))}" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe></div><p class="tiny muted mt-8">Jika muncul "Video Tidak Tersedia", ubah privasi postingan menjadi Publik atau pakai link YouTube.</p></details>`}</div>
            <button class="btn btn-danger-ghost btn-icon btn-sm" data-del-g="${g.id}">${icon('trash-2')}</button></div>`; }).join('') || '<p class="small muted">Belum ada video.</p>'}</div>`}</div>`;
      bind();
      const tambahItem = (it) => {
        const g = Object.assign({ id: U.uid(), jenis, sumber: 'link', fileId: '', judul: '', urutan: String(items.length + 1), tampil: 'ya', createdAt: U.nowIso() }, it);
        A.mut((dd) => { dd.galeri.push(g); });
        A.kirim({ op: 'upsertGaleri', item: g, _label: jenis === 'foto' ? 'Foto galeri' : 'Video' });
        kirimPratinjau();
      };
      const uf = $('[data-up-foto]', el);
      if (uf) uf.onclick = async () => { const r = await unggahFoto(true); if (r) r.forEach((x) => tambahItem({ sumber: 'unggah', url: x.url, fileId: x.fileId, judul: x.judul })); };
      const lf = $('[data-link-foto]', el);
      if (lf) lf.onclick = async () => { const u = await U.prompt({ title: 'Tambah foto dari link', label: 'Alamat gambar (https://…)', icon: 'link', ok: 'Tambah' }); if (u && /^https?:\/\//.test(u.trim())) tambahItem({ url: u.trim() }); else if (u) U.toast('Link harus diawali https://', 'warn'); };
      const av = $('[data-add-v]', el);
      if (av) av.onclick = async () => {
        let u = $('#v-url').value.trim();
        if (!/youtu\.?be|facebook\.com|fb\.watch/i.test(u)) return U.toast('Link harus dari YouTube atau Facebook', 'warn');
        if (/facebook\.com\/share\/|fb\.watch/i.test(u)) { // link "Bagikan" → cari alamat asli video
          av.disabled = true;
          try { const r = await U.api('normalVideo', { token: A.S.token, url: u }); if (r && r.url) u = r.url; } catch (e) { /* pakai link apa adanya */ }
          av.disabled = false;
        }
        tambahItem({ url: U.fbVideoUrl(u), judul: '' }); U.toast('Video ditambahkan'); A.render();
      };
      $$('[data-cap]', el).forEach((i) => i.oninput = U.debounce(() => {
        const g = D().galeri.find((z) => z.id === i.dataset.cap); if (!g) return;
        g.judul = i.value; A.mut(() => { }, { render: false });
        A.kirim({ op: 'upsertGaleri', item: g, _label: 'Keterangan galeri' }); kirimPratinjau();
      }, 700));
      $$('[data-del-g]', el).forEach((b) => b.onclick = async () => {
        if (!(await U.confirm({ title: 'Hapus ' + jenis + ' ini?', ok: 'Hapus', danger: true }))) return;
        A.mut((dd) => { dd.galeri = dd.galeri.filter((z) => z.id !== b.dataset.delG); });
        A.kirim({ op: 'deleteGaleri', id: b.dataset.delG, _label: 'Hapus galeri' }); kirimPratinjau();
      });
    } else if (s.id === 'lokasi') {
      const set = D().settings;
      const titik = x.mapsLat && x.mapsLng;
      el.innerHTML = `<div class="form-stack">${umum}<div class="field"><label>Alamat lengkap</label><textarea class="input" data-x="alamat" rows="2" placeholder="${esc(U.alamatLengkap(set) || 'Kosongkan untuk memakai alamat di Pengaturan → Identitas')}">${esc(x.alamat || '')}</textarea><span class="help">Kosongkan untuk memakai alamat dari Pengaturan → Identitas.</span></div>
        <div class="field"><label>Jam les</label><input class="input" data-x="jam" value="${esc(x.jam || '')}"></div>
        <div class="field"><label>Link Google Maps</label><div class="row-gap"><input class="input" id="lk-maps" value="${esc(x.mapsLink || '')}" placeholder="Tempel link: https://maps.app.goo.gl/…" style="flex:1"><button class="btn btn-primary" id="lk-pakai">${icon('map-pin')} Pasang</button></div>
          <span class="help">Di aplikasi Google Maps: buka lokasi les → <b>Bagikan</b> → <b>Salin link</b>, lalu tempel di sini. Titik merah otomatis muncul di peta landing page.</span>
          <div id="lk-st" class="mt-8">${titik ? `<div class="note-box ok">${icon('circle-check')}<span>Titik peta terpasang: <b class="num">${esc(x.mapsLat)}, ${esc(x.mapsLng)}</b>${x.mapsNama ? ' · ' + esc(x.mapsNama) : ''}</span></div>` : ''}</div></div>
        ${titik ? `<div class="map" style="min-height:220px"><iframe loading="lazy" title="Pratinjau peta" style="min-height:220px" src="https://maps.google.com/maps?q=${encodeURIComponent(x.mapsLat + ',' + x.mapsLng)}&z=17&hl=id&output=embed"></iframe></div>` : ''}
        <details${titik ? '' : ' open'}><summary class="small strong" style="cursor:pointer">Cara lain: cari dengan nama tempat / koordinat</summary>
          <div class="field mt-8"><input class="input" data-x="mapsQuery" value="${esc(x.mapsQuery || '')}" placeholder="-0.5052, 117.5502 atau nama tempat"><span class="help">Dipakai bila link Google Maps belum dipasang.</span></div></details></div>`;
      bind();
      $('#lk-pakai', el).onclick = async (e) => {
        const b = e.currentTarget, url = $('#lk-maps', el).value.trim();
        if (!url) { ubahSeksi('lokasi', (z) => { const o = isiSeksi(z); delete o.mapsLat; delete o.mapsLng; delete o.mapsNama; o.mapsLink = ''; z.isi = JSON.stringify(o); }); A.render(); return; }
        const asli = b.innerHTML; b.disabled = true; b.innerHTML = `${icon('loader-circle', 'spin')} Membaca…`;
        try {
          const r = await U.api('petaDariLink', { token: A.S.token, url });
          ubahSeksi('lokasi', (z) => { const o = isiSeksi(z); o.mapsLink = url; o.mapsLat = String(r.lat); o.mapsLng = String(r.lng); o.mapsNama = r.nama || ''; z.isi = JSON.stringify(o); });
          U.toast('Titik lokasi terpasang di peta'); A.render();
        } catch (er) { $('#lk-st', el).innerHTML = `<div class="note-box bad">${icon('triangle-alert')}<span>${esc(er.message)}</span></div>`; b.disabled = false; b.innerHTML = asli; }
      };
    } else if (s.id === 'kontak') {
      el.innerHTML = `<div class="form-stack"><p class="help">${icon('info', 'ic-sm')} Footer berisi tombol WhatsApp dan tombol media sosial. Kosongkan link yang tidak dipakai.</p>
        <div class="field"><label>Link Facebook</label><input class="input" data-x="facebook" value="${esc(x.facebook || '')}" placeholder="https://facebook.com/…"></div>
        <div class="field"><label>Link Instagram</label><input class="input" data-x="instagram" value="${esc(x.instagram || '')}"></div>
        <div class="field"><label>Link YouTube</label><input class="input" data-x="youtube" value="${esc(x.youtube || '')}"></div>
        <div class="field"><label>Link TikTok</label><input class="input" data-x="tiktok" value="${esc(x.tiktok || '')}" placeholder="https://tiktok.com/@…"></div>
        <p class="help">${icon('info', 'ic-sm')} Nomor WhatsApp kontak diambil dari Pengaturan → WhatsApp.</p></div>`;
      bind();
    }
  }
  // Unggah foto ke Drive (dikompres di perangkat)
  async function unggahFoto(banyak, maks) {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.multiple = !!banyak;
    const files = await new Promise((res) => { inp.onchange = () => res(Array.from(inp.files || [])); inp.click(); });
    if (!files.length) return null;
    const hasil = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.size > 15 * 1024 * 1024) { U.toast(f.name + ' terlalu besar', 'warn'); continue; }
      U.toast(`Mengunggah foto ${i + 1}/${files.length}…`, 'info', 2500);
      try {
        const k = await U.kompres(f, maks || 1600, 0.85);
        const r = await U.api('uploadFile', { token: A.S.token, tujuan: 'galeri', mime: k.mime, base64: k.base64, name: f.name.replace(/\.[^.]+$/, '') + '.jpg' }, { timeout: 150000 });
        if (!r.publik) U.toast('Foto tersimpan, tetapi berbagi publik diblokir akun Google ini — foto mungkin tidak tampil.', 'warn', 7000);
        hasil.push({ url: r.url, fileId: r.fileId, judul: f.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').slice(0, 60) });
      } catch (e) { U.toast('Gagal mengunggah ' + f.name + ': ' + e.message, 'bad'); }
    }
    if (hasil.length) U.toast(hasil.length + ' foto diunggah');
    return banyak ? hasil : hasil[0];
  }

  // ======================================================================
  // PENGATURAN
  // ======================================================================
  const PRESET_WARNA = [['#6B2F8F', 'Ungu'], ['#1E3A8A', 'Biru Navy'], ['#047857', 'Hijau Zamrud'], ['#B91C1C', 'Merah Bata'], ['#0F766E', 'Toska'], ['#C2410C', 'Oranye Bata'], ['#BE185D', 'Merah Muda'], ['#1F2937', 'Arang']];
  const TOKEN_TPL = ['{lembaga}', '{nama}', '{panggilan}', '{ortu}', '{program}', '{kode}', '{level}', '{wa}', '{bulan_tunggakan}', '{total}', '{link_kuitansi}', '{hari_absen}', '{terakhir_hadir}', '{wa_admin}'];
  const TPL = [['tpl_wa_daftar_ortu', 'Pendaftaran – ke Orang Tua', 'Dikirim otomatis saat formulir terkirim'], ['tpl_wa_daftar_admin', 'Pendaftaran – ke Admin', 'Notifikasi pendaftar baru'], ['tpl_wa_terima', 'Diterima – ke Orang Tua', 'Saat admin menerima pendaftar'],
    ['tpl_wa_tunggakan', 'Tunggakan SPP 2 Bulan', 'Pemicu harian 07.00 WITA, sekali per bulan'], ['tpl_wa_absen_admin', 'Siswa Tidak Masuk – ke Admin', 'Pemicu harian, sekali per periode absen'], ['tpl_wa_kuitansi', 'Kuitansi SPP', 'Saat SPP ditandai lunas']];
  A.page('pengaturan', {
    title: 'Pengaturan', crumb: 'Pengaturan',
    render(view, params) {
      const demo = (D().settings || {}).mode_demo === 'ya';
      const tab = params[0] === 'demo' && !demo ? 'identitas' : (params[0] || 'identitas');
      view.innerHTML = `<div class="page-head"><div><h1>Pengaturan</h1><p>Identitas lembaga, pendaftaran, SPP, kehadiran, WhatsApp (Fonnte), akun, dan piagam.</p></div></div>
        <div class="tabs mb-16">${[['identitas', 'Identitas', 'palette'], ['pendaftaran', 'Pendaftaran', 'user-plus'], ['spp', 'SPP', 'wallet'], ['kehadiran', 'Kehadiran', 'calendar-check'], ['wa', 'WhatsApp', 'message-circle'], ['akun', 'Akun', 'key-round'], ['piagam', 'Piagam', 'award']].concat(demo ? [['demo', 'Mode Demo', 'sparkles']] : [])
          .map(([k, l, ic]) => `<a class="tab ${tab === k ? 'on' : ''}" href="#/pengaturan/${k}">${icon(ic, 'ic-sm')} ${l}</a>`).join('')}</div><div id="set-isi"></div>`;
      const el = $('#set-isi');
      ({ identitas: setIdentitas, pendaftaran: setDaftar, spp: setSpp, kehadiran: setHadir, wa: setWa, akun: setAkun, demo: setDemo, piagam: (x) => window.Piagam ? Piagam.pengaturan(x) : (x.innerHTML = '') }[tab] || setIdentitas)(el);
    }
  });
  function simpanSet(values, label) {
    A.mut((d) => { Object.assign(d.settings, values); });
    A.kirim({ op: 'saveSettings', values, _label: label || 'Pengaturan' });
    U.toast((label || 'Pengaturan') + ' disimpan');
  }
  const fld = (k, l, v, attr, help) => `<div class="field"><label>${l}</label><input class="input" name="${k}" value="${esc(v || '')}" ${attr || ''}>${help ? `<span class="help">${help}</span>` : ''}</div>`;
  function setIdentitas(el) {
    const s = D().settings;
    let logo = s.logo_data || '', warna = s.warna_utama || '#6B2F8F';
    el.innerHTML = `<div class="split"><form class="card card-pad form-stack" id="fid"><h3>${icon('school')} Identitas lembaga</h3>
        ${fld('nama_aplikasi', 'Nama aplikasi', s.nama_aplikasi, 'maxlength="60"', 'Tampil di header, login, dan judul halaman')}
        ${fld('nama_lembaga', 'Nama lembaga resmi', s.nama_lembaga, 'maxlength="120"', 'Dipakai di kuitansi, rekap PDF, dan pesan WA')}
        ${fld('slogan', 'Slogan singkat', s.slogan)}
        <div class="grid-2">${fld('nama_unit', 'Nama unit', s.nama_unit, 'maxlength="100"', 'Menjadi “Unit Pembelajaran” di piagam Ahe')}${fld('no_unit', 'No. Unit (4 digit)', s.no_unit, 'maxlength="4" inputmode="numeric" pattern="[0-9]{4}" placeholder="Contoh: 3924"', '<span id="id-nomor">Dipakai di nomor piagam</span>')}</div>
        ${fld('kepala_unit', 'Kepala Unit', s.kepala_unit || s.kuitansi_penerima, 'maxlength="100"', 'Penanda tangan kuitansi & nama Kepala Unit di piagam')}
        <div class="grid-2">${fld('kecamatan', 'Kecamatan', s.kecamatan, 'maxlength="80"')}${fld('desa', 'Desa / Kelurahan', s.desa, 'maxlength="80"', 'Menjadi “Desa / Kelurahan” di piagam Ala')}</div>
        <div class="field"><label>Alamat</label><textarea class="input" name="alamat" rows="2" maxlength="200" placeholder="Contoh: Jl. Pendidikan No. 45, RT 05">${esc(s.alamat || '')}</textarea><span class="help">Isi nama jalan, RT, dan nomor. Desa & kecamatan diambil dari kolom di atas.</span></div>
        <button class="btn btn-primary" type="submit">${icon('save')} Simpan identitas</button></form>
      <div class="stack"><div class="card card-pad"><h3 class="mb-12">${icon('image')} Logo lembaga</h3><div class="row-gap"><div id="lg-prev" style="width:96px;height:96px;border-radius:24px;background:var(--p-50);display:grid;place-items:center;overflow:hidden;border:1px solid var(--line)">${logo ? `<img src="${logo}" alt="" style="width:100%;height:100%;object-fit:contain">` : icon('image', 'ic-xl')}</div>
        <div class="stack-sm"><button class="btn btn-soft btn-sm" id="lg-up">${icon('upload')} Unggah logo</button>${logo ? `<button class="btn btn-danger-ghost btn-sm" id="lg-del">${icon('trash-2')} Hapus logo</button>` : ''}<span class="tiny muted">PNG transparan disarankan. Dikompres otomatis.</span></div></div></div>
        <div class="card card-pad"><h3 class="mb-12">${icon('square-pen')} Tanda tangan kuitansi</h3><div class="row-gap" style="align-items:flex-start"><div id="ttd-prev" class="ttd-prev">${s.ttd_data ? `<img src="${s.ttd_data}" alt="Tanda tangan">` : '<span class="tiny muted">Belum ada</span>'}</div>
          <div class="stack-sm"><button class="btn btn-soft btn-sm" id="ttd-up">${icon('upload')} Unggah tanda tangan</button>${s.ttd_data ? `<button class="btn btn-danger-ghost btn-sm" id="ttd-del">${icon('trash-2')} Hapus</button>` : ''}<span class="tiny muted">PNG transparan paling baik. Foto/scan di kertas putih juga bisa — latar putih dihapus otomatis.</span></div></div>
          <p class="help mt-8">${icon('info', 'ic-sm')} Tampil di atas nama ${esc(s.kepala_unit || 'Kepala Unit')} pada kuitansi (layar, cetak, PDF, dan link WA).</p></div>
        <div class="card card-pad"><h3 class="mb-12">${icon('palette')} Warna utama</h3><div class="swatches">${PRESET_WARNA.map(([h, n]) => `<button class="swatch ${h.toLowerCase() === warna.toLowerCase() ? 'on' : ''}" style="background:${h}" data-w="${h}" title="${n}" aria-label="${n}">${h.toLowerCase() === warna.toLowerCase() ? icon('check', 'ic-sm') : ''}</button>`).join('')}
          <label class="swatch" style="background:conic-gradient(red,yellow,lime,cyan,blue,magenta,red);position:relative" title="Warna lain"><input type="color" id="w-pick" value="${esc(warna)}" style="opacity:0;position:absolute;inset:0;cursor:pointer"></label></div>
          <div class="row-gap mt-12"><span class="chip num" id="w-hex">${esc(warna.toUpperCase())}</span><span class="small" id="w-kontras"></span></div>
          <div class="row-gap mt-12"><button class="btn btn-primary btn-sm">Contoh tombol</button><span class="chip chip-ahe">Chip</span><a class="small strong">Tautan</a></div>
          <p class="help mt-8">${icon('sparkles', 'ic-sm')} Warna teks tombol otomatis menyesuaikan agar tetap terbaca (kontras ≥ 4,5:1).</p>
          <button class="btn btn-primary mt-12" id="w-simpan">${icon('save')} Simpan warna</button></div></div></div>`;
    $('#fid').onsubmit = (e) => {
      e.preventDefault(); const f = e.target;
      const v = {}; ['nama_aplikasi', 'nama_lembaga', 'nama_unit', 'no_unit', 'kepala_unit', 'kecamatan', 'desa', 'slogan', 'alamat'].forEach((k) => { v[k] = f[k].value.trim(); });
      v.kuitansi_penerima = v.kepala_unit;
      if (v.no_unit && !/^\d{4}$/.test(v.no_unit)) { f.no_unit.focus(); return U.toast('No. Unit harus 4 digit angka, contoh 3924', 'warn'); }
      if (!v.nama_aplikasi) return U.toast('Nama aplikasi wajib diisi', 'warn');
      simpanSet(v, 'Identitas'); A.render(); document.querySelector('.brand .t1') && (document.querySelector('.brand .t1').textContent = v.nama_aplikasi);
    };
    const tampilWarna = (h) => { warna = h; U.applyTheme(h); $('#w-hex').textContent = h.toUpperCase(); const k = U.kontras(h, '#FFFFFF'); $('#w-kontras').innerHTML = k >= 4.5 ? `<span style="color:var(--ok-700)">${icon('circle-check', 'ic-sm')} Kontras baik (${k.toFixed(1)}:1)</span>` : `<span style="color:var(--warn-700)">${icon('triangle-alert', 'ic-sm')} Teks tombol memakai warna gelap (${k.toFixed(1)}:1)</span>`; $$('[data-w]').forEach((b) => { const on = b.dataset.w.toLowerCase() === h.toLowerCase(); b.classList.toggle('on', on); b.innerHTML = on ? icon('check', 'ic-sm') : ''; }); };
    tampilWarna(warna);
    $$('[data-w]').forEach((b) => b.onclick = () => tampilWarna(b.dataset.w));
    $('#w-pick').oninput = (e) => tampilWarna(e.target.value);
    $('#w-simpan').onclick = () => { simpanSet({ warna_utama: warna }, 'Warna utama'); };
    $('#lg-up').onclick = async () => {
      const f = await U.pilihFile('image/png,image/jpeg,image/webp,image/svg+xml'); if (!f) return;
      try {
        let k = await U.kompres(f, 256, 0.92, 'image/png');
        if (k.dataUrl.length > 45000) k = await U.kompres(f, 220, 0.85, 'image/jpeg');
        if (k.dataUrl.length > 45000) k = await U.kompres(f, 160, 0.8, 'image/jpeg');
        logo = k.dataUrl;
        simpanSet({ logo_data: logo }, 'Logo');
        A.refresh(true); document.querySelectorAll('.brand .logo, .tb-logo').forEach((x) => { x.innerHTML = `<img src="${logo}" alt="">`; });
      } catch (e) { U.toast(e.message, 'bad'); }
    };
    const ld = $('#lg-del'); if (ld) ld.onclick = () => { simpanSet({ logo_data: '' }, 'Logo dihapus'); A.refresh(true); };
    $('#ttd-up').onclick = async () => {
      const f = await U.pilihFile('image/png,image/jpeg,image/webp'); if (!f) return;
      try { const url = await U.olahTtd(f); simpanSet({ ttd_data: url }, 'Tanda tangan'); A.refresh(true); }
      catch (e) { U.toast(e.message, 'bad', 7000); }
    };
    const td = $('#ttd-del'); if (td) td.onclick = async () => { if (await U.confirm({ title: 'Hapus tanda tangan?', text: 'Kuitansi akan tampil tanpa gambar tanda tangan.', ok: 'Hapus', danger: true })) { simpanSet({ ttd_data: '' }, 'Tanda tangan dihapus'); A.refresh(true); } };
    const nomorContoh = () => { const el = $('#id-nomor'); if (!el) return; const nu = $('#fid').no_unit.value.trim(); el.innerHTML = 'Contoh nomor piagam: <b class="num">' + esc(Piagam.formatNomor(1, 'ahe', U.today(), nu)) + '</b>'; };
    $('#fid').no_unit.addEventListener('input', (e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); if (v !== e.target.value) e.target.value = v; nomorContoh(); }); nomorContoh();
  }
  function setDaftar(el) {
    const s = D().settings;
    let opsi = []; try { opsi = JSON.parse(s.opsi_info_dari || '[]'); } catch (e) { opsi = []; }
    const link = U.urlBaseFrontend() + '#/daftar';
    el.innerHTML = `<div class="split"><form class="card card-pad form-stack" id="fd"><h3>${icon('user-plus')} Formulir pendaftaran</h3>
      <label class="switch"><input type="checkbox" name="buka" ${s.pendaftaran_buka === 'ya' ? 'checked' : ''}><span class="track"></span><span class="strong">Pendaftaran dibuka</span></label>
      <div class="field"><label>Pesan saat pendaftaran ditutup</label><textarea class="input" name="pesan" rows="3">${esc(s.pesan_pendaftaran_tutup || '')}</textarea></div>
      <div class="field"><label>Pilihan "Info Dari" (satu per baris)</label><textarea class="input" name="opsi" rows="6">${esc(opsi.join('\n'))}</textarea></div>
      <button class="btn btn-primary">${icon('save')} Simpan</button></form>
      <div class="card card-pad"><h3 class="mb-12">${icon('link')} Bagikan formulir</h3><div class="input-group"><input class="input" readonly value="${esc(link)}"></div>
        <div class="row-gap mt-12"><button class="btn btn-soft btn-sm" id="cp">${icon('copy')} Salin link</button><a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent('Pendaftaran Les Baca & Berhitung ' + (s.nama_aplikasi || '') + ' dibuka! Daftar di sini: ' + link)}">${icon('message-circle')} Bagikan ke WA</a></div>
        <div style="text-align:center" class="mt-16"><img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=8&data=${encodeURIComponent(link)}" alt="Kode QR" style="width:200px;margin:0 auto;border-radius:12px;border:1px solid var(--line)"><a class="btn btn-light btn-sm mt-12" target="_blank" rel="noopener" href="https://api.qrserver.com/v1/create-qr-code/?size=800x800&margin=12&data=${encodeURIComponent(link)}">${icon('download')} Unduh kode QR</a></div></div></div>`;
    $('#cp').onclick = async () => { if (await U.salin(link)) U.toast('Link disalin'); };
    $('#fd').onsubmit = (e) => { e.preventDefault(); const f = e.target; simpanSet({ pendaftaran_buka: f.buka.checked ? 'ya' : 'tidak', pesan_pendaftaran_tutup: f.pesan.value.trim(), opsi_info_dari: JSON.stringify(f.opsi.value.split('\n').map((x) => x.trim()).filter(Boolean)) }, 'Pengaturan pendaftaran'); };
  }
  function setSpp(el) {
    const s = D().settings;
    const tarif = (D().tarif || []).slice().sort((a, b) => b.berlakuMulai.localeCompare(a.berlakuMulai));
    el.innerHTML = `<div class="split"><form class="card card-pad form-stack" id="fs"><h3>${icon('wallet')} Aturan SPP</h3>
      ${fld('spp_jatuh_tempo', 'Tanggal jatuh tempo setiap bulan', s.spp_jatuh_tempo, 'type="number" min="1" max="28"', 'SPP bulan berjalan dianggap menunggak setelah tanggal ini')}
      ${fld('spp_mulai_bulan', 'Mulai pencatatan SPP', s.spp_mulai_bulan, 'type="month"', 'Bulan sebelum ini tidak ditagih (agar data lama tidak dianggap menunggak)')}
      <button class="btn btn-primary">${icon('save')} Simpan</button></form>
      <div class="card card-pad"><div class="row-gap mb-12"><h3 style="flex:1">${icon('banknote')} Tarif SPP</h3><button class="btn btn-soft btn-sm" id="tf">${icon('plus')} Atur tarif</button></div>
        ${tarif.length ? tarif.map((t, i) => `<div class="row-gap card soft card-pad mb-12" style="padding:10px 14px"><b style="flex:1">${U.bulan(t.berlakuMulai)}${i === 0 ? ' <span class="chip chip-ok chip-sm">terbaru</span>' : ''}</b><span class="num strong">${U.rp(t.nominal)}</span></div>`).join('') : '<p class="small muted">Belum ada tarif.</p>'}</div></div>`;
    $('#tf').onclick = () => A.aturTarif();
    $('#fs').onsubmit = (e) => { e.preventDefault(); const f = e.target; const j = +f.spp_jatuh_tempo.value; if (!(j >= 1 && j <= 28)) return U.toast('Jatuh tempo 1–28', 'warn'); simpanSet({ spp_jatuh_tempo: String(j), spp_mulai_bulan: f.spp_mulai_bulan.value }, 'Pengaturan SPP'); };
  }
  function setHadir(el) {
    const s = D().settings;
    el.innerHTML = `<form class="card card-pad form-stack" id="fh" style="max-width:640px"><h3>${icon('calendar-check')} Aturan kehadiran</h3>
      ${fld('ambang_absen_hari', 'Batas hari les tidak masuk berturut-turut', s.ambang_absen_hari, 'type="number" min="1" max="60"', 'Bawaan 10 hari les ≈ 2 minggu Senin–Jumat. Siswa ditandai & admin menerima WA.')}
      ${fld('ambang_siswa_banyak', 'Batas jumlah siswa per guru per hari', s.ambang_siswa_banyak, 'type="number" min="1" max="60"', 'Hari dengan siswa LEBIH dari angka ini masuk rekap khusus guru.')}
      ${fld('hadir_mulai', 'Mulai pencatatan kehadiran', s.hadir_mulai, 'type="date"', 'Hari sebelum tanggal ini tidak dihitung sebagai absen.')}
      <div class="note-box">${icon('info')}<span>Hari les = Senin–Jumat dikurangi hari libur khusus. Atur libur di menu <a href="#/libur">Hari Libur</a>.</span></div>
      <button class="btn btn-primary">${icon('save')} Simpan</button></form>`;
    $('#fh').onsubmit = (e) => { e.preventDefault(); const f = e.target; simpanSet({ ambang_absen_hari: String(+f.ambang_absen_hari.value || 10), ambang_siswa_banyak: String(+f.ambang_siswa_banyak.value || 10), hadir_mulai: f.hadir_mulai.value }, 'Pengaturan kehadiran'); };
  }
  function setWa(el) {
    const d = D(), s = d.settings;
    const mati = new Set(String(s.tpl_nonaktif || '').split(',').filter(Boolean));
    const ui = A.ui.wa = A.ui.wa || { tpl: TPL[0][0] };
    const log = (d.logWA || []).slice().reverse();
    const kuota = d.waBulanIni || 0;
    el.innerHTML = `<div class="split half"><div class="stack">
      <div class="card card-pad"><div class="row-gap mb-12"><span class="icon-dot ok">${icon('message-circle')}</span><h3 style="flex:1">Koneksi WhatsApp (Fonnte)</h3><span class="chip ${d.fonnteTerpasang ? 'chip-ok' : 'chip-bad'}" id="fn-st">${d.fonnteTerpasang ? 'Token terpasang' : 'Belum terhubung'}</span></div>
        <div class="field"><label>Token Fonnte</label><div class="row-gap"><input class="input" id="fn-tok" type="password" placeholder="${d.fonnteTerpasang ? '•••••••••••• (tersimpan)' : 'Tempel token dari dashboard Fonnte'}" style="flex:1" autocomplete="off"><button class="btn btn-primary" id="fn-simpan">${icon('save')} ${d.fonnteTerpasang ? 'Ganti' : 'Simpan'}</button>${d.fonnteTerpasang ? `<button class="btn btn-danger-ghost btn-icon" id="fn-hapus" title="Hapus token (hentikan semua WA otomatis)">${icon('trash-2')}</button>` : ''}</div>
          <span class="help">${icon('lock', 'ic-sm')} Disimpan aman di Script Properties server, tidak pernah dikirim balik ke browser. Panduan lengkap: PANDUAN-FONNTE.md</span></div>
        <div class="field mt-12"><label>Nomor WA admin (penerima notifikasi)</label><div class="row-gap"><div class="input-group" style="flex:1"><span class="prefix">+62</span><input class="input" id="wa-admin" inputmode="tel" value="${esc(s.wa_admin ? '0' + s.wa_admin.slice(2) : '')}"></div><button class="btn btn-light" id="wa-admin-s">${icon('save')}</button></div><span class="help">Juga tampil sebagai kontak di landing page.</span></div>
        <label class="switch mt-12"><input type="checkbox" id="wa-aktif" ${s.wa_aktif === 'ya' ? 'checked' : ''}><span class="track"></span><span><b>Pengiriman WA otomatis aktif</b><br><span class="tiny muted">Matikan sementara bila kuota habis / perangkat Fonnte terputus</span></span></label>
        <div class="card soft card-pad mt-16"><div class="row-gap"><span class="small strong" style="flex:1">Pesan terkirim bulan ini (paket gratis 1.000/bulan)</span><span class="chip ${kuota > 800 ? 'chip-bad' : 'chip-ok'}">${kuota} / 1.000</span></div><div class="bar ${kuota > 800 ? 'bad' : 'ok'} mt-8"><i style="width:${Math.min(100, kuota / 10)}%"></i></div></div>
        <div class="row-gap mt-16"><button class="btn btn-light btn-sm" id="fn-cek">${icon('refresh-cw')} Cek status perangkat</button><button class="btn btn-light btn-sm" id="fn-uji">${icon('send')} Kirim pesan uji ke admin</button><button class="btn btn-light btn-sm" id="fn-cekharian">${icon('clock')} Jalankan cek tunggakan & absen sekarang</button></div>
        <div id="fn-info"></div></div>
      <div class="card"><div class="card-head"><h3>${icon('history')} Riwayat pengiriman</h3><span class="small muted">${log.length} terakhir</span></div>
        ${log.length ? `<div class="tbl-wrap" style="max-height:420px"><table class="tbl tbl-cards"><thead><tr><th>Waktu</th><th>Jenis</th><th>Tujuan</th><th>Status</th><th></th></tr></thead><tbody>${log.slice(0, 80).map((l) => `<tr class="${l.status === 'gagal' ? 'row-bad' : ''}"><td data-l="Waktu" class="nowrap small">${esc(U.tgl(String(l.waktu).slice(0, 10)))} ${esc(String(l.waktu).slice(11, 16))}</td><td class="t-main" style="min-width:0"><span class="chip chip-sm chip-ahe">${esc(l.jenis)}</span></td><td data-l="Tujuan" class="num small nowrap">${esc(U.tampilWa(l.tujuan))}</td>
          <td data-l="Status">${l.status === 'terkirim' ? `<span class="chip chip-ok chip-sm">${icon('check')} Terkirim</span>` : l.status === 'dilewati' ? `<span class="chip chip-sm" title="${esc(l.respon)}">Dilewati</span>` : `<span class="chip chip-bad chip-sm" title="${esc(l.respon)}">${icon('x')} Gagal</span><div class="tiny muted">${esc(l.respon)}</div>`}</td>
          <td class="t-actions">${l.status !== 'terkirim' && l.tujuan ? `<button class="btn btn-light btn-xs" data-ulang="${l.id}">${icon('refresh-cw')} Kirim ulang</button>` : ''}</td></tr>`).join('')}</tbody></table></div>` : A.kosong('message-circle', 'Belum ada pengiriman', '')}</div></div>
      <div class="card card-pad" style="align-self:start"><div class="row-gap mb-12"><span class="icon-dot">${icon('file-text')}</span><h3 style="flex:1">Template pesan otomatis</h3></div>
        <div class="tabs mb-12" style="flex-wrap:wrap">${TPL.map(([k, l]) => `<button class="tab ${ui.tpl === k ? 'on' : ''} ${mati.has(k) ? 'tpl-mati' : ''}" data-tpl="${k}" style="min-height:34px;font-size:13px">${mati.has(k) ? icon('circle-pause', 'ic-sm') + ' ' : ''}${l}</button>`).join('')}</div>
        <label class="switch tpl-sw mb-12"><input type="checkbox" id="tpl-aktif" ${mati.has(ui.tpl) ? '' : 'checked'}><span class="track"></span><span><b>${mati.has(ui.tpl) ? 'Pesan ini NONAKTIF' : 'Pesan ini aktif'}</b><br><span class="tiny muted">${esc(TPL.find((x) => x[0] === ui.tpl)[2])}. ${mati.has(ui.tpl) ? 'Tidak dikirim otomatis.' : 'Matikan bila tidak ingin dikirim otomatis.'}</span></span></label>
        <textarea class="input" id="tpl-isi" rows="7">${esc(s[ui.tpl] || '')}</textarea>
        <div class="tiny strong muted mt-12 mb-12">KLIK UNTUK MENYISIPKAN:</div><div class="tokens">${TOKEN_TPL.map((t) => `<button type="button" data-tok="${t}">${t}</button>`).join('')}</div>
        <div class="tiny strong muted mt-16 mb-12">PRATINJAU DI HP PENERIMA</div><div class="wa-phone"><div class="wa-bubble"><span id="tpl-prev"></span><div class="meta">${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} ✓✓ · sent via fonnte</div></div></div>
        <div class="row-gap mt-16"><button class="btn btn-light btn-sm" id="tpl-reset">${icon('rotate-ccw')} Kembali ke sebelumnya</button><span class="spacer"></span><button class="btn btn-primary" id="tpl-simpan">${icon('save')} Simpan template</button></div></div></div>`;
    $('#tpl-aktif').onchange = (e) => {
      const set2 = new Set(String(D().settings.tpl_nonaktif || '').split(',').filter(Boolean));
      if (e.target.checked) set2.delete(ui.tpl); else set2.add(ui.tpl);
      simpanSet({ tpl_nonaktif: Array.from(set2).join(',') }, e.target.checked ? 'Pesan otomatis diaktifkan' : 'Pesan otomatis dinonaktifkan'); A.render();
    };
    const contoh = { lembaga: s.nama_lembaga || s.nama_aplikasi, nama: 'Aisyah Putri', panggilan: 'Ica', ortu: 'Hendra', program: 'Les Berhitung (Ala)', kode: 'REG-2026-0012', level: '1', wa: '6281234567890', bulan_tunggakan: 'September & Oktober 2026', total: 'Rp300.000', link_kuitansi: U.urlBaseFrontend() + '#/kuitansi/contoh', hari_absen: '11', terakhir_hadir: U.tglPanjang(U.addDays(U.today(), -16)), wa_admin: s.wa_admin ? '+' + s.wa_admin : '+62812xxxx' };
    const ta = $('#tpl-isi');
    const prev = () => { $('#tpl-prev').innerHTML = esc(ta.value.replace(/\{([a-z_]+)\}/g, (m, k) => contoh[k] !== undefined ? contoh[k] : m)).replace(/\*([^*\n]+)\*/g, '<b>$1</b>').replace(/_([^_\n]+)_/g, '<i>$1</i>'); };
    prev(); ta.oninput = prev;
    $$('[data-tok]').forEach((b) => b.onclick = () => { const p = ta.selectionStart || ta.value.length; ta.value = ta.value.slice(0, p) + b.dataset.tok + ta.value.slice(ta.selectionEnd || p); ta.focus(); ta.selectionStart = ta.selectionEnd = p + b.dataset.tok.length; prev(); });
    $$('[data-tpl]').forEach((b) => b.onclick = () => { ui.tpl = b.dataset.tpl; A.render(); });
    $('#tpl-reset').onclick = () => { ta.value = s[ui.tpl] || ''; prev(); };
    $('#tpl-simpan').onclick = () => { if (!ta.value.trim()) return U.toast('Template tidak boleh kosong', 'warn'); const v = {}; v[ui.tpl] = ta.value; simpanSet(v, 'Template pesan'); };
    $('#wa-admin-s').onclick = () => { const w = U.normWa($('#wa-admin').value); if (w && w.length < 10) return U.toast('Nomor WA tidak valid', 'warn'); simpanSet({ wa_admin: w }, 'Nomor WA admin'); };
    $('#wa-aktif').onchange = (e) => simpanSet({ wa_aktif: e.target.checked ? 'ya' : 'tidak' }, e.target.checked ? 'Pengiriman WA diaktifkan' : 'Pengiriman WA dimatikan');
    // Kirim token Fonnte (nama field "fonnteToken" agar tidak bentrok dengan token sesi)
    $('#fn-simpan').onclick = async (e) => {
      const t = $('#fn-tok').value.trim(); if (!t) return U.toast('Tempel token Fonnte terlebih dahulu', 'warn');
      const b = e.currentTarget; b.disabled = true;
      try { await U.api('setTokenFonnte', { token: A.S.token, fonnteToken: t }); A.S.data.fonnteTerpasang = true; U.toast('Token Fonnte tersimpan'); $('#fn-tok').value = ''; $('#fn-st').className = 'chip chip-ok'; $('#fn-st').textContent = 'Token terpasang'; cek(); }
      catch (er) { U.toast(er.message, 'bad'); }
      b.disabled = false;
    };
    if ($('#fn-hapus')) $('#fn-hapus').onclick = async (e) => {
      if (!(await U.confirm({ title: 'Hapus token Fonnte?', text: 'Semua pengiriman WA otomatis akan berhenti sampai token baru dipasang.', ok: 'Hapus token', danger: true }))) return;
      const b = e.target.closest('button'); if (b) b.disabled = true;
      try { await U.api('setTokenFonnte', { token: A.S.token, fonnteToken: '' }); A.S.data.fonnteTerpasang = false; U.toast('Token Fonnte dihapus'); A.render(); }
      catch (er) { U.toast(er.message, 'bad'); if (b) b.disabled = false; }
    };
    const info = (html, cls) => { $('#fn-info').innerHTML = `<div class="note-box ${cls || ''} mt-12">${html}</div>`; };
    const cek = async () => {
      info(`${icon('loader-circle', 'spin')}<span>Memeriksa perangkat Fonnte…</span>`);
      try { const r = await U.api('cekFonnte', { token: A.S.token }); info(`${icon('circle-check')}<span>Perangkat <b>${esc(r.device || '-')}</b> · status <b>${esc(r.status || '-')}</b>${r.paket ? ' · paket ' + esc(r.paket) : ''}${r.kuota !== undefined && r.kuota !== '' ? ' · sisa kuota ' + esc(r.kuota) : ''}</span>`, /connect/i.test(r.status) && !/disconnect/i.test(r.status) ? 'ok' : 'warn'); }
      catch (er) { info(`${icon('circle-alert')}<span>${esc(er.message)}</span>`, 'bad'); }
    };
    $('#fn-cek').onclick = cek;
    $('#fn-uji').onclick = async (e) => { const b = e.currentTarget; b.disabled = true; try { await U.api('ujiWA', { token: A.S.token }); U.toast('Pesan uji terkirim ke WA admin'); A.segarkanLog(); } catch (er) { U.toast(er.message, 'bad', 7000); } b.disabled = false; };
    $('#fn-cekharian').onclick = async (e) => { const b = e.currentTarget; b.disabled = true; info(`${icon('loader-circle', 'spin')}<span>Menjalankan pemeriksaan…</span>`); try { const r = await U.api('jalankanCek', { token: A.S.token }, { timeout: 330000 }); info(`${icon('circle-check')}<span>Selesai: ${r.tunggakan} tunggakan, ${r.absen} absen · ${r.terkirim} WA terkirim, ${r.gagal} gagal.</span>`, 'ok'); A.segarkanLog(); } catch (er) { info(`${icon('circle-alert')}<span>${esc(er.message)}</span>`, 'bad'); } b.disabled = false; };
    $$('[data-ulang]').forEach((b) => b.onclick = () => { const l = (D().logWA || []).find((x) => x.id === b.dataset.ulang); if (l) A.kirimWA({ target: l.tujuan, pesan: l.pesan, jenis: l.jenis, siswaId: l.siswaId, periode: l.periode }); });
  }
  // ---------------------------------------------------------------- Mode demo
  function setDemo(el) {
    const s = D().settings;
    const li = (ic, cls, t) => `<li><span class="ic" style="color:var(--${cls})">${icon(ic, 'ic-sm')}</span><span>${t}</span></li>`;
    el.innerHTML = `<div class="split half"><div class="stack">
      <div class="card card-pad" style="border-color:#F5D38A;background:#FFFBEF"><div class="row-gap mb-12"><span class="icon-dot sun">${icon('sparkles')}</span><div style="flex:1"><h3>Mode Demo sedang aktif</h3><div class="small muted">${s.demo_mulai ? 'Sejak ' + esc(U.tglPanjang(String(s.demo_mulai).slice(0, 10))) : ''}</div></div></div>
        <p class="small">Semua siswa, guru, kehadiran, SPP, kuitansi, hari libur, piagam, dan galeri saat ini adalah <b>data contoh</b>. Silakan coba semua fitur dengan bebas.</p>
        <ul class="demo-list mt-12">
          ${li('key-round', 'p-700', 'Login guru: pilih nama guru mana saja, sandi <b>guru1234</b>.')}
          ${li('message-circle', 'ok-700', 'WhatsApp untuk orang tua <b>tidak dikirim</b> ke nomor contoh; pesannya <b>dialihkan ke WA admin</b> (maks. 20 pesan/hari) agar Anda bisa melihat isinya.')}
          ${li('globe', 'p-700', 'Landing page & formulir menampilkan tanda kecil "Mode uji coba". Jangan bagikan link ke orang tua dulu.')}
        </ul></div>
      <div class="card card-pad"><h3 class="mb-12">${icon('refresh-cw')} Isi ulang data demo</h3>
        <p class="small muted">Kembalikan data contoh seperti semula (semua perubahan percobaan Anda dibuang). Berguna bila data sudah berantakan setelah banyak dicoba.</p>
        <button class="btn btn-light mt-12" id="demo-ulang">${icon('refresh-cw')} Isi ulang data demo</button></div></div>
      <div class="card card-pad" style="align-self:start"><h3 class="mb-12">${icon('circle-check')} Akhiri mode demo & mulai pakai</h3>
        <p class="small muted mb-12">Lakukan setelah aplikasi sudah sesuai keinginan. Data contoh dihapus dan aplikasi siap diisi data asli.</p>
        <div class="tiny strong muted mb-8" style="letter-spacing:.06em">DIHAPUS (KEMBALI KOSONG)</div>
        <ul class="demo-list mb-16">
          ${li('x', 'bad', 'Siswa & pendaftar, program, riwayat level, foto siswa')}
          ${li('x', 'bad', 'Guru & akun guru')}
          ${li('x', 'bad', 'Kehadiran guru & siswa')}
          ${li('x', 'bad', 'Tarif SPP, pembayaran SPP & kuitansi')}
          ${li('x', 'bad', 'Hari libur, piagam yang sudah dibuat, riwayat WA')}
          ${li('x', 'bad', 'Galeri contoh')}
        </ul>
        <div class="tiny strong muted mb-8" style="letter-spacing:.06em">TETAP DISIMPAN</div>
        <ul class="demo-list mb-16">
          ${li('check', 'ok-700', 'Akun admin (username & sandi Anda)')}
          ${li('check', 'ok-700', 'Identitas, logo, warna utama & semua pengaturan')}
          ${li('check', 'ok-700', 'Template pesan WA & token Fonnte')}
          ${li('check', 'ok-700', 'Isi landing page, template & posisi teks piagam')}
        </ul>
        <label class="check mb-16"><input type="checkbox" id="demo-galeri" checked><span class="box">${icon('check')}</span><span class="small">Pertahankan foto/video galeri yang saya tambahkan sendiri</span></label>
        <div class="note-box mb-16">${icon('info')}<span>Tanggal mulai pencatatan kehadiran & SPP otomatis diatur ke hari ini. HP guru yang masih menyimpan data contoh akan diperbarui sendiri.</span></div>
        <button class="btn btn-danger btn-block" id="demo-akhiri">${icon('trash-2')} Akhiri Mode Demo & Kosongkan Data</button></div></div>`;
    const jalankan = async (b, perintah, extra, pesanOk) => {
      const asli = b.innerHTML;
      $$('#demo-ulang,#demo-akhiri').forEach((x) => { x.disabled = true; });
      b.innerHTML = `${icon('loader-circle', 'spin')} Memproses… jangan tutup halaman`;
      try {
        await U.api('demo', Object.assign({ token: A.S.token, perintah }, extra), { timeout: 300000 });
        A.resetLokal();
        U.toast(pesanOk, 'ok', 6000);
        setTimeout(() => { location.hash = '#/dashboard'; location.reload(); }, 900);
      } catch (er) {
        U.toast(er.message, 'bad', 8000);
        b.innerHTML = asli; $$('#demo-ulang,#demo-akhiri').forEach((x) => { x.disabled = false; });
      }
    };
    $('#demo-ulang').onclick = async (e) => {
      const b = e.currentTarget;
      if (!(await U.confirm({ title: 'Isi ulang data demo?', text: 'Semua perubahan percobaan dibuang dan data contoh dikembalikan seperti semula.', ok: 'Isi ulang' }))) return;
      jalankan(b, 'ulangi', {}, 'Data demo diisi ulang');
    };
    $('#demo-akhiri').onclick = async (e) => {
      const b = e.currentTarget;
      const simpanGaleri = $('#demo-galeri').checked;
      if (!(await U.confirm({ danger: true, title: 'Akhiri mode demo?', text: 'Semua data contoh dan data percobaan akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.', ketik: 'KOSONGKAN', ok: 'Kosongkan data' }))) return;
      jalankan(b, 'akhiri', { simpanGaleri }, 'Mode demo berakhir — aplikasi siap diisi data asli');
    };
  }
  function setAkun(el) {
    el.innerHTML = `<div class="card card-pad" style="max-width:560px"><div class="row-gap mb-16">${U.avatar('Admin Utama', 'admin', 'av-lg')}<div><h3>Admin Utama</h3><div class="small muted">Username: <b>${esc(A.S.user.username || '-')}</b></div></div></div>
      <div class="stack-sm"><button class="btn btn-primary" id="ak-ganti">${icon('key-round')} Ganti username & kata sandi</button><button class="btn btn-light" id="ak-sync">${icon('refresh-cw')} Muat ulang data dari server</button><button class="btn btn-danger-ghost" id="ak-out">${icon('log-out')} Keluar</button></div>
      <div class="note-box mt-16">${icon('shield-check')}<span>Sesi admin berakhir otomatis setelah 60 menit tidak aktif. Perubahan yang belum terkirim tetap tersimpan di perangkat ini dan dikirim setelah login lagi.</span></div>
      <p class="tiny muted mt-12">Versi aplikasi ${esc(D().versi || '')} · Data terakhir disinkronkan ${new Date(A.S.lastSync || Date.now()).toLocaleString('id-ID')}</p></div>`;
    $('#ak-ganti').onclick = () => A.gantiAkun(false);
    $('#ak-sync').onclick = () => { U.toast('Memuat ulang…', 'info'); A.segarkan(); };
    $('#ak-out').onclick = A.keluar;
  }
})();
