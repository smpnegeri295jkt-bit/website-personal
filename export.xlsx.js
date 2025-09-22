 function exportLocalStorageToExcel() {
    
        const dataFromLocalStorage = JSON.parse(localStorage.getItem('muridDataSMP'));
        const worksheet = XLSX.utils.json_to_sheet(dataFromLocalStorage);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "exported_data.xlsx");
        
    }
