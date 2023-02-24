import React, { Component } from 'react'
import '../../style.css'
export default class MarcadorMapa extends Component {
    render() {
        const {data} = this.props
        return (
            <div className="abajo-derecha" onClick={()=>{this.props.pre_solicitud(data)}}>
                <div className="toltip">
                    {this.props.indice}
                </div>
                <div className="abajo-derecha1">
                   <span><b>Pasajero: </b>{data.descripcion_pasajero}</span>
                </div>  
            </div>
        )
    }
}
