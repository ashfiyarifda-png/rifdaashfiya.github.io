async function tampilkanPendidikan() {
    const tabel = document.getElementById("educationTable");

    try {
        tabel.innerHTML = `
            <tr><td colspan="4">Menghubungkan database...</td></tr>
        `;

        // Membuka SQLite
        const SQL = await initSqlJs({
            locateFile: file =>
                new URL(file, window.location.href).href
        });

        // Mengambil file database
        const response = await fetch("./riwayat.db");

        if (!response.ok) {
            throw new Error("File riwayat.db tidak ditemukan.");
        }

        const buffer = await response.arrayBuffer();
        const db = new SQL.Database(new Uint8Array(buffer));

        // Membaca tabel riwayat
        const hasil = db.exec(`
            SELECT nama_sekolah, tahun_masuk,
                   tahun_lulus, keterangan
            FROM riwayat
            ORDER BY tahun_masuk DESC
        `);

        tabel.innerHTML = "";

        if (hasil.length === 0 || hasil[0].values.length === 0) {
            tabel.innerHTML = `
                <tr><td colspan="4">Data pendidikan kosong.</td></tr>
            `;
        } else {
            hasil[0].values.forEach(data => {
                const baris = document.createElement("tr");

                data.forEach(nilai => {
                    const kolom = document.createElement("td");
                    kolom.textContent = nilai ?? "-";
                    baris.appendChild(kolom);
                });

                tabel.appendChild(baris);
            });
        }

        db.close();

    } catch (error) {
        console.error("Kesalahan SQLite:", error);

        tabel.innerHTML = `
            <tr>
                <td colspan="4" class="text-danger">
                    Gagal memuat data: ${error.message}
                </td>
            </tr>
        `;
    }
}

document.addEventListener("DOMContentLoaded", tampilkanPendidikan);
