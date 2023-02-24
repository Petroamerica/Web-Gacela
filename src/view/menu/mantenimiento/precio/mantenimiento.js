import React, { Component } from 'react'
import '../styles.css'
import moment from 'moment'
import trashP from '../../../../assets/trashP.svg'
import close from '../../../../assets/close.svg'
import loader from '../../../../assets/loader.gif'

export default class mantenimiento extends Component {

    state={
        buscar: ''
    }

    cambiarTextoBuscador = (val) =>{
        this.setState({buscarDistrito: val.target.value})
    }

    cambiarTextoBuscador = (val) =>{
        this.setState({buscar: val.target.value})
    }

    render() {
        return (
        <div style={{display:'flex', flexDirection:'column' ,justifyContent:'center', padding:'2rem', margin:'3rem', boxShadow:'rgb(0 0 0 / 15%) 0px 0px 8px 0px'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom: '1rem', flexWrap:'wrap', lineHeight:'3rem'}}>
                <button className='botonAddChofer' onClick={()=> this.props.crearTarifa() }>
                    Crear
                </button>
                <div style={{display:'flex'}}>
                    <input type="text" className='buscador' placeholder='Filtrar por Tipo...'  onChange={this.cambiarTextoBuscador} />
                </div>
            </div>
            <div style={{maxHeight:'65vh', overflowY:'scroll', width:'100%'}}>
            <table border="1" style={{borderCollapse:'collapse', width:'100%'}} className="table"  bordercolor="#d9a600">
                <thead style={{background: '#e6b012', color: 'white'}}>
                    <tr>
                        <td style={{padding:'6px 3px'}} align="center">Tipo</td>
                        <td style={{padding:'6px 3px'}} align="center">Fecha Inicio</td>
                        <td style={{padding:'6px 3px'}} align="center">Fecha Final</td>
                        <td style={{padding:'6px 3px'}} align="center">Precio</td>
                        <td style={{padding:'6px 3px'}} align="center">Opciones</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.estadosCarga
                        ?
                            (this.props.tarifa.filter(value => value.id_tipo_servicio.indexOf(this.state.buscar.toUpperCase()) !== -1).map((index, key) => 
                                <tr style={{textAlign:'center'}} key={key}>
                                    <td style={{padding:'6px 3px' , fontSize: '0.9em'}}>{index.id_tipo_servicio}</td>
                                    <td style={{padding:'6px 3px' , fontSize: '0.9em'}}>{moment(index.fecha_ini).format('DD-MM-YYYY')}</td>
                                    <td style={{padding:'6px 3px' , fontSize: '0.9em'}}>{moment(index.fecha_fin).format('DD-MM-YYYY')}</td>
                                    <td style={{padding:'6px 3px' , fontSize: '0.9em'}}>{index.precio}</td>
                                    <td style={{padding:'6px 3px' , fontSize: '0.9em'}}> <span style={{cursor:'pointer'}} onClick={()=> this.props.eliminarTarifa(index) }><img src={trashP} alt="close" width="15"/></span></td>
                                </tr>
                            ))
                        : 
                            <tr>
                                <td colSpan={5} align='center'>
                                    <span > <img src={loader} width="45"  alt="loader" /></span>
                                </td>
                            </tr>
                    }                    
                </tbody>
            </table>

            {
                this.props.display_editar ? 
                    <div id="openModal"  className="modalDialog">
                        <div className="modal-dialog">
                            <header className="modal-header">
                                Mantenimiento de Tarifa
                                <span onClick={()=> this.props.ocultarTarifa()} style={{cursor:'pointer'}}><img src={close} alt="close" width="15"/></span>
                            </header>
                            <div style={{margin:'15px'}}>
                            <form onSubmit={(e)=>this.props.formBtn(e)}>
                                <div className="filasFormulario">
                                    <label className="labelFormulario">Tipo</label>
                                    <select name='id_tipo_servicio' onChange={this.props.changeText} style={{outline:'none'}} value={this.props.edit_tarifa[0]['id_tipo_servicio'] || ''} className="selectFormulario fontSize09em">
                                        <option value="">Seleccionar..</option>
                                        {
                                            this.props.listaTipoServicio.map((value,index) =>
                                                <option key={index} defaultValue={value.id_tipo_servicio} value={value.id_tipo_servicio}>{value.id_tipo_servicio}</option>   
                                            )
                                        }
                                    </select>
                                </div>
                                <br/>
                                <div className="filasFormulario">
                                    <label className="labelFormulario">Fecha Inicial</label>
                                    <input type="date" name="fecha_ini" className="inputFormulario inputFormularioText inputDate" 
                                    value={this.props.edit_tarifa[0] ? this.props.edit_tarifa[0]['fecha_ini'] : null}
                                    onChange={this.props.changeText}
                                    readOnly
                                    />
                                </div>
                                <br/>
                                <div className="filasFormulario">
                                    <label className="labelFormulario">Fecha Final</label>
                                    <input type="date" name="fecha_fin"  className="inputFormulario inputFormularioText inputDate" 
                                    value={this.props.edit_tarifa[0] ? this.props.edit_tarifa[0]['fecha_fin'] : null}
                                    onChange={this.props.changeText}
                                    readOnly
                                    />
                                </div>
                                <br/>
                                <div className="filasFormulario">
                                    <label className="labelFormulario">Precio</label>
                                    <input type="text" name="precio" placeholder="*" className="inputFormulario inputFormularioText invalido" 
                                    value={this.props.edit_tarifa[0] ? this.props.edit_tarifa[0]['precio'] : null}
                                    onChange={this.props.changeText}
                                    required
                                    pattern={"[0-9.]+"}
                                    />
                                </div>
                                <br/>
                                <div className="filasFormulario">
                                    <input type="submit" value="Guardar" className="BtnGuardar inputFormularioText inputFormularioBoton"/>
                                </div>
                            </form>
                            </div>
                        </div>
                    </div> 
                : null
            }

            </div>
        </div>    
        )
    }
}   