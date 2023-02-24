import React, { Component } from 'react'
import loader from '../../../../assets/loader.gif'
import  ReactDatePicker  from 'react-datepicker'
import { global } from '../../../../global/global'
import {api} from '../../../../global/api'
import Tabla from './Tabla'
import swal from 'sweetalert'
export default class ReporteLiquidacion extends Component {

    state = {
        cliente: "",
        token: '',
        fechaI : new Date(),
        fechaII: new Date(),
        horaI : "",
        horaF : "",
        origen : "-",
        nro_servicio : "",
        costoTotal: 0,
        viewLoader : true,
        viewTabla: false,
        servicios: [],
        pasajeros: [],
        listaServicios: []
    }

    async componentDidMount(){
        const {estadoLocalStorage, token, name, id_cliente} = await global.obtenerDatosLocalStorage()
        if(estadoLocalStorage){
            this.setState({cliente: id_cliente, token, usuairo: name})
        }else{
            await swal("Mensaje", 'No se encontro información para hacer consultas al servidor.\nCerrar Sesión y volver a iniciar.', "error")
            this.setState({cliente: '', token: '', usuairo:''})
        }
    }

    seleccionarFecha = (e) =>{
        let fecha1 = e[0]
        let fecha2 = e[1]
        if(fecha1 !== this.state.fechaI){ this.setState({fechaI: fecha1}) }
        if(fecha2 !== this.state.fechaII){ this.setState({fechaII: fecha2}) }
    }

    cambiar = text =>{
        this.setState({[text.target.name]: text.target.value})
    }

    convertirFechas = (fecha) =>{
        let formatear = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate()
        return formatear;
    }

    obtenerPrecioTotal = () =>{
        let precioT = parseFloat(0.000)
        this.state.servicios.forEach((value)=>{
            value.data.forEach((subValue)=>{
                if(subValue.costo_pasajero !== null){
                    precioT = (parseFloat(precioT) + parseFloat(subValue.costo_pasajero))
                }
            })
        })
        return precioT
    }

    validarFormulario = async () =>{
        return await new Promise((resolve, reject) => {
            let resultado = false
            let mensaje = ''
            if(this.state.fechaI === null || this.state.fechaII === null){
                resultado = true
                mensaje = 'Error en las fechas.'
            }else if(this.state.nro_servicio !== ''){
                let patt = new RegExp(/[0-9]+/)
                if(!patt.test(parseInt(this.state.nro_servicio))){
                    resultado = true
                    mensaje = 'Error en el numero de servicio.'     
                }
            }else if(this.state.horaI !== "" ){
                let patt = new RegExp(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/)     
                if(!patt.test(this.state.horaI)){
                    resultado = true
                    mensaje = 'Error en la hora de inicio.'     
                }
            }else if(this.state.horaF !== ""){
                let patt = new RegExp(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/)     
                if(!patt.test(this.state.horaF)){
                    resultado = true
                    mensaje = 'Error en la hora final.'     
                }
            }
            if(this.state.nro_servicio === ""){
                this.setState({nro_servicio: 0})
            }
            if(this.state.horaI === "" || this.state.horaF === ""){
                this.setState({horaI: '-', horaF: '-'})
            }
            setTimeout(()=>{
                resolve([resultado, mensaje])
            }, 1000)
        })
    }

    btn_ProcesarReporte = async (e) =>{
        e.preventDefault()
        let resultado = await this.validarFormulario()
        if(resultado[0]){
            swal('Mensaje', resultado[1], 'info')
        }else{
            let fechaI = this.convertirFechas(this.state.fechaI)
            let fechaII = this.convertirFechas(this.state.fechaII)
            let _cabecera =  await api.reporteLiquidacionCabecera_fetch(this.state.token, this.state.cliente, fechaI, fechaII, this.state.origen, this.state.horaI, this.state.horaF, this.state.nro_servicio)
            _cabecera.map(value => value.fechaFormat = this.convertirFechas(new Date(value.fecha)))
            let _detalle =  await api.reporteLiquidacionDetalle_fetch(this.state.token, this.state.cliente, fechaI, fechaII, this.state.origen, this.state.horaI, this.state.horaF, this.state.nro_servicio)
            if(_cabecera.error || _detalle.error){
                if(!global.validarCookies()){ 
                    await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                    global.cerrarSesion() 
                }
                await swal("Mensaje",  _cabecera.error || _detalle.error)
                return
            }
            this.setState({pasajeros:_detalle, listaServicios: _cabecera})

            if(_cabecera.length < 1 || _detalle.length < 1){
                swal('Mensaje', 'No se encontraron resulados.')
            }else{
                let arregloFinal = []
                let servicios = this.state.pasajeros
                let formarArreglo = { data: [], cabecera: [], nro_servicio: 0 }
                let indexSeguido = _cabecera[0]['nro_servicio']
                let indexSeguidoFecha = _cabecera[0]['fecha']
                let nro_servicio = 0
                //let fecha = _detalle[0]['fecha']
                _cabecera.forEach((element, index) => {
                    if(element.nro_servicio === indexSeguido && element.fecha === indexSeguidoFecha){
                        formarArreglo.cabecera = element
                        formarArreglo.nro_servicio = element.nro_servicio
                    }else{
                        let res = []
                        servicios.forEach(value=>{
                            if(value.nro_servicio === nro_servicio && value.fecha === indexSeguidoFecha){ res.push(value) }
                        })
                        formarArreglo.data = res
                        arregloFinal.push(formarArreglo)
                        formarArreglo = { data: [], cabecera: [], nro_servicio: 0 }
                    }
                    if(element.nro_servicio !== indexSeguido || element.fecha !== indexSeguidoFecha){
                        formarArreglo.cabecera = element
                        formarArreglo.nro_servicio = element.nro_servicio
                    }
                    if((index+1) === _cabecera.length){
                        let res = []
                        servicios.forEach(value=>{
                            if(value.nro_servicio === element.nro_servicio && value.fecha === element.fecha){ res.push(value) }
                        })
                        formarArreglo.data = res
                        arregloFinal.push(formarArreglo)
                        formarArreglo.nro_servicio = element.nro_servicio
                    }
                    indexSeguido = element.nro_servicio
                    nro_servicio = element.nro_servicio
                    indexSeguidoFecha = element.fecha
                    //fecha = element.fecha
                });

                this.setState({servicios: arregloFinal, viewTabla: true})
                let total = this.obtenerPrecioTotal()
                this.setState({costoTotal: total})
            }
        }
    } 

    render() {
        return (
            <div>
                <p className="historial">Reporte &gt; Liquidacion</p>
                <div className="cuadro_REPORTE">
                    <form onSubmit={this.btn_ProcesarReporte} style={{textAlign:'center'}}>
                    <div>
                        <div className="col1" style={{justifyContent:'flex-start'}}>
                            <div style={{marginBottom:'15px'}}>
                                <span>Selecionar rango de fecha</span>
                                <ReactDatePicker dateFormat="yyyy/MM/dd"  selectsRange startDate={this.state.fechaI} endDate={this.state.fechaII} onChange={(e)=>this.seleccionarFecha(e)} />
                            </div>                       
                            <div style={{marginBottom:'15px', display:'flex'}}>
                                <div style={{lineHeight:'30px'}}>
                                    <span>Servicio</span>
                                    <select onChange={(e)=>this.setState({origen:e.target.value})} >
                                        <option value="-">Todo</option>
                                        <option value="e">Entrada</option>
                                        <option value="s">Salida</option>
                                    </select>
                                </div>
                                <div style={{lineHeight:'30px'}}>
                                    <span>Nro Servicio</span>
                                    <input type="text" 
                                        className="invalido"    
                                        style={{textAlign:'center'}} 
                                        name="nro_servicio" 
                                        pattern="[0-9]+" 
                                        maxLength="3"
                                        onChange={this.cambiar}/>
                                </div>
                            </div>
                            <div style={{marginBottom:'15px', display:'flex', justifyContent:'center'}}>
                                <div style={{lineHeight:'30px'}}>
                                    <span>Hora Inicio</span>
                                    <input type="text" 
                                        className="invalido"
                                        style={{textAlign:'center'}} 
                                        name="horaI" 
                                        pattern="^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$" 
                                        maxLength="5"
                                        onChange={this.cambiar}/>
                                </div>
                                <div style={{lineHeight:'30px'}}>
                                    <span>Hora Final</span>
                                    <input type="text" 
                                        className="invalido"
                                        style={{textAlign:'center'}} 
                                        name="horaF" 
                                        pattern="^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$" 
                                        maxLength="5"
                                        onChange={this.cambiar}/>
                                </div>
                            </div>
                            <div style={{marginBottom:'15px'}}>
                                {
                                    this.state.viewLoader ? <input type="submit" value="Emitir Reporte" /> : <span><img src={loader} alt="loader" width="35"/></span>
                                }
                            </div>
                        </div>
                    </div>
                    </form>
                </div>
                {
                    this.state.viewTabla ? 
                        <Tabla
                            servicios = {this.state.servicios}
                            costoTotal = {this.state.costoTotal}
                        />
                    : null
                }
            </div>
        )
    }
}
