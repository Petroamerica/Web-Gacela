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
        buscarChofer: '',
        modalNuevoChofer:false
    }

    editarLineaTabla = (fila, value) =>{
        this.setState({fila_editar:fila, editar_guardar: true})
        this.props.editarChofer(value)
    }

    guardarLinea = async (fila, value) =>{
        await this.props.actualizarDatos(this.props.nuevoChofer, fila)
        this.descartarCambios()
    }

    crearNuevoChofer = async (e) =>{
        e.preventDefault()
        await this.props.crearNuevoChofer(this.props.crearChofer)
        this.descartarCambios()
    }

    eliminar = async (fila, value) =>{
        await this.props.eliminarChofer(value, fila)
        this.descartarCambios()
    }

    descartarCambios = () =>{
        this.setState({fila_editar: '', editar_guardar: false})
    }

    cambiarTextoBuscador = (val) =>{
        this.setState({buscarChofer: val.target.value})
    }

    abrirModalChofer = () =>{
        this.props.limpiarChofer()
        this.setState({modalNuevoChofer: true})
    }
    cerrarModalChofer = () =>{
        this.setState({modalNuevoChofer: false})
    }

    render() {
        return (
            <div style={{display:'flex', flexDirection:'column' ,justifyContent:'center', padding:'2rem', margin:'3rem', boxShadow:'rgb(0 0 0 / 15%) 0px 0px 8px 0px'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom: '1rem', flexWrap:'wrap', lineHeight:'3rem'}}>
                    <div>
                        <button className='botonAddChofer' onClick ={()=> this.abrirModalChofer()}>
                            Agregar
                        </button>
                    </div>
                    <div style={{display:'flex'}}>
                        <input type="text" className='buscador' placeholder='Filtrar por nombre...' onChange={this.cambiarTextoBuscador} />
                    </div>
                </div>
                <div style={{maxHeight:'65vh', overflowY:'scroll', width:'100%'}}>
                    <table border="1" style={{borderCollapse:'collapse'}} className="table" bordercolor="#d9a600">
                        <thead style={{background: '#e6b012', color: 'white'}}>
                            <tr>
                                <td style={{width:"8%", position:'sticky', top:'0', zIndex: '10', background: '#e6b012', padding:'6px'}} align="center">Codigo</td>
                                <td style={{width:"25%", position:'sticky', top:'0', zIndex: '10', background: '#e6b012', padding:'6px'}} align="center">Nombre</td>
                                <td style={{width:"25%", position:'sticky', top:'0', zIndex: '10', background: '#e6b012', padding:'6px'}} align="center">Direccion</td>
                                <td style={{width:"10%", position:'sticky', top:'0', zIndex: '10', background: '#e6b012', padding:'6px'}} align="center">Licencia</td>
                                <td style={{width:"10%", position:'sticky', top:'0', zIndex: '10', background: '#e6b012', padding:'6px'}} align="center">Telefono</td>
                                <td style={{width:"10%", position:'sticky', top:'0', zIndex: '10', background: '#e6b012', padding:'6px'}} align="center">Cod. Velsat</td>
                                <td style={{width:"10%", position:'sticky', top:'0', zIndex: '10', background: '#e6b012', padding:'6px'}} align="center">Usuario</td>
                                <td style={{width:"10%", position:'sticky', top:'0', zIndex: '10', background: '#e6b012', padding:'6px'}} align="center">Contraseña</td>
                                <td style={{minWidth:'100px', width:"12%", position:'sticky', top:'0', zIndex: '10', background: '#e6b012', padding:'6px'}} align="center">Estado</td>
                                <td style={{minWidth:'120px', position:'sticky', top:'0', zIndex: '10', background: '#e6b012', padding:'6px'}} align="center">Opciones</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.estadosCarga.tabla ?
                                    this.props.chofer.filter( values => values.descripcion.indexOf(this.state.buscarChofer.toUpperCase()) !== -1).map((value, fila) =>
                                        <tr key={value.id_chofer} style={{height:'40px', fontSize:'0.9rem'}}>
                                            <td style={{padding:'6px'}}>
                                                { 
                                                    fila === this.state.fila_editar ? 
                                                        this.state.editar_guardar ? <input type="text" style={{textTransform:'uppercase', fontSize:'1rem', background:'none', width:'100px'}} 
                                                            name='id_chofer' disabled
                                                            value={this.props.nuevoChofer.id_chofer} 
                                                            onChange={this.props.cambiarTexto}/> : value.id_chofer  || ''
                                                    : value.id_chofer || ''
                                                }
                                            </td>
                                            <td style={{padding:'6px'}}>
                                                { 
                                                    fila === this.state.fila_editar ? 
                                                        this.state.editar_guardar ? <input type="text" style={{textTransform:'uppercase', fontSize:'1rem', background:'none', width:'-webkit-fill-available'}} 
                                                        name='descripcion' 
                                                        value={this.props.nuevoChofer.descripcion || ''}
                                                        onChange={this.props.cambiarTexto}/> : value.descripcion || ''
                                                    : value.descripcion || ''
                                                }
                                            </td>
                                            <td style={{padding:'6px'}}>
                                                { 
                                                    fila === this.state.fila_editar ? 
                                                        this.state.editar_guardar ? <input type="text" style={{textTransform:'uppercase', fontSize:'1rem', background:'none', width:'-webkit-fill-available'}} 
                                                        name='direccion' 
                                                        value={this.props.nuevoChofer.direccion || ''}
                                                        onChange={this.props.cambiarTexto}/> : value.direccion || ''
                                                    : value.direccion || ''
                                                }
                                            </td>
                                            <td style={{padding:'6px'}} align="center">
                                                { 
                                                    fila === this.state.fila_editar ? 
                                                        this.state.editar_guardar ? <input type="text" style={{textTransform:'uppercase', fontSize:'1rem', background:'none', width:'-webkit-fill-available'}} 
                                                        name='licencia' 
                                                        value={this.props.nuevoChofer.licencia || ''}
                                                        onChange={this.props.cambiarTexto}/> : value.licencia  || ''
                                                    : value.licencia || ''
                                                }
                                            </td>
                                            <td style={{padding:'6px'}} align="center">
                                                { 
                                                    fila === this.state.fila_editar ? 
                                                        this.state.editar_guardar ? <input type="text" style={{textTransform:'uppercase', fontSize:'1rem', background:'none', width:'-webkit-fill-available'}} 
                                                        name='telefono' 
                                                        value={this.props.nuevoChofer.telefono || ''}
                                                        onChange={this.props.cambiarTexto}/> : value.telefono  || ''
                                                    : value.telefono || ''
                                                }
                                            </td>
                                            <td style={{padding:'6px'}} align="center">
                                                { 
                                                    fila === this.state.fila_editar ? 
                                                        this.state.editar_guardar ? <input type="text" style={{textTransform:'uppercase', fontSize:'1rem', background:'none', width:'-webkit-fill-available'}} 
                                                        name='id_chofer_velsat' 
                                                        value={this.props.nuevoChofer.id_chofer_velsat || ''}
                                                        onChange={this.props.cambiarTexto}/> : value.id_chofer_velsat  || ''
                                                    : value.id_chofer_velsat || ''
                                                }
                                            </td>
                                            <td style={{padding:'6px'}} align="center">
                                                { 
                                                    fila === this.state.fila_editar ? 
                                                        this.state.editar_guardar ? <input type="text" style={{textTransform:'uppercase', fontSize:'1rem', background:'none', width:'-webkit-fill-available'}} 
                                                        name='login_velsat' 
                                                        value={this.props.nuevoChofer.login_velsat || ''}
                                                        onChange={this.props.cambiarTexto}/> : value.login_velsat  || ''
                                                    : value.login_velsat || ''
                                                }
                                            </td>
                                            <td style={{padding:'6px'}} align="center">
                                                { 
                                                    fila === this.state.fila_editar ? 
                                                        this.state.editar_guardar ? <input type="text" style={{textTransform:'uppercase', fontSize:'1rem', background:'none', width:'-webkit-fill-available'}} 
                                                        name='clave_velsat' 
                                                        value={this.props.nuevoChofer.clave_velsat || ''}
                                                        onChange={this.props.cambiarTexto}/> : value.clave_velsat  || ''
                                                    : value.clave_velsat || ''
                                                }
                                            </td>
                                            <td style={{padding:'6px'}} align="center">
                                                { 
                                                    fila === this.state.fila_editar ? 
                                                        <select style={{border:'1px solid black', padding:'0px', margin:'0px', borderRadius:'5px', width:'-webkit-fill-available'}} name='id_estado'  className="selectTablaAerolinea" 
                                                        value={this.props.nuevoChofer.id_estado}
                                                        onChange={this.props.cambiarTexto}>
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
                                                        <span style={{cursor:'pointer', marginRight:'15px'}}  onClick={()=>this.guardarLinea(fila,value)}>
                                                            <img src={guardar} alt="editar" width="17"/>
                                                        </span>
                                                        <span style={{cursor:'pointer', marginRight:'15px'}}  onClick={()=>this.eliminar(fila,value)}>
                                                            <img src={trashP} alt="editar" width="17"/>
                                                        </span>
                                                        <span style={{cursor:'pointer'}}  onClick={()=>this.descartarCambios()}>
                                                            <img src={backP} alt="retroceder" width="17"/>
                                                        </span>
                                                    </>
                                                }
                                            </td>
                                        </tr>        
                                    )
                                :
                                <tr>
                                    <td colSpan={10} align='center'>
                                        <span > <img src={loader} width="45"  alt="loader" /></span>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
                {
                    this.state.modalNuevoChofer ? 
                    <div id="openModal"  className="modalDialog">
                        <div className="modal-dialog-2col">
                            <header className="modal-header">
                                <span>Agregar nuevo Chofer</span>
                            <span onClick={()=> this.cerrarModalChofer()} style={{cursor:'pointer'}}><img src={close} alt="close" width="15"/></span>
                            </header>
                            <div style={{margin:'15px'}}>
                            <form onSubmit={(e)=>{this.crearNuevoChofer(e)}} style={{display:'flex', justifyContent:'space-between'}}>
                                <div>
                                    <div className="filasFormulario">
                                        <label className="labelFormulario">Codigo</label>
                                        <input type="text" name="id_chofer" required className="inputFormulario inputFormularioText" autoComplete="off" 
                                        value={this.props.crearChofer.id_chofer || ''} onChange={this.props.modificarDatosCrear }/> 
                                    </div>
                                    <br/>
                                    <div className="filasFormulario">
                                        <label className="labelFormulario">Nombre</label>
                                        <input type="text"  name="descripcion" required className="inputFormulario inputFormularioText" autoComplete="off" 
                                        value={this.props.crearChofer.descripcion || ''}  onChange={this.props.modificarDatosCrear }/> 
                                    </div>
                                    <br/>
                                    <div className="filasFormulario">
                                        <label className="labelFormulario">Direccion</label>
                                        <input type="text"  name="direccion" className="inputFormulario inputFormularioText" autoComplete="off" 
                                        value={this.props.crearChofer.direccion || ''}  onChange={this.props.modificarDatosCrear }/> 
                                    </div>
                                    <br/>
                                    <div className="filasFormulario">
                                        <label className="labelFormulario">Telefono</label>
                                        <input type="text"  name="telefono" className="inputFormulario inputFormularioText" autoComplete="off" 
                                        value={this.props.crearChofer.telefono || ''}  onChange={this.props.modificarDatosCrear }/> 
                                    </div>
                                </div>
                                <div>
                                    <div className="filasFormulario">
                                        <label className="labelFormulario">Licencia</label>
                                        <input type="text"  name="licencia" className="inputFormulario inputFormularioText" autoComplete="off" 
                                        value={this.props.crearChofer.licencia || ''}  onChange={this.props.modificarDatosCrear }/> 
                                    </div>
                                    <br/>
                                    <div className="filasFormulario">
                                        <label className="labelFormulario">Usuario</label>
                                        <input type="text"  name="login_velsat" className="inputFormulario inputFormularioText" autoComplete="off" 
                                        value={this.props.crearChofer.login_velsat || ''}  onChange={this.props.modificarDatosCrear }/> 
                                    </div>
                                    <br/>
                                    <div className="filasFormulario">
                                        <label className="labelFormulario">Contraseña</label>
                                        <input type="text"  name="clave_velsat" className="inputFormulario inputFormularioText" autoComplete="off" 
                                        value={this.props.crearChofer.clave_velsat || ''}  onChange={this.props.modificarDatosCrear }/> 
                                    </div>
                                    <br/>
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
