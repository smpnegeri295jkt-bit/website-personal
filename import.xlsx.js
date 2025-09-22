function importExcel() {
    const fileInput = document.getElementById('excelFileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select an Excel file.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assuming you want to read the first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert the worksheet data to a JSON array
        const jsonSheetData = XLSX.utils.sheet_to_json(worksheet);

        // Store the JSON data in localStorage
        localStorage.setItem('muridDataSMP', JSON.stringify(jsonSheetData));

        document.getElementById('output').innerText = 'Data imported to localStorage!';
        console.log('Data stored in localStorage:', jsonSheetData);
    };

    reader.onerror = function(e) {
        console.error('File reading error:', e);
        alert('Error reading file.');
    };

    reader.readAsArrayBuffer(file);
}