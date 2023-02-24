import React, { Component } from 'react'
import close from '../../../../assets/close.svg'
import '../../style.css'

export default class ModalMoficacion extends Component {
    render() {
        return (
            <div id="openModal"  className="modalDialog">
                <div className="modal-dialog">
                    <header className="modal-header">
                        <span>Ultima modificación </span>
                    <span onClick={()=> this.props.cerrarVentanaModificacion()} style={{cursor:'pointer'}}><img src={close} alt="close" width="15"/></span>
                    </header>
                    <div style={{margin:'15px'}}>
                        <div className="filasFormulario">
                            <label className="labelFormulario">Usuario:</label>
                            <input type="text" readOnly="readonly" className="inputFormulario inputFormularioText" autoComplete="off" 
                            value={this.props.pasajeroComentario.usuario_asigna_servicio || ''} />
                        </div>
                    </div>
                </div>
            </div> 
        )
    }
}
