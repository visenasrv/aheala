# Panduan Instalasi: Aplikasi Manajemen Les Ahe & Ala

Aplikasi ini terdiri dari dua bagian yang dipasang terpisah:

| Bagian | Isi | Dipasang di |
|---|---|---|
| **Backend** (server & database) | `Kode.gs`, `appsscript.json` | Google Apps Script + Google Sheets (akun Google lembaga) |
| **Frontend** (tampilan) | ZIP berisi `index.html`, `app.html`, `css/`, `js/`, `assets/` | GitHub Pages (gratis) |

Alamat yang akan Anda miliki setelah selesai:

- `https://USERNAME.github.io/NAMA-REPO/` adalah landing page dan formulir pendaftaran untuk umum.
- `https://USERNAME.github.io/NAMA-REPO/app.html` adalah halaman login untuk admin dan guru.

Perkiraan waktu: 30–45 menit untuk pertama kali.

> 💡 Gunakan **satu akun Google khusus lembaga** (misalnya `les.aheala@gmail.com`), bukan akun pribadi. Semua data siswa, foto, dan piagam akan tersimpan di Google Drive akun ini.

---

## Bagian A: Memasang Backend (Google Apps Script)

### A1. Buat proyek Apps Script
1. Buka **https://script.google.com** dengan akun Google lembaga.
2. Klik **Proyek baru** (New project).
3. Klik judul "Proyek tanpa judul" di kiri atas dan ganti namanya, misalnya `Backend Les Ahe Ala`.

### A2. Tempel kode
1. Di panel kiri ada berkas `Kode.gs` (atau `Code.gs`). Klik berkas itu, **hapus semua isinya**, lalu tempel **seluruh isi `Kode.gs`** dari paket ini.
2. Tampilkan berkas manifest: klik ⚙️ **Setelan proyek** (Project Settings) di kiri, lalu centang **"Tampilkan file manifes 'appsscript.json' di editor"**.
3. Kembali ke **Editor** (ikon `< >`), buka `appsscript.json`, ganti seluruh isinya dengan isi `appsscript.json` dari paket ini. Berkas ini mengatur zona waktu **Asia/Makassar (WITA)** dan izin web app.
4. Tekan **Ctrl+S** untuk menyimpan.

### A3. Jalankan `setupAplikasi` (cukup sekali)
1. Di toolbar atas, pada dropdown nama fungsi, pilih **`setupAplikasi`**, lalu klik **▶ Jalankan** (Run).
2. Muncul jendela **"Otorisasi diperlukan"**. Klik **Tinjau izin**, lalu pilih akun lembaga.
3. Jika muncul **"Google belum memverifikasi aplikasi ini"**, klik **Lanjutan**, lalu **Buka Backend Les Ahe Ala (tidak aman)**, lalu **Izinkan**. Peringatan ini normal karena skrip ini buatan Anda sendiri.
4. Tunggu sampai **Log eksekusi** menampilkan:
   ```
   ✅ Setup selesai
      Spreadsheet : https://docs.google.com/spreadsheets/d/...
      Folder Drive: https://drive.google.com/drive/folders/...
      Login admin : admin / admin12345 (wajib diganti saat login pertama)
   ```

Hasil fungsi ini:
- Membuat folder **📁 Manajemen Les Ahe & Ala** di Google Drive, berisi subfolder Logo, Galeri, Arsip, dan Piagam AHE/Template.
- Membuat spreadsheet **Database** berisi 17 sheet (Siswa, Guru, Hadir_Siswa, SPP, Kuitansi, dan lainnya).
- Mengisi pengaturan bawaan dan konten landing page.
- Memasang **pemicu harian pukul 07.00 WITA** untuk mengecek tunggakan SPP dan siswa yang lama tidak masuk.

> Fungsi ini aman bila tidak sengaja dijalankan ulang. Ia hanya melengkapi yang belum ada dan tidak menghapus data.

### A4. Deploy sebagai Web App
1. Klik tombol biru **Terapkan** (Deploy) di kanan atas, lalu **Deployment baru** (New deployment).
2. Klik ikon ⚙️ di sebelah "Pilih jenis", lalu pilih **Aplikasi web** (Web app).
3. Isi:
   - **Deskripsi:** `v1`
   - **Jalankan sebagai** (Execute as): **Saya** (Me)
   - **Yang memiliki akses** (Who has access): **Siapa saja** (Anyone)
4. Klik **Terapkan**, lalu **salin URL Aplikasi web** yang berakhiran **`/exec`**. Simpan dulu di Notepad.

**Uji cepat:** tempel URL itu di tab browser baru, tambahkan `?action=ping` di belakangnya, lalu Enter. Jika muncul `{"success":true,"data":{...}}`, backend sudah hidup.

### ⚠️ A5. Penting: cara memperbarui backend nanti
Setiap kali `Kode.gs` diubah, **jangan** membuat "Deployment baru" lagi, karena URL-nya akan berganti dan frontend tidak tersambung. Gunakan cara ini:

**Terapkan → Kelola deployment → ✏️ (edit) → Versi: "Versi baru" → Terapkan.**

Dengan cara ini URL `/exec` tetap sama.

### A6. Isi data demo (disarankan sebelum dipakai sungguhan)
Agar Anda bisa mencoba semua fitur dengan data yang terlihat nyata:
1. Di dropdown fungsi, pilih **`isiDataDemo`**, lalu klik **▶ Jalankan**.
2. Log eksekusi menampilkan `🧪 Mode demo aktif: 63 siswa, 5 guru, … kehadiran, … kuitansi.`

Cara mengakhiri mode demo ada di **Bagian D0**.

---

## Bagian B: Menyiapkan Frontend

### B1. Ekstrak ZIP
1. Unduh `manajemen-les-ahe-ala.zip`.
2. Klik kanan, pilih **Extract All / Ekstrak Semua**, lalu ekstrak ke misalnya `Documents`.
3. Hasilnya adalah folder **`Documents\manajemen-les-ahe-ala\`**, yang langsung berisi:
   ```
   manajemen-les-ahe-ala\        ← INI folder proyek (tempat git init nanti)
   ├── index.html                ← landing page & pendaftaran
   ├── app.html                  ← login admin & guru
   ├── README.md
   ├── PANDUAN-INSTALASI.md
   ├── PANDUAN-FONNTE.md
   ├── assets\
   ├── css\
   └── js\
       ├── config.js             ← satu-satunya file yang perlu diisi
       └── ... (berkas JS lain, jangan diubah)
   ```

### B2. Isi `js/config.js`
Buka `js\config.js` dengan Notepad, lalu ganti URL contoh dengan URL `/exec` dari langkah A4:

```js
window.APP_CONFIG = {
  GAS_URL: 'https://script.google.com/macros/s/AKfycb.................../exec'
};
```

Simpan. Pastikan tanda kutip `'...'` tetap ada dan URL berakhiran `/exec`.

---

## Bagian C: Mengunggah Frontend ke GitHub Pages

> Selalu unggah lewat terminal (perintah `git`). **Jangan** memakai tombol "Upload files" di situs GitHub, karena struktur folder `css/` dan `js/` akan rusak dan tampilan menjadi polos atau 404.

### C1. Pasang Git (sekali saja)
- **Windows:** unduh dari https://git-scm.com/download/win dan pasang dengan pilihan bawaan (Next terus). Setelah itu buka **PowerShell** dari Start Menu.
- **Mac:** buka Terminal, ketik `git --version`. Jika belum ada, macOS menawarkan instalasi otomatis.

Cek dengan perintah:
```bash
git --version
```
Hasil yang benar berbentuk `git version 2.xx.x`.

### C2. Buat akun GitHub
Daftar di https://github.com. Username Anda akan menjadi bagian alamat situs (`USERNAME.github.io`), jadi pilih yang rapi, misalnya `lesaheala`.

### C3. Atur identitas Git (sekali saja per komputer)
```bash
git config --global user.name "Nama Anda"
git config --global user.email "email-akun-github@gmail.com"
```
`user.name` hanya label di riwayat dan boleh diisi apa saja. `user.email` sebaiknya sama dengan email akun GitHub.

### C4. Buat repository di GitHub
1. Di github.com klik **+**, lalu **New repository**.
2. **Repository name:** misalnya `les-aheala`.
3. Pilih **Public**. Ini wajib untuk Pages gratis, dan aman karena frontend tidak memuat kata sandi atau token apa pun.
4. **Jangan** centang "Add a README", .gitignore, ataupun license.
5. Klik **Create repository**. Biarkan halaman itu terbuka.

### C5. Masuk ke folder proyek yang benar

📂 **Folder kerja Anda adalah `manajemen-les-ahe-ala`**, yaitu folder hasil ekstrak yang **langsung berisi `index.html`**. Semua perintah `git` dijalankan di folder ini. Jangan naik satu tingkat dan jangan masuk ke `js`.

Cara tercepat di Windows: buka folder `manajemen-les-ahe-ala` di File Explorer, klik address bar, ketik `powershell`, lalu Enter. Atau dengan perintah:
```powershell
cd "$HOME\Documents\manajemen-les-ahe-ala"
```

Lalu periksa isinya:
```powershell
dir
```
✅ Harus terlihat `index.html`, `app.html`, `css`, `js`, dan `assets` di daftar. Jika yang terlihat hanya satu folder `manajemen-les-ahe-ala`, berarti Anda satu tingkat terlalu tinggi. Jalankan `cd manajemen-les-ahe-ala` lalu `dir` lagi.

**Cek terakhir sebelum lanjut:** `js\config.js` sudah berisi URL `/exec` Anda (langkah B2).

### C6. Kirim ke GitHub
Jalankan **satu per satu**:

```bash
git init
```
Hasil yang diharapkan: `Initialized empty Git repository in ...`

```bash
git add .
```
Perhatikan **titik** di akhir perintah. Perintah ini tidak menampilkan apa-apa bila berhasil.

```bash
git commit -m "Upload pertama"
```
Hasil yang diharapkan: daftar `create mode 100644 index.html`, dan seterusnya.

```bash
git branch -M main
git remote add origin https://github.com/USERNAME/les-aheala.git
```
Ganti `USERNAME` dan `les-aheala` sesuai milik Anda.

```bash
git push -u origin main
```
- **Username:** username GitHub Anda.
- **Password:** isi dengan **Personal Access Token**, bukan password akun (lihat C7).
- Saat token ditempel, **layar tetap kosong**. Ini normal. Tekan Enter.

Tanda berhasil: `Writing objects: 100%` dan `* [new branch] main -> main`.

### C7. Membuat Personal Access Token
Jika muncul pesan `Password authentication is not supported`, buat token terlebih dahulu:
1. Buka https://github.com/settings/tokens, lalu **Generate new token**, lalu **Generate new token (classic)**.
2. Isi **Note:** `git-push`. Untuk **Expiration**, pilih `90 days` atau `No expiration`.
3. Centang ✅ **repo**.
4. Klik **Generate token**, lalu salin token `ghp_...`. Token hanya tampil sekali, jadi simpan di Notepad.
5. Jalankan lagi `git push -u origin main` dan tempel token sebagai password.

> Jika terminal terus menyulitkan, Anda bisa memakai **GitHub Desktop** (https://desktop.github.com). Caranya: **File**, **Add Local Repository**, pilih folder `manajemen-les-ahe-ala`, lalu **Publish repository**. Hapus centang "Keep this code private".

### C8. Aktifkan GitHub Pages
1. Buka repo di github.com, pastikan `index.html` terlihat di daftar paling atas (bukan di dalam folder).
2. Buka **Settings**, lalu **Pages** (menu kiri).
3. Atur **Source** ke **Deploy from a branch**, **Branch** ke **main**, dan folder ke **/ (root)**, lalu klik **Save**.
4. Tunggu 1–2 menit, lalu refresh. Akan muncul tulisan **"Your site is live at https://USERNAME.github.io/les-aheala/"**.
5. Centang **Enforce HTTPS** jika tersedia.

---

## Bagian D: Penggunaan Pertama

### D0. Mode Demo: mencoba dulu, lalu dikosongkan
Jika Anda menjalankan `isiDataDemo` (langkah A6), aplikasi berisi data contoh:

| Data contoh | Isi |
|---|---|
| Siswa | 60 siswa (Ahe & Ala, berbagai level). Sebagian rehat, lulus, belum punya buku, atau datanya belum lengkap. |
| Pendaftar | 3 pendaftar online yang menunggu diterima |
| Guru | 5 guru. Semuanya login dengan sandi **`guru1234`**. |
| Kehadiran | Dari awal bulan lalu sampai kemarin. Hari ini sengaja dikosongkan agar Anda bisa mencoba absen sebagai guru. |
| SPP | Tarif Rp150.000. Ada siswa yang menunggak 2 bulan, lengkap dengan kuitansi. |
| Lainnya | Hari libur, 1 piagam jadi, 2 siswa siap dibuatkan piagam, galeri foto contoh, riwayat WA (termasuk 1 yang gagal) |

Selama mode demo berlaku hal-hal berikut:
- Ada **pita kuning "Mode Demo"** di atas aplikasi. Landing page juga menampilkan tanda kecil **"Mode uji coba"**.
- **WhatsApp tidak pernah dikirim ke nomor contoh.** Pesan yang seharusnya untuk orang tua **dialihkan ke nomor WA admin** dengan awalan `[MODE DEMO]`, maksimal 20 pesan per hari. Dengan begitu Anda bisa melihat isi pesannya tanpa menghabiskan kuota.
- Anda bebas mengubah, menghapus, dan menambah data. Jika data sudah berantakan, buka **Pengaturan → Mode Demo → Isi ulang data demo**.
- Akun admin, identitas, logo, warna, template WA, isi landing page, dan template piagam yang Anda atur selama demo **tetap tersimpan** setelah demo berakhir.

**Jika aplikasi sudah sesuai keinginan, akhiri mode demo:**
1. Login admin, lalu buka **Pengaturan → Mode Demo** (atau klik **"Akhiri mode demo"** di pita kuning).
2. Pilih apakah foto/video galeri yang Anda tambahkan sendiri ingin dipertahankan.
3. Klik **Akhiri Mode Demo & Kosongkan Data**, ketik **`KOSONGKAN`**, lalu konfirmasi.
4. Hasilnya:
   - Semua siswa, guru, kehadiran, SPP, kuitansi, libur, piagam, dan riwayat WA terhapus.
   - Tanggal mulai pencatatan kehadiran dan SPP otomatis diatur ke hari itu.
   - Pita "Mode Demo" dan menu Mode Demo **hilang dari aplikasi**.
   - Aplikasi siap diisi data asli mulai dari langkah D2.
   - HP guru yang masih menyimpan data contoh akan diperbarui sendiri. Perubahan lama dari HP tersebut tidak akan masuk ke data asli.

> Mode demo hanya bisa diisi pada aplikasi yang **masih kosong**. Setelah data asli mulai diisi, `isiDataDemo` akan menolak berjalan, sehingga data asli tidak mungkin tertimpa.
> Cara alternatif dari editor Apps Script: jalankan fungsi **`akhiriModeDemo`**. Cara ini juga menghapus seluruh galeri.


### D1. Login admin dan ganti akun
1. Buka `https://USERNAME.github.io/les-aheala/app.html`.
2. Pilih tab **Admin**, lalu masuk dengan username **`admin`** dan sandi **`admin12345`**.
3. Aplikasi **langsung meminta Anda mengganti** username dan kata sandi. Simpan baik-baik.

> Login admin pertama dari alamat GitHub Pages juga membuat aplikasi otomatis mencatat alamat situs Anda. Alamat ini dipakai untuk link kuitansi yang dikirim ke orang tua lewat WhatsApp.

### D2. Urutan pengaturan yang disarankan
| No | Menu | Yang diisi |
|---|---|---|
| 1 | **Pengaturan → Identitas** | Nama aplikasi, nama lembaga, Nama unit, **No. Unit** (4 digit angka, contoh `3924`; dipakai di nomor piagam, contoh `001/AHE-3924/X/2026`), **Kepala Unit** (penanda tangan kuitansi & piagam), kecamatan, desa/kelurahan, alamat (jalan, RT, nomor), logo, **gambar tanda tangan** (PNG; foto/scan di kertas putih juga bisa), dan **warna utama** |
| 2 | **Pengaturan → SPP** | Tanggal jatuh tempo, **Mulai pencatatan SPP** (isi bulan ini agar bulan-bulan lama tidak dianggap menunggak), lalu **Atur tarif** |
| 3 | **Pengaturan → Kehadiran** | **Mulai pencatatan kehadiran** (isi tanggal mulai pakai aplikasi), batas absen (bawaan 10 hari les), batas siswa per guru (bawaan 10) |
| 4 | **Guru** | Tambah guru dan kata sandinya. Guru login dengan memilih namanya dari daftar. |
| 5 | **Siswa → Impor Excel** | Unduh template, isi data siswa lama, lalu unggah. Data yang belum lengkap tetap bisa masuk dan ditandai "belum lengkap". |
| 6 | **Hari Libur** | Tandai libur khusus (Senin–Jumat selain libur otomatis dianggap hari les) |
| 7 | **Landing Page** | Foto **banner** (landscape, ideal 1920×800), teks, foto kegiatan, video, lokasi, dan footer (link Facebook/Instagram/YouTube/TikTok). Di bagian **Lokasi & Peta**, tempel link Google Maps (Bagikan → Salin link) lalu klik **Pasang**, dan titik merah muncul di peta. |
| 8 | **Pengaturan → Piagam** | Unggah gambar template piagam Ahe dan Ala, lalu **Atur Posisi Teks** (kalibrasi). Nomor, Kepala Unit, Unit Pembelajaran, dan Desa/Kelurahan terisi otomatis dari Identitas. |
| 9 | **Pengaturan → WhatsApp** | Sambungkan Fonnte. Ikuti **PANDUAN-FONNTE.md** (terpisah). Tiap template pesan otomatis bisa **dinonaktifkan** satu per satu lewat sakelar di atas kotak template. |

### D3. Bagikan ke guru dan orang tua
- **Guru:** kirim link `.../app.html` dan kata sandinya. Guru bisa mengganti sandinya sendiri di menu **Akun Saya**. Di HP, guru bisa memilih **"Tambahkan ke layar utama"** di menu browser agar aplikasi terbuka seperti app biasa.
- **Orang tua / umum:** bagikan link utama `https://USERNAME.github.io/les-aheala/`. Pendaftaran bisa dibuka atau ditutup dari **Pengaturan → Pendaftaran**.

### D4. Fitur harian yang sering dipakai (v1.2)
- **Filter periode** (Dashboard, Kehadiran, SPP): klik tombol periode, pilih satu bulan, atau klik bulan awal lalu bulan akhir untuk rentang. Tombol cepat **Satu tahun**, **Bulan ini**, **3/6 bulan terakhir** juga tersedia.
- **Kehadiran → Per Hari:** jumlah siswa yang diajar tiap guru pada tanggal tertentu, lengkap dengan nama siswanya.
- **Siswa → Naik 1 Level:** muncul konfirmasi "Naikkan ke Level X?" dengan pilihan **Iya** / **Tidak**. Siswa yang baru diubah tetap tampil (ditandai) walau tidak lagi cocok dengan filter.
- **Siswa → Lulus / Alumni:** siswa yang dituntaskan pindah ke tab ini. Lulusan Les Baca yang lanjut berhitung: centang lalu **Lanjut Berhitung**, dan siswa kembali ke tab **Siswa Les**.
- **Landing page** menampilkan jumlah murid Les Baca, Les Berhitung, alumni, dan guru secara otomatis (bagian **Jumlah Murid** di editor Landing Page bisa diubah judulnya atau disembunyikan).
- **Masuk dari landing page** saat masih login: halaman login tetap tampil dengan pilihan **Lanjutkan** atau **Keluar** (untuk berganti akun).

---

## Bagian E: Kenapa aplikasi terasa instan

- **Pindah menu dan halaman** terjadi di dalam browser tanpa memuat ulang (sekitar 15–100 ms).
- **Menyimpan** (absen, bayar SPP, naik level, dan lainnya) langsung tampil di layar. Pengiriman ke server berjalan di belakang dan antre otomatis bila sinyal putus. Status di pojok atas menunjukkan ✅ **Tersimpan**, ⏳ **Menyimpan…**, atau 📴 **Offline**. Jangan tutup browser saat status masih "Menyimpan…" lebih dari 1 menit.
- **Data dibuka dari cache** perangkat, lalu diperbarui diam-diam dari server.
- Server memakai cache dan penulisan per-batch agar tetap cepat walau data tahunan sudah besar.

---

## Bagian F: Memperbarui Aplikasi

**Frontend** (setelah ada berkas baru): salin berkas baru ke folder `manajemen-les-ahe-ala`, lalu dari folder itu jalankan:
```bash
git add .
git commit -m "Update tampilan"
git push
```
Tunggu 1–2 menit, lalu buka situs dan tekan **Ctrl+Shift+R** (hard refresh).

> ⚠️ Saat menimpa berkas, **jangan timpa `js/config.js`** dengan versi kosong. Jika terlanjur tertimpa, isi lagi URL `/exec` Anda.

**Backend:** tempel `Kode.gs` baru, simpan, lalu pilih **Terapkan → Kelola deployment → ✏️ → Versi baru → Terapkan** (lihat A5).

---

## Bagian G: Fungsi Bantuan di Editor Apps Script

Pilih nama fungsi di dropdown, lalu klik ▶ **Jalankan**:

| Fungsi | Kegunaan |
|---|---|
| `setupAplikasi` | Setup awal. Aman diulang dan juga memasang ulang pemicu harian bila terhapus. |
| `resetAkunAdmin` | **Lupa sandi admin?** Fungsi ini mengembalikan akun ke `admin` / `admin12345`. |
| `bersihkanCache` | Jalankan setelah Anda mengedit banyak data **langsung di spreadsheet**. |
| `jalankanPengecekanSekarang` | Uji pengecekan tunggakan dan absen beserta kirim WA saat itu juga. Saat mode demo, pesan dialihkan ke WA admin. |
| `cekTemplate` | Melihat template piagam yang sedang aktif. |
| `isiDataDemo` | Mengisi data contoh untuk mencoba aplikasi (hanya bila data masih kosong). Lihat D0. |
| `akhiriModeDemo` | Mengakhiri mode demo dan mengosongkan semua data contoh. |
| `arsipkanTahun` | Memindahkan data kehadiran tahun lalu ke spreadsheet arsip, agar database tetap ringan. Jalankan setahun sekali di bulan Januari. |

> Data boleh dilihat langsung di spreadsheet Database. Namun **jangan** mengubah nama sheet, urutan kolom, atau baris judul.

---

## Bagian H: Mengatasi Masalah

| Gejala | Penyebab | Solusi |
|---|---|---|
| Situs 404 di GitHub Pages, padahal git sukses | `git init` dijalankan di folder yang salah | Di repo GitHub, `index.html` harus terlihat di root. Ulangi dari folder `manajemen-les-ahe-ala` dengan `git push -u origin main --force`. |
| Halaman tampil polos tanpa warna | Berkas diunggah lewat web GitHub sehingga folder `css/` dan `js/` hilang | Hapus berkas di repo, ulangi lewat terminal (Bagian C) |
| "Tidak bisa terhubung ke server" | `config.js` belum diisi atau URL salah | Periksa `GAS_URL` (harus berakhiran `/exec`), lalu push ulang |
| Perubahan backend tidak berlaku | Lupa membuat "Versi baru" | Lihat A5 |
| URL `/exec` minta login Google | "Yang memiliki akses" belum "Siapa saja" | Kelola deployment → ✏️ → ubah akses → Terapkan |
| Data di HP berbeda dengan di laptop | Masih ada antrean yang belum terkirim di salah satu perangkat | Pastikan status "Tersimpan" di perangkat itu, lalu tekan **Sinkronkan** di Dashboard (atau muat ulang halaman) |
| Setelah edit spreadsheet manual, data tidak berubah di aplikasi | Cache server | Jalankan `bersihkanCache` |
| Situs masih versi lama | Cache browser | Tekan Ctrl+Shift+R atau buka di jendela Incognito |
| `remote origin already exists` | `remote add` sudah pernah dijalankan | Lewati langkah itu dan lanjut `git push` |
| `Updates were rejected` | Repo GitHub dibuat dengan README | `git pull --rebase origin main`, lalu `git push` |

---

## Glosarium Singkat
- **Repository (repo):** folder proyek di GitHub.
- **Commit:** menyimpan perubahan beserta catatan.
- **Push:** mengirim commit ke GitHub.
- **Personal Access Token:** "kata sandi khusus" GitHub untuk terminal.
- **Deployment / Versi baru:** cara menerbitkan perubahan kode Apps Script tanpa mengganti URL.
