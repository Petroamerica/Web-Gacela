import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react';
import Marcador from './MarcadorMapa';
import PreSolicitud from './pre_solicitud';
import cerrar_modal from '../../../../assets/close.svg'
export default class cuadroMapa extends Component {
    static defaultProps = {
        center: { 
            lat: -12.046198828462366,
            lng: -77.04127501255363
        },
        zoom: 11
    };

    render() { 
        return (
            <div className="cuadroMapa">
                <div className="mapa">
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: "AIzaSyDrq4sz8y-iJt4wEOWpbdOFVGDy8XUQqbY" }}
                        defaultCenter={this.props.center}
                        defaultZoom={this.props.zoom}
                        onClick={(e)=>console.log(e)}
                    >
                    {
                        this.props.estadoMarcador 
                            ?   this.props.listaMarcadores.map((e, indice) => 
                                    <Marcador 
                                        indice = {indice+1}
                                        key={e.id_pasajero} 
                                        // lat={e.longitud} 
                                        // lng={e.latitud}
                                        lat={e.latitud} 
                                        lng={e.longitud}
                                        data={e}
                                        pre_solicitud={this.props.agreparPasajeros} 
                                    />) 
                            :   null
                    } 
                    </GoogleMapReact>
                    <div style={{width:'100%', backgroundColor:'black', display:'flex', justifyContent:'space-between', padding:'5px 4px'}}>
                        <span style={{color:'white'}}>{this.props.numero_servicio === "0" ? "Pasajeros sin servicio" : "servicio " + this.props.numero_servicio}</span>
                        <span style={{cursor:'pointer'}} onClick={()=>{this.props.mostrarMapa()}}><img src={cerrar_modal} width="15" alt="img" /></span>
                    </div>
                    
                </div>
                <div className="mapaSeleccion">
                    <ul>
                        {
                            this.props.pre_solicitud.map(index=> 
                                <PreSolicitud 
                                    key={index.id_pasajero} 
                                    id={index.id_pasajero} 
                                    quitarPasajero ={this.props.quitarPasajero} 
                                    nombre={index.descripcion_pasajero} 
                                    descripcion_distrito={index.descripcion_distrito}
                                    hora = {index.hora}
                                    numServicio = {index.numServicio}
                                    destino ={this.props.destino}
                                />
                            )
                        }
                        <div style={{display: 'flex', justifyContent:'space-around'}}>
                            <input type="button" id="botonReserva" value={this.props.btn_botonReserva} className="botonReserva" disabled={this.props.reservarStatus} onClick={()=>{this.props.agregarSolicitud()}} style={{width: '120px'}}/>
                        </div>
                    </ul>
                </div>
            </div>  
        )
    }
}
