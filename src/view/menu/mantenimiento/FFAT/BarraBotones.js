import React, { Component } from 'react'
import close from '../../../../assets/close.svg'
export default class BarraBotones extends Component {
    
    state ={
        modalNuevoFFAT: false
    }

    cerrarModalComentario = () =>{
        this.setState({modalNuevoFFAT: false})
    }

    abrirModalFFAT = () =>{
        this.props.lispiarNuevoFFAT()
        this.setState({modalNuevoFFAT: true})
    }

    crearNuevoFFAT = (e) =>{
        e.preventDefault()
        this.props.guardarCambios(this.props.nuevoffat, 'save')
    }
    
    render() {
        return (
            <div style={{display:'flex', justifyContent:'center', paddingTop:'30px'}}>
                <div>
                    <input type="button" value="Agregar Nuevo Estado" className="FormularioCrear fontSize1" onClick ={()=> this.abrirModalFFAT()}/>
                </div>
                {
                    this.state.modalNuevoFFAT ? 
                    <div id="openModal"  className="modalDialog">
                        <div className="modal-dialog">
                            <header className="modal-header">
                                <span>Agregar nuevo FFAT: </span>
                            <span onClick={()=> this.cerrarModalComentario()} style={{cursor:'pointer'}}><img src={close} alt="close" width="15"/></span>
                            </header>
                            <div style={{margin:'15px'}}>
                            <form onSubmit={(e)=>{this.crearNuevoFFAT(e)}}>
                                <div className="filasFormulario">
                                    <label className="labelFormulario">Codigo</label>
                                    <input type="text" name="id_tipo_estado_mov" className="inputFormulario inputFormularioText" autoComplete="off" 
                                    value={this.props.nuevoffat[0].id_tipo_estado_mov || ''} onChange={this.props.modificarDatos }/> 
                                </div>
                                <br/>
                                <div className="filasFormulario">
                                    <label className="labelFormulario">Descripcion</label>
                                    <input type="text"  name="descripcion" className="inputFormulario inputFormularioText" autoComplete="off" 
                                    value={this.props.nuevoffat[0].descripcion || ''}  onChange={this.props.modificarDatos }/> 
                                </div>
                                <br/>
                                <div className="filasFormulario">
                                <label className="labelFormulario">Facturable</label>
                                    <select  name="flg_facturable" className="selectFormulario" value={this.props.nuevoffat[0].flg_facturable || ''}
                                        onChange={this.props.modificarDatos}>
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
