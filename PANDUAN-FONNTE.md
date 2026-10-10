# Panduan Integrasi WhatsApp (Fonnte): Aplikasi Les Ahe & Ala

Fonnte adalah layanan *WhatsApp gateway*. Aplikasi Anda "meminjam" satu nomor WhatsApp yang tersambung ke Fonnte untuk mengirim pesan otomatis ke orang tua dan admin.

> Lakukan panduan ini **setelah** aplikasi terpasang dan Anda bisa login sebagai admin (lihat PANDUAN-INSTALASI.md).

---

## 1. Pesan apa saja yang dikirim aplikasi?

| Kapan | Penerima | Template di aplikasi |
|---|---|---|
| Formulir pendaftaran terkirim | Orang tua | Pendaftaran – ke Orang Tua |
| Formulir pendaftaran terkirim | Admin | Pendaftaran – ke Admin |
| Admin menerima pendaftar (jika dicentang) | Orang tua | Diterima – ke Orang Tua |
| SPP ditandai lunas (jika dicentang "kirim link kuitansi") | Orang tua | Kuitansi SPP (berisi **link** kuitansi) |
| **Otomatis setiap hari les pukul 07.00 WITA**: siswa menunggak **2 bulan berturut-turut** | Orang tua | Tunggakan SPP 2 Bulan |
| **Otomatis pukul 07.00 WITA**: siswa tidak masuk **≥ 10 hari les** | Admin | Siswa Tidak Masuk – ke Admin |
| **Otomatis pukul 07.00 WITA**: siswa tidak masuk **≥ 10 hari les** (sekali per periode) | Orang tua | Tidak Masuk – ke Orang Tua |
| Admin menekan **Naik 1 Level** dan mencentang "Kirim WhatsApp ucapan naik level" | Orang tua | Naik Level – ke Orang Tua |
| Admin menekan tombol WA di detail siswa atau di halaman SPP | Orang tua | Pesan bebas atau pengingat |

Aturan anti-dobel:
- Pengingat tunggakan dikirim **sekali per periode tunggakan**, bukan setiap hari.
- Peringatan absen dikirim **sekali per periode absen**.
- Hari Sabtu, Minggu, dan hari libur khusus **tidak** ada pengecekan.

---

> 🧪 **Saat Mode Demo aktif**, pesan untuk orang tua **tidak dikirim ke nomor contoh**. Semua pesan itu dialihkan ke **nomor WA admin** dengan awalan `[MODE DEMO]`, maksimal 20 pesan per hari. Isi dulu nomor WA admin (langkah 5) agar Anda bisa melihat contoh pesannya. Setelah mode demo diakhiri, pesan kembali terkirim ke nomor orang tua yang sebenarnya. Untuk uji kirim ke nomor asli, tambahkan nomor di **Pengaturan → Mode Demo → Uji kirim WA ke nomor asli** (maks. 5), lalu pasang nomor itu sebagai No. WA orang tua salah satu siswa demo. Pesan ke nomor uji terkirim apa adanya.

## 2. Tentang paket gratis Fonnte

| | Paket **Free** |
|---|---|
| Kuota | **1.000 pesan/bulan** |
| Jenis pesan | **Teks saja.** Tidak bisa melampirkan gambar atau PDF. Karena itu kuitansi dikirim sebagai **link**, dan orang tua bisa membuka lalu mengunduh PDF-nya sendiri. |
| Watermark | Ada tambahan teks kecil dari Fonnte di akhir pesan |
| Notifikasi perangkat terputus | Tidak ada. Admin perlu mengecek status sesekali (langkah 6). |

**Perkiraan pemakaian untuk lembaga Anda** (60–120 siswa, 2–10 pendaftar per bulan):
- Pendaftaran: ±10 pendaftar × 3 pesan = ±30 pesan
- Kuitansi: ±60–120 pesan (bila setiap pembayaran dikirimi link)
- Tunggakan dan absen: biasanya puluhan pesan

**Total: sekitar 100–250 pesan per bulan, jauh di bawah 1.000.** Penggunaan bulan ini terlihat di **Pengaturan → WhatsApp** (contoh: "125 / 1.000").

> Jika kelak ingin tanpa watermark, paket berbayar termurah (Lite) mulai sekitar Rp25.000/bulan dengan kuota yang sama. Cek harga terbaru di fonnte.com. Aplikasi tidak perlu diubah sama sekali bila Anda berganti paket.

---

## 3. Siapkan nomor WhatsApp khusus lembaga

**Sangat disarankan memakai nomor khusus lembaga, bukan nomor pribadi admin.**

- Fonnte bukan layanan resmi WhatsApp (Meta). Nomor yang mengirim pesan otomatis **berisiko diblokir** WhatsApp, terutama nomor baru yang langsung mengirim banyak pesan.
- Gunakan kartu SIM baru, pasang di HP cadangan (boleh HP lama) dengan aplikasi **WhatsApp** atau **WhatsApp Business**.
- Agar nomor lebih "dipercaya" WhatsApp, pakai nomor itu untuk chat biasa beberapa hari sebelum disambungkan ke Fonnte. Isi juga foto profil dan nama lembaga.
- HP cadangan itu **harus tetap menyala dan terhubung internet** (Wi-Fi atau data). Jika HP mati atau WhatsApp keluar, pesan tidak terkirim.
- Admin tetap memakai nomor pribadinya sebagai **penerima** notifikasi (langkah 5).

---

## 4. Daftar Fonnte dan sambungkan perangkat

1. Buka **https://fonnte.com**, klik **Register / Daftar**, lalu isi data. Gunakan email lembaga.
2. Masuk ke **dashboard** Fonnte, lalu buka menu **Device**, lalu **Add Device**.
   - **Name:** misalnya `Les Ahe Ala`
   - **Number:** nomor WA khusus lembaga (format `628xxxx`)
3. Pada perangkat yang baru dibuat, klik **Connect**. Akan muncul **QR code**.
4. Di HP cadangan, buka WhatsApp, lalu **⋮ / Setelan → Perangkat tertaut → Tautkan perangkat**, kemudian pindai QR code tersebut.
5. Status perangkat di dashboard Fonnte berubah menjadi **connect** (hijau).
6. Klik **Token** pada perangkat itu, lalu **salin token**. Token berupa deretan huruf dan angka, misalnya `aB3dEfG7hiJKlmN9oPqR`.

> 🔒 **Token itu seperti kata sandi.** Siapa pun yang memegangnya bisa mengirim WA atas nama lembaga. Jangan dibagikan di grup, jangan ditaruh di `config.js`, dan jangan diunggah ke GitHub.

---

## 5. Pasang token di aplikasi

1. Login admin, lalu buka **Pengaturan → WhatsApp**.
2. Di kolom **Token Fonnte**, tempel token, lalu klik **Simpan**. Lencana di kanan atas berubah menjadi **"Token terpasang"**.
   - Token disimpan di **Script Properties** server Google Apps Script. Token **tidak pernah** dikirim balik ke browser, tidak tersimpan di spreadsheet, dan tidak ada di GitHub.
3. Isi **Nomor WA admin (penerima notifikasi)**, misalnya `0812xxxxxxx`, lalu klik 💾. Nomor ini menerima notifikasi pendaftar baru dan siswa yang lama tidak masuk. Nomor ini juga tampil sebagai kontak di landing page.
4. Pastikan sakelar **"Pengiriman WA otomatis aktif"** menyala.

---

## 6. Uji coba

Lakukan berurutan di **Pengaturan → WhatsApp**:

1. **Cek status perangkat.** Muncul nama perangkat, status, paket, dan sisa kuota. Jika status bukan "connect", ulangi langkah 4.3–4.4.
2. **Kirim pesan uji ke admin.** Dalam beberapa detik, WA admin menerima pesan *"Pesan uji dari aplikasi … Koneksi Fonnte berhasil ✅"*.
3. (Opsional) **Jalankan cek tunggakan & absen sekarang.** Aplikasi langsung menjalankan pengecekan harian. Hasilnya: jumlah tunggakan, jumlah absen, berapa WA terkirim dan gagal.
   > ⚠️ Tombol ini **benar-benar mengirim** pesan ke orang tua yang menunggak. Pastikan data SPP sudah benar dan **Mulai pencatatan SPP** di Pengaturan → SPP sudah diatur, agar bulan-bulan lama tidak dianggap tunggakan.
4. Coba alur nyata: isi formulir pendaftaran dari HP dengan nomor WA Anda sendiri. Anda (sebagai "orang tua") dan admin seharusnya sama-sama menerima pesan.

Semua pengiriman, baik berhasil maupun gagal, tercatat di **Riwayat pengiriman** di halaman yang sama. Riwayat ini juga tersimpan di sheet `Log_WA`. Pesan yang gagal bisa dikirim ulang dengan tombol **Kirim ulang**.

---

## 7. Mengubah isi pesan (template)

Di **Pengaturan → WhatsApp → Template pesan otomatis**, pilih template, ubah teksnya, periksa **pratinjau** di bawahnya, lalu klik **Simpan**.

**Menonaktifkan template:** matikan sakelar **Pesan ini aktif** di atas kotak template. Template yang nonaktif ditandai di tab-nya dan pesannya tidak dikirim otomatis (pengiriman WA lain tetap jalan). Nyalakan lagi kapan saja.

Kata dalam kurung kurawal akan diganti otomatis:

| Kode | Diganti dengan |
|---|---|
| `{lembaga}` | Nama lembaga |
| `{nama}` / `{panggilan}` | Nama lengkap / panggilan siswa |
| `{ortu}` | Nama orang tua |
| `{program}` | Les Baca (Ahe) / Les Berhitung (Ala) |
| `{kode}` | Kode registrasi |
| `{level}` | Level awal (template "Diterima") / level baru (template "Naik Level") |
| `{level_lama}` | Level sebelumnya (template "Naik Level") |
| `{wa}` | Nomor WA orang tua |
| `{bulan_tunggakan}` | Contoh: "September & Oktober 2026" |
| `{total}` | Contoh: "Rp300.000" |
| `{link_kuitansi}` | Link kuitansi online |
| `{hari_absen}` / `{terakhir_hadir}` | Jumlah hari tidak masuk / tanggal terakhir hadir |
| `{wa_admin}` | Nomor WA admin |

Format WhatsApp tetap berlaku: `*tebal*`, `_miring_`, dan baris baru dengan Enter.

---

## 8. Pemicu harian pukul 07.00 WITA

Pemicu dipasang otomatis oleh `setupAplikasi`. Untuk memeriksanya:

- Buka editor Apps Script, lalu ⏰ **Pemicu** (Triggers) di menu kiri. Harus ada baris **`cekHarian`**, *Berbasis waktu*, *Pemicu hari*, *07.00–08.00*.
- Jika tidak ada (misalnya terhapus), jalankan lagi **`setupAplikasi`** dan pemicu akan dipasang ulang.
- Google menjalankan pemicu ini **di antara pukul 07.00 dan 08.00**, bukan tepat 07.00.
- Jeda 2 detik diberikan antar-pesan agar nomor tidak dianggap spam.

---

## 9. Mengatasi masalah

| Gejala (di Riwayat pengiriman / pesan error) | Penyebab | Solusi |
|---|---|---|
| `Token Fonnte belum diisi` | Token belum disimpan | Ulangi langkah 5 |
| `invalid token` / `token tidak valid` | Token salah atau perangkat dihapus | Salin ulang token dari dashboard Fonnte, lalu Ganti |
| `device disconnected` / status bukan "connect" | HP cadangan mati, tanpa internet, atau WhatsApp logout | Nyalakan HP dan internet. Bila perlu, pindai ulang QR (langkah 4.3) |
| `quota habis` / `insufficient quota` | 1.000 pesan bulan ini habis | Matikan sementara sakelar WA otomatis, tunggu bulan depan, atau naikkan paket |
| `Nomor tujuan kosong` | Data WA orang tua belum diisi | Lengkapi nomor di data siswa |
| Status **dilewati** | Sakelar "Pengiriman WA otomatis aktif" mati | Nyalakan kembali |
| Pesan uji berhasil tetapi pengingat harian tidak pernah terkirim | Pemicu tidak ada, atau memang tidak ada tunggakan/absen | Cek langkah 8. Lihat juga Dashboard → Peringatan Otomatis. |
| Nomor lembaga diblokir WhatsApp | Risiko layanan tidak resmi | Gunakan nomor baru, jangan kirim pesan massal sekaligus, isi profil WA dengan lengkap |
| `Tidak bisa menghubungi Fonnte` | Gangguan sementara di Fonnte/Google | Coba lagi beberapa menit kemudian. Pesan gagal bisa dikirim ulang dari Riwayat. |

**Jika Fonnte sedang bermasalah,** tombol **Kirim WA** di detail siswa dan di kuitansi tetap bisa dipakai secara manual. Bila pengiriman lewat Fonnte gagal, aplikasi menawarkan **"Buka di WhatsApp"**, yang membuka WhatsApp di HP admin dengan pesan yang sudah terisi.

---

## 10. Mengganti nomor atau token
- **Ganti HP atau nomor:** tambahkan perangkat baru di Fonnte, salin tokennya, lalu di **Pengaturan → WhatsApp** isi token baru dan klik **Ganti**.
- **Mencabut akses:** klik ikon 🗑️ di sebelah tombol **Ganti**. Token terhapus dari server, dan semua pengiriman otomatis berhenti dengan status "Token Fonnte belum diisi".

---

*Informasi paket Fonnte dapat berubah sewaktu-waktu. Selalu cek fonnte.com untuk ketentuan terbaru.*
