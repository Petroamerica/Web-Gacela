import React, { Component } from 'react'
import close from '../../../../assets/close.svg'
import '../../style.css'

export default class ModalComentario extends Component {
    render() {
        return (
            <div id="openModal"  className="modalDialog">
                <div className="modal-dialog">
                    <header className="modal-header">
                        <span>Ingresar un comentario para el pasajero: </span>
                    <span onClick={()=> this.props.cerrarModalComentario()} style={{cursor:'pointer'}}><img src={close} alt="close" width="15"/></span>
                    </header>
                    <div style={{margin:'15px'}}>
                    <form onSubmit={(e)=>{this.props.agregarComentario(e)}}>
                        <div className="filasFormulario">
                            <label className="labelFormulario">Pasajero</label>
                            <input type="text" name="comentario" readOnly="readonly" className="inputFormulario inputFormularioText" autoComplete="off" value={this.props.pasajeroComentario.descripcion_pasajero} />
                        </div>
                        <br/>
                        <div className="filasFormulario">
                            <label className="labelFormulario">Comentario</label>
                            <textarea onChange = {this.props.modificarComentario} value={this.props.comentario || ''} name="comentario" className="inputFormulario inputFormularioText" 
                            style={{ marginTop:'10px' ,resize: 'none', height: '120px'}}></textarea>
                        </div>
                        <br/>
                        <div className="filasFormulario">
                            <input type="submit" value="Guardar" className="BtnGuardar inputFormularioText inputFormularioBoton"/>
                        </div>
                    </form>
                    </div>
                </div>
            </div> 
        )
    }
}
