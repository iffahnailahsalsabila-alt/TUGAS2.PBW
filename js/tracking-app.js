new Vue({
    el: '#trackingApp',
    data: {
        // Ekstrak Key Induk dan konversi format Rina dari DO2025-0001 menjadi DO2025-001
        trackingList: Object.keys(dataTracking).map(key => {
            let formattedKey = key;
            if (key === "DO2025-0001") {
                formattedKey = "DO2025-001";
            }
            return {
                noDO: formattedKey,
                ...dataTracking[key]
            };
        }),

        ekspedisiList: pengirimanList.map(e => e.nama),
        daftarPaket: paketList,
        selectedPaketKode: '',

        newDO: {
            nim: '',
            nama: '',
            ekspedisi: '',
            paket: '',        
            totalHarga: 0,    
            // FUNGSI REVISI: Menggunakan fungsi Date dasar untuk mengambil string waktu lokal hari ini (Format: YYYY-MM-DD)
            tanggalKirim: new Date().toLocaleDateString('fr-CA'), 
            status: 'Input Baru'
        }
    },
    computed: {
        detailIsiPaketSelected() {
            if (!this.selectedPaketKode) return null;
            const paketKetemu = this.daftarPaket.find(p => p.kode === this.selectedPaketKode);
            return paketKetemu ? paketKetemu.isi : null;
        },

        generateNoDO() {
            const currentYear = new Date().getFullYear();
            const sequence = this.trackingList.length + 1;
            const paddedSequence = String(sequence).padStart(3, '0');
            return `DO${currentYear}-${paddedSequence}`;
        }
    },
    watch: {
        selectedPaketKode(newKode) {
            const paketKetemu = this.daftarPaket.find(p => p.kode === newKode);
            if (paketKetemu) {
                this.newDO.paket = paketKetemu.nama;
                this.newDO.totalHarga = paketKetemu.harga; 
            } else {
                this.newDO.paket = '';
                this.newDO.totalHarga = 0;
            }
        }
    },
    methods: {
        addTrackingDO() {
            // Validasi data field form wajib diisi termasuk tanggal kirim
            if (!this.newDO.nim.trim() || !this.newDO.nama.trim() || !this.newDO.ekspedisi || !this.selectedPaketKode || !this.newDO.tanggalKirim) {
                alert("Harap lengkapi seluruh bidang data field yang disediakan!");
                return;
            }

            const newEntry = {
                noDO: this.generateNoDO,
                nim: this.newDO.nim,
                nama: this.newDO.nama,
                ekspedisi: this.newDO.ekspedisi,
                paket: this.newDO.paket,
                totalHarga: this.newDO.totalHarga,
                tanggalKirim: this.newDO.tanggalKirim, // Diambil dari value form (bisa hasil edit manual user)
                status: this.newDO.status
            };

            this.trackingList.push(newEntry);

            alert(`Delivery Order ${newEntry.noDO} sukses ditambahkan ke daftar antrean.`);
            this.resetFormInput();
        },
        resetFormInput() {
            this.selectedPaketKode = '';
            this.newDO = {
                nim: '',
                nama: '',
                ekspedisi: '',
                paket: '',
                totalHarga: 0,
                // Kembalikan ke default waktu lokal saat ini setelah di-reset
                tanggalKirim: new Date().toLocaleDateString('fr-CA'),
                status: 'Input Baru'
            };
        }
    }
});