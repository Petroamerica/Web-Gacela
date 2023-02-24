import React, { Component } from 'react'
import NuevoPasajero from './NuevoPasajero'
//import MarcadorMapa from './MarcadorMapa'
import { global } from '../../../../global/global'
import { api } from '../../../../global/api'
import swal from 'sweetalert'
import {exportar} from './exportarExcel'
//import GoogleMapReact from 'google-map-react';

export default class Pasajero extends Component {

    state={
        token: '',
        mensajeError: "",
        arrayClient: [{
            _cod : '',
            _cli: '_cli_NA',
            _doc: '_doc_NA',
            _name: '',
            _address: '',
            _district: '',
            _lat: '',
            _lon: '',
            _phone: '',
            _area: ''
        }],
        Inputs:{ _cliInput: false, _docInput: false, _codInput: false },
        display:true,
        stateBtnSearch: true,
        stateBtnForm: true,
        changePassenger: 1,
        arrayDistrict: [],
        arrayClientAll: [],
        arrayPassenger: [],
        newArrayPassenger: [],
        allArea: [],
        cliente: '',
        descrip_cliente:'',
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

    async componentDidMount(){
        const {estadoLocalStorage, descripcion, id_cliente, token} = await global.obtenerDatosLocalStorage()
        if(estadoLocalStorage){
            this.setState({cliente: id_cliente, descrip_cliente : descripcion, token})    
            await this.searchPassenger_Client_Area(id_cliente)
            const arrayDistrict =  await api.searchDistrict_fetch(token)
            if(arrayDistrict.error){
                if(!global.validarCookies()){
                    await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                    global.cerrarSesion()
                }
                return
            }
            this.setState({arrayDistrict:arrayDistrict}) 
        }else{
            await swal("Mensaje", 'No se encontro información para hacer consultas al servidor.\nCerrar Sesión y volver a iniciar.', "error")
            this.setState({cliente: '', descrip_cliente : '', token:''})    
        }
    }

    searchCLient = async () =>{
        let cli = this.state.arrayClient[0]['_cli']
        let cod = this.state.arrayClient[0]['_cod']
        let doc = this.state.arrayClient[0]['_doc']
        if(cli !== "_cli_NA" && cod !== "" && doc !== '_doc_NA'){
            let search = this.state.arrayPassenger.filter((value) => (value.id_pasajero === cod && value.id_cliente === cli  && value.id_tipo_di === doc) )
            if(search.length>0){
                this.setState({arrayClient: [{
                    _cod: search[0]['nro_di'],
                    _cli: search[0]['id_cliente'],
                    _doc: search[0]['id_tipo_di'],
                    _name: search[0]['descripcion'],
                    _address: search[0]['direccion'],
                    _district: search[0]['id_distrito'],
                    _lat: search[0]['latitud'],
                    _lon: search[0]['longitud'],
                    _phone: search[0]['celular'],
                    _area: search[0]['id_area']
                }], Inputs: {
                    _cliInput: true,
                    _docInput: true,
                    _codInput: true,
                }, changePassenger: 2,
                lat: parseFloat(search[0]['latitud']), 
                lng: parseFloat(search[0]['longitud'])
            })
            }
        }else{
            swal("Mensaje","Debe seleccionar o ingresar de manera correcta los campos anteriore.", "info")
        }
    }
    
    cleanBtn = () =>{
        this.setState({
            arrayClient: [{
                _cod : '',
                _cli: '_cli_NA',
                _doc: '_doc_NA',
                _name: '',
                _address: '',
                _district: '_district_NA',
                _lat: '',
                _lon: '',
                _phone: '',
                _area: ''
            }],
            Inputs:{
                _cliInput: false,
                _docInput: false,
                _codInput: false,
            },
            newArrayPassenger:[],
            changePassenger: 1,
        })
    }
    
    formBtn = async (e) =>{
        e.preventDefault()
        const newPassenger = {
            id_cliente: this.state.cliente,
            id_pasajero: this.state.arrayClient[0]['_cod'],
            descripcion: this.state.arrayClient[0]['_name'],
            id_tipo_di: this.state.arrayClient[0]['_doc'] === '' ? null : this.state.arrayClient[0]['_doc'],
            nro_di: this.state.arrayClient[0]['_cod'] === '' ? null : this.state.arrayClient[0]['_cod'],
            direccion: this.state.arrayClient[0]['_address'] === '' ? null : this.state.arrayClient[0]['_address'],
            id_distrito: this.state.arrayClient[0]['_district'] === '' ? null : this.state.arrayClient[0]['_district'],
            latitud: this.state.arrayClient[0]['_lat'] === '' ? null : this.state.arrayClient[0]['_lat'],
            longitud: this.state.arrayClient[0]['_lon'] === '' ? null : this.state.arrayClient[0]['_lon'],
            celular: this.state.arrayClient[0]['_phone'] === '' ? null : this.state.arrayClient[0]['_phone'],
            id_area: this.state.arrayClient[0]['_area'] === '' ? null  : this.state.arrayClient[0]['_area']
        }
        if(newPassenger['id_cliente'] !== "_cli_NA" &&  newPassenger['id_tipo_di'] !== "_doc_NA"){
            this.setState({stateBtnForm: false})
            const _function = this.state.changePassenger === 1 ? 
                await api.createPassenger_fetch(this.state.token, newPassenger) : 
                await api.updatePassenger_fecth(this.state.token, newPassenger['id_cliente'], newPassenger['id_pasajero'], newPassenger)
            if(_function.error){
                if(!global.validarCookies()){
                    await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                    global.cerrarSesion()
                }
                await swal("Mensaje", _function.error)
                this.setState({stateBtnForm: true})
                return
            }
            if(_function.status !== 200){
                swal("Mensaje","Ocurrio un error al momento de ingresar los datos, validar e ingresar nuevamente.", "error")
                this.setState({stateBtnForm: true})
                return
            }
            swal("Mensaje","Datos del pasajero ingresados satisfactoriamente.", "success")
            await this.searchPassenger_Client_Area(this.state.cliente)
            this.cleanBtn()
            this.setState({stateBtnForm: true})
        }else{
            swal("Mensaje","Debe seleccionar un tipo de cliente o documento adecuado.", "info")
        }
        
    }
    
    selectPassenger = (val) =>{
        let arrayVal = val.target.id
        let splitVal = arrayVal.split(',')
        this.state.arrayClient.map((valor)=>  
            (
                (
                    (valor['_cod'] = splitVal[0]) , valor['_cli'] = splitVal[1], (valor['_doc'] = splitVal[2])
                )
            )
        )
        this.setState({newArrayPassenger: []})
    }

    searchPassenger_Client_Area = async (cli) =>{
        const listPassanger = await api.passanger_fetch(this.state.token, cli)
        const searchArea =  await api.searchArea_fetch(this.state.token, cli)
        if(listPassanger.error || searchArea.error){
            if(!global.validarCookies()){
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion()
            }
            return
        }
        this.setState({arrayPassenger: listPassanger, allArea:searchArea})
        
    }

    changeText = text => { 
        let id = [text.target.name]
        if(id[0] === "_cod" && text.target.value.length > 0){
            this.searchPassenger(text.target.value)
        }
        else if(id[0] === "_cod" && text.target.value.length < 1){
            this.setState({newArrayPassenger: []})
        }
        this.state.arrayClient.map(valor=> valor[id] = text.target.value )
        this.setState({arrayClient: this.state.arrayClient})
    }

    searchPassenger = (value) =>{
        const nuevo = this.state.arrayPassenger.filter((val) =>  val.id_pasajero.indexOf(value) !== -1 ||  val.descripcion.indexOf(value.toUpperCase()) !== -1 )
        this.setState({newArrayPassenger: nuevo})
    }

    exportarExcel = () =>{
        exportar.reporteXlsx(this.state.arrayPassenger, this.state.descrip_cliente)
    }

    render() {
        return (
            <div>
                <p className="historial">Mantenimiento &gt; Pasajeros</p>
                <div className="cuadro_mantenimiento">
                    <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', lineHeight:'3rem'}}>
                        <div>
                            <button className='botonAddChofer' onClick={this.exportarExcel}>
                                Exportar
                            </button>
                        </div>
                    </div>
                    
                    <hr size="1" style={{margin:'20px 0px', opacity:'0.5'}} />

                    <NuevoPasajero 
                        arrayClient={this.state.arrayClient} 
                        searchCLient={this.searchCLient} 
                        formBtn={this.formBtn} 
                        changeText={this.changeText}
                        Inputs={this.state.Inputs}
                        arrayDistrict={this.state.arrayDistrict}
                        cleanBtn={this.cleanBtn}
                        arrayClientAll={this.state.arrayClientAll}
                        stateBtnSearch = {this.state.stateBtnSearch}
                        stateBtnForm = {this.state.stateBtnForm}
                        newArrayPassenger = {this.state.newArrayPassenger}
                        selectPassenger = {this.selectPassenger}
                        changePassenger = {this.state.changePassenger}
                        allArea = {this.state.allArea}
                        lng = {this.state.lng}
                        lat = {this.state.lat}
                        />
                </div>
                {
                    /*
                    <div style={{display:'flex', flexDirection:'column', width:'100%', height:'43vh', padding:'0px 5px'}}>
                    <GoogleMapReact
                        bootstrapURLKeys={{ key: "AIzaSyDrq4sz8y-iJt4wEOWpbdOFVGDy8XUQqbY" }}
                        defaultCenter={this.props.center}
                        defaultZoom={this.props.zoom}
                        center =   { { lat: this.state.lng, lng: this.state.lat} }
                        onClick={(e)=>console.log(e)}
                    >
                    {
                        this.state.arrayClient[0] !== undefined ? 
                            <MarcadorMapa lat={this.state.arrayClient[0]._lon} lng={this.state.arrayClient[0]._lat} data={this.state.arrayClient[0]} />
                        : null
                    }
                    </GoogleMapReact>
                </div>
                   */ 
                }
                
            </div>
        )
    }
}