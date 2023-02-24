import ExcelJS from 'exceljs'

export const exportar = {
    reporteXlsx : async (pasajeros, descrip_cliente) =>{
        const workbook = new ExcelJS.Workbook();
        workbook.addWorksheet("pasajeros");
        const worksheet = workbook.getWorksheet("pasajeros");
        let saltoLinea = 5
        worksheet.columns = [ { width: 12 }, { width: 50 }, { width: 80 }, { width: 12 }, { width: 20 }, { width: 16 },{ width: 16 }, { width: 25 } ];

        worksheet.getCell('A'+2).value = "COMPAÑIA:"
        worksheet.getCell('B'+2).value = descrip_cliente
        worksheet.getCell('B'+2).font = {bold:true};

        for (let index = 0; index < 1; index++) {
            worksheet.getCell('A'+4).value = "DNI"
            worksheet.getCell('A'+4).font = {bold:true};
            worksheet.getCell('A'+4).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            worksheet.getCell('A'+4).alignment = { vertical: 'middle', horizontal: 'center' };

            worksheet.getCell('B'+4).value = "DESCRIPCION"
            worksheet.getCell('B'+4).font = {bold:true};
            worksheet.getCell('B'+4).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            worksheet.getCell('B'+4).alignment = { vertical: 'middle', horizontal: 'center' };

            worksheet.getCell('C'+4).value = "DIRECCION"
            worksheet.getCell('C'+4).font = {bold:true};
            worksheet.getCell('C'+4).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            worksheet.getCell('C'+4).alignment = { vertical: 'middle', horizontal: 'center' };

            worksheet.getCell('D'+4).value = "AREA"
            worksheet.getCell('D'+4).font = {bold:true};
            worksheet.getCell('D'+4).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            worksheet.getCell('D'+4).alignment = { vertical: 'middle', horizontal: 'center' };

            worksheet.getCell('E'+4).value = "DISTRITO"
            worksheet.getCell('E'+4).font = {bold:true};
            worksheet.getCell('E'+4).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            worksheet.getCell('E'+4).alignment = { vertical: 'middle', horizontal: 'center' };
            
            worksheet.getCell('F'+4).value = "LATITUD"
            worksheet.getCell('F'+4).font = {bold:true};
            worksheet.getCell('F'+4).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            worksheet.getCell('F'+4).alignment = { vertical: 'middle', horizontal: 'center' };

            worksheet.getCell('G'+4).value = "LONGITUD"
            worksheet.getCell('G'+4).font = {bold:true};
            worksheet.getCell('G'+4).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            worksheet.getCell('G'+4).alignment = { vertical: 'middle', horizontal: 'center' };

            worksheet.getCell('H'+4).value = "CELULAR"
            worksheet.getCell('H'+4).font = {bold:true};
            worksheet.getCell('H'+4).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            worksheet.getCell('H'+4).alignment = { vertical: 'middle', horizontal: 'center' };
        }

        for (let index = 0; index < pasajeros.length; index++) {   
            worksheet.getCell('A'+saltoLinea).value = pasajeros[index].nro_di
            worksheet.getCell('B'+saltoLinea).value = pasajeros[index].descripcion
            worksheet.getCell('C'+saltoLinea).value = pasajeros[index].direccion
            worksheet.getCell('D'+saltoLinea).value = pasajeros[index].id_area
            worksheet.getCell('E'+saltoLinea).value = pasajeros[index].id_distrito
            worksheet.getCell('F'+saltoLinea).value = pasajeros[index].latitud
            worksheet.getCell('G'+saltoLinea).value = pasajeros[index].longitud
            worksheet.getCell('H'+saltoLinea).value = pasajeros[index].celular
            
            saltoLinea+=1
           
        }


        const uint8Array = await workbook.xlsx.writeBuffer()
        const blob = new Blob([uint8Array], { type: "application/octet-binary" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "reportePasajeros.xlsx";
        a.click();
        a.remove();
    }
}



