### RPLJudge

RPLJudge adalah platform penilaian otomatis untuk kompetisi pemrograman yang dirancang dengan menggunakan Next.js dan TypeScript. Proyek ini bertujuan untuk memberikan sistem penilaian yang efisien dan mudah digunakan bagi peserta dan juri dalam lomba pemrograman.

### Fitur Utama:

- **Penilaian Otomatis**: RPLJudge secara otomatis menilai solusi yang diberikan peserta berdasarkan kriteria yang telah ditentukan.
- **Dukungan Multibahasa**: Platform ini mendukung berbagai bahasa pemrograman, termasuk C, C++, Java, Python, JavaScript, Ruby, Go, dan Rust.
- **Antarmuka Pengguna yang Ramah**: Antarmuka yang intuitif dan mudah digunakan untuk peserta dan juri, memudahkan interaksi dengan sistem.
- **Manajemen Kontes**: Memungkinkan penyelenggara untuk membuat dan mengelola kontes dengan mudah.
- **Statistik dan Laporan**: Menyediakan statistik real-time mengenai peserta dan hasil penilaian.
- **Template Kode**: Menyediakan template kode untuk setiap bahasa pemrograman yang didukung, sehingga peserta dapat memulai dengan cepat.

### Arsitektur:

Proyek ini dibangun dengan teknologi berikut:

- **Frontend**: Menggunakan React dan Tailwind CSS untuk antarmuka pengguna.
- **Backend**: Memanfaatkan Next.js dengan TypeScript untuk pengolahan logika bisnis.
- **Database**: Anda dapat menggunakan database pilihan Anda (seperti MongoDB atau PostgreSQL) untuk menyimpan data kontes dan peserta.
- **Containerization**: Menggunakan Docker untuk menjalankan lingkungan pengujian secara terisolasi.

### Instalasi:

Untuk menjalankan RPLJudge di lingkungan lokal, ikuti langkah-langkah berikut:

1. **Clone Repository**:

   - Jalankan perintah berikut di terminal:
     ```
     git clone https://github.com/username/rpljudge.git
     cd rpljudge
     ```

2. **Instal Dependensi**:

   - Pastikan Anda berada di direktori proyek, lalu jalankan:
     ```
     npm install
     ```

3. **Menjalankan Aplikasi**:

   - Untuk memulai aplikasi Next.js, gunakan perintah:
     ```
     npm run dev
     ```

4. **Akses Aplikasi**:
   - Buka browser dan kunjungi `http://localhost:3000` untuk melihat antarmuka pengguna.

### Penggunaan:

1. **Mendaftar dan Masuk**: Pengguna harus mendaftar dan masuk untuk berpartisipasi dalam kontes.

2. **Mengikuti Kontes**: Setelah masuk, pengguna dapat melihat daftar kontes yang tersedia dan mendaftar untuk berpartisipasi.

3. **Mengirimkan Solusi**: Peserta dapat mengirimkan solusi untuk masalah yang diberikan selama kontes.

4. **Melihat Hasil**: Setelah penilaian selesai, peserta dapat melihat hasil dan statistik mereka.

### Endpoint API:

- **Compile and Run Code**:

  - Endpoint: `POST /api/compile`
  - Fungsi: Menerima kode, bahasa, dan (opsional) input untuk dijalankan. Contoh payload:
    ```json
    {
      "code": "print('Hello, World!')",
      "language": "python"
    }
    ```

- **Get Code Template**:
  - Endpoint: `GET /api/template?language=language`
  - Fungsi: Mengembalikan template kode untuk bahasa yang ditentukan.

### Kontribusi:

Kami sangat menghargai kontribusi dari semua orang. Jika Anda ingin berkontribusi, silakan ikuti langkah-langkah berikut:

1. Fork repositori ini.
2. Buat branch baru (`git checkout -b feature-nama-fitur`).
3. Lakukan perubahan dan commit (`git commit -m 'Menambahkan fitur baru'`).
4. Push ke branch (`git push origin feature-nama-fitur`).
5. Buat pull request.

### Lisensi:

Proyek ini dilisensikan di bawah MIT License.
