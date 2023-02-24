import React, { Component } from 'react'
import '../styles.css'

import edit_ from '../../../../assets/editP.svg'
import guardar from '../../../../assets/saveP.svg'
import cancelar from '../../../../assets/backP.svg'
import retornar from '../../../../assets/trashP.svg'
import close from '../../../../assets/close.svg'
import loader from '../../../../assets/loader.gif' 

export default class TablaDistrito extends Component {

    state={
        fila_editar : '',
        editar_guardar: false,
        buscarDistrito: '',
        modalNuevoDistrito: false
    }

    editarLineaTabla = (fila, value) =>{
        this.setState({fila_editar:fila, editar_guardar: true})
        this.props.editarDistrito(value)
    }

    crearNuevoDistrito = async (e) =>{
        e.preventDefault()
        await this.props.crearNuevoDistrito(this.props.Creardistrito)
        this.descartarCambios()
    }

    guardarLinea = async (fila, value) =>{
        await this.props.actualizarDatos(this.props.nuevoDistrito, fila)
        this.descartarCambios()
    }

    eliminar = async (fila, value) =>{
        await this.props.eliminarDistrito(value, fila)
        this.descartarCambios()
    }

    descartarCambios = () =>{
        this.setState({fila_editar: '', editar_guardar: false})
    }

    cambiarTextoBuscador = (val) =>{
        this.setState({buscarDistrito: val.target.value})
    }

    cerrarModalDistrito = () =>{
        this.setState({modalNuevoDistrito: false})
    }
    abrirModalDistrito = () =>{
        this.props.limpiarCrearDistrito()
        this.setState({modalNuevoDistrito: true})
    }

    render() {
        return (
            <div style={{display:'flex', flexDirection:'column' ,justifyContent:'center', padding:'2rem', margin:'3rem', boxShadow:'rgb(0 0 0 / 15%) 0px 0px 8px 0px'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom: '1rem', flexWrap:'wrap', lineHeight:'3rem'}}>
                    <div>
                        <button className='botonAddChofer' onClick ={()=> this.abrirModalDistrito()}>
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
                                <td style={{width:"50%",  padding:'6px', position:'sticky', top:'0', background: '#e6b012'}} >Descripción</td>
                                <td style={{minWidth:"120px",  padding:'6px', position:'sticky', top:'0', background: '#e6b012'}} align="center">Opciones</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.estadosCarga.tabla ? 
                                this.props.distrito.filter(value => value.descripcion.indexOf(this.state.buscarDistrito.toUpperCase()) !== -1).map((value, fila) =>
                                    <tr key={value.id_distrito} style={{height:'40px', fontSize:'0.9rem'}}>
                                        <td style={{padding:'6px'}}>
                                            { 
                                                fila === this.state.fila_editar ? 
                                                    this.state.editar_guardar ? 
                                                        <input type="text" style={{textTransform:'uppercase', width:'-webkit-fill-available', background:'none', fontSize:'0.9rem'}}  
                                                            name="id_distrito" disabled
                                                            value={this.props.nuevoDistrito.id_distrito || ''} 
                                                            onChange={this.props.modificarDatos }/> : value.id_distrito 
                                                : value.id_distrito || ''
                                            }
                                        </td>
                                        <td style={{padding:'6px'}}>
                                            { 
                                                fila === this.state.fila_editar ? 
                                                    this.state.editar_guardar ? <input type="text" style={{textTransform:'uppercase', width:'-webkit-fill-available', background:'none', fontSize:'0.9rem'}} 
                                                        name="descripcion"
                                                        value={this.props.nuevoDistrito.descripcion || ''} 
                                                        onChange={this.props.modificarDatos }/> : value.descripcion 
                                                : value.descripcion || ''
                                            }
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
                        <div className="modal-dialog">
                            <header className="modal-header">
                                <span>Agregar nuevo Distrito</span>
                            <span onClick={()=> this.cerrarModalDistrito()} style={{cursor:'pointer'}}><img src={close} alt="close" width="15"/></span>
                            </header>
                            <div style={{margin:'15px'}}>
                            <form onSubmit={(e)=>{this.crearNuevoDistrito(e)}}>
                                <div className="filasFormulario">
                                    <label className="labelFormulario">Codigo</label>
                                    <input type="text" required name="id_distrito" className="inputFormulario inputFormularioText" autoComplete="off" 
                                    value={this.props.Creardistrito.id_distrito || ''} onChange={this.props.modificarDatosCrear }/> 
                                </div>
                                <br/>
                                <div className="filasFormulario">
                                    <label className="labelFormulario">Descripcion</label>
                                    <input type="text"  name="descripcion" className="inputFormulario inputFormularioText" autoComplete="off" 
                                    value={this.props.Creardistrito.descripcion || ''}  onChange={this.props.modificarDatosCrear }/> 
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
        )
    }
}
