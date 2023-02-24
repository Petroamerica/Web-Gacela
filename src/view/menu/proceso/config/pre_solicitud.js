import React, { Component } from 'react'

export default class pre_solicitud extends Component {
    render() {
        //onClick={()=>{ this.props.quitarPasajero(this.props.id)} }
        return (
                <>
                {
                    this.props.destino === "programacion.js" ?
                    <li onClick={ ()=>{  this.props.quitarPasajero(this.props.id)} }>
                        <span><b>Numero de viaje:</b> {this.props.numServicio}</span>
                        <span><b>Pasajero:</b> {this.props.nombre}</span>
                        <span><b>Distrito:</b> {this.props.descripcion_distrito}</span>
                        <span><b>Hora:</b> {this.props.hora}</span>
                    </li>
                    :
                    <li onClick={ ()=>{ this.props.numServicio === 0? this.props.quitarPasajero(this.props.id): console.warn('x')} }>
                        <span><b>Numero de viaje:</b> {this.props.numServicio}</span>
                        <span><b>Pasajero:</b> {this.props.nombre}</span>
                        <span><b>Distrito:</b> {this.props.descripcion_distrito}</span>
                        <span><b>Hora:</b> {this.props.hora}</span>
                    </li>
                }
                </>
        )
    }
}
