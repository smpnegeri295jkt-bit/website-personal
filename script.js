document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // STATE & DATA APLIKASI
    // =================================================================
    let guruData = JSON.parse(localStorage.getItem('guruDataSMP')) || [];
    let muridData = JSON.parse(localStorage.getItem('muridDataSMP')) || [];
    let studentData = JSON.parse(localStorage.getItem('sumatifDataSMP')) || [];
    let formatifData = JSON.parse(localStorage.getItem('formatifDataSMP')) || [];

    const teacherList = ["ABRIYANTO GUNAWAN,S.KOM"];
    const tugasTambahanList = ["-", "Wali kelas"];
    const classList = ['7F'];

    // =================================================================
    // FUNGSI UMUM (MODALS, SAVING, DROPDOWNS)
    // =================================================================
    const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));
    const openModal = (modalId) => document.getElementById(modalId).classList.remove('hidden');
    const closeModal = (modalId) => document.getElementById(modalId).classList.add('hidden');

    const populateDropdown = (element, options, placeholder) => {
        element.innerHTML = `<option value="">${placeholder}</option>`;
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            element.appendChild(option);
        });
    };
    
    // =================================================================
    // NAVIGASI & INISIALISASI
    // =================================================================
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('#app-content > div');

    const showPage = (pageId) => {
        pages.forEach(page => page.classList.add('hidden'));
        document.getElementById(pageId).classList.remove('hidden');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.hash === `#${pageId.split('-')[1]}`) link.classList.add('active');
        });
    };

    const initializeApp = () => {
        // Navigasi
        navLinks.forEach(link => link.addEventListener('click', e => {
            e.preventDefault();
            showPage(`page-${e.target.hash.substring(1)}`);
        }));
        
        // Populate static dropdowns
        const classDropdowns = [document.getElementById('muridKelas'), document.getElementById('filterKelas'), document.getElementById('kelasWali'), document.getElementById('formatifKelas'), document.getElementById('kelas')];
        classDropdowns.forEach(dd => populateDropdown(dd, classList, dd.id === 'filterKelas' ? 'Semua Kelas' : 'Pilih Kelas'));
        populateDropdown(document.getElementById('tugasTambahan'), tugasTambahanList, 'Pilih Tugas');
        populateDropdown(document.getElementById('guruMapel'), teacherList, 'Pilih Guru');

        // Render tables
        renderGuruTable();
        renderMuridTable();
        renderFormatifTable();
        renderSumatifTable();

        // Initial Page
        showPage('page-beranda');
    };

    // =================================================================
    // DATA MASTER: GURU
    // =================================================================
    const guruTableBody = document.getElementById('guruTableBody');
    const noDataGuru = document.getElementById('no-data-guru');
    const guruForm = document.getElementById('guruForm');
    const tugasTambahanSelect = document.getElementById('tugasTambahan');
    const kelasWaliContainer = document.getElementById('kelasWaliContainer');

    const renderGuruTable = () => {
        guruTableBody.innerHTML = '';
        noDataGuru.classList.toggle('hidden', guruData.length > 0);
        guruData.forEach(guru => {
            const row = guruTableBody.insertRow();
            row.innerHTML = `<td class="px-6 py-4">${guru.namaGuru}</td><td class="px-6 py-4">${guru.tugasTambahan}</td><td class="px-6 py-4">${guru.kelasWali || '-'}</td><td class="px-6 py-4"><button class="font-medium text-blue-600 edit-guru" data-id="${guru.id}">Edit</button><button class="font-medium text-red-600 ml-2 delete-guru" data-id="${guru.id}">Hapus</button></td>`;
        });
    };
    
    tugasTambahanSelect.addEventListener('change', () => {
        kelasWaliContainer.classList.toggle('hidden', tugasTambahanSelect.value !== 'Wali kelas');
    });

    document.getElementById('addGuruButton').addEventListener('click', () => {
        guruForm.reset();
        guruForm.guruId.value = '';
        document.getElementById('guruModalTitle').textContent = 'Input Data Guru';
        kelasWaliContainer.classList.add('hidden');
        openModal('guruModal');
    });
    
    guruForm.addEventListener('submit', e => {
        e.preventDefault();
        const id = guruForm.guruId.value;
        const guru = {
            id: id || Date.now().toString(),
            namaGuru: guruForm.namaGuru.value,
            tugasTambahan: guruForm.tugasTambahan.value,
            kelasWali: guruForm.tugasTambahan.value === 'Wali kelas' ? guruForm.kelasWali.value : null
        };
        if (id) {
            guruData = guruData.map(g => g.id === id ? guru : g);
        } else {
            guruData.push(guru);
        }
        saveData('guruDataSMP', guruData);
        renderGuruTable();
        closeModal('guruModal');
    });

    guruTableBody.addEventListener('click', e => {
        const id = e.target.dataset.id;
        const guru = guruData.find(g => g.id === id);
        if (e.target.classList.contains('edit-guru')) {
            guruForm.guruId.value = guru.id;
            guruForm.namaGuru.value = guru.namaGuru;
            guruForm.tugasTambahan.value = guru.tugasTambahan;
            guruForm.kelasWali.value = guru.kelasWali || '';
            tugasTambahanSelect.dispatchEvent(new Event('change'));
            document.getElementById('guruModalTitle').textContent = 'Edit Data Guru';
            openModal('guruModal');
        }
        if (e.target.classList.contains('delete-guru')) {
            guruData = guruData.filter(g => g.id !== id);
            saveData('guruDataSMP', guruData);
            renderGuruTable();
        }
    });

    // =================================================================
    // DATA MASTER: MURID
    // =================================================================
    const muridTableBody = document.getElementById('muridTableBody');
    const noDataMurid = document.getElementById('no-data-murid');
    const muridForm = document.getElementById('muridForm');

    const renderMuridTable = () => {
        muridTableBody.innerHTML = '';
        noDataMurid.classList.toggle('hidden', muridData.length > 0);
        muridData.forEach(murid => {
            const row = muridTableBody.insertRow();
            row.innerHTML = `<td class="px-6 py-4">${murid.namaMurid}</td><td class="px-6 py-4">${murid.kelas}</td><td class="px-6 py-4">${murid.nis}</td><td class="px-6 py-4">${murid.nisn}</td><td class="px-6 py-4"><button class="font-medium text-blue-600 edit-murid" data-id="${murid.id}">Edit</button><button class="font-medium text-red-600 ml-2 delete-murid" data-id="${murid.id}">Hapus</button></td>`;
        });
    };
    
    document.getElementById('addMuridButton').addEventListener('click', () => {
        muridForm.reset();
        muridForm.muridId.value = '';
        document.getElementById('muridModalTitle').textContent = 'Input Data Murid';
        openModal('muridModal');
    });
    
    muridForm.addEventListener('submit', e => {
        e.preventDefault();
        const id = muridForm.muridId.value;
        const murid = {
            id: id || Date.now().toString(),
            namaMurid: muridForm.muridNama.value,
            kelas: muridForm.muridKelas.value,
            nis: muridForm.muridNis.value,
            nisn: muridForm.muridNisn.value
        };
        if (id) {
            muridData = muridData.map(m => m.id === id ? murid : m);
        } else {
            muridData.push(murid);
        }
        saveData('muridDataSMP', muridData);
        renderMuridTable();
        closeModal('muridModal');
    });
    
    muridTableBody.addEventListener('click', e => {
        const id = e.target.dataset.id;
        const murid = muridData.find(m => m.id === id);
        if (e.target.classList.contains('edit-murid')) {
            muridForm.muridId.value = murid.id;
            muridForm.muridNama.value = murid.namaMurid;
            muridForm.muridKelas.value = murid.kelas;
            muridForm.muridNis.value = murid.nis;
            muridForm.muridNisn.value = murid.nisn;
            document.getElementById('muridModalTitle').textContent = 'Edit Data Murid';
            openModal('muridModal');
        }
        if (e.target.classList.contains('delete-murid')) {
            muridData = muridData.filter(m => m.id !== id);
            saveData('muridDataSMP', muridData);
            renderMuridTable();
        }
    });

    // =================================================================
    // NILAI FORMATIF
    // =================================================================
    const formatifTableBody = document.getElementById('formatifTableBody');
    const noDataFormatif = document.getElementById('no-data-formatif');
    const formatifForm = document.getElementById('formatifForm');

    const renderFormatifTable = () => {
        formatifTableBody.innerHTML = '';
        noDataFormatif.classList.toggle('hidden', formatifData.length > 0);
        formatifData.forEach((item, index) => {
            const row = formatifTableBody.insertRow();
            row.innerHTML = `<td class="px-6 py-4">${index + 1}</td><td class="px-6 py-4">${item.namaMurid}</td><td class="px-6 py-4">${item.kelas}</td><td class="px-6 py-4">${item.mataPelajaran}</td><td class="px-6 py-4 text-center">${item.scores.f1||'-'}</td><td class="px-6 py-4 text-center">${item.scores.f2||'-'}</td><td class="px-6 py-4 text-center">${item.scores.f3||'-'}</td><td class="px-6 py-4 text-center">${item.scores.f4||'-'}</td><td class="px-6 py-4 text-center font-bold text-green-700 bg-green-50">${item.average}</td><td class="px-6 py-4 no-print"><button class="font-medium text-blue-600 edit-formatif" data-id="${item.id}">Edit</button><button class="font-medium text-red-600 ml-2 delete-formatif" data-id="${item.id}">Hapus</button></td>`;
        });
    };

    const calculateFormatifAverage = () => {
        const scores = [parseFloat(formatifForm.f1.value) || 0, parseFloat(formatifForm.f2.value) || 0, parseFloat(formatifForm.f3.value) || 0, parseFloat(formatifForm.f4.value) || 0];
        const validScores = scores.filter(s => s > 0);
        const average = validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0;
        formatifForm.formatifRataRata.value = average.toFixed(2);
    };
    
    ['f1','f2','f3','f4'].forEach(id => formatifForm[id].addEventListener('input', calculateFormatifAverage));
    
    document.getElementById('formatifKelas').addEventListener('change', e => {
        const selectedClass = e.target.value;
        const studentsInClass = muridData.filter(m => m.kelas === selectedClass).map(m => m.namaMurid);
        populateDropdown(document.getElementById('formatifNamaMurid'), studentsInClass, 'Pilih Murid');
    });

    document.getElementById('addFormatifDataButton').addEventListener('click', () => {
        formatifForm.reset();
        formatifForm.formatifId.value = '';
        document.getElementById('formatifModalTitle').textContent = 'Input Nilai Formatif';
        document.getElementById('formatifNamaMurid').innerHTML = '<option value="">Pilih Kelas Dulu</option>';
        openModal('formatifModal');
    });
    
    formatifForm.addEventListener('submit', e => {
        e.preventDefault();
        const id = formatifForm.formatifId.value;
        const average = parseFloat(formatifForm.formatifRataRata.value);
        const newItem = {
            id: id || Date.now().toString(),
            namaMurid: formatifForm.formatifNamaMurid.value,
            kelas: formatifForm.formatifKelas.value,
            mataPelajaran: formatifForm.formatifMataPelajaran.value.trim(),
            scores: { f1: formatifForm.f1.value, f2: formatifForm.f2.value, f3: formatifForm.f3.value, f4: formatifForm.f4.value },
            average: isNaN(average) ? 0 : average,
        };
        if(id) formatifData = formatifData.map(i => i.id === id ? newItem : i);
        else formatifData.push(newItem);
        saveData('formatifDataSMP', formatifData);
        renderFormatifTable();
        closeModal('formatifModal');
    });
    
    formatifTableBody.addEventListener('click', e => {
        const id = e.target.dataset.id;
        const item = formatifData.find(i => i.id === id);
        if (e.target.classList.contains('edit-formatif')) {
            formatifForm.formatifId.value = item.id;
            formatifForm.formatifKelas.value = item.kelas;
            // Trigger change to populate students, then select the right one
            formatifForm.formatifKelas.dispatchEvent(new Event('change'));
            setTimeout(() => { formatifForm.formatifNamaMurid.value = item.namaMurid; }, 100);
            formatifForm.formatifMataPelajaran.value = item.mataPelajaran;
            formatifForm.f1.value = item.scores.f1 || '';
            formatifForm.f2.value = item.scores.f2 || '';
            formatifForm.f3.value = item.scores.f3 || '';
            formatifForm.f4.value = item.scores.f4 || '';
            calculateFormatifAverage();
            document.getElementById('formatifModalTitle').textContent = 'Edit Nilai Formatif';
            openModal('formatifModal');
        }
        if (e.target.classList.contains('delete-formatif')) {
            formatifData = formatifData.filter(i => i.id !== id);
            saveData('formatifDataSMP', formatifData);
            renderFormatifTable();
        }
    });

    // =================================================================
    // NILAI SUMATIF
    // =================================================================
    const dataTableBody = document.getElementById('dataTableBody');
    const noDataMessage = document.getElementById('no-data-message');
    const dataForm = document.getElementById('dataForm');
    
    const renderSumatifTable = () => {
        dataTableBody.innerHTML = '';
        const filterKelas = document.getElementById('filterKelas').value;
        const filterMapel = document.getElementById('filterMapel').value.toLowerCase();
        const filteredData = studentData.filter(s => (!filterKelas || s.kelas === filterKelas) && (!filterMapel || s.mataPelajaran.toLowerCase().includes(filterMapel)));
        
        noDataMessage.classList.toggle('hidden', filteredData.length > 0);
        filteredData.forEach((student, index) => {
            const row = dataTableBody.insertRow();
            row.innerHTML = `<td class="px-6 py-4">${index + 1}</td><td class="px-6 py-4">${student.namaMurid}</td><td class="px-6 py-4">${student.kelas}</td><td class="px-6 py-4">${student.mataPelajaran}</td><td class="px-6 py-4 text-center">${student.nilai.tugas}</td><td class="px-6 py-4 text-center">${student.nilai.formatif}</td><td class="px-6 py-4 text-center">${student.nilai.pts}</td><td class="px-6 py-4 text-center">${student.nilai.pas}</td><td class="px-6 py-4 text-center font-bold text-indigo-700 bg-indigo-50">${student.nilai.akhir}</td><td class="px-6 py-4 text-center font-bold text-indigo-700 bg-indigo-50">${student.nilai.predikat}</td><td class="px-6 py-4 no-print"><button class="font-medium text-blue-600 edit-sumatif" data-id="${student.id}">Edit</button><button class="font-medium text-red-600 ml-2 delete-sumatif" data-id="${student.id}">Hapus</button></td>`;
        });
    };
    
    const fetchFormatifValue = () => {
        const studentName = dataForm.namaMurid.value;
        const subject = dataForm.mataPelajaran.value.trim().toLowerCase();
        const found = formatifData.find(item => item.namaMurid === studentName && item.mataPelajaran.toLowerCase() === subject);
        dataForm.nilaiFormatif.value = found ? found.average : '';
    };

    document.getElementById('kelas').addEventListener('change', e => {
        const selectedClass = e.target.value;
        // Populate students
        const studentsInClass = muridData.filter(m => m.kelas === selectedClass).map(m => m.namaMurid);
        populateDropdown(document.getElementById('namaMurid'), studentsInClass, 'Pilih Murid');
        // Set wali kelas
        const wali = guruData.find(g => g.tugasTambahan === 'Wali kelas' && g.kelasWali === selectedClass);
        document.getElementById('waliKelas').value = wali ? wali.namaGuru : 'Belum ditentukan';
    });
    
    dataForm.namaMurid.addEventListener('change', fetchFormatifValue);
    dataForm.mataPelajaran.addEventListener('blur', fetchFormatifValue);
    
    document.getElementById('addDataButton').addEventListener('click', () => {
        dataForm.reset();
        dataForm.studentId.value = '';
        document.getElementById('modalTitle').textContent = 'Input Nilai Sumatif';
        document.getElementById('namaMurid').innerHTML = '<option value="">Pilih Kelas Dulu</option>';
        openModal('dataModal');
    });
    
    dataForm.addEventListener('submit', e => {
        e.preventDefault();
        const id = dataForm.studentId.value;
        const formatifValue = parseFloat(dataForm.nilaiFormatif.value);
        if (isNaN(formatifValue) || formatifValue <= 0) {
            console.error("Nilai formatif belum ada atau tidak valid.");
            return;
        }
        const tugas = parseInt(dataForm.nilaiTugas.value);
        const pts = parseInt(dataForm.nilaiPts.value);
        const pas = parseInt(dataForm.nilaiPas.value);
        const akhir = parseFloat(((tugas*0.2)+(formatifValue*0.3)+(pts*0.25)+(pas*0.25)).toFixed(2));
        const predikat = akhir >= 90 ? 'A' : akhir >= 80 ? 'B' : akhir >= 70 ? 'C' : akhir >= 60 ? 'D' : 'E';
        const newStudent = { id: id || Date.now().toString(), namaMurid: dataForm.namaMurid.value, kelas: dataForm.kelas.value, waliKelas: dataForm.waliKelas.value, guruMapel: dataForm.guruMapel.value, mataPelajaran: dataForm.mataPelajaran.value, nilai: { tugas, formatif: formatifValue, pts, pas, akhir, predikat }};
        if(id) studentData = studentData.map(s => s.id === id ? newStudent : s);
        else studentData.push(newStudent);
        saveData('sumatifDataSMP', studentData);
        renderSumatifTable();
        closeModal('dataModal');
    });

    dataTableBody.addEventListener('click', e => {
        const id = e.target.dataset.id;
        const student = studentData.find(s => s.id === id);
        if (e.target.classList.contains('edit-sumatif')) {
             dataForm.studentId.value = student.id;
             dataForm.kelas.value = student.kelas;
             dataForm.kelas.dispatchEvent(new Event('change'));
             setTimeout(() => { dataForm.namaMurid.value = student.namaMurid; }, 100);
             dataForm.waliKelas.value = student.waliKelas;
             dataForm.guruMapel.value = student.guruMapel;
             dataForm.mataPelajaran.value = student.mataPelajaran;
             dataForm.nilaiTugas.value = student.nilai.tugas;
             dataForm.nilaiFormatif.value = student.nilai.formatif;
             dataForm.nilaiPts.value = student.nilai.pts;
             dataForm.nilaiPas.value = student.nilai.pas;
             document.getElementById('modalTitle').textContent = 'Edit Nilai Sumatif';
             openModal('dataModal');
        }
        if (e.target.classList.contains('delete-sumatif')) {
            studentData = studentData.filter(s => s.id !== id);
            saveData('sumatifDataSMP', studentData);
            renderSumatifTable();
        }
    });

    // =================================================================
    // EVENT LISTENERS LAINNYA (FILTER, CETAK, BATAL)
    // =================================================================
    document.getElementById('filterKelas').addEventListener('change', renderSumatifTable);
    document.getElementById('filterMapel').addEventListener('input', renderSumatifTable);
    document.querySelectorAll('.cancel-btn').forEach(btn => btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        if (modal) closeModal(modal.id);
    }));
    document.getElementById('printFormatifButton').addEventListener('click', () => handlePrint('formatif'));
    document.getElementById('printSumatifButton').addEventListener('click', () => handlePrint('sumatif'));
    
    const handlePrint = (pageType) => {
        const printHeader = document.getElementById(`print-header-${pageType}`);
        if (pageType === 'sumatif') {
            document.getElementById('print-header-mapel').textContent = `Mata Pelajaran: ${document.getElementById('filterMapel').value || 'Semua'}`;
            document.getElementById('print-header-kelas').textContent = `Kelas: ${document.getElementById('filterKelas').options[document.getElementById('filterKelas').selectedIndex].text}`;
        }
        const areaId = `print-area-${pageType}`;
        const style = document.createElement('style');
        style.innerHTML = `@media print { body.printing * { visibility: hidden; } body.printing #${areaId}, body.printing #${areaId} * { visibility: visible; } #${areaId} { position: absolute; left: 0; top: 0; width: 100%;} }`;
        document.head.appendChild(style);
        document.body.classList.add('printing');
        printHeader.classList.remove('hidden');
        window.print();
        printHeader.classList.add('hidden');
        document.head.removeChild(style);
        document.body.classList.remove('printing');
    };

  // =================================================================
    // EVENT EXPORT
    // =================================================================
   

    // Jalankan Aplikasi
    initializeApp();


    




    
});
