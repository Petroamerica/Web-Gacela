import React, { Component } from 'react'
import ExcelJS from 'exceljs'
export default class Tabla extends Component {


    exportExcel = async () =>{
        const workbook = new ExcelJS.Workbook();
        workbook.addWorksheet("programacion");
        const worksheet = workbook.getWorksheet("programacion");
        let servicios = this.props.servicios
        let cliente = 3
        let titulo = 4
        let detalle = titulo+1
        worksheet.columns = [  
            { width: 12 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 12 }, { width: 15 }, { width: 12 }, { width: 30 }, { width: 15 }, { width: 15 }, { width: 50 }, { width: 30 }
          ];
        for (let index = 0; index < servicios.length; index++) {   
            worksheet.getCell('A'+cliente).value = servicios[index].cabecera.id_cliente
            worksheet.getCell('A'+cliente).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            worksheet.getCell('A'+cliente).alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell('A'+cliente).fill = { type: 'pattern', pattern:'darkTrellis', fgColor:{argb:'FFF323'}, bgColor:{argb:'FFEFA0'} };

            worksheet.getCell('A'+titulo).value = 'FECHA';
            worksheet.getCell('A'+titulo).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            worksheet.getCell('A'+titulo).alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell('A'+titulo).fill = { type: 'pattern', pattern:'darkTrellis', fgColor:{argb:'FFF323'}, bgColor:{argb:'FFEFA0'} };

            worksheet.getCell('B'+titulo).value = 'TIPO SERVICIO';
            worksheet.getCell('B'+titulo).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            worksheet.getCell('B'+titulo).alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell('B'+titulo).fill = { type: 'pattern', pattern:'darkTrellis', fgColor:{argb:'FFF323'}, bgColor:{argb:'FFEFA0'} };

            worksheet.getCell('C'+titulo).value = 'HORA INICIO';
            worksheet.getCell('C'+titulo).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            worksheet.getCell('C'+titulo).alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell('C'+titulo).fill = { type: 'pattern', pattern:'darkTrellis', fgColor:{argb:'FFF323'}, bgColor:{argb:'FFEFA0'} };

            worksheet.getCell('D'+titulo).value = 'HORA LLEGADA';
            worksheet.getCell('D'+titulo).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            worksheet.getCell('D'+titulo).alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell('D'+titulo).fill = { type: 'pattern', pattern:'darkTrellis', fgColor:{argb:'FFF323'}, bgColor:{argb:'FFEFA0'} };

            worksheet.getCell('E'+titulo).value = 'N° SERVICIO';
            worksheet.getCell('E'+titulo).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            worksheet.getCell('E'+titulo).alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell('E'+titulo).fill = { type: 'pattern', pattern:'darkTrellis', fgColor:{argb:'FFF323'}, bgColor:{argb:'FFEFA0'} };
            /*worksheet.getCell('F'+titulo).value = 'TIPO SERVICIO';
            worksheet.getCell('F'+titulo).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };*/
            worksheet.getCell('F'+titulo).value = 'AREA';
            worksheet.getCell('F'+titulo).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            worksheet.getCell('F'+titulo).alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell('F'+titulo).fill = { type: 'pattern', pattern:'darkTrellis', fgColor:{argb:'FFF323'}, bgColor:{argb:'FFEFA0'} };

            worksheet.getCell('G'+titulo).value = 'AEROLINEA';
            worksheet.getCell('G'+titulo).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            worksheet.getCell('G'+titulo).alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell('G'+titulo).fill = { type: 'pattern', pattern:'darkTrellis', fgColor:{argb:'FFF323'}, bgColor:{argb:'FFEFA0'} };

            worksheet.getCell('H'+titulo).value = 'NOMBRE';
            worksheet.getCell('H'+titulo).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            worksheet.getCell('H'+titulo).fill = { type: 'pattern', pattern:'darkTrellis', fgColor:{argb:'FFF323'}, bgColor:{argb:'FFEFA0'} };

            worksheet.getCell('I'+titulo).value = 'CODIGO';
            worksheet.getCell('I'+titulo).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            worksheet.getCell('I'+titulo).fill = { type: 'pattern', pattern:'darkTrellis', fgColor:{argb:'FFF323'}, bgColor:{argb:'FFEFA0'} };

            worksheet.getCell('J'+titulo).value = 'TELEFONO';
            worksheet.getCell('J'+titulo).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            worksheet.getCell('J'+titulo).alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell('J'+titulo).fill = { type: 'pattern', pattern:'darkTrellis', fgColor:{argb:'FFF323'}, bgColor:{argb:'FFEFA0'} };

            worksheet.getCell('K'+titulo).value = 'DIRECCIÓN';
            worksheet.getCell('K'+titulo).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            worksheet.getCell('K'+titulo).fill = { type: 'pattern', pattern:'darkTrellis', fgColor:{argb:'FFF323'}, bgColor:{argb:'FFEFA0'} };

            worksheet.getCell('L'+titulo).value = 'DISTRITO';
            worksheet.getCell('L'+titulo).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
            worksheet.getCell('L'+titulo).alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getCell('L'+titulo).fill = { type: 'pattern', pattern:'darkTrellis', fgColor:{argb:'FFF323'}, bgColor:{argb:'FFEFA0'} };
            for (let index2 = 0; index2 < servicios[index].data.length; index2++) {

                worksheet.getCell('A'+detalle).value = servicios[index].cabecera.fechaFormat;
                worksheet.getCell('A'+detalle).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
                worksheet.getCell('A'+detalle).alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.getCell('B'+detalle).value = servicios[index].data[index2].origen_servicio === 'E' ? "ENTRADA" : "SALIDA";
                worksheet.getCell('B'+detalle).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
                worksheet.getCell('B'+detalle).alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.getCell('C'+detalle).value = servicios[index].cabecera.hora_inicio;
                worksheet.getCell('C'+detalle).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
                worksheet.getCell('C'+detalle).alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.getCell('D'+detalle).value = servicios[index].data[index2].hora;
                worksheet.getCell('D'+detalle).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
                worksheet.getCell('D'+detalle).alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.getCell('E'+detalle).value = servicios[index].data[index2].nro_servicio;
                worksheet.getCell('E'+detalle).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
                worksheet.getCell('E'+detalle).alignment = { vertical: 'middle', horizontal: 'center' };
/*
                worksheet.getCell('F'+detalle).value = servicios[index].data[index2].origen_servicio === 'E' ? "ENTRADA" : "SALIDA";
                worksheet.getCell('F'+detalle).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
                worksheet.getCell('F'+detalle).alignment = { vertical: 'middle', horizontal: 'center' };*/

                worksheet.getCell('F'+detalle).value = servicios[index].data[index2].id_area;
                worksheet.getCell('F'+detalle).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
                worksheet.getCell('F'+detalle).alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.getCell('G'+detalle).value = servicios[index].data[index2].id_cuenta;
                worksheet.getCell('G'+detalle).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
                worksheet.getCell('G'+detalle).alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.getCell('H'+detalle).value = servicios[index].data[index2].descripcion_pasajero;
                worksheet.getCell('H'+detalle).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };

                worksheet.getCell('I'+detalle).value = servicios[index].data[index2].id_cliente + servicios[index].data[index2].id_pasajero;
                worksheet.getCell('I'+detalle).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
                worksheet.getCell('I'+detalle).alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.getCell('J'+detalle).value = servicios[index].data[index2].celular;
                worksheet.getCell('J'+detalle).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
                worksheet.getCell('J'+detalle).alignment = { vertical: 'middle', horizontal: 'center' };

                worksheet.getCell('K'+detalle).value = servicios[index].data[index2].direccion;
                worksheet.getCell('K'+detalle).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };

                worksheet.getCell('L'+detalle).value = servicios[index].data[index2].descripcion_distrito;
                worksheet.getCell('L'+detalle).border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
                worksheet.getCell('L'+detalle).alignment = { vertical: 'middle', horizontal: 'center' };
                detalle=detalle+1
            }
            titulo = detalle+2
            detalle = titulo+1
            cliente = titulo-1
        }
        const uint8Array = await workbook.xlsx.writeBuffer()
        const blob = new Blob([uint8Array], { type: "application/octet-binary" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "programacion.xlsx";
        a.click();
        a.remove();

    }

    render() {
        return (
            <div style={{overflowY: 'scroll',  maxHeight: '900px', marginTop: '15px', padding:'0px 15px', marginBottom:'15px'}}>
                <div style={{display:'flex', justifyContent:'space-between', fontSize: '1.2em', fontWeight:'bold', marginBottom: '10px'}}>
                    <div style={ {display:'flex' ,flexDirection:'row'}}>
                        <div>
                            <input onClick={()=> this.exportExcel() } type="button" value="Exportal Excel" 
                                className='emitirReportes'
                            />
                        </div>
                    </div>
                    <div>
                        <span style={{color:'green'}}>Estado de la liquidacion: ACTIVO</span>
                    </div>
                </div>

                <table border="1" style={{width:'100%', borderCollapse:'collapse'}} className="table_solicitudes">
                    <thead style={{background: '#e6b012', color: 'white', fontSize: '0.8em'}}>
                        <tr>
                            <th style={{width:"20px", padding:'4px'}}>N° Orden</th>
                            <th style={{width:"60px"}}>Hora</th>
                            <th style={{width:"40px"}}>Aerolinea</th>
                            <th style={{width:"40px"}}>Area</th>
                            <th style={{width:"40px"}}>Cod</th>
                            <th style={{width:"250px"}}>Nombre</th>
                            <th style={{width:"250px"}}>Direccion</th>
                            <th style={{width:"90px"}}>Distrito</th>
                            <th style={{width:"90px"}}>Celular</th>
                        </tr>
                    </thead>
                        {this.props.servicios.map((value, key) => 
                        <tbody key={key}>
                            <tr>
                                <td colSpan="12" style={{padding:'5px', fontSize:'0.8em'}}>
                                    <span>Servicio <b>{(value.cabecera.nro_servicio)}</b></span>
                                    <span style={{marginLeft: '15px'}}>Hora: <b>{value.cabecera.hora_inicio}</b></span>
                                    <span style={{marginLeft: '15px'}}>Fecha: <b>{value.cabecera.fechaFormat}</b></span>
                                </td>
                            </tr>
                            {value.data.map((subValue, subKey) => 
                                <tr key={subValue.id_pasajero} style={{backgroundColor: (subValue.nro_servicio % 2) ? '#EEEEEE' : 'white' }}>
                                <>      
                                    <td style={{width:"20px", padding:"4px", fontSize: '0.7em'}} align="center" >{subValue.orden_recojo}</td>
                                    <td style={{width:"60px", padding:"4px", fontSize: '0.7em'}} align="center" >{subValue.hora}</td>
                                    <td style={{width:"40px", padding:"4px", fontSize: '0.7em'}} align="center" >{subValue.id_cuenta}</td>
                                    <td className="eliminar" style={{width:"40px", padding:"4px", fontSize: '0.7em'}} align="center">{subValue.id_area}</td>
                                    <td className="eliminar" style={{width:"40px", padding:"4px", fontSize: '0.7em'}} align="center">{subValue.id_pasajero}</td>
                                    <td style={{maxWidth:"250px", height:'30px', padding:' 5px 4px'}}>
                                        <div style={{tableLayout:'fixed', overflow:'hidden', whiteSpace:'nowrap', width:'100%', fontSize: '0.7em'}}>{subValue.descripcion_pasajero}</div>
                                    </td>
                                    <td style={{maxWidth:"250px", height:'30px', padding:' 5px 4px'}}>
                                        <div style={{tableLayout:'fixed', overflow:'hidden', whiteSpace:'nowrap', width:'100%', fontSize: '0.7em'}}>{subValue.direccion}</div>
                                    </td>
                                    <td style={{maxWidth:"90px", height:'30px', padding:' 5px 4px'}} align="center">
                                        <div style={{tableLayout:'fixed', overflow:'hidden', whiteSpace:'nowrap', width:'100%', fontSize: '0.7em'}}>{subValue.descripcion_distrito}</div>
                                    </td>
                                    <td style={{maxWidth:"90px", height:'30px', padding:' 5px 4px'}} align="center">
                                        <div style={{tableLayout:'fixed', overflow:'hidden', whiteSpace:'nowrap', width:'100%', fontSize: '0.7em'}}>{subValue.celular}</div>
                                    </td>
                                </>
                                </tr>   
                            )}
                        </tbody>
                        )}  
                </table>
            </div>
        )
    }
}
