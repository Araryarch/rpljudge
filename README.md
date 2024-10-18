# RPLJudge

RPLJudge adalah platform penilaian otomatis untuk kompetisi pemrograman, terinspirasi oleh DOMjudge. Proyek ini dirancang untuk menyediakan sistem penilaian yang efisien dan mudah digunakan bagi peserta dan juri dalam lomba pemrograman.

## Fitur Utama

- **Penilaian Otomatis**: Menilai solusi secara otomatis berdasarkan kriteria yang ditentukan.
- **Dukungan Multibahasa**: Mendukung berbagai bahasa pemrograman seperti C, C++, Java, Python, dan banyak lagi.
- **Antarmuka Pengguna yang Ramah**: Antarmuka yang intuitif untuk peserta dan juri, memudahkan interaksi dengan sistem.
- **Manajemen Kontes**: Fitur untuk membuat dan mengelola kontes dengan mudah.
- **Statistik dan Laporan**: Menyediakan statistik real-time tentang peserta dan hasil penilaian.

## Arsitektur

Proyek ini dibangun menggunakan teknologi berikut:

- **Frontend**: [React](https://reactjs.org/) dan [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Node.js](https://nodejs.org/) dan [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) untuk menyimpan data kontes dan peserta
- **Containerization**: [Docker](https://www.docker.com/) untuk menjalankan lingkungan pengujian secara terisolasi

## Instalasi

Untuk menjalankan RPLJudge di lokal Anda, ikuti langkah-langkah berikut:

1. **Clone Repository**

   ```bash
   git clone https://github.com/username/rpljudge.git
   cd rpljudge
   ```

2. **Instal Dependensi**

   - **Backend**:

     ```bash
     cd backend
     npm install
     ```

   - **Frontend**:

     ```bash
     cd frontend
     npm install
     ```

3. **Konfigurasi Database**

   Pastikan Anda telah menginstal MongoDB dan mengatur koneksi database dalam file konfigurasi.

4. **Menjalankan Aplikasi**

   - **Backend**:

     ```bash
     cd backend
     npm start
     ```

   - **Frontend**:

     ```bash
     cd frontend
     npm start
     ```

5. **Akses Aplikasi**

   Buka browser Anda dan akses `http://localhost:3000` untuk melihat antarmuka pengguna.

## Penggunaan

1. **Mendaftar dan Masuk**: Pengguna harus mendaftar dan masuk untuk dapat berpartisipasi dalam kontes.
2. **Mengikuti Kontes**: Setelah masuk, pengguna dapat melihat kontes yang tersedia dan mendaftar untuk berpartisipasi.
3. **Mengirimkan Solusi**: Peserta dapat mengirimkan solusi untuk masalah yang diberikan selama kontes.
4. **Melihat Hasil**: Setelah penilaian selesai, peserta dapat melihat hasil dan statistik mereka.

## Kontribusi

Kami sangat menghargai kontribusi dari semua orang. Jika Anda ingin berkontribusi, silakan ikuti langkah-langkah berikut:

1. Fork repositori ini
2. Buat branch baru (`git checkout -b feature-nama-fitur`)
3. Lakukan perubahan dan commit (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin feature-nama-fitur`)
5. Buat pull request

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## Kontak

Untuk pertanyaan atau saran, silakan hubungi:

- **Ararya Arka**: [araryaarch@gmail.com](mailto:araryaarch@gmail.com)

```

### Penjelasan:

- **Judul dan Deskripsi**: Menjelaskan nama proyek dan fungsinya.
- **Fitur Utama**: Daftar fitur yang ditawarkan oleh proyek.
- **Arsitektur**: Teknologi yang digunakan dalam proyek.
- **Instalasi**: Langkah-langkah untuk menginstal dan menjalankan proyek secara lokal.
- **Penggunaan**: Cara menggunakan aplikasi setelah diinstal.
- **Kontribusi**: Petunjuk bagi orang lain untuk berkontribusi pada proyek.
- **Lisensi**: Informasi tentang lisensi yang digunakan.
- **Kontak**: Informasi kontak untuk pertanyaan lebih lanjut.

Silakan sesuaikan isi README ini dengan detail proyek Anda agar sesuai dengan fitur dan struktur yang Anda inginkan.
```
