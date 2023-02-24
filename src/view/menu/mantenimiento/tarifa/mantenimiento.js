import React, { Component } from 'react'
import '../styles.css'

import edit_ from '../../../../assets/editP.svg'
import guardar from '../../../../assets/saveP.svg'
import backP from '../../../../assets/backP.svg'
import trashP from '../../../../assets/trashP.svg'

import close from '../../../../assets/close.svg'
import loader from '../../../../assets/loader.gif'

export default class mantenimiento extends Component {

    state={
        fila_editar : '',
        editar_guardar: false,
        buscar: ''
    }

    cambiarTextoBuscador = (val) =>{
        this.setState({buscarDistrito: val.target.value})
    }

    cambiarTextoBuscador = (val) =>{
        this.setState({buscar: val.target.value})
    }

    descartarCambios = () =>{
        this.setState({fila_editar: '', editar_guardar: false})
    }

    eliminar = async (value) =>{
        await this.props.eliminarTarifa(value)
        this.descartarCambios()
    }

    guardarLinea = async(value) =>{
        await this.props.actualizarDatos(this.props.editarTipoServicio)
        this.descartarCambios()
    }

    editarLineaTabla = (fila, value) =>{
        this.setState({fila_editar:fila, editar_guardar: true})
        this.props.cambiarValoresEditarServicio(value)
    }

    render() {
        return (
        <div style={{display:'flex', flexDirection:'column' ,justifyContent:'center', padding:'2rem', margin:'3rem', boxShadow:'rgb(0 0 0 / 15%) 0px 0px 8px 0px'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom: '1rem', flexWrap:'wrap', lineHeight:'3rem'}}>
                <button className='botonAddChofer' onClick={()=> this.props.crearTipoServicio() }>
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
                        <td style={{padding:'6px 3px'}} align="center">Rango minimo</td>
                        <td style={{padding:'6px 3px'}} align="center">Rango maximo</td>
                        <td style={{padding:'6px 3px'}} align="center">Estado</td>
                        <td style={{padding:'6px 3px'}} align="center">Opciones</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.estadosCarga
                        ?
                            (this.props.tipoServicio.filter(value => value.id_tipo_servicio.indexOf(this.state.buscar.toUpperCase()) !== -1).map((value, fila) => 
                                <tr key={value.id_tipo_servicio} style={{height:'40px', fontSize:'0.9rem'}}>
                                    <td style={{padding:'6px'}}>
                                        { 
                                            fila === this.state.fila_editar ? 
                                                this.state.editar_guardar ? <input type="text" style={{textTransform:'uppercase', width:'-webkit-fill-available', background:'none', fontSize:'0.9rem'}}
                                                name='id_tipo_servicio' 
                                                value={this.props.editarTipoServicio.id_tipo_servicio || ''} 
                                                onChange={this.props.cambiarTexto}/> : value.id_tipo_servicio || ''
                                            : value.id_tipo_servicio || ''
                                        }
                                    </td>
                                    <td style={{padding:'6px'}}>
                                        { 
                                            fila === this.state.fila_editar ? 
                                                this.state.editar_guardar ? <input type="text" style={{textTransform:'uppercase', width:'-webkit-fill-available', background:'none', fontSize:'0.9rem'}} 
                                                name='min_rango' 
                                                value={this.props.editarTipoServicio.min_rango || ''} 
                                                onChange={this.props.cambiarTexto}/> : value.min_rango  || ''
                                            : value.min_rango || ''
                                        }
                                    </td>
                                    <td style={{padding:'6px'}}>
                                        { 
                                            fila === this.state.fila_editar ? 
                                                this.state.editar_guardar ? <input type="text" style={{textTransform:'uppercase', width:'-webkit-fill-available', background:'none', fontSize:'0.9rem'}}
                                                name='max_rango' 
                                                value={this.props.editarTipoServicio.max_rango || ''} 
                                                onChange={this.props.cambiarTexto}/> : value.max_rango 
                                            : value.max_rango 
                                        }
                                    </td>
                                    <td style={{padding:'6px'}} align="center">
                                        { 
                                            fila === this.state.fila_editar ? 
                                                <select style={{border:'1px solid black', padding:'0px', margin:'0px', borderRadius:'5px', width:'-webkit-fill-available', fontSize:'0.9rem'}} className="selectTablaAerolinea" name="id_estado"
                                                value={this.props.editarTipoServicio.id_estado}
                                                onChange={this.props.cambiarTexto}>
                                                    <option value="01">Activo</option>
                                                    <option value="02">Inactivo</option>
                                                </select> 
                                            : value.id_estado === '01' ? 'Activo' : 'Inactivo' }
                                    </td>
                                    <td style={{padding:'6px'}} align="center">
                                        {
                                            fila !== this.state.fila_editar ? 
                                                <span style={{cursor:'pointer'}}  onClick={()=>this.editarLineaTabla(fila,value)}>
                                                    <img src={edit_} alt="editar" width="22"/>
                                                </span>
                                            :
                                            <>
                                                <span style={{cursor:'pointer', marginRight:'15px'}}  onClick={()=>this.guardarLinea(value)}>
                                                    <img src={guardar} alt="editar" width="17"/>
                                                </span>
                                                <span style={{cursor:'pointer', marginRight:'15px'}} onClick={()=>this.eliminar(value)}>
                                                    <img src={trashP} alt="editar" width="17"/>
                                                </span>
                                                <span style={{cursor:'pointer'}} onClick={()=>this.descartarCambios()}>
                                                    <img src={backP} alt="retroceder" width="17"/>
                                                </span>
                                            </>
                                        }
                                    </td>
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
                                Mantenimiento de Tipo de Servicio
                                <span onClick={()=> this.props.ocultarTipoServicio()} style={{cursor:'pointer'}}><img src={close} alt="close" width="15"/></span>
                            </header>
                            <div style={{margin:'15px'}}>
                            <form onSubmit={(e)=>this.props.formBtn(e)}>
                                <div className="filasFormulario">
                                    <label className="labelFormulario">Tipo de servicio</label>
                                    <input type="text" name="id_tipo_servicio" className="inputFormulario inputFormularioText" 
                                    value={this.props.nuevoTipoServicio[0] ? this.props.nuevoTipoServicio[0]['id_tipo_servicio'] : null}
                                    placeholder="*"
                                    style={{textTransform: 'uppercase'}}
                                    required
                                    onChange={this.props.changeText}
                                    />
                                </div>
                                <br/>
                                <div className="filasFormulario">
                                    <label className="labelFormulario">Cantidad Minima</label>
                                    <input type="text" name="min_rango"  className="inputFormulario inputFormularioText invalido" 
                                    value={this.props.nuevoTipoServicio[0] ? this.props.nuevoTipoServicio[0]['min_rango'] : null}
                                    onChange={this.props.changeText}
                                    placeholder="*"
                                    required
                                    pattern={"[0-9.]+"}
                                    />
                                </div>
                                <br/>
                                <div className="filasFormulario">
                                    <label className="labelFormulario">Cantidad Maxima</label>
                                    <input type="text" name="max_rango" placeholder="*" className="inputFormulario inputFormularioText invalido" 
                                    value={this.props.nuevoTipoServicio[0] ? this.props.nuevoTipoServicio[0]['max_rango'] : null}
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