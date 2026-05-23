new Vue({
    el: '#stokApp',
    data: {
        stokDataGlobal: dataStok, 
        upbjjListDaerah: upbjjList, 
        upbjjListKategori: kategoriList, 

        selectedUpbjj: 'Semua',
        selectedKategori: 'Semua',
        sortBy: 'judul',
        filterReorderOnly: false,

        newBahanAjar: {
            kode: '',
            judul: '',
            kategori: '',
            upbjj: '',
            lokasiRak: '',
            qty: 0,
            safety: 0,
            harga: 50000, 
            catatanHTML: ''
        }
    },
    computed: {
        filteredAndSortedStok() {
            let hasilProses = [...this.stokDataGlobal];

            // 1. Filter UT-Daerah
            if (this.selectedUpbjj !== 'Semua') {
                hasilProses = hasilProses.filter(item => item.upbjj === this.selectedUpbjj);
            }

            // 2. Filter Kategori (Dependent)
            if (this.selectedUpbjj !== 'Semua' && this.selectedKategori !== 'Semua') {
                hasilProses = hasilProses.filter(item => item.kategori === this.selectedKategori);
            }

            // 3. Filter Re-order Kritis
            if (this.filterReorderOnly) {
                hasilProses = hasilProses.filter(item => item.qty === 0 || item.qty < item.safety);
            }

            // 4. Sorting
            hasilProses.sort((a, b) => {
                if (this.sortBy === 'judul') {
                    return a.judul.localeCompare(b.judul);
                } else if (this.sortBy === 'stock') {
                    return a.qty - b.qty;
                } else if (this.sortBy === 'harga') {
                    let hargaA = a.harga || 0;
                    let hargaB = b.harga || 0;
                    return hargaA - hargaB;
                }
                return 0;
            });

            return hasilProses;
        }
    },
    methods: {
        // Output teks bersih dan formal sesuai permintaan tugas akademik
        evaluasiStatusTeks(qty, safety) {
            if (qty === 0) return 'Kosong';
            if (qty < safety) return 'Menipis';
            return 'Aman';
        },
        // Mengembalikan kelas class styling untuk CSS formal (bisa diatur warnanya di css/style.css)
        evaluasiStatusClass(qty, safety) {
            if (qty === 0) return 'status-kosong'; // Default warna merah formal di CSS
            if (qty < safety) return 'status-menipis'; // Default warna jingga/oranye di CSS
            return 'status-aman'; // Default warna hijau di CSS
        },
        addBahanAjar() {
            // Validasi Sederhana
            if (!this.newBahanAjar.judul.trim()) {
                alert("Validasi Gagal: Nama Mata Kuliah wajib diisi.");
                return;
            }
            if (!this.newBahanAjar.kategori || !this.newBahanAjar.upbjj) {
                alert("Validasi Gagal: Silakan pilih Kategori dan UT-Daerah.");
                return;
            }
            if (this.newBahanAjar.qty === '' || this.newBahanAjar.safety === '') {
                alert("Validasi Gagal: Kolom Jumlah Stok atau Safety tidak boleh kosong.");
                return;
            }

            this.newBahanAjar.kode = 'MK-' + (this.stokDataGlobal.length + 101);
            this.stokDataGlobal.push({ ...this.newBahanAjar });
            
            alert(`Data modul "${this.newBahanAjar.judul}" berhasil ditambahkan.`);
            this.resetFormInput();
        },
        resetSemuaFilter() {
            this.selectedUpbjj = 'Semua';
            this.selectedKategori = 'Semua';
            this.sortBy = 'judul';
            this.filterReorderOnly = false;
        },
        resetFormInput() {
            this.newBahanAjar = {
                kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '',
                qty: 0, safety: 0, harga: 50000, catatanHTML: ''
            };
        }
    }
});