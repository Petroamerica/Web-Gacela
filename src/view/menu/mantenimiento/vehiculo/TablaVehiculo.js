import React, { PureComponent } from 'react'
import '../styles.css'
import edit_ from '../../../../assets/editP.svg'
import guardar from '../../../../assets/saveP.svg'
import backP from '../../../../assets/backP.svg'
import trashP from '../../../../assets/trashP.svg'
import close from '../../../../assets/close.svg'
import loader from '../../../../assets/loader.gif' 

export default class TablaVehiculo extends PureComponent {

    state={
        fila_editar : '',
        editar_guardar: false,
        buscarVehiculo : '',
        modalNuevoVehiculo: false
    }

    editarLineaTabla = (fila, value) =>{
        this.setState({fila_editar:fila, editar_guardar: true})
        this.props.editarVehiculo(value)
    }

    guardarLinea = async(fila, value) =>{
        await this.props.actualizarDatos(this.props.nuevoVehiculo, fila)
        this.descartarCambios()
    }

    crearNuevoVehiculo = async (e) =>{
        e.preventDefault()
        await this.props.crearNuevoVehiculo(this.props.crearVehiculo)
        this.descartarCambios()
    }

    eliminar = async (fila, value) =>{
        await this.props.eliminarVehiculo(value, fila)
        this.descartarCambios()
    }

    descartarCambios = (fila, value) =>{
        this.setState({fila_editar: '', editar_guardar: false})
    }

    cambiarTextoBuscador = (val) =>{
        this.setState({buscarVehiculo: val.target.value})
    }

    cerrarModalVehiculo = () =>{
        this.setState({modalNuevoVehiculo: false})
    }
    
    abrirModalVehiculo = () =>{
        this.props.limpiarVehiculo()
        this.setState({modalNuevoVehiculo: true})
    }

    render() {
        return (
            <div style={{display:'flex', flexDirection:'column' ,justifyContent:'center', padding:'2rem', margin:'3rem', boxShadow:'rgb(0 0 0 / 15%) 0px 0px 8px 0px'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom: '1rem', flexWrap:'wrap', lineHeight:'3rem'}}>
                    <div>
                        <button className='botonAddChofer' onClick ={()=> this.abrirModalVehiculo()}>
                            Agregar
                        </button>
                    </div>
                    <div style={{display:'flex'}}>
                        <input type="text" className='buscador' placeholder='Filtrar por codigo...' onChange={this.cambiarTextoBuscador} />
                    </div>
                </div>
                <div style={{maxHeight:'65vh', overflowY:'scroll', width:'100%'}}>
                    <table border="1" style={{borderCollapse:'collapse', width:'100%'}} className="table"  bordercolor="#d9a600">
                        <thead style={{background: '#e6b012', color: 'white'}}>
                            <tr>
                                <td style={{width:"15%", position:'sticky', top:'0', zIndex: '10', background: '#e6b012', padding:'6px'}}>Codigo</td>
                                <td style={{width:"20%", position:'sticky', top:'0', zIndex: '10', background: '#e6b012', padding:'6px'}} align="center">Marca</td>
                                <td style={{width:"20%", position:'sticky', top:'0', zIndex: '10', background: '#e6b012', padding:'6px'}} align="center">Modelo</td>
                                <td style={{width:"20%", position:'sticky', top:'0', zIndex: '10', background: '#e6b012', padding:'6px'}} align="center">Placa</td>
                                <td style={{width:"15%", position:'sticky', top:'0', zIndex: '10', background: '#e6b012', padding:'6px'}} align="center">Estado</td>
                                <td style={{minWidth:"120px", position:'sticky', top:'0', zIndex: '10', background: '#e6b012', padding:'6px'}} align="center">Opciones</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.estadosCarga.tabla ?
                                    this.props.vehiculos.filter(value => value.id_unidad.indexOf(this.state.buscarVehiculo.toUpperCase()) !== -1).map((value, fila) =>
                                    <tr key={value.id_unidad} style={{height:'40px', fontSize:'0.9rem'}}>
                                        <td style={{padding:'6px'}}>
                                            { 
                                                fila === this.state.fila_editar ? 
                                                    this.state.editar_guardar ? <input type="text" style={{textTransform:'uppercase', width:'-webkit-fill-available', background:'none', fontSize:'0.9rem'}}
                                                    name='id_unidad' 
                                                    value={this.props.nuevoVehiculo.id_unidad || ''} 
                                                    onChange={this.props.cambiarTexto}/> : value.id_unidad || ''
                                                : value.id_unidad || ''
                                            }
                                        </td>
                                        <td style={{padding:'6px'}}>
                                            { 
                                                fila === this.state.fila_editar ? 
                                                    this.state.editar_guardar ? <input type="text" style={{textTransform:'uppercase', width:'-webkit-fill-available', background:'none', fontSize:'0.9rem'}} 
                                                    name='marca' 
                                                    value={this.props.nuevoVehiculo.marca || ''} 
                                                    onChange={this.props.cambiarTexto}/> : value.marca  || ''
                                                : value.marca || ''
                                            }
                                        </td>
                                        <td style={{padding:'6px'}}>
                                            { 
                                                fila === this.state.fila_editar ? 
                                                    this.state.editar_guardar ? <input type="text" style={{textTransform:'uppercase', width:'-webkit-fill-available', background:'none', fontSize:'0.9rem'}}
                                                    name='modelo' 
                                                    value={this.props.nuevoVehiculo.modelo || ''} 
                                                    onChange={this.props.cambiarTexto}/> : value.modelo 
                                                : value.modelo 
                                            }
                                        </td>
                                        <td style={{padding:'6px'}}>
                                            { 
                                                fila === this.state.fila_editar ? 
                                                    this.state.editar_guardar ? <input type="text" style={{textTransform:'uppercase', width:'-webkit-fill-available', background:'none', fontSize:'0.9rem'}}
                                                    name='placa' 
                                                    value={this.props.nuevoVehiculo.placa || ''} 
                                                    onChange={this.props.cambiarTexto}/> : value.placa 
                                                : value.placa 
                                            }
                                        </td>
                                        <td style={{padding:'6px'}} align="center">
                                            { 
                                                fila === this.state.fila_editar ? 
                                                    <select style={{border:'1px solid black', padding:'0px', margin:'0px', borderRadius:'5px', width:'-webkit-fill-available', fontSize:'0.9rem'}} className="selectTablaAerolinea" name="id_estado"
                                                    value={this.props.nuevoVehiculo.id_estado}
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
                                                    <span style={{cursor:'pointer', marginRight:'15px'}}  onClick={()=>this.guardarLinea(fila,value)}>
                                                        <img src={guardar} alt="editar" width="17"/>
                                                    </span>
                                                    <span style={{cursor:'pointer', marginRight:'15px'}} onClick={()=>this.eliminar(fila, value)}>
                                                        <img src={trashP} alt="editar" width="17"/>
                                                    </span>
                                                    <span style={{cursor:'pointer'}} onClick={()=>this.descartarCambios(fila, value)}>
                                                        <img src={backP} alt="retroceder" width="17"/>
                                                    </span>
                                                </>
                                            }
                                        </td>
                                    </tr>        
                                    )
                                :
                                <tr>
                                    <td colSpan={6} align='center'>
                                        <span > <img src={loader} width="45"  alt="loader" /></span>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
                {
                    this.state.modalNuevoVehiculo ? 
                    <div id="openModal"  className="modalDialog">
                        <div className="modal-dialog">
                            <header className="modal-header">
                                <span>Agregar nuevo Vehiculo    </span>
                            <span onClick={()=> this.cerrarModalVehiculo()} style={{cursor:'pointer'}}><img src={close} alt="close" width="15"/></span>
                            </header>
                            <div style={{margin:'15px'}}>
                            <form onSubmit={(e)=>{this.crearNuevoVehiculo(e)}}>
                                <div className="filasFormulario">
                                    <label className="labelFormulario">Codigo</label>
                                    <input type="text" required name="id_unidad" className="inputFormulario inputFormularioText" autoComplete="off" 
                                    value={this.props.crearVehiculo.id_unidad || ''} onChange={this.props.modificarDatosCrear }/> 
                                </div>
                                <br/>
                                <div className="filasFormulario">
                                    <label className="labelFormulario">Marca</label>
                                    <input type="text" name="marca" className="inputFormulario inputFormularioText" autoComplete="off" 
                                    value={this.props.crearVehiculo.marca || ''}  onChange={this.props.modificarDatosCrear }/> 
                                </div>
                                <br/>
                                <div className="filasFormulario">
                                    <label className="labelFormulario">Modelo</label>
                                    <input type="text"  name="modelo" className="inputFormulario inputFormularioText" autoComplete="off" 
                                    value={this.props.crearVehiculo.modelo || ''}  onChange={this.props.modificarDatosCrear }/> 
                                </div>
                                <br/>
                                <div className="filasFormulario">
                                    <label className="labelFormulario">Placa</label>
                                    <input type="text"  name="placa" className="inputFormulario inputFormularioText" autoComplete="off" 
                                    value={this.props.crearVehiculo.placa || ''}  onChange={this.props.modificarDatosCrear }/> 
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
