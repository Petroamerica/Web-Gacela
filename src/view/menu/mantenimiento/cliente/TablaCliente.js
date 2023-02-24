import React, { Component } from 'react'
import '../styles.css'

import edit_ from '../../../../assets/editP.svg'
import guardar from '../../../../assets/saveP.svg'
import cancelar from '../../../../assets/backP.svg'
import retornar from '../../../../assets/trashP.svg'
import close from '../../../../assets/close.svg'
import loader from '../../../../assets/loader.gif' 

export default class TablaCliente extends Component {

    state={
        fila_editar : '',
        editar_guardar: false,
        buscarDistrito: '',
        modalNuevoDistrito: false
    }

    editarLineaTabla = (fila, value) =>{
        this.setState({fila_editar:fila, editar_guardar: true})
        this.props.editarCliente(value)
    }

    crearNuevoCliente = async (e) =>{
        e.preventDefault()
        await this.props.crearNuevoCliente(this.props.crearCliente)
        this.descartarCambios()
    }

    guardarLinea = async (fila, value) =>{
        await this.props.actualizarDatos(this.props.nuevoCliente, fila)
        this.descartarCambios()
    }

    eliminar = async (fila, value) =>{
        await this.props.eliminarCliente(value, fila)
        this.descartarCambios()
    }

    descartarCambios = () =>{
        this.setState({fila_editar: '', editar_guardar: false})
    }

    cambiarTextoBuscador = (val) =>{
        this.setState({buscarDistrito: val.target.value})
    }

    cerrarModaCliente = () =>{
        this.setState({modalNuevoDistrito: false})
    }
    
    abrirModalCliente = () =>{
        this.props.limpiarCrearCliente()
        this.setState({modalNuevoDistrito: true})
    }

    render() {
        return (
            <div style={{display:'flex', flexDirection:'column' ,justifyContent:'center', padding:'2rem', margin:'3rem', boxShadow:'rgb(0 0 0 / 15%) 0px 0px 8px 0px'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom: '1rem', flexWrap:'wrap', lineHeight:'3rem'}}>
                    <div>
                        <button className='botonAddChofer' onClick ={()=> this.abrirModalCliente()}>
                            Agregar
                        </button>
                    </div>
                    <div style={{display:'flex'}}>
                        <input type="text" className='buscador' placeholder='Filtrar por descripcion...' onChange={this.cambiarTextoBuscador} />
                    </div>
                </div>
                <div style={{maxHeight:'64vh', overflowY:'scroll', width:'100%'}}>
                    <table border="1" style={{borderCollapse:'collapse', width:'100%'}} className="table"  bordercolor="#d9a600">
                        <thead style={{background: '#e6b012', color: 'white'}}>
                            <tr>
                                <td style={{width:"30%", padding:'6px', position:'sticky', top:'0', background: '#e6b012'}}>Codigo</td>
                                <td style={{width:"30%",  padding:'6px', position:'sticky', top:'0', background: '#e6b012'}} >Descripción corta</td>
                                <td style={{width:"30%",  padding:'6px', position:'sticky', top:'0', background: '#e6b012'}} >Descripción</td>
                                <td style={{minWidth:'100px', padding:'6px', position:'sticky', top:'0',  background: '#e6b012'}} align="center">Estado</td>
                                <td style={{minWidth:"120px",  padding:'6px', position:'sticky', top:'0', background: '#e6b012'}} align="center">Opciones</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.estadosCarga.tabla ? 
                                this.props.clientes.filter(value => value.descripcion.indexOf(this.state.buscarDistrito.toUpperCase()) !== -1).map((value, fila) =>
                                    <tr key={value.id_cliente} style={{height:'40px', fontSize:'0.9rem'}}>
                                        <td style={{padding:'6px'}}>
                                            { 
                                                fila === this.state.fila_editar ? 
                                                    this.state.editar_guardar ? 
                                                        <input type="text" style={{textTransform:'uppercase', width:'-webkit-fill-available', background:'none', fontSize:'0.9rem'}}  
                                                            name="id_cliente" disabled
                                                            value={this.props.nuevoCliente.id_cliente || ''} 
                                                            onChange={this.props.modificarDatos }/> : value.id_cliente 
                                                : value.id_cliente || ''
                                            }
                                        </td>
                                        <td style={{padding:'6px'}}>
                                            { 
                                                fila === this.state.fila_editar ? 
                                                    this.state.editar_guardar ? <input type="text" style={{textTransform:'uppercase', width:'-webkit-fill-available', background:'none', fontSize:'0.9rem'}} 
                                                        name="descripcion_corta"
                                                        value={this.props.nuevoCliente.descripcion_corta || ''} 
                                                        onChange={this.props.modificarDatos }/> : value.descripcion_corta 
                                                : value.descripcion_corta || ''
                                            }
                                        </td>
                                        <td style={{padding:'6px'}}>
                                            { 
                                                fila === this.state.fila_editar ? 
                                                    this.state.editar_guardar ? <input type="text" style={{textTransform:'uppercase', width:'-webkit-fill-available', background:'none', fontSize:'0.9rem'}} 
                                                        name="descripcion"
                                                        value={this.props.nuevoCliente.descripcion || ''} 
                                                        onChange={this.props.modificarDatos }/> : value.descripcion 
                                                : value.descripcion || ''
                                            }
                                        </td>
                                        <td style={{padding:'6px'}} align="center">
                                                { 
                                                    fila === this.state.fila_editar ? 
                                                        <select style={{border:'1px solid black', padding:'0px', margin:'0px', borderRadius:'5px', width:'-webkit-fill-available'}} name='id_estado'  className="selectTablaAerolinea" 
                                                        value={this.props.nuevoCliente.id_estado}
                                                        onChange={this.props.modificarDatos}>
                                                            <option value='01'>Activo</option>
                                                            <option value='02'>Inactivo</option>
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
                                                    <span style={{cursor:'pointer', marginRight:'20px'}}  onClick={()=>this.guardarLinea(fila,value)}>
                                                        <img src={guardar} alt="editar" width="17"/>
                                                    </span>
                                                    <span style={{cursor:'pointer', marginRight:'20px'}}  onClick={()=>this.eliminar(fila,value)} >
                                                        <img src={retornar} alt="cancelar" width="17"/>
                                                    </span>
                                                    <span style={{cursor:'pointer'}}  onClick={()=>this.descartarCambios()} >
                                                        <img src={cancelar} alt="cancelar" width="17"/>
                                                    </span>
                                                    </>
                                                    
                                            }
                                        </td>
                                    </tr>        
                                )
                                :
                                <tr>
                                    <td colSpan={3} align='center'>
                                        <span > <img src={loader} width="45"  alt="loader" /></span>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
                {
                    this.state.modalNuevoDistrito ? 
                    <div id="openModal"  className="modalDialog">
                        <div className="modal-dialog-2col">
                            <header className="modal-header">
                                <span>Agregar nuevo Cliente</span>
                            <span onClick={()=> this.cerrarModaCliente()} style={{cursor:'pointer'}}><img src={close} alt="close" width="15"/></span>
                            </header>
                            <div style={{margin:'15px'}}>
                            <form onSubmit={(e)=>{this.crearNuevoCliente(e)}} style={{display:'flex', justifyContent:'space-between'}}>
                                <div>
                                    <div className="filasFormulario">
                                        <label className="labelFormulario">Codigo</label>
                                        <input type="text" required name="id_cliente" className="inputFormulario inputFormularioText" autoComplete="off" 
                                            value={this.props.crearCliente.id_cliente || ''} onChange={this.props.modificarDatosCrear }/> 
                                    </div>
                                    <br/>
                                    <div className="filasFormulario">
                                        <label className="labelFormulario">Descripción Corta</label>
                                        <input type="text" required name="descripcion_corta" className="inputFormulario inputFormularioText" autoComplete="off" 
                                        value={this.props.crearCliente.descripcion_corta || ''}  onChange={this.props.modificarDatosCrear }/> 
                                    </div>
                                    <br/>
                                    <div className="filasFormulario">
                                        <label className="labelFormulario">Descripción</label>
                                        <input type="text" required name="descripcion" className="inputFormulario inputFormularioText" autoComplete="off" 
                                        value={this.props.crearCliente.descripcion || ''}  onChange={this.props.modificarDatosCrear }/> 
                                    </div>
                                    <br/>
                                    <div className="filasFormulario">
                                        <label className="labelFormulario">Email</label>
                                        <input type="text"  name="email" className="inputFormulario inputFormularioText" autoComplete="off" 
                                        value={this.props.crearCliente.email || ''}  onChange={this.props.modificarDatosCrear }/> 
                                    </div>
                                </div>
                                <div>
                                    <div className="filasFormulario">
                                        <label className="labelFormulario">Dirección</label>
                                        <input type="text"  name="direccion" className="inputFormulario inputFormularioText" autoComplete="off" 
                                        value={this.props.crearCliente.direccion || ''} onChange={this.props.modificarDatosCrear }/> 
                                    </div>
                                    <br/>
                                    <div className="filasFormulario">
                                        <label className="labelFormulario">Telefono</label>
                                        <input type="text"  name="fono" className="inputFormulario inputFormularioText" autoComplete="off" 
                                        value={this.props.crearCliente.fono || ''}  onChange={this.props.modificarDatosCrear }/> 
                                    </div>
                                    <br/>
                                    <div className="filasFormulario">
                                        <label className="labelFormulario">nro_di</label>
                                        <input type="text"  name="nro_di" className="inputFormulario inputFormularioText" autoComplete="off" 
                                        value={this.props.crearCliente.nro_di || ''}  onChange={this.props.modificarDatosCrear }/> 
                                    </div>
                                    <br/>
                                    <div className="filasFormulario">
                                    <input type="submit" value="Guardar" className="BtnGuardar inputFormularioText inputFormularioBoton"/>
                                </div>
                                </div>
                            </form>
                            </div>
                        </div>
                    </div> 
                    : null
                }
            </div>
        )
    }
}
