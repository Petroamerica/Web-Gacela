import React, { PureComponent } from 'react'
import '../styles.css'

import edit_ from '../../../../assets/editP.svg'
import guardar from '../../../../assets/saveP.svg'
import backP from '../../../../assets/backP.svg'
import trashP from '../../../../assets/trashP.svg'
import close from '../../../../assets/close.svg'
import loader from '../../../../assets/loader.gif' 

export default class TablaAerolinea extends PureComponent {

    state={
        fila_editar : '',
        editar_guardar: false,
        buscarAerolinea: '',
        modalNuevoAerolinea: false
    }

    editarLineaTabla = (fila, value) =>{
        this.setState({fila_editar:fila, editar_guardar: true})
        this.props.editarAerolinea(value)
    }

    guardarLinea = async (fila, value) =>{
        await this.props.actualizarDatos(this.props.nuevaAerolinea, fila)
        this.descartarCambios()
    }

    crearNuevaAerolinea = async (e) =>{
        e.preventDefault()
        await this.props.crearNuevaAerolinea(this.props.crearAerolinea)
    }

    eliminar = async (fila, value) =>{
        await this.props.eliminarAerolinea(value, fila)
        this.descartarCambios()
    }

    descartarCambios = (fila, value) =>{
        this.setState({fila_editar: '', editar_guardar: false})
    }
    
    cambiarTextoBuscador = (val) =>{
        this.setState({buscarAerolinea: val.target.value})
    }

    abrirModalDistrito = () =>{
        this.props.limpiarAerolinea()
        this.setState({modalNuevoAerolinea: true})
    }

    cerrarModalDistrito = () =>{
        this.setState({modalNuevoAerolinea: false})
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
                        <input type="text" className='buscador' placeholder='Filtrar por nombre...' onChange={this.cambiarTextoBuscador} />
                    </div>
                </div>
                <div style={{maxHeight:'65vh', overflowY:'scroll', width:'100%'}}>
                    <table border="1" style={{borderCollapse:'collapse'}} className="table" bordercolor="#d9a600">
                        <thead style={{background: '#e6b012', color: 'white'}}>
                            <tr>
                                <td style={{width:"30%", padding:'6px', position:'sticky', top:'0', background: '#e6b012'}}>Codigo</td>
                                <td style={{width:"50%",  padding:'6px', position:'sticky', top:'0', background: '#e6b012'}} >Descripcion</td>
                                <td style={{width:"20%",  padding:'6px', position:'sticky', top:'0', background: '#e6b012'}} align="center">Estado</td>
                                <td style={{minWidth:"120px",  padding:'6px', position:'sticky', top:'0', background: '#e6b012'}} align="center">Opciones</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.estadosCarga.tabla ?
                                    this.props.aerolineas.filter(value => value.descripcion.indexOf(this.state.buscarAerolinea.toUpperCase()) !== -1).map((value, fila) =>
                                        <tr key={value.id_cuenta} style={{height:'40px', fontSize:'0.9rem'}}>
                                            <td style={{padding:'6px'}}>
                                                { 
                                                    fila === this.state.fila_editar ? 
                                                        this.state.editar_guardar ? 
                                                            <input type="text"
                                                                style={{textTransform:'uppercase', width:'-webkit-fill-available', background:'none', fontSize:'0.9rem'}} 
                                                                name='id_cuenta' disabled
                                                                value={this.props.nuevaAerolinea.id_cuenta} 
                                                                onChange={this.props.cambiarTexto}/>
                                                        : value.id_cuenta || ''
                                                    : value.id_cuenta  || ''
                                                }
                                            </td>
                                            <td style={{padding:'6px'}}>
                                                { 
                                                    fila === this.state.fila_editar ? 
                                                        this.state.editar_guardar ? 
                                                            <input type="text"
                                                                style={{textTransform:'uppercase', width:'-webkit-fill-available', background:'none', fontSize:'0.9rem'}} 
                                                                name='descripcion' 
                                                                value={this.props.nuevaAerolinea.descripcion} 
                                                                onChange={this.props.cambiarTexto}/> 
                                                        : value.descripcion 
                                                    : value.descripcion 
                                                }
                                            </td>
                                            <td style={{padding:'6px'}} align="center">
                                                { 
                                                    fila === this.state.fila_editar ? 
                                                        <select style={{border:'1px solid black', padding:'0px', margin:'0px', borderRadius:'5px', width:'-webkit-fill-available'}} 
                                                            className="selectTablaAerolinea"
                                                            name='id_estado'
                                                            value={this.props.nuevaAerolinea.id_estado}
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
                                                    <span style={{cursor:'pointer', marginRight:'15px'}}  onClick={()=>this.eliminar(fila,value)}>
                                                        <img src={trashP} alt="editar" width="17"/>
                                                    </span>
                                                    <span style={{cursor:'pointer'}}  onClick={()=>this.descartarCambios(fila,value)}>
                                                        <img src={backP} alt="retroceder" width="17"/>
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
                    this.state.modalNuevoAerolinea ? 
                    <div id="openModal"  className="modalDialog">
                        <div className="modal-dialog">
                            <header className="modal-header">
                                <span>Agregar nueva Aerolinea</span>
                            <span onClick={()=> this.cerrarModalDistrito()} style={{cursor:'pointer'}}><img src={close} alt="close" width="15"/></span>
                            </header>
                            <div style={{margin:'15px'}}>
                            <form onSubmit={(e)=>{this.crearNuevaAerolinea(e)}}>
                                <div className="filasFormulario">
                                    <label className="labelFormulario">Codigo</label>
                                    <input type="text" required name="id_cuenta" className="inputFormulario inputFormularioText" autoComplete="off" 
                                    value={this.props.crearAerolinea.id_cuenta || ''} onChange={this.props.modificarDatosCrear }/> 
                                </div>
                                <br/>
                                <div className="filasFormulario">
                                    <label className="labelFormulario">Descripcion</label>
                                    <input type="text" required name="descripcion" className="inputFormulario inputFormularioText" autoComplete="off" 
                                    value={this.props.crearAerolinea.descripcion || ''}  onChange={this.props.modificarDatosCrear }/> 
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
