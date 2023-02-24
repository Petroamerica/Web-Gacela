import React, { Component } from 'react'
import close from '../../../../assets/close.svg'
import '../../style.css'
import { NavLink } from 'react-router-dom'

export default class ModalAgregarPasajero extends Component {
    render() {
        const pasajeroSeleccionado = this.props.pasajeroSeleccionado ? this.props.pasajeroSeleccionado : []
        return (
            <div id="openModal"  className="modalDialog">
                <div className="modal-dialog">
                    <header className="modal-header">
                        <span>Ingresar nuevo pasajero </span>
                    <span onClick={()=> this.props.cerrarModal()} style={{cursor:'pointer'}}><img src={close} alt="close" width="15"/></span>
                    </header>
                    <div style={{margin:'15px'}}>
                    <form onSubmit={(e)=>{this.props.guarDardatosModal(e)}}>
                        <div className="filasFormulario">
                            <label className="labelFormulario">Pasajero</label>
                            <input type="text" name="MIN_PASAJERO" className="inputFormulario inputFormularioText invalido"  
                            onChange={this.props.buscarPasajero}
                            required
                            autoComplete="off"
                            value={pasajeroSeleccionado[0]['descripcion']}
                            style={{textTransform:'uppercase'}}
                            />
                        </div>
                        {
                            this.props.newArrayPassenger.length > 0 ?   
                                <div className="listPassenger" style={{marginTop:'0px'}}>
                                {
                                    this.props.newArrayPassenger.map( value =>
                                        <span style={{cursor:'pointer', overflow:'hidden', whiteSpace:'nowrap', minHeight: '25px', borderRadius: '4px', border: '1px solid #1A1C20', color:'#1A1C20', margin:'3px', padding:'4px'}} 
                                            key={value.id_pasajero} 
                                            onClick={(value)=>this.props.escogerPasajero(value)} id={[value.id_pasajero,value.id_cliente,value.id_tipo_di]}>
                                                {value.id_pasajero} - {value.descripcion}
                                        </span>
                                    )
                                }
                                </div>
                            : null 
                        }

                        <br/>
                        <div className="filasFormulario">
                            <label className="labelFormulario">Hora de llegada</label>
                            <input type="text" name="MIN_PASAJERO" className="inputFormulario inputFormularioText invalido"  
                            required
                            onChange={this.props.agregarHora}
                            autoComplete="off"
                            value={this.props.horaServicio}
                            pattern="^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$"
                            maxLength="5"
                            />
                        </div>
                        <br/>
                        {
                             this.props._ffat === undefined ? null : 
                            <div className="filasFormulario">
                                <label className="labelFormulario">Estado de Movilidad del Pasajero</label>
                                <select value={this.props._ffat || ''} style={{outline:'none'}} onChange={this.props.agregarffat} className="selectFormulario fontSize09em">
                                    <option value="" >Seleccionar</option>
                                    {
                                        this.props.ffat.map(value =>
                                            <option key={value.id_tipo_estado_mov} 
                                                value={value.id_tipo_estado_mov} 
                                                >{value.descripcion}</option>
                                        )
                                    }
                                </select>
                            </div>
                        }   
                        <br/>
                        <div className="filasFormulario">
                            <label className="labelFormulario">Aerolinea</label>
                            <select onChange={this.props.agregarAerolinea} style={{outline:'none'}} value={this.props.cuenta || ''} className="selectFormulario fontSize09em">
                                <option value="">Seleccionar..</option>
                                {
                                    this.props.aerolinea.map(value =>
                                        <option key={value.id_cuenta} defaultValue={value.id_cuenta} value={value.id_cuenta}>{value.descripcion}</option>   
                                    )
                                }
                            </select>
                        </div>
                        <br/>
                        <div className="filasFormulario">
                            <input type="submit" value="Guardar" className="BtnGuardar inputFormularioText inputFormularioBoton"/>
                        </div>
                        <div className="filasFormulario" style={{textAlign:'center'}}>
                            <NavLink exact  to="/GacelaWeb/" style={{color:'black'}} rel="noopener noreferrer" target={"_blank"}>
                                ¿Crear nuevo pasajero?
                            </NavLink>
                        </div>
                    </form>
                    </div>
                </div>
            </div> 
        )
    }
}
