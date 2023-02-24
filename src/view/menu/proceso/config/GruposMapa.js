import React, { Component } from 'react'
import '../../style.css'
export default class GruposMapa extends Component {
    render() {
        const {data} = this.props
        return (
            <div className="abajo-derecha">
                <div className="toltip">
                    {data.numServicio !== 0 ? data.numServicio : data.numViaje}
                    {this.props.numero_viaje || ''}
                </div>
                <div className="abajo-derecha1">
                   <label><b>Pasajero: </b>{data.descripcion_pasajero}</label>
                </div>  
            </div>
        )
    }
}
