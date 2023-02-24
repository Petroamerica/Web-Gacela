import React, { Component } from 'react'
import '../styles.css'
import loader from '../../../../assets/loader.gif'
import MarcadorMapa from './MarcadorMapa'
import GoogleMapReact from 'google-map-react';

export default class NuevoPasajero extends Component {

    state = {
        maxLength_DI:8,
        lat: -12.046198828462366,
        lng: -77.04127501255363
    }

    static defaultProps = {
        center: { 
            lat: -12.046198828462366,
            lng: -77.04127501255363
        },
        zoom: 11
    };

    change_maxlength = e =>{
        switch (e.target.value) {
            case "PASAPORTE":
                this.setState({maxLength_DI: 12})
                break;
            default:
                this.setState({maxLength_DI: 8})
                this.props.arrayClient[0]['_cod'] = ""
                break;
        }
    }

    render() {
        const nameFrom =  this.props.changePassenger === 1 ? 'Crear' : 'Actualizar'
        return (
            <form className="Pasajero_form" onSubmit={(e)=>this.props.formBtn(e)}>
                <div className="carasFormulario">
                    <div  className="filasFormulario">
                        <label className="labelFormulario">Tipo de documento</label>
                        <select name="_doc" className="selectFormulario" 
                            value={this.props.arrayClient[0] ? this.props.arrayClient[0]['_doc'] : null} 
                            onChange={(e)=>{
                                this.props.changeText(e);
                                this.change_maxlength(e)
                            }}
                            disabled={!this.props.Inputs['_docInput'] ? false: true}
                            required
                            >
                            <option defaultValue="_doc_NA" value="_doc_NA">Seleccionar..</option>
                            <option defaultValue="DNI" value="DNI">DNI</option>
                            <option defaultValue="PASAPORTE" value="PASAPORTE">PASAPORTE</option>
                        </select>
                    </div>
                    <div className="filasFormulario">
                        <label className="labelFormulario">Documento de identidad</label>
                        <input type="text" name="_cod" className="inputFormulario invalido"
                            value={this.props.arrayClient[0] ? this.props.arrayClient[0]['_cod'] : null} 
                            onChange={this.props.changeText}
                            disabled={!this.props.Inputs['_codInput'] ? false: true}
                            required
                            autoComplete="off"
                            maxLength = {this.state.maxLength_DI}
                            pattern={"[0-9]{"+this.state.maxLength_DI+"}"}
                            style={{textTransform:'uppercase'}}
                            />
                            {
                                this.props.newArrayPassenger.length > 0 ? 
                                    <div className="listPassenger">
                                    {
                                        this.props.newArrayPassenger.map( value =>
                                            <span style={{cursor:'pointer', overflow:'hidden', whiteSpace:'nowrap', minHeight: '25px', borderRadius: '4px', border: '1px solid #1A1C20', color:'#1A1C20', margin:'3px', padding:'4px'}} key={value.id_pasajero} 
                                                onClick={(value)=>this.props.selectPassenger(value)} id={[value.id_pasajero,value.id_cliente,value.id_tipo_di]}>
                                                    {value.id_pasajero} - {value.descripcion}
                                            </span>
                                        )
                                    }
                                    </div>
                                : null 
                            }
                            
                        <div style={{display:'flex', marginTop: '5px', justifyContent:'space-around'}}>
                            {
                                this.props.stateBtnSearch ? <input type="button" value="Buscar" className="BtnCodigo"  onClick={()=>this.props.searchCLient()}/>
                                : <span> <img src={loader} width="30" alt="loader"/></span>
                            }
                            
                            <input type="button" className="BtnCodigo" value="Nuevo" onClick={()=> this.props.cleanBtn()}/>
                        </div>
                    </div>
                    <div className="filasFormulario">
                        <label className="labelFormulario">Nombres</label>
                        <input type="text" name="_name" className="inputFormulario invalido" 
                            value={this.props.arrayClient[0]['_name'] ? this.props.arrayClient[0]['_name'] : ''} 
                            maxLength="80"
                            onChange={this.props.changeText}
                        />
                    </div>
                    <div className="filasFormulario">
                        <label className="labelFormulario">Direccion</label>
                        <input type="text" name="_address"  className="inputFormulario" 
                            value={this.props.arrayClient[0]['_address'] ? this.props.arrayClient[0]['_address'] : ''} 
                            maxLength="120"
                            onChange={this.props.changeText}/>
                    </div>
                    <div className="filasFormulario">
                        <label className="labelFormulario">Area</label>
                        <select name="_area" className="selectFormulario" 
                            value={this.props.arrayClient[0]['_area'] ? this.props.arrayClient[0]['_area'] : ''} 
                            onChange={this.props.changeText}>
                            <option defaultValue="" value="">Seleccionar..</option>
                            {
                                this.props.allArea.map((value)=> 
                                <option key={value.id_area} value={value.id_area} defaultValue={value.id_area} >{value.descripcion}</option>
                                )
                            }
                        </select>
                    </div> 
                </div>

                <div className="carasFormulario">
                    <div className="filasFormulario">
                        <label className="labelFormulario">Zonas (Localidad)</label>
                        <select className="selectFormulario"  name="_district"
                            value={this.props.arrayClient[0]['_district'] ? this.props.arrayClient[0]['_district'].toString() : ''} 
                            onChange={this.props.changeText}>
                                <option value="" defaultValue="" >Seleccionar..</option>
                                {
                                    this.props.arrayDistrict.map((value)=> 
                                    <option key={value.id_distrito} value={value.id_distrito} defaultValue={value.id_distrito} >{value.id_distrito}</option>
                                    )
                                }
                        </select>
                    </div>
                    <div className="filasFormulario">
                        <label className="labelFormulario">Latitud</label>
                        <input type="text" name="_lat" className="inputFormulario invalido" 
                            value={this.props.arrayClient[0]['_lat'] ? this.props.arrayClient[0]['_lat'] : ''} 
                            maxLength="15"
                            pattern="[0-9.-]{0,15}"
                            onChange={this.props.changeText}/>
                    </div>
                    <div className="filasFormulario">
                        <label className="labelFormulario">Longitud</label>
                        <input type="text" name="_lon"  className="inputFormulario" 
                            value={this.props.arrayClient[0]['_lon'] ? this.props.arrayClient[0]['_lon'] : ''}  
                            maxLength="15"
                            pattern="[0-9.-]{0,15}"
                            onChange={this.props.changeText}/>
                    </div>
                    <div className="filasFormulario">
                        <label className="labelFormulario">Celular</label>
                        <input type="text" name="_phone"  className="inputFormulario invalido" 
                            value={this.props.arrayClient[0]['_phone'] ? this.props.arrayClient[0]['_phone'] : ''} 
                            //pattern="[0-9]{3}[-][0-9]{3}[-][0-9]{3}"
                            onChange={this.props.changeText}/>
                    </div>

                    <div className="filasFormulario">
                        {
                            this.props.stateBtnForm ? 
                                <input type="submit" value={nameFrom} className="FormularioCrear"/>
                            : <span> <img src={loader} width="30"  alt="loader"/></span>
                        }
                    </div>
                </div>
                        
                <div className="carasFormulario"  style={{width:'30%'}}>
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: "AIzaSyDrq4sz8y-iJt4wEOWpbdOFVGDy8XUQqbY" }}
                        defaultCenter={this.props.center}
                        defaultZoom={this.props.zoom}
                        //center =   { { lat: this.props.lng , lng: this.props.lat} }
                        center =   { { lat: this.props.lat , lng: this.props.lng} }
                        onClick={(e)=>console.log(e)}
                    >
                    {
                        this.props.arrayClient[0] !== undefined ? 
                            //<MarcadorMapa lat={this.props.arrayClient[0]['_lon']} lng={this.props.arrayClient[0]['_lat']} data={this.props.arrayClient[0]} />
                            <MarcadorMapa lat={this.props.arrayClient[0]['_lat']} lng={this.props.arrayClient[0]['_lon']} data={this.props.arrayClient[0]} />
                        : null
                    }
                    </GoogleMapReact>
                </div>

            </form>
        )
    }
}