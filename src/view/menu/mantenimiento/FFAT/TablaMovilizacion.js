import React, { Component } from 'react'
import '../styles.css'
import edit_ from '../../../../assets/editP.svg'
import guardar from '../../../../assets/saveP.svg'
import cancelar from '../../../../assets/backP.svg'
import retornar from '../../../../assets/trashP.svg'
import close from '../../../../assets/close.svg'
import loader from '../../../../assets/loader.gif' 

export default class TablaMovilizacion extends Component {

    state={
        fila_editar : '',
        editar_guardar: false,
        modalNuevoFFAT: false,
        buscarFFAT: ''
    }

    editarLineaTabla = (fila, value) =>{
        this.setState({fila_editar:fila, editar_guardar: true})
        this.props.editarFFAT(value)
    }

    descartarCambios = (fila, value) =>{
        this.setState({editar_guardar: false, fila_editar: ''})
    }

    guardarLinea = async(fila, value) =>{
        await this.props.actualizarDatos(this.props.nuevoffat, fila)
        this.descartarCambios()
    }

    eliminar = async(fila, value) =>{
        await this.props.eliminarEstadoMovilizacion(value, fila)
        this.descartarCambios()
    }

    cerrarModalFFAT = () =>{
        this.setState({modalNuevoFFAT: false})
    }

    abrirModalFFAT = () =>{
        this.props.limpiarFFAT()
        this.setState({modalNuevoFFAT: true})
    }

    cambiarTextoBuscador = (val) =>{
        this.setState({buscarFFAT: val.target.value})
    }

    crearNuevoFFAT = async (e) =>{
        e.preventDefault()
        await this.props.crearNuevoEstadoM(this.props.crearffat)
    }

    render() {
        return (
            <div style={{display:'flex', flexDirection:'column' ,justifyContent:'center', padding:'2rem', margin:'3rem', boxShadow:'rgb(0 0 0 / 15%) 0px 0px 8px 0px'}}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom: '1rem', flexWrap:'wrap', lineHeight:'3rem'}}>
                    <div>
                        <button className='botonAddChofer' onClick ={()=> this.abrirModalFFAT()}>
                            Agregar
                        </button>
                    </div>
                    <div style={{display:'flex'}}>
                        <input type="text" className='buscador'  placeholder='Filtrar por codigo...' onChange={this.cambiarTextoBuscador} />
                    </div>
                </div>
                <div style={{maxHeight:'65vh', overflowY:'scroll', width:'100%'}}>
                    <table border="1" style={{borderCollapse:'collapse', width:'100%'}} className="table"  bordercolor="#d9a600">
                        <thead style={{background: '#e6b012', color: 'white'}}>
                            <tr>
                                <td style={{width:"20%", padding:'6px', position:'sticky', top:'0', background: '#e6b012'}}>Codigo</td>
                                <td style={{width:"45%", padding:'6px', position:'sticky', top:'0', background: '#e6b012'}}>Descripción</td>
                                <td style={{width:"20%", padding:'6px', position:'sticky', top:'0', background: '#e6b012'}} align="center">Facturable</td>
                                <td style={{maxWidth:"120px", padding:'6px', position:'sticky', top:'0', background: '#e6b012'}} align="center">Opciones</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.estadosCarga.tabla ? 
                                    this.props.ffat.filter(value => value.descripcion.indexOf(this.state.buscarFFAT.toUpperCase()) !== -1).map((value, fila) =>
                                        <tr key={value.id_tipo_estado_mov} style={{height:'40px', fontSize:'0.9rem'}}>
                                            <td style={{padding:'6px'}}>
                                                { 
                                                    fila === this.state.fila_editar ? 
                                                        this.state.editar_guardar ? 
                                                            <input type="text" style={{textTransform:'uppercase', width:'-webkit-fill-available', background:'none', fontSize:'0.9rem'}}  
                                                            name="id_tipo_estado_mov" disabled
                                                            value={this.props.nuevoffat.id_tipo_estado_mov || ''} 
                                                            onChange={this.props.modificarDatos }/> : value.id_tipo_estado_mov 
                                                    : value.id_tipo_estado_mov 
                                                }
                                            </td>
                                            <td style={{padding:'6px'}}>
                                                { 
                                                    fila === this.state.fila_editar ? 
                                                        this.state.editar_guardar ? <input type="text" style={{textTransform:'uppercase', width:'-webkit-fill-available', background:'none', fontSize:'0.9rem'}}   
                                                        name="descripcion" 
                                                        value={this.props.nuevoffat.descripcion || ''} 
                                                        onChange={this.props.modificarDatos }/> : value.descripcion 
                                                    : value.descripcion 
                                                }
                                            </td>
                                            <td style={{padding:'6px'}} align="center">
                                                { 
                                                    fila === this.state.fila_editar ? 
                                                        <select style={{border:'1px solid black', padding:'0px', margin:'0px', borderRadius:'5px', width:'-webkit-fill-available'}} 
                                                        name="flg_facturable" 
                                                        className="selectTablaAerolinea" 
                                                        value={this.props.nuevoffat.flg_facturable || ''}
                                                        onChange={this.props.modificarDatos}
                                                        >
                                                            <option value="">Seleccionar..</option>
                                                            <option value="1">Sí</option>
                                                            <option value="0">No</option>
                                                        </select> 
                                                    : value.flg_facturable === '1' ? 'Sí' : 'No' }
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
                                                            <img src={guardar} alt="editar" width="15"/>
                                                        </span>
                                                        <span style={{cursor:'pointer', marginRight:'15px'}}  onClick={()=>this.eliminar(fila,value)} >
                                                            <img src={retornar} alt="cancelar" width="15"/>
                                                        </span>
                                                        <span style={{cursor:'pointer'}}  onClick={()=>this.descartarCambios(fila,value)} >
                                                            <img src={cancelar} alt="cancelar" width="15"/>
                                                        </span>
                                                        </>
                                                        
                                                }
                                            </td>
                                        </tr>
                                    )
                                :
                                    <tr>
                                        <td colSpan={4} align='center'>
                                            <span > <img src={loader} width="45"  alt="loader" /></span>
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
                {
                    this.state.modalNuevoFFAT ? 
                    <div id="openModal"  className="modalDialog">
                        <div className="modal-dialog">
                            <header className="modal-header">
                                <span>Agregar nuevo FFAT: </span>
                            <span onClick={()=> this.cerrarModalFFAT()} style={{cursor:'pointer'}}><img src={close} alt="close" width="15"/></span>
                            </header>
                            <div style={{margin:'15px'}}>
                            <form onSubmit={(e)=>{this.crearNuevoFFAT(e)}}>
                                <div className="filasFormulario">
                                    <label className="labelFormulario">Codigo</label>
                                    <input type="text" required name="id_tipo_estado_mov" className="inputFormulario inputFormularioText" autoComplete="off" 
                                    value={this.props.crearffat.id_tipo_estado_mov || ''} onChange={this.props.editarFFATCrear }/> 
                                </div>
                                <br/>
                                <div className="filasFormulario">
                                    <label className="labelFormulario">Descripcion</label>
                                    <input type="text" required name="descripcion" className="inputFormulario inputFormularioText" autoComplete="off" 
                                    value={this.props.crearffat.descripcion || ''}  onChange={this.props.editarFFATCrear }/> 
                                </div>
                                <br/>
                                <div className="filasFormulario">
                                <label className="labelFormulario">Facturable</label>
                                    <select  name="flg_facturable" className="selectFormulario" value={this.props.crearffat.flg_facturable || ''}
                                        onChange={this.props.editarFFATCrear}>
                                        <option value="">Seleccionar..</option>
                                        <option value="1">Sí</option>
                                        <option value="0">No</option>
                                    </select> 
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
