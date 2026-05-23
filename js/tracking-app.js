new Vue({
    el: '#trackingApp',
    data: {
        // Mengambil nama KEY asli ("DO2025-0001") langsung tanpa pemotongan digit angka
        trackingList: Object.keys(dataTracking).map(key => {
            return {
                noDO: key, 
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
            tanggalKirim: new Date().toLocaleDateString('fr-CA'), // Format YYYY-MM-DD waktu lokal
            status: 'Input Baru'
        }
    },
    computed: {
        detailIsiPaketSelected() {
            if (!this.selectedPaketKode) return null;
            const paketKetemu = this.daftarPaket.find(p => p.kode === this.selectedPaketKode);
            return paketKetemu ? paketKetemu.isi : null;
        },

        // Generasi otomatis kode running DO nomor urut (Format 4 digit sesuai data awal: DO2026-0002)
        generateNoDO() {
            const currentYear = new Date().getFullYear();
            const sequence = this.trackingList.length + 1;
            const paddedSequence = String(sequence).padStart(4, '0'); // Menggunakan padStart 4 digit
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
                tanggalKirim: this.newDO.tanggalKirim, 
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
                tanggalKirim: new Date().toLocaleDateString('fr-CA'),
                status: 'Input Baru'
            };
        }
    }
});