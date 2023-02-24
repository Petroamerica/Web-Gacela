import React, { Component } from 'react'
import close from '../../../../assets/close.svg'

export default class BarraBotones extends Component {

    state ={
        modalNuevoDistrito: false
    }

    cerrarModalComentario = () =>{
        this.setState({modalNuevoDistrito: false})
    }

    abrirModalDistrito = () =>{
        this.props.lispiarNuevoDistrito()
        this.setState({modalNuevoDistrito: true})
    }

    crearNuevoDistrito = (e) =>{
        e.preventDefault()
        this.props.guardarDistrito(this.props.nuevoDistrito, 'save')
    }

    render() {
        return (
            <div style={{display:'flex', justifyContent:'center', paddingTop:'30px'}}>
                <div>
                    <input type="button" value="Agregar Nuevo Distrito" className="FormularioCrear fontSize1" onClick ={()=> this.abrirModalDistrito()}/>
                </div>
                {
                    this.state.modalNuevoDistrito ? 
                    <div id="openModal"  className="modalDialog">
                        <div className="modal-dialog">
                            <header className="modal-header">
                                <span>Agregar nuevo Distrito: </span>
                            <span onClick={()=> this.cerrarModalComentario()} style={{cursor:'pointer'}}><img src={close} alt="close" width="15"/></span>
                            </header>
                            <div style={{margin:'15px'}}>
                            <form onSubmit={(e)=>{this.crearNuevoDistrito(e)}}>
                                <div className="filasFormulario">
                                    <label className="labelFormulario">Codigo</label>
                                    <input type="text" name="id_distrito" className="inputFormulario inputFormularioText" autoComplete="off" 
                                    value={this.props.nuevoDistrito.id_distrito || ''} onChange={this.props.modificarDatos }/> 
                                </div>
                                <br/>
                                <div className="filasFormulario">
                                    <label className="labelFormulario">Descripcion</label>
                                    <input type="text"  name="descripcion" className="inputFormulario inputFormularioText" autoComplete="off" 
                                    value={this.props.nuevoDistrito.descripcion || ''}  onChange={this.props.modificarDatos }/> 
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
