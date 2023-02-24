import React, { Component } from 'react'
import usuairo from '../../../../assets/usuairo.svg'
import '../../style.css'

export default class MarcadorMapa extends Component {
    render() {
        const {data} = this.props
        return (
            <div className="abajo-derecha">
                <div className="toltip"> 
                <img src={usuairo} alt="icon" width="20"/>
                </div>
                <div className="abajo-derecha1">
                   <label><b>Pasajero: </b>{data._name}</label>
                </div>  
            </div>
        )
    }
}
