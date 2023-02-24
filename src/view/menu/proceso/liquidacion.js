import React, { Component } from 'react'
import '../style.css'
import { global } from '../../../global/global'
import {api} from '../../../global/api'
import loader from '../../../assets/loader.gif'
import TablaLiquidacion from './config/TablaLiquidacion'
import swal from 'sweetalert'

export default class liquidacion extends Component {

    
    state = {
        user: '',
        token: '',
        usuario: "",
        cliente: "",
        arrayClientAll: [],
        servicios: [],
        aerolinea:[],
        price: [],
        ffat:[],
        pasajeros: [],
        listPassanger: [],
        listaReprogramado:[],
        listaChofer: [],
        filtroChofer: [],
        listaAuto: [],
        filtroAuto: [],
        listaServicios: [],
        servicioReprogramados: [],
        listArea: [],
        fechaI:"",
        origen:"",
        horaI : "",
        horaF: "",
        viewLoader:true,
        tablaLiquidacion: false,
        costoTotal: 0.000,
        validarMaximoPasajeros: 0,
        numero_servicio: 0,
        numeroServicio: 0,
    }

    async componentDidMount(){
        /*const data = await JSON.parse(localStorage.getItem('data'))
        this.setState({cliente: data[0]['id_cliente'], usuario: data[1]['name'], servicios: []})*/
        const {estadoLocalStorage, name, id_cliente, token} = await global.obtenerDatosLocalStorage()
        if(estadoLocalStorage){
            this.setState({cliente: id_cliente, user: name, usuario : name, token, servicios: []})
            const searchffat   = await api.searchFFTA_fetch(token)
            const searchChofer = await api.searchUnidadesChofer_fetch(token,'chofer','01')
            const searchUnidad = await api.searchUnidadesChofer_fetch(token,'unidad','01')
            const searchArea =  await api.searchArea_fetch(token, id_cliente)
            if(searchffat.error || searchChofer.error || searchUnidad.error || searchArea.error)  {
                if(!global.validarCookies()){ 
                    await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                    global.cerrarSesion() 
                }
                await swal("Mensaje", searchffat.error || searchChofer.error || searchUnidad.error || searchArea.error, "error")
                return
            }
            this.setState({ffat:searchffat, listaChofer: searchChofer, listaAuto: searchUnidad, listArea: searchArea})  
        }else{
            await swal("Mensaje", 'No se encontro información para hacer consultas al servidor.\nCerrar Sesión y volver a iniciar.', "error")
            this.setState({cliente: '', user: '', usuario : '', token:''})
        }
    }
    
    todosPasajeros = async () =>{
        const listPassanger = await api.passangerProgramacion_fetch(this.state.token, this.state.cliente)
        if(listPassanger.error)  {
            if(!global.validarCookies()){ 
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion() 
            }
            await swal("Mensaje", listPassanger.error, "error")
            return
        }
        this.setState({listPassanger: listPassanger})
    }

    validarPrecio = (cant) =>{
        for (let index = 0; index < this.state.price.length; index++) {
            if(this.state.price[index].min_rango <= parseInt(cant) && this.state.price[index].max_rango >= parseInt(cant)){
                return  [this.state.price[index].precio, this.state.price[index].id_tipo_servicio]
            }
        }
    }

    insertPrice = async (arregloFinal) =>{
        try{
            let precioT = parseFloat(0.00)
            arregloFinal.map((value)=> {
                let flag0 = value.data.filter(subValue => this.validateFlgFacturable(subValue.id_tipo_estado_mov) !== '0' && subValue.id_tipo_estado_mov !== null )
                value.data.map((valores) =>{
                    let valid = this.validarPrecio(flag0.length === 0 ? 1 : flag0.length)
                    if(valores.id_tipo_estado_mov !== null && valores.costo_pasajero !== "0.000"){
                        let precioParticionado = (parseFloat(valid[0]).toFixed(3)/(flag0.length === 0 ? 1 : flag0.length))
                        valores.costo_pasajero = precioParticionado.toFixed(3)
                        valores.id_tipo_servicio = valid[1]
                        precioT = (parseFloat(precioT) + parseFloat(precioParticionado))
                    }else{
                        valores.id_tipo_servicio = '-'
                    }
                    return null
                })
                return null
            })
            this.setState({costoTotal: precioT})
            return arregloFinal
        }catch(err){
            console.log(err)
        }
    }

    onsubmit = async (e) =>{
        e.preventDefault()       
        var patt = new RegExp(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/)     
        if(this.state.fechaI  &&  this.state.cliente && this.state.origen && this.state.origen !== '_ori_NA' && patt.test(this.state.horaI) && patt.test(this.state.horaF)){
            this.setState({viewLoader: false, costoTotal: 0.00})
            const searchPrice = await api.searchPrices_fetch(this.state.token, this.state.cliente,this.state.fechaI)
            const listPassanger =  await api.searchListaPasajero(this.state.token, this.state.cliente, this.state.fechaI, this.state.origen, this.state.horaI, this.state.horaF, 'b')
            const listAerolinea =  await api.searchAerolineafetch(this.state.token, this.state.cliente)
            const listaServicios =  await api.searchServiciosfetch(this.state.token, this.state.cliente, this.state.fechaI, this.state.origen, this.state.horaI, this.state.horaF)
            const numeroServicio = await api.searchNumeroServicio_fetch(this.state.token, this.state.cliente, this.state.fechaI)
            const listaReprogramados = await api.searchListaReprogramados_fetch(this.state.token, this.state.cliente, this.state.fechaI, this.state.origen)
            if(searchPrice.error || listPassanger.error || listAerolinea.error || listaServicios.error || numeroServicio.error){
                this.setState({viewLoader: true})
                if(!global.validarCookies()){ 
                    await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                    global.cerrarSesion() 
                }
                swal("Mensaje", searchPrice.error || listPassanger.error || listAerolinea.error || listaServicios.error || numeroServicio.error, "error")
                return
            }
            if(listaServicios.length < 1 || listPassanger.length < 1){
                this.setState({viewLoader: true})
                swal("Mensaje", "No se encontraron servicios programados.", "error")
                return
            }
            if(searchPrice.length < 1){
                this.setState({viewLoader: true})
                swal("Mensaje", "No se encontro registros de tarifa.", "error")
                return
            }
            listPassanger.map(value => ((value.costo_pasajero =  parseFloat(value.costo_pasajero).toFixed(3), value.id_tipo_estado_mov === null ? value.id_tipo_estado_mov = 'AC' : null )))
            this.setState({numeroServicio: numeroServicio[0].campo, price: searchPrice, pasajeros:listPassanger, aerolinea: listAerolinea, listaServicios: listaServicios})
            let arregloFinal = []
            let pasajeros = this.state.pasajeros
            let formarArreglo = { data: [], cabecera: [], nro_servicio: 0 }
            let indexSeguido = listaServicios[0]['nro_servicio']
            let nro_servicio = 0
            listaServicios.forEach((element, index) => {
                if(element.nro_servicio === indexSeguido){
                    formarArreglo.cabecera = element
                    formarArreglo.nro_servicio = element.nro_servicio
                }else{
                    let res = []
                    pasajeros.forEach(value=>{
                        if(value.nro_servicio === nro_servicio){ res.push(value) }
                    })
                    formarArreglo.data = res
                    arregloFinal.push(formarArreglo)
                    formarArreglo = { cabecera: [], data: [], nro_servicio: 0 }
                }
                if(element.nro_servicio !== indexSeguido){
                    formarArreglo.cabecera = element
                    formarArreglo.nro_servicio = element.nro_servicio
                }
                if((index+1) === listaServicios.length){
                    let res = []
                    pasajeros.forEach(value=>{
                        if(value.nro_servicio === element.nro_servicio){ res.push(value) }
                    })
                    formarArreglo.data = res
                    arregloFinal.push(formarArreglo)
                    formarArreglo.nro_servicio = element.nro_servicio
                }
                indexSeguido = element.nro_servicio
                nro_servicio = element.nro_servicio
            });
            const arreglo = await this.insertPrice(arregloFinal)
            this.setState({servicios: arreglo, tablaLiquidacion: true})
            let total = this.obtenerPrecioTotal()
            this.setState({costoTotal: total})
            let nuevoArregloListaProgramados = []
            for (let index = 0; index < listaReprogramados.length; index++) {
                nuevoArregloListaProgramados.push({servicio: listaReprogramados[index].nro_servicio, codigo:listaReprogramados[index].id_pasajero, nombre: listaReprogramados[index].descripcion})
            }
            this.setState({listaReprogramado:nuevoArregloListaProgramados})
            this.setState({viewLoader: true})
        }else{
            console.log('falta un dato')
        }
    }

    quitarReprogramados = (id_pasaj) =>{
        let RE = this.state.listaReprogramado.filter( value => value.codigo.toString() !== id_pasaj.toString())
        this.setState({listaReprogramado: RE})
    }

    validateFlgFacturable = (name) =>{
        for (let index = 0; index < this.state.ffat.length; index++) {
            if(this.state.ffat[index].id_tipo_estado_mov === name){
                return  this.state.ffat[index].flg_facturable
            }
        }
    }

    obtenerPrecioTotal = () =>{
        let precioT = parseFloat(0.000)
        this.state.servicios.forEach((value)=>{
            value.data.forEach((subValue)=>{
                if (subValue.costo_pasajero !== "" && subValue.costo_pasajero !== "NaN" ) {
                    precioT = (parseFloat(precioT) + parseFloat(subValue.costo_pasajero))
                }
            })
        })
        return precioT
    }

    modificarFFAT = (id, name, key) =>{
        this.state.servicios[key].data.map((valores) =>{
            if(valores.id_pasajero === id) {
                valores.id_tipo_estado_mov = name
                let flag = this.validateFlgFacturable(name)
                if(flag === '0'){
                    valores.costo_pasajero = parseFloat(0.00).toFixed(3)
                    valores.id_tipo_servicio = '-'
                }else{
                    let valid = this.validarPrecio(this.state.servicios[key].data.length)
                    let precioParticionado = (parseFloat(valid[0]).toFixed(3)/this.state.servicios[key].data.length)
                    valores.costo_pasajero = precioParticionado.toFixed(3)
                    valores.id_tipo_servicio = valid[1]
                }
            }
           return null
        })
        let flag0 = this.state.servicios[key].data.filter(value => this.validateFlgFacturable(value.id_tipo_estado_mov) !== '0' && value.id_tipo_estado_mov !== null )
        this.state.servicios[key].data.map((valores) =>{
            let valid = this.validarPrecio(flag0.length === 0 ? 1 : flag0.length)
            if(valores.id_tipo_estado_mov !== null && valores.costo_pasajero !== "0.000"){
                let precioParticionado = (parseFloat(valid[0]).toFixed(3)/(flag0.length === 0 ? 1 : flag0.length))
                valores.costo_pasajero = precioParticionado.toFixed(3)
                valores.id_tipo_servicio = valid[1]
            }
            return null
        })
        this.setState({servicios: this.state.servicios})
        let total = this.obtenerPrecioTotal()
        this.setState({costoTotal: total})
    }

    modificarAerolinea = (id, name, key) =>{
        this.state.servicios[key].data.map((valores) =>
            valores.id_pasajero === id ? valores.id_cuenta = name : null
        )
        this.setState({servicios: this.state.servicios})
    }

    modificarArea = (id, name, key) =>{
        this.state.servicios[key].data.map((valores) =>
            valores.id_pasajero === id ? valores.id_area = name : null
        )
        this.setState({servicios: this.state.servicios})
    }

    changeText = async (text, nro_servicio) => { 
        let value = [text.target.value]
        let name = text.target.name
        let values = [text.target.id][0].split(',')
        if(name === "id_cuenta"){
            this.modificarAerolinea(values[1], value[0], values[0])
        }else if(name === "id_area"){
            this.modificarArea(values[1], value[0], values[0])
        }else if(name === "id_tipo_estado_mov"){
            this.modificarFFAT(values[1], value[0], values[0])
            if('RE' === value[0]){
                this.setState({listaReprogramado:[...this.state.listaReprogramado, {servicio: values[2], codigo:values[1], nombre: values[3], distrito: values[4]}]})
            }else{
                this.quitarComentario(values[1], values[0])
                console.log(this.state.listaReprogramado)
                const nueva_listaReprogramado = this.state.listaReprogramado.filter(value => value.codigo !== values[1])
                this.setState({listaReprogramado: nueva_listaReprogramado})
            }
            await this.actualizar_estadoMovilizacion(values)
        }
        this.agregarServiciosReprogramados(nro_servicio)
    }

    cambiarHoraCabecera = (text, nro_servicio ) =>{
        this.state.servicios.map(value => value.cabecera.nro_servicio === nro_servicio ? value.cabecera.hora_inicio = text.target.value : null)
        this.setState({servicios: this.state.servicios})
        this.agregarServiciosReprogramados(nro_servicio)
    }

    cambiarHoraDetalle = (text, ordenCabecera, ordenDetalle, nro_servicio) =>{
        this.state.servicios[ordenCabecera].data.map((value, key) => value.hora = text.target.value )
        this.setState({servicios: this.state.servicios})
        this.agregarServiciosReprogramados(nro_servicio)
    }

    nuevoPasajeroServicio = async (pasajero, hora, posicion, erolinea, ffat) =>{
        const validarPasajero = this.state.pasajeros.filter(value => value.id_pasajero === pasajero[0].id_pasajero)
        let orden_recojo = this.state.servicios[posicion].data.length
        let nro_servicio = this.state.servicios[posicion].cabecera.nro_servicio
        let _buscarPasajeroxHora = this.buscarPasajeroxHora(hora, pasajero[0].id_pasajero)
        if(_buscarPasajeroxHora && validarPasajero[0].id_tipo_estado_mov !== 'RE'){
            //ESTA EN EL SERVICIO Y NO ESTA COMO REPROGRAMADO
            //console.log('ESTA EN EL SERVICIO Y NO ESTA COMO REPROGRAMADO')
            swal("Mensaje", "No se puede ingresar a este pasajero porque no esta con el estado 'Reprogramado'.", "error")
        }else if(_buscarPasajeroxHora && validarPasajero[0].id_tipo_estado_mov === 'RE'){
            //ESTA EN EL SERVICIO Y SI  ESTA COMO REPROGRAMADO
            //console.log('ESTA EN EL SERVICIO Y SI  ESTA COMO REPROGRAMADO')
            await this.agregarNuevoPasajeroBD(pasajero, hora, erolinea, ffat, posicion, orden_recojo, nro_servicio)
            this.agregarServiciosReprogramados(nro_servicio)
        }else{
            //QUE PASE
            //console.log('QUE PASE')
            await this.agregarNuevoPasajeroBD(pasajero, hora, erolinea, ffat, posicion, orden_recojo, nro_servicio)
            this.agregarServiciosReprogramados(nro_servicio)
        }
        /*if(validarPasajero.length > 0 && validarPasajero[0].id_tipo_estado_mov === 'RE'){
            const validarPasajeroServicio = this.state.servicios[posicion].data.filter(value => value.id_pasajero.toString() === pasajero[0].id_pasajero.toString())
            if(validarPasajeroServicio.length > 0){
                swal("Mensaje", "Este pasajero ya se encuentra en este servicio", "error")
            }else{        
                this.agregarNuevoPasajeroBD(pasajero, hora, erolinea, ffat, posicion, orden_recojo, nro_servicio)
            }
        }else if(validarPasajero.length > 0 && validarPasajero[0].id_tipo_estado_mov !== 'RE'){
            swal("Mensaje","El pasajero debe tener el estado de movilizacion 'Reprogramado'.", "error")
        }else{
            this.agregarNuevoPasajeroBD(pasajero, hora, erolinea, ffat, posicion, orden_recojo, nro_servicio)
        }*/
    }
    
    buscarPasajeroxHora = (hora_cabecera, id_pasajero) => {
        let buscarPasajeroxHora = false
        this.state.servicios.forEach(value => {
            value.data.forEach(subValue => {
                if(subValue.hora === hora_cabecera && subValue.id_pasajero === id_pasajero){
                    buscarPasajeroxHora = true
                }
            })
        })
        return buscarPasajeroxHora
    }

    agregarNuevoPasajeroBD = async (pasajero, hora, erolinea, ffat, posicion, orden_recojo, nro_servicio) =>{
        let cantidad_preci = this.state.price.length
        let maxi_price = this.state.price[cantidad_preci-1].max_rango
        if(this.validarCantidadArreglo(this.state.servicios, posicion, maxi_price)){
            swal('Mensaje', 'Estas excediendo el numero de pasajeros', 'info')
        }else{
            pasajero.map(value => ((
                value['estado'] = false, 
                value['Orden_recojo'] = (orden_recojo+1), 
                value['orden_recojo'] = (orden_recojo+1), 
                value['nro_servicio'] = nro_servicio,
                value['hora'] = hora, 
                value['descripcion_pasajero']= value.descripcion,
                value['descripcion_distrito'] = value.id_distrito,
                value['id_tipo_estado_mov'] = ffat,
                value['id_cuenta'] = erolinea === "" ? null : erolinea,
                value['fecha'] = this.state.fechaI,
                value['origen'] = this.state.origen,
                value['usuario'] = this.state.usuario.toUpperCase()
            )))
            
            const res = await api.saveServices_fetch(this.state.token, pasajero, 'i')
            if(res.error){
                if(!global.validarCookies()){
                    await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                    global.cerrarSesion()
                }
                await swal("Mensaje", res.error  ,"error")
                return
            }

            if(res.status !==200){
                swal("Mensaje","No se inserto el nuevo pasajero.", "error")
                return
            }

            this.state.pasajeros.push(pasajero[0])
            this.state.servicios[posicion].data.push(pasajero[0])
            this.setState({servicios: this.state.servicios})
            this.modificarFFAT(pasajero[0].id_pasajero, ffat, posicion)
            this.quitarReprogramados(pasajero[0].id_pasajero)
            
        }
    }

    agregarComentario = (pasajero, posicion, comentario) =>{
        let key = [posicion['key']]
        this.state.servicios[key].data.map((value )=> value.id_pasajero === pasajero.id_pasajero ? value['comentario'] = comentario : null )
        this.setState({servicios: this.state.servicios})
        swal("Mensaje", "Se modifico satisfactoriamente", "success")
        this.agregarServiciosReprogramados(pasajero.nro_servicio)
    }

    quitarComentario = (codigo, posicion)=>{
        this.state.servicios[posicion].data.map((value )=> value.id_pasajero === codigo ? value['comentario'] = '' : null )
        this.setState({servicios: this.state.servicios})
    }

    //Obtener datos del chofer
    buscarListaChofer = (text, key,nro_servicio) =>{
        let id = [text.target.name]
        this.state.servicios.map(values => values.nro_servicio === nro_servicio ? ((values.cabecera.id_chofer = text.target.value, values.cabecera.descripcion = "")) : null)
        if(id[0] === "_chofer" && text.target.value.length > 0){
            this.filtrarChoferAuto(text.target.value, 1)
            this.setState({numero_servicio:key, filtroAuto: []})
        }else if(id[0] === "_chofer" && text.target.value.length < 1){
            this.setState({filtroChofer: []})
        }
        this.agregarServiciosReprogramados(nro_servicio)
    }

     //Obtener datos del automovil
    buscarListaAuto = (text, key,nro_servicio) =>{
        let id = [text.target.name]
        this.state.servicios.map(values => values.cabecera.nro_servicio === nro_servicio ? ((values.cabecera.id_unidad = text.target.value, values.cabecera.placa = "")) : null)
        if(id[0] === "_auto" && text.target.value.length > 0){
            this.filtrarChoferAuto(text.target.value, 2)
            this.setState({numero_servicio:key, filtroChofer :[]})
        }else if(id[0] === "_auto" && text.target.value.length < 1){
            this.setState({filtroAuto: []})
        }
        this.agregarServiciosReprogramados(nro_servicio)
    }

    filtrarChoferAuto = (value, acceso) =>{
        if(acceso === 1){
            const listaChofer = this.state.listaChofer.filter((val) => val.id_chofer.indexOf(value) !== -1 ||  val.descripcion.indexOf(value.toUpperCase()) !== -1 )
            this.setState({filtroChofer: listaChofer})
        }else if(acceso === 2){
            const listaAuto = this.state.listaAuto.filter((val) => val.id_unidad.indexOf(value.toUpperCase()) !== -1 )
            this.setState({filtroAuto: listaAuto})
        }
        
    }

    seleccionarChofer = (val) =>{
        let ids = val.target.id
        let idsSplit = ids.split(',')
        this.state.servicios.map(value=>
            value.nro_servicio === parseInt(idsSplit[1])? 
                ((value.cabecera.id_chofer = idsSplit[0], value.cabecera.descripcion = idsSplit[2],
                    value.data.map(subValue => 
                        subValue['id_chofer'] = idsSplit[0])
                )) : null
        )
        this.setState({filtroChofer: [], servicios:this.state.servicios})
    }
    
    seleccionarAuto = (val) =>{
        let ids = val.target.id
        let idsSplit = ids.split(',')
        this.state.servicios.map(value=>
            value.cabecera.nro_servicio === parseInt(idsSplit[1])? 
                ((value.cabecera.id_unidad = idsSplit[0], value.cabecera.placa = idsSplit[2],
                    value.data.map(subValue => 
                        subValue['id_unidad'] = idsSplit[0])
                )) : null
        )
        this.setState({filtroAuto: [], servicios:this.state.servicios})
        
    }

    filtrarChoferSeleccionado = () =>{
        let choferes = []
        this.state.servicios.forEach(value =>{
            if(value.cabecera.id_chofer) choferes.push(value.cabecera.id_chofer)
        })
        return choferes
    }

    filtrarAutoSeleccionado = () =>{
        let auto = []
        this.state.servicios.forEach(value =>{
            if(value.cabecera.id_unidad) auto.push(value.cabecera.id_unidad)
        })
        return auto
    }

    filtrarPasajeroSeleccionado = () =>{
        let pasajero = []
        this.state.servicios.forEach(value =>{
            value.data.forEach(value =>{
                pasajero.push(value.id_pasajero)
            })
        })
        return pasajero
    }

    validarExistenciaHora = () =>{
        var patt = new RegExp(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/)
        let servicio = this.state.servicios
        let res = false
        for (let index = 0; index < servicio.length; index++) {
            if(servicio[index].cabecera.hora === '' || !patt.test(servicio[index].cabecera.hora)){
                res = true
                break
            }
        }
        return res
    }

    validarExistenciaHora_Detalle = () =>{
        var patt = new RegExp(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/)
        let servicio = this.state.servicios
        let res = false
        for (let index = 0; index < servicio.length; index++) {
            for (let Subindex = 0; Subindex < servicio[index].data.length; Subindex++) {
                if(servicio[index].data[Subindex].hora === '' || !patt.test(servicio[index].data[Subindex].hora)){
                    res = true
                    break
                }
            }
        }
        return res
    }

    //Guardar cambios de liquidación
    guardarCambios = async () =>{
        // if(this.state.listaReprogramado.length > 0){
        //     swal('Mensaje', "Aún estan pendientes pasajeros con estado 'Reprogramado'.", 'info')
        // }else{
            if( this.validarExistenciaHora() || this.validarExistenciaHora_Detalle()){
                swal('Mensaje', 'Debe de ingresar de manera correcta las horas de los servicios y/o pasajeros.','info')
            }else{
                const confirmac = await swal({
                    title:"Mensaje",
                    text: "¿Estas seguro de guardar los cambios realizados?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true
                })
                if(confirmac){
                    const data = []
                    let contador = -1
                    let servicios_unicos = [...new Set(this.state.servicioReprogramados)]
                    
                    let servicios = this.state.servicios.filter(value => servicios_unicos.includes(value.cabecera.nro_servicio) )
                    
                    servicios.forEach((value, index)=>{
                        value.data.forEach((dat, indice) =>
                        {
                            data.push({
                                id_cliente: this.state.cliente,
                                id_pasajero: dat.id_pasajero,
                                fecha: this.state.fechaI,
                                origen_servicio: this.state.origen,
                                hora: dat.hora,
                                orden_recojo: dat.orden_recojo,
                                id_tipo_estado_mov: dat.id_tipo_estado_mov,
                                nro_servicio:value.cabecera.nro_servicio,
                                costo_pasajero:dat.costo_pasajero,
                                id_cuenta: dat.id_cuenta === '' ? null : dat.id_cuenta,
                                id_area: dat.id_area === '' ? null : dat.id_area,
                                usuario: this.state.user.toUpperCase(),
                                comentario: dat.comentario === '' ? null : dat.comentario
                            })
                        })
                        if(contador !== index){
                            data.push({
                                id_cliente: this.state.cliente,
                                fecha: this.state.fechaI,
                                hora: value.data[0].hora,
                                Hora_inicio: value.cabecera.hora,
                                usuario:this.state.user.toUpperCase(),
                                nro_servicio:value.cabecera.nro_servicio,
                                id_chofer: value.cabecera.id_chofer === '' ? null :  value.cabecera.id_chofer,
                                id_unidad: value.cabecera.id_unidad === '' ? null : value.cabecera.id_unidad,
                                hora_llegada: value.cabecera.hora_llegada === "" ?  null : value.cabecera.hora_llegada
                            })
                        }
                        contador = index
                    })
                    console.log(data)
                    const res = await api.updateListaPasajeros_fecth(this.state.token, data, 'Liq')
                    if(res.error){
                        if(!global.validarCookies()){
                            await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                            global.cerrarSesion()
                        }
                        await swal("Mensaje", res.error  ,"error")
                        return
                    }
                    if(res.status !== 200){ 
                        swal("Mensaje","Se genero un error. Por favor intentarlo nuevamente.", "error") 
                        return 
                    }
                    swal("Mensaje","Cambios guardados satisfactoriamente.", "success")
                }
            }
        //}
    }
    
    //Agregar nuevo servicio
    nuevoServcio_Pasajero = async (MAS_chofer, MAS_vehiculo, pasajero, horaDelServicio, horaServicio, ffat, aerolinea, e) =>{
        pasajero.map(value => ((
            value['estado'] = false, 
            value['Orden_recojo'] = 1, 
            value['orden_recojo'] = 1, 
            value['nro_servicio'] = (this.state.numeroServicio+1),
            value['hora'] = horaServicio, 
            value['descripcion_pasajero']= value.descripcion,
            value['descripcion_distrito'] = value.id_distrito,
            value['id_tipo_estado_mov'] = "AD",
            value['id_cuenta'] = aerolinea === "" ? null : value['id_cuenta'],
            value['fecha'] = this.state.fechaI,
            value['origen'] = this.state.origen,
            value['origen_servicio'] = this.state.origen,
            value['usuario'] = this.state.usuario.toUpperCase()
        )))
        let servicio = [{
            id_cliente: pasajero[0].id_cliente,
            nro_servicio: (this.state.numeroServicio+1),
            fecha: this.state.fechaI,
            hora_inicio: horaDelServicio,
            hora: horaServicio,
            usuario:this.state.user.toUpperCase(),
            origen: this.state.origen,
            id_chofer: MAS_chofer === "" ? null : MAS_chofer,
            id_unidad: MAS_vehiculo === "" ? null : MAS_vehiculo
        }]
        let servicio1 = {
            id_cliente: pasajero[0].id_cliente,
            nro_servicio: (this.state.numeroServicio+1),
            fecha: this.state.fechaI,
            hora_inicio: horaDelServicio,
            hora: horaServicio,
            usuario:this.state.user.toUpperCase(),
            origen: this.state.origen,
            id_chofer: MAS_chofer === "" ? null : MAS_chofer,
            id_unidad: MAS_vehiculo === "" ? null : MAS_vehiculo 
        }
        
        const res = await api.saveServices_fetch(this.state.token, pasajero, 'i')
        if(res.error){
            if(!global.validarCookies()){ 
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion() 
            }
            await swal("Mensaje", res.error ,"error")
            return
        }
        if(res.status !== 200){
            swal("Mensaje","No se inserto el nuevo pasajero.", "error")
            return
        }

        const res1 = await api.saveServices_fetch(this.state.token, servicio, 'u')
        if(res1.error){
            if(!global.validarCookies()){ 
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion() 
            }
            await swal("Mensaje", res1.error ,"error")
            return
        }

        if(res1.status !== 200){
            swal("Mensaje","El pasajero se inserto pero no se actualizo en el servicio, intentarlo nuevamente.", "error")
            return
        }

        swal("Mensaje","Se ingreso el servicio correctamente.", "success")
        this.setState({servicios: [...this.state.servicios, {cabecera: servicio1, data: pasajero, nro_servicio: (this.state.numeroServicio+1)} ] })
        this.modificarFFAT(pasajero[0].id_pasajero, ffat, (this.state.servicios.length-1))
        this.quitarReprogramados(pasajero[0].id_pasajero)
        this.agregarServiciosReprogramados(this.state.numeroServicio+1)
    }

    //actualizar estado de movilizacion
    actualizar_estadoMovilizacion = async (data) =>{
        let solicitud = []
        this.state.servicios[data[0]].data.forEach(value => {
            if(value.id_pasajero === data[1]){
                solicitud.push({
                    id_cliente: this.state.cliente,
                    id_pasajero: value.id_pasajero,
                    fecha: this.state.fechaI,
                    origen_servicio: this.state.origen,
                    hora: value.hora,
                    orden_recojo: value.orden_recojo,
                    id_tipo_estado_mov: value.id_tipo_estado_mov,
                    nro_servicio: parseInt(data[2]),
                    costo_pasajero: value.costo_pasajero,
                    id_cuenta: value.id_cuenta === '' ? null : value.id_cuenta,
                    usuario: this.state.user.toUpperCase(),
                    comentario: value.comentario === '' ? null : value.comentario
                })
                
            }
        })
        const res = await api.updateListaPasajeros_fecth(this.state.token, solicitud, 'Liq')
        if(res.error){
            if(!global.validarCookies()){ 
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion() 
            }
            await swal("Mensaje", res.error ,"error")
            return
        }

        if(res.status !== 200)    {
            return false
        }

        return true
        
    }

    validarCantidadArreglo = (list, posicion, maxi) =>{
        let resultado = false
        let cantidad = list[posicion].data.length
        if(cantidad >= maxi){
            resultado = true
        }
        return resultado
    }

    cambiarHora_llegada = (text, nro_servicio) =>{
        this.state.servicios.map(value => value.cabecera.nro_servicio === nro_servicio ? value.cabecera.hora_llegada = text.target.value : null)
        this.setState({servicios: this.state.servicios})
        this.agregarServiciosReprogramados(nro_servicio)
    }

    agregarServiciosReprogramados = (nro_servicio) =>{
        if(this.state.servicioReprogramados.filter(value => value === nro_servicio).length === 0){
            this.state.servicioReprogramados.push(nro_servicio)
        }
    }

    modifyService = (list, inicio, fin) =>{
        if(inicio.droppableId !== fin.droppableId){
            return
        }
        const result = [...list]
        let start = {}
        result.forEach( (value, index) => {
            if(index === parseInt(inicio.droppableId)){
                start = value.data[inicio.index]
                value.data.splice(inicio.index, 1)
            }
        })
        result.forEach((value, index)=>{
            if(index === parseInt(fin.droppableId)){
                value.data.splice(fin.index, 0, start)
            }
        })
        result.forEach((values, index)=>{
            if(index === parseInt(inicio.droppableId)){
                let contador = 1
                values.data.forEach(subValue=>{
                    subValue['orden_recojo'] = contador++
                })
            }
        })
        let servicio = result[inicio.droppableId].cabecera.nro_servicio
        this.agregarServiciosReprogramados(servicio)
        this.setState({solicitud: result})
    }

    render() {
        return (
            <div>
                <p className="historial">Proceso &gt; Liquidación</p>
                <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap'}}>

                    <div className="cuadro_PROCESO_PROGRAMACION">
                        <form onSubmit={this.onsubmit}>
                        <div>
                            <div className="col1" style={{justifyContent:'flex-start'}}>
                                <div>
                                    <span>Fecha</span>
                                    <input type="date" style={{width:'150px', border:'1px solid #d9a600', padding:'3px', fontSize: '1em'}} onChange={(e)=>this.setState({fechaI:e.target.value})}/>
                                </div>                       
                                <div>
                                    <span>Servicio</span>
                                    <select onChange={(e)=>this.setState({origen:e.target.value})}>
                                        <option value="_ori_NA">Seleccionar</option>
                                        <option value="E">Entrada</option>
                                        <option value="S">Salida</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col2" style={{paddingLeft: '30px'}}>
                                <div style={{paddingTop:'9px'}}>
                                    <span>Hora I.</span>
                                    <input type="text" maxLength="5" 
                                    pattern="^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$" 
                                    className="invalido" required onChange={(e)=>this.setState({horaI:e.target.value})}/>
                                </div>

                                <div style={{paddingTop:'9px'}}>
                                    <span>Hora F.</span>
                                    <input type="text" maxLength="5" 
                                    pattern="^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$"
                                    className="invalido" required onChange={(e)=>this.setState({horaF:e.target.value})}/>
                                </div>
                                <div>
                                    {
                                        this.state.viewLoader ? <input type="submit" value="Procesar" /> : <span><img src={loader} alt="loader" width="35"/></span>
                                    }
                                </div>
                            </div>
                        </div>
                        </form>
                    </div>

                    <div className="cuadro_PROCESO_PROGRAMACION cuadro_PROCESO_PROGRAMACION_RE">
                        <span style={{color:'red', fontWeight:'bold'}}>Lista de Reprogramados</span>
                        <ul style={{overflowY: 'scroll', height:'154px'}}>
                            {
                                this.state.listaReprogramado.map(value => 
                                    <li style={{padding:'7px'}} key={value.codigo}>Servicio <b>{value.servicio}</b> - Dni: <b>{value.codigo}</b> - Nombre: <b>{value.nombre}</b> - Distrito  - <b>{value.distrito}</b></li>
                                )
                            }
                        </ul>
                    </div>

                </div>

                {
                    this.state.tablaLiquidacion?
                        <TablaLiquidacion
                            changeText={this.changeText}
                            nuevoPasajeroServicio = {this.nuevoPasajeroServicio}
                            todosPasajeros = {this.todosPasajeros}
                            agregarComentario = {this.agregarComentario}
                            buscarListaChofer = {this.buscarListaChofer}
                            buscarListaAuto = {this.buscarListaAuto}
                            seleccionarChofer = {this.seleccionarChofer}
                            seleccionarAuto = {this.seleccionarAuto}
                            guardarCambios = {this.guardarCambios}
                            filtrarAutoSeleccionado = {this.filtrarAutoSeleccionado}
                            filtrarChoferSeleccionado = {this.filtrarChoferSeleccionado}
                            filtrarPasajeroSeleccionado = {this.filtrarPasajeroSeleccionado}
                            nuevoServcio_Pasajero = {this.nuevoServcio_Pasajero}
                            cambiarHoraCabecera = {this.cambiarHoraCabecera}
                            cambiarHoraDetalle = {this.cambiarHoraDetalle}
                            cambiarHora_llegada = {this.cambiarHora_llegada}
                            modifyService = {this.modifyService}
                            servicio={this.state.servicios}
                            ffat={this.state.ffat}
                            costoTotal={this.state.costoTotal}
                            aerolinea={this.state.aerolinea}
                            listArea = {this.state.listArea}
                            pasajeros={this.state.pasajeros}
                            listPassanger = {this.state.listPassanger}
                            listaReprogramado = {this.state.listaReprogramado}
                            filtroChofer = {this.state.filtroChofer}
                            filtroAuto = {this.state.filtroAuto}
                            numero_servicio = {this.state.numero_servicio}
                            listaAuto = {this.state.listaAuto}
                            listaChofer = {this.state.listaChofer}
                        />
                    :null
                }

            </div>
        )
    }
}