import React, { Component } from 'react'
import close from '../../../../assets/close.svg'
import '../../style.css'
import { NavLink } from 'react-router-dom'

export default class ModalAgregarServicio extends Component {
    render() {
        const pasajeroSeleccionado = this.props.pasajeroSeleccionado ? this.props.pasajeroSeleccionado : []
        return (
            <div id="openModal"  className="modalDialog">
                <div className="modal-dialog">
                    <header className="modal-header">
                        <span>Ingresar nuevo Servicio </span>
                    <span onClick={()=> this.props.cerrarModalServicio()} style={{cursor:'pointer'}}><img src={close} alt="close" width="15"/></span>
                    </header>
                    <div style={{margin:'15px'}}>
                    <form onSubmit={(e)=>{this.props.agregarServicio(e)}}>
                        <div className ="filasFormulario">
                            <label className="labelFormulario">Asignar Vehiculo del Servicio</label>
                            <input type="text" className="inputFormulario inputFormularioText invalido"  
                                onChange={this.props.agregarVehiculo}
                                autoComplete="off"
                                value={this.props.MAS_vehiculo || ''}
                                style={{textTransform:'uppercase'}}
                                />
                        </div>
                        {
                            this.props.newArrayVehiculo.length > 0 ?   
                                <div className="listPassenger" style={{marginTop:'0px'}}>
                                {
                                    this.props.newArrayVehiculo.map( value =>
                                        <span style={{cursor:'pointer', overflow:'hidden', whiteSpace:'nowrap', minHeight: '25px', borderRadius: '4px', border: '1px solid #1A1C20', color:'#1A1C20', margin:'3px', padding:'4px'}} 
                                            key={value.id_unidad} 
                                            onClick={()=>this.props.seleccionarVehiculo(value.id_unidad)}>
                                                {value.id_unidad}
                                        </span>
                                    )
                                }
                                </div>
                            : null 
                        }
                        <br/>
                        <div className ="filasFormulario">
                            <label className="labelFormulario">Asignar Chofer del Servicio</label>
                            <input type="text" className="inputFormulario inputFormularioText invalido"  
                                onChange={this.props.agregarChofer}
                                autoComplete="off"
                                value={this.props.MAS_chofer || ''}
                                style={{textTransform:'uppercase'}}
                                />
                        </div>
                        {
                            this.props.newArrayChofer.length > 0 ?   
                                <div className="listPassenger" style={{marginTop:'0px'}}>
                                {
                                    this.props.newArrayChofer.map( value =>
                                        <span style={{cursor:'pointer', overflow:'hidden', whiteSpace:'nowrap', minHeight: '25px', borderRadius: '4px', border: '1px solid #1A1C20', color:'#1A1C20', margin:'3px', padding:'4px'}} 
                                            key={value.id_chofer} 
                                            onClick={()=>this.props.seleccionarChofer(value.id_chofer)}>
                                                {value.id_chofer} - {value.descripcion}
                                        </span>
                                    )
                                }
                                </div>
                            : null 
                        }
                        <br/>
                        <div className="filasFormulario">
                            <label className="labelFormulario">Hora de Inicio del Servicio</label>
                            <input type="text" className="inputFormulario inputFormularioText invalido"  
                            required
                            onChange={this.props.agregarHoraServicio}
                            autoComplete="off"
                            value={this.props.horaDelServicio || ''}
                            pattern="^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$"
                            maxLength="5"
                            />
                        </div>
                        <br/>
                        <div className="filasFormulario">
                            <label className="labelFormulario">Asignar pasajero</label>
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
                            <label className="labelFormulario">Hora de llegada del pasajero</label>
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
                        <div className="filasFormulario">
                            <label className="labelFormulario">Estado de Movilizacion del pasajero</label>
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
                        <br/>
                        <div className="filasFormulario">
                            <label className="labelFormulario">Aerolinea del pasajero</label>
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
                            {
                                //to={{pathname: "/GacelaWeb/pasajero"}}
                            }
                            <NavLink exact  to="/GacelaWeb/"  style={{color:'black'}}  rel="noopener noreferrer" target={"_blank"}>
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
