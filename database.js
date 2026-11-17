// Membuka database SQLite
async function tampilkanPendidikan() {
    const SQL = await initSqlJs({
        locateFile: file => file
    });

    const response = await fetch("riwayat.db");
    const buffer = await response.arrayBuffer();
    const db = new SQL.Database(new Uint8Array(buffer));

    // Mengambil data pendidikan
    const hasil = db.exec(`
        SELECT nama_sekolah, tahun_masuk, tahun_lulus, keterangan
        FROM riwayat
        ORDER BY tahun_masuk DESC
    `);

    const tabel = document.getElementById("educationTable");

    if (!tabel) {
        console.error("Tabel pendidikan tidak ditemukan.");
        return;
    }

    tabel.innerHTML = "";

    if (hasil.length === 0) {
        tabel.innerHTML = "<tr><td colspan='4'>Belum ada data pendidikan.</td></tr>";
        return;
    }

    hasil[0].values.forEach(data => {
        const baris = document.createElement("tr");

        data.forEach(nilai => {
            const kolom = document.createElement("td");
            kolom.textContent = nilai ?? "-";
            baris.appendChild(kolom);
        });

        tabel.appendChild(baris);
    });

    db.close();
}

// Jalankan saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", tampilkanPendidikan);
