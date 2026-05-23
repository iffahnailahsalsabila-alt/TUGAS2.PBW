new Vue({
    el: '#trackingApp',
    data: {
        trackingList: Object.values(dataTracking),
        // Menggunakan data pengirimanList
        ekspedisiList: pengirimanList,
        newDO: {
            nim: '',
            nama: '',
            ekspedisi: '',
            tanggalKirim: new Date().toISOString().slice(0, 10),
            status: 'Input Baru',
        },
    },
    // Computed Properties sederhana untuk nomor DO otomatis
    computed: {
        generateNoDO() {
            const currentYear = new Date().getFullYear();
            const sequence = Object.keys(dataTracking).length + this.trackingList.length + 1;
            const paddedSequence = String(sequence).padStart(4, '0');
            return `DO${currentYear}-${paddedSequence}`;
        },
    },
    methods: {
        addTrackingDO() {
            if (!this.newDO.nim || !this.newDO.nama || !this.newDO.ekspedisi) {
                alert("Harap lengkapi NIM, Nama, dan Ekspedisi!");
                return;
            }

            const newEntry = {
                noDO: this.generateNoDO,
                ...this.newDO,
                totalHarga: 0,
                paket: 'Default',
            };

            this.trackingList.push(newEntry);

            alert(`Delivery Order ${newEntry.noDO} berhasil ditambahkan!`);

            // Reset form
            this.newDO = {
                nim: '',
                nama: '',
                ekspedisi: '',
                tanggalKirim: new Date().toISOString().slice(0, 10),
                status: 'Input Baru',
            };
        }
    }
});