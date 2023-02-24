import React, { Component } from 'react'
import loader from '../../../assets/loader.gif'
import {api} from '../../../global/api'
import {global} from '../../../global/global'
import swal from 'sweetalert'
import '../style.css'
import Solicitudes from './config/solicitudes'; 
import CuadroMapa from './config/CuadroMapa';

export default class ReProgramacion extends Component {

    state = {
        user: '',
        token: '',
        fechaI: "",
        cliente: "",
        horaI : "",
        usuario: '',
        origen: "_ori_NA",
        btn_botonReserva: 'Reservar',
        cliente_descp: '',
        numeroServicio: 0,
        numeroServicio_fetch : 0,
        mapaDisplay: false,
        listadeGrupoDisplay: false,
        reservarStatus: true,
        marcadorCerrado: true,
        viewHora: true,
        viewLoader: true,
        Pasajeros: [],
        pre_solicitud: [],
        solicitud: [],
        listPassanger:[],
        pasajeroServicio: [],
        listaHoras : [],
        aerolinea:[],
        servicioReprogramados: []
    }

    async componentDidMount(){
        const {estadoLocalStorage, token, name, id_cliente, descripcion} = await global.obtenerDatosLocalStorage()
        if(estadoLocalStorage){
            this.setState({cliente: id_cliente, user: name, cliente_descp : descripcion, token})
        }else{
            await swal("Mensaje", 'No se encontro información para hacer consultas al servidor.\nCerrar Sesión y volver a iniciar.', "error")
            this.setState({cliente: '', user: '', cliente_descp : '', token: ''})
        }
    }

    todosPasajeros = async () =>{
        const listPassanger = await api.passangerProgramacion_fetch(this.state.token, this.state.cliente)
        if(listPassanger.error){
            if(!global.validarCookies()){
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion()
            }
            await swal("Mensaje", listPassanger.error, "error")
            return
        }
        this.setState({listPassanger: listPassanger})
    }

    onsubmit = async (e) =>{
        e.preventDefault()
        if(this.state.horaI !== '' && this.state.origen !== '_ori_NA'){
            let _pasajeroSinServicio = this.pasajeroSinServicio()
            let _servicioSinPasajero = this.servicioSinPasajero()
            let _comprobarHoraServicio = this.comprobarHoraServicio()

            if(_pasajeroSinServicio || _comprobarHoraServicio){
                swal('Mensaje', 'Antes de procesar otro servicio, considere no tener pasajeros sin servicio y servicios sin pasajeros.', 'error')
            }else if(_servicioSinPasajero){
                if(this.state.solicitud.length > 0){
                    await this.BtnSave_PreSubmit()
                }
                
                const listSolicitud =  await api.reprogramacion_fetch(this.state.token, this.state.cliente, this.state.fechaI, this.state.origen,  this.state.horaI)
                const listAerolinea =  await api.searchAerolineafetch(this.state.token, this.state.cliente)
                const numeroServicio = await api.searchNumeroServicio_fetch(this.state.token, this.state.cliente, this.state.fechaI)
                if(listSolicitud.error || listAerolinea.error || numeroServicio.error){
                    if(!global.validarCookies()){ 
                        await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                        global.cerrarSesion() 
                    }
                    await swal("Mensaje", listSolicitud.error || listAerolinea.error || numeroServicio.error, "error")
                    return
                }
                
                listSolicitud.map((value, index) => ((value['estado'] =   false, value['numServicio'] = value.orden_recojo, value['numViaje'] = (index+1))))
                this.setState({numeroServicio: numeroServicio[0].campo, numeroServicio_fetch: numeroServicio[0].campo, aerolinea: listAerolinea})
                let dataDetalle = []
                let _nro_servicio = listSolicitud[0].nro_servicio
                let pre_solicitud = {data:[], cab:[]}
                listSolicitud.forEach((element, index) => { 
                    if(element.nro_servicio === _nro_servicio){
                        pre_solicitud.data.push(element)
                        pre_solicitud.cab = {hora_servicio : element.hora_inicio, nro_servicio : element.nro_servicio}
                    }else{
                        dataDetalle.push(pre_solicitud)
                        pre_solicitud = {data:[], cab:[]}
                        pre_solicitud.data.push(element)
                        pre_solicitud.cab = {hora_servicio : element.hora_inicio, nro_servicio : element.nro_servicio}
                    }
                    if(listSolicitud.length === index+1){
                        dataDetalle.push(pre_solicitud)
                    }
                    _nro_servicio = element.nro_servicio
                });
                this.setState({solicitud: dataDetalle, Pasajeros: listSolicitud}) 
            }
            else{
                if(this.state.solicitud.length > 0){
                    await this.BtnSave_PreSubmit()
                }
                
                const listSolicitud =  await api.reprogramacion_fetch(this.state.token, this.state.cliente, this.state.fechaI, this.state.origen,  this.state.horaI)
                const listAerolinea =  await api.searchAerolineafetch(this.state.token, this.state.cliente)
                const numeroServicio = await api.searchNumeroServicio_fetch(this.state.token, this.state.cliente, this.state.fechaI)
                if(listSolicitud.error || listAerolinea.error || numeroServicio.error){
                    if(!global.validarCookies()){ 
                        await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                        global.cerrarSesion() 
                    }
                    await swal("Mensaje", listSolicitud.error || listAerolinea.error || numeroServicio.error, "error")
                    return
                }
                
                listSolicitud.map((value, index) => ((value['estado'] =   false, value['numServicio'] = value.orden_recojo, value['numViaje'] = (index+1))))
                this.setState({numeroServicio: numeroServicio[0].campo, numeroServicio_fetch: numeroServicio[0].campo, aerolinea: listAerolinea})
                let dataDetalle = []
                let _nro_servicio = listSolicitud[0].nro_servicio
                let pre_solicitud = {data:[], cab:[]}
                listSolicitud.forEach((element, index) => { 
                    if(element.nro_servicio === _nro_servicio){
                        pre_solicitud.data.push(element)
                        pre_solicitud.cab = {hora_servicio : element.hora_inicio, nro_servicio : element.nro_servicio}
                    }else{
                        dataDetalle.push(pre_solicitud)
                        pre_solicitud = {data:[], cab:[]}
                        pre_solicitud.data.push(element)
                        pre_solicitud.cab = {hora_servicio : element.hora_inicio, nro_servicio : element.nro_servicio}
                    }
                    if(listSolicitud.length === index+1){
                        dataDetalle.push(pre_solicitud)
                    }
                    _nro_servicio = element.nro_servicio
                });
                this.setState({solicitud: dataDetalle, Pasajeros: listSolicitud}) 
            }
            this.setState({listadeGrupoDisplay:true, viewLoader: true})
        }
    }

    modificarFormulario = (text) =>{
        if(text.target.name === "fechaI"){ this.setState({fechaI:text.target.value}) }
        if(text.target.name === "origen"){ this.setState({origen:text.target.value}) }
        this.setState({viewHora:false})
        setTimeout(()=>{
            if(this.state.fechaI !== "" && this.state.origen !== "_ori_NA"){ this.filtrarHoras() }
        }, 1000)
    }   

    filtrarHoras =  async ()=> {
        const listHOra =  await api.searchHoraReprogramacion_fetch(this.state.token, this.state.cliente, this.state.fechaI, this.state.origen)
        if(listHOra.error){
            if(!global.validarCookies()){
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion()
            }
            await swal("Mensaje", listHOra.error ,"error")
            return
        }
        this.setState({listaHoras: listHOra, viewHora: true})   
    }

    agreparPasajeros = (data) =>{
        this.setState({reservarStatus:false})
        if(!this.validarPasajeroDuplicado(data)){
            this.setState({pre_solicitud: [...this.state.pre_solicitud,data]})
        }
        this.state.Pasajeros.map(index =>  
            index.id_pasajero === data.id_pasajero ? ((index['estado'] = false, index['numServicio'] = (this.state.pre_solicitud.length+1))) : null
        )
        this.setState({Pasajeros: this.state.Pasajeros})
    }

    validarPasajeroDuplicado(data){
        let duplicado = false
        for (let index = 0; index < this.state.pre_solicitud.length; index++) {
            if(this.state.pre_solicitud[index].id_pasajero === data.id_pasajero){
                duplicado = true
                break
            }
        }
        return duplicado
    }

    quitarPasajero = async (id_pasajero) =>{
        let confirm = await swal({
            title: "Mensaje",
            text: "¿Seguro de retirar a este pasajero?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
        if (confirm) {
            const pre_solicitud = this.state.pre_solicitud.filter(index => index.id_pasajero !== id_pasajero)
            pre_solicitud.map((index, num) => index['numServicio'] = (num+1))
            this.state.Pasajeros.map(value => value.id_pasajero === id_pasajero ? ((value['estado'] = true, value['numServicio'] = 0)) : null )
            this.setState({pre_solicitud:pre_solicitud, Pasajeros: this.state.Pasajeros, reservarStatus : (this.state.pre_solicitud.length-1 < 1) ? true: false})
        } 
    }

    modificarGrupo = (arreglo) =>{ this.setState({Pasajeros:arreglo}) }

    agregarSolicitud = () =>{
        this.setState({btn_botonReserva : 'Cargando...', marcadorCerrado : false})
        document.getElementById('botonReserva').disabled = true
        const promesa = new Promise ((resolve, reject)=>{
            const pre_solicitud = {data:[], cab:[]}
            this.state.pre_solicitud.map(index => pre_solicitud.data.push(index))
            pre_solicitud.cab = {hora_servicio : '', nro_servicio : (this.state.numeroServicio+1)}
            setTimeout(function(){resolve(pre_solicitud);}, 1000);
        })
        promesa.then( async resolve => {
            this.setState({ solicitud: [...this.state.solicitud, resolve], pre_solicitud: [], btn_botonReserva: 'Reservar', reservarStatus:true, marcadorCerrado:true, numeroServicio: (this.state.numeroServicio+1) })
            await this.BtnSave_Services(resolve)
        })
    }

    retirarPasajeroSolicitud = async  (_key, _indice, id) =>{
        let nro_servicio = this.state.solicitud[_key].cab.nro_servicio
        let confirm = await swal({
            title: "Mensaje",
            text: "¿Estas seguro de LIBERAR a este pasajero del servicio para volver a seleccionarlo?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        if(confirm){
            this.state.solicitud.forEach((valores, key)=>{
                if(key === _key){
                    valores.data.splice(_indice,1)
                    this.state.Pasajeros.map((index, conta)=> (index.id_pasajero === id) ? ((index['estado'] = true, index['numServicio'] = 0)): null )
                    this.setState({Pasajeros: this.state.Pasajeros})
                }
            })
            this.state.solicitud.map((valores, key)=> (key === _key) ? valores.data.map((data, num)=> data['numServicio'] = (num+1) ) : null)
            this.setState({solicitud:this.state.solicitud})
            this.state.servicioReprogramados.push({id_pasajero: id, data_start: nro_servicio, data_end: nro_servicio})
        } 
    }

    eliminarPasajeroSolicitud = async (_key, _indice, value) =>{
        let nro_servicio = this.state.solicitud[_key].cab.nro_servicio
        let confirm = await swal({
            title: "Mensaje",
            text: "¿Estas seguro de ELIMINAR a este pasajero de la lista?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        if(confirm){
            let res = await api.eliminarPasajero_fetch(this.state.token, this.state.cliente, value.id_pasajero, this.state.fechaI, this.state.origen, value.hora)
            if(res.error){
                if(!global.validarCookies()){
                    await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                    global.cerrarSesion()
                }
                await swal("Mensaje",res.error,"error")
                return
            }

            if(res.status !== 200){
                swal('Mensaje', 'Ocurrio un error en el proceso de la eliminacion, intentarlo nuevamente por favor.', 'error')
                return
            }

            swal('Mensaje', value.descripcion_pasajero + ' se elimino de la Lista de Pasajeros.\nPara organizar de nuevo el numero de recojo debe guardar la reprogramación.', 'success')
            this.state.solicitud.forEach((valores, key)=>{
                if(key === _key){
                    valores.data.splice(_indice,1)
                    this.state.Pasajeros.map((index, conta)=> (index.id_pasajero === value.id_pasajero) ?  this.state.Pasajeros.splice(conta, 1) : null )
                    this.setState({Pasajeros: this.state.Pasajeros})
                }
            })
            this.state.solicitud.map((valores, key)=> (key === _key) ? valores.data.map((data, num)=> data['numServicio'] = (num+1) ) : null)
            this.setState({solicitud: this.state.solicitud})
            this.state.servicioReprogramados.push({id_pasajero: value.id_pasajero, data_start: nro_servicio, data_end: nro_servicio})            
        }
    }

    eliminarServiciosSolicitud = async (value) => {
        console.log(value)
        let confirm = await swal({
            title: "Mensaje",
            text: "¿Estas seguro de ELIMINAR a este servicio?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        if(confirm){
            let nuevaListaServicio = this.state.solicitud.filter(sol => sol.cab.nro_servicio !== value.cab.nro_servicio)
            console.log(nuevaListaServicio)
            this.setState({solicitud: [...nuevaListaServicio]})
        }
    }

    mostrarMapa = async () =>{
        let preS = this.state.pre_solicitud
        if(preS.length > 0){
            let confirm = await swal({
                title: "Mensaje",
                text: "¿Quieres descartar los cambios?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
            if (confirm) {
                this.state.Pasajeros.map((value, index)=>
                    preS.map((subValue, subIndex)=> 
                        (value.id_pasajero === subValue.id_pasajero) ? ((subValue['estado'] = true, value['numServicio'] = 0)) : null
                    )
                )
                this.setState({ mapaDisplay: false, pre_solicitud: []})
            } 
        }else{
            this.setState({ mapaDisplay: false})
        }
    }

    //GUARDAR SERVICIOS 
    BtnSave_Services = async (nuevoServicio) =>{
        const data = []
        let contador = -1
        nuevoServicio.data.forEach((value, index)=>{
                data.push(
                {
                    id_cliente: this.state.cliente,
                    id_pasajero: value.id_pasajero,
                    fecha: this.state.fechaI,
                    origen: this.state.origen,
                    hora: value.hora,
                    nro_servicio: nuevoServicio.cab.nro_servicio,
                    usuario: this.state.user.toUpperCase(),
                    Orden_recojo: value.numServicio,
                    id_cuenta: value.id_cuenta
                })
            if(contador === -1){
                data.push({
                    hora_inicio: null,
                    id_cliente: this.state.cliente,
                    nro_servicio:nuevoServicio.cab.nro_servicio,
                    fecha: this.state.fechaI,
                    hora: value.hora,
                    usuario:this.state.user.toUpperCase(),
                    origen: this.state.origen
                })
            }
            contador = index
        })

        const res = await api.saveServices_fetch(this.state.token, data, 'u')
        if(res.error){
            if(!global.validarCookies()){
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion()
            }
            await swal("Mensaje",res.error,"error")
            return
        }

        if(res.status !==200){
            swal("Mensaje","Se genero un error. Por favor intentarlo nuevamente.", "error")
            return
        }
        swal("Mensaje","Nuevo servicio agregado.", "success")
    }

    BtnSeve_Services2 = async () =>{
        let _pasajeroSinServicio = this.pasajeroSinServicio()
        let _servicioSinPasajero = this.servicioSinPasajero()
        let _comprobarHoraServicio = this.comprobarHoraServicio()
        if(_pasajeroSinServicio){
            swal("Mensaje", "Tiene pasajeros sin servicio, por favor asignarlo antes de guardar la reprogramación.", "error")
        }else if (_servicioSinPasajero){
            const confirmac = await swal({
                title:"Mensaje",
                text: "¿Esta seguro de eliminar los servicios sin pasajero? podrian ir vacios en Velsat.",
                icon: "warning",
                buttons: true,
                dangerMode: true
            })
            if(confirmac){
                let arreglo_nro_servicios = []
                this.state.servicioReprogramados.forEach(value => {
                    arreglo_nro_servicios.push(value.data_start)
                    arreglo_nro_servicios.push(value.data_end)
                })
                let servicios_unicos = [...new Set(arreglo_nro_servicios)]
                let servicios = this.state.solicitud.filter(value => servicios_unicos.includes(value.cab.nro_servicio) )
                const data = []
                servicios.forEach((value, index)=>{
                    if(value.data.length > 0){
                        let contador = -1
                        value.data.forEach((dat, indice) =>
                        {
                            data.push({
                                id_cliente: this.state.cliente,
                                id_pasajero: dat.id_pasajero,
                                fecha: this.state.fechaI,
                                origen_servicio: this.state.origen,
                                hora: dat.hora,
                                nro_servicio: value.cab.nro_servicio,
                                usuario: this.state.user.toUpperCase(),
                                orden_recojo: dat.numServicio,
                                id_cuenta: dat.id_cuenta === '' ? null : dat.id_cuenta
                            })
                        })
                        if(contador === -1){
                            data.push({
                                id_cliente: this.state.cliente,
                                fecha: this.state.fechaI,
                                hora: value.data[0].hora,
                                Hora_inicio: value.cab.hora_servicio,
                                usuario:this.state.user.toUpperCase(),
                                nro_servicio:value.cab.nro_servicio
                            })
                        }
                        contador = index
                    }
                })
                const res = await api.updateListaPasajeros_fecth(this.state.token, data, 'Rep')
                if(res.error){
                    if(!global.validarCookies()){ 
                        await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                        global.cerrarSesion() 
                    }
                    await swal("Mensaje", res.error, "error")
                    return
                }
                if(res.status !== 200){ 
                    swal("Mensaje","Se genero un error. Por favor intentarlo nuevamente.", "error")
                    return
                }
                swal("Mensaje","Cambios guardados satisfactoriamente.", "success")
                this.setState({servicioReprogramados:[]})
            }
        }else if(_comprobarHoraServicio){
            swal("Mensaje", "Deben de ingresar correctamente las horas de inicio en el Servicio.", "error")
        }else{
            const confirmac = await swal({
                title:"Mensaje",
                text: "¿Estas seguro de guardar los servicios?",
                icon: "warning",
                buttons: true,
                dangerMode: true
            })
            if(confirmac){
                let arreglo_nro_servicios = []
                this.state.servicioReprogramados.forEach(value => {
                    arreglo_nro_servicios.push(value.data_start)
                    arreglo_nro_servicios.push(value.data_end)
                })
                let servicios_unicos = [...new Set(arreglo_nro_servicios)]
                let servicios = this.state.solicitud.filter(value => servicios_unicos.includes(value.cab.nro_servicio) )
                const data = []
                servicios.forEach((value, index)=>{
                    let contador = -1
                    value.data.forEach((dat, indice) =>
                    {
                        data.push({
                            id_cliente: this.state.cliente,
                            id_pasajero: dat.id_pasajero,
                            fecha: this.state.fechaI,
                            origen_servicio: this.state.origen,
                            hora: dat.hora,
                            nro_servicio: value.cab.nro_servicio,
                            usuario: this.state.user.toUpperCase(),
                            orden_recojo: dat.numServicio,
                            id_cuenta: dat.id_cuenta === '' ? null : dat.id_cuenta
                        })
                    })
                    if(contador === -1){
                        data.push({
                            id_cliente: this.state.cliente,
                            fecha: this.state.fechaI,
                            hora: value.data[0].hora,
                            Hora_inicio: value.cab.hora_servicio,
                            usuario:this.state.user.toUpperCase(),
                            nro_servicio:value.cab.nro_servicio
                        })
                    }
                    contador = index
                })
                const res = await api.updateListaPasajeros_fecth(this.state.token, data, 'Rep')
                if(res.error){
                    if(!global.validarCookies()){ 
                        await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                        global.cerrarSesion() 
                    }
                    await swal("Mensaje", res.error, "error")
                    return
                }
                if(res.status !== 200){ 
                    swal("Mensaje","Se genero un error. Por favor intentarlo nuevamente.", "error")
                    return
                }
                this.setState({servicioReprogramados:[]})
                swal("Mensaje","Cambios guardados satisfactoriamente.", "success")
                    
            }
        }
    }

    BtnSave_PreSubmit = async () => {
        const data = []
        let arreglo_nro_servicios = []
        this.state.servicioReprogramados.forEach(value => {
            arreglo_nro_servicios.push(value.data_start)
            arreglo_nro_servicios.push(value.data_end)
        })
        let servicios_unicos = [...new Set(arreglo_nro_servicios)]
        let servicios = this.state.solicitud.filter(value => servicios_unicos.includes(value.cab.nro_servicio) )
        servicios.forEach((value, index)=>{
            let contador = -1
            value.data.forEach((dat, indice) =>
            {
                data.push(
                {
                    id_cliente: this.state.cliente,
                    id_pasajero: dat.id_pasajero,
                    fecha: this.state.fechaI,
                    origen_servicio: this.state.origen,
                    hora: dat.hora,
                    nro_servicio: value.cab.nro_servicio,
                    usuario: this.state.user.toUpperCase(),
                    orden_recojo: dat.numServicio,
                    id_cuenta: dat.id_cuenta === '' ? null : dat.id_cuenta
                })
            })
            if(contador === -1){
                data.push({
                    id_cliente: this.state.cliente,
                    fecha: this.state.fechaI,
                    hora: value.data[0].hora,
                    Hora_inicio: value.cab.hora_servicio,
                    usuario:this.state.user.toUpperCase(),
                    nro_servicio:value.cab.nro_servicio
                })
            }
            contador = index
        })
        const res = await api.updateListaPasajeros_fecth(this.state.token, data, 'Rep')
        if(res.error){
            if(!global.validarCookies()){
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion()
            }
            await swal("Mensaje",res.error,"error")
            return
        }
        if(res.status!== 200){
            console.log('se genero un error')
            return
        }
        this.setState({servicioReprogramados:[]})
    }

    //VALIDACIONES PARA GUARDAR SERVICIO
    pasajeroSinServicio = () =>{
        let pasajerosSinServicio = false
        let pasajeros = this.state.Pasajeros.filter(value => value.estado === true)
        if(pasajeros.length > 0){
            pasajerosSinServicio  = true
        }
        return pasajerosSinServicio
    }

    servicioSinPasajero = () =>{
        let servicioSinPasajero = false
        this.state.solicitud.forEach(value =>{
            if(value.data.length === 0){
                servicioSinPasajero = true
            }
        })
        return servicioSinPasajero
    }
    comprobarHoraServicio = () =>{
        let patt = new RegExp(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/)
        let comprobarHoraServicio = false
        this.state.solicitud.forEach(value =>{
            if(value.cab.hora_servicio === '' || !patt.test(value.cab.hora_servicio)){
                comprobarHoraServicio = true
            }
        })
        return comprobarHoraServicio
    }

    modifyService = (list, startIndex, endIndex) =>{
        const result = [...list]
        let start = {}
        let data_start = []
        let data_end = []
        let index_end = -1
        if(list[startIndex.droppableId].data.length < 2){
            swal('Mensaje', 'Este servicio se quedara sin pasajeros, debe contener al menos uno.', 'info')
        }else{
            result.forEach( (value, index) => {
                if(index === parseInt(startIndex.droppableId)){
                    start = value.data[startIndex.index]
                    value.data.splice(startIndex.index, 1)
                    data_start = value.cab.nro_servicio
                }
            })
            result.forEach((value, index)=>{
                if(index === parseInt(endIndex.droppableId)){
                    value.data.splice(endIndex.index, 0, start)
                    data_end = value.cab.nro_servicio
                }
            })
            result.forEach(values=>{
                let contador = 1
                values.data.forEach(subValue=>{
                    subValue['numServicio'] = contador++
                })
            })
            //MEJORAR EL CAMBIO CUANDO PASE ENTRE SERVICIOS
            let reproPasajero = this.state.servicioReprogramados.filter(value => value.id_pasajero === start.id_pasajero)
            if( reproPasajero.length < 1){
                this.setState({servicioReprogramados:[...this.state.servicioReprogramados, {id_pasajero: start.id_pasajero, data_start, data_end, inicio: startIndex.index+1}]})
            }else{
                if(reproPasajero[0].data_start === data_end && reproPasajero[0].inicio === (endIndex.index+1)){
                    index_end = this.state.servicioReprogramados.findIndex(value => value.id_pasajero === reproPasajero[0].id_pasajero)
                    this.state.servicioReprogramados.splice(index_end,1)
                }else{
                    this.state.servicioReprogramados.map(value => value.id_pasajero === start.id_pasajero ? value.data_end = data_end : null )
                }
            }
            setTimeout(()=>{
                console.log(this.state.servicioReprogramados)
            }, 1000)
            this.setState({solicitud: result})
        }
    }

    nuevoPasajeroServicio = async (pasajero, hora, posicion, erolinea) =>{
        console.log(pasajero, hora, posicion, erolinea)
        const validarPasajero = this.state.Pasajeros.filter(value => value.id_pasajero === pasajero[0].id_pasajero)
        if(validarPasajero.length>0){
            swal("Mensaje", "Este pasajero ya se encuentra en servicio", "error")
        }else{
            let cantidadSolicitud = this.state.solicitud[posicion].data.length
            let nro_servicio = this.state.solicitud[posicion].cab.nro_servicio
            pasajero.map(value => ((
                value['estado'] = false, 
                value['numServicio'] = (cantidadSolicitud+1), 
                value['hora'] = hora, 
                value['descripcion_pasajero']= value.descripcion,
                value['numViaje'] = 0,
                value['descripcion_distrito'] = value.id_distrito,
                value['id_cuenta'] = erolinea === "" ? null : erolinea,
                value['fecha'] = this.state.fechaI,
                value['origen'] = this.state.origen,
                value['origen_servicio'] = this.state.origen,
                value['usuario'] = this.state.user.toUpperCase(),
                value['orden_recojo'] = (cantidadSolicitud+1) ,
                value['nro_servicio'] = nro_servicio
            )))

            const res = await api.saveServices_fetch(this.state.token, pasajero, 'i')
            if(res.error){
                if(!global.validarCookies()){ 
                    await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                    global.cerrarSesion() 
                }
                await swal("Mensaje",res.error,"error")
                return
            }

            if(res.status !== 200){
                swal("Mensaje","Se genero un error. Por favor intentarlo nuevamente.", "error")
                return
            }

            this.state.Pasajeros.push(pasajero[0])
            this.state.solicitud[posicion].data.push(pasajero[0])
            this.setState({solicitud:this.state.solicitud})
            this.state.servicioReprogramados.push({id_pasajero: pasajero[0].id_pasajero, data_start: nro_servicio, data_end: nro_servicio})
            swal("Mensaje", `Nuevo pasajero agregado.\nPara guardar en Velsat es necesario guardar el servicio.`, "success")
        }
    }

    asignarHoraServicio = (valor, _servicio) =>{
        let nro_servicio = this.state.solicitud[_servicio].cab.nro_servicio
        this.state.solicitud.map((value, servicio) => 
            servicio === _servicio ? value.cab.hora_servicio = valor.target.value : null
        )
        this.setState({solicitud: this.state.solicitud})
        if(this.state.servicioReprogramados.filter(value => value.id_pasajero === nro_servicio).length === 0){
            this.state.servicioReprogramados.push({id_pasajero: nro_servicio, data_start: nro_servicio, data_end: nro_servicio})
        }
    }

    AumentarNumeroServicio = (num) =>{ this.setState({numeroServicio: num}) }

    render() {
        const listaMarcadores = this.state.Pasajeros.filter(index => index.estado === true)
        const cantidadPasajeros = (this.state.solicitud.length > 0) ? true: false
        return (
            <div>
                <p className="historial">Proceso &gt; Re Programacion</p>
                <div className="cuadro_PROCESO_PROGRAMACION">
                    <form onSubmit={this.onsubmit}>
                    <div>
                        <div className="col1">
                            <div>
                                <span>Fecha</span>
                                <input type="date" name="fechaI" 
                                    value={this.state.fechaI} 
                                    style={{width:'150px', border:'1px solid #F0A500', padding:'3px', fontSize: '1em'}} 
                                    onChange={e=> this.modificarFormulario(e)}/>
                            </div>                       
                            <div>
                                <span>Servicio</span>
                                <select name="origen" value={this.state.origen} onChange={e=>this.modificarFormulario(e)}>
                                    <option value="_ori_NA">Seleccionar</option>
                                    <option value="E">Entrada</option>
                                    <option value="S">Salida</option>
                                </select>
                            </div>
                        </div>
                        <div className="col2">
                            <div style={{alignItems:'center'}}>
                                <span>Hora I.</span>
                                {
                                    this.state.viewHora ?
                                        <select name="hora"
                                        style={{width:'150px', border:'1px solid #F0A500', padding:'3px', fontSize: '1em'}} 
                                        onChange={e => this.setState({horaI: e.target.value})}
                                        >       
                                        <option value="">Seleccionar</option>                    
                                        {
                                                this.state.listaHoras?
                                                    this.state.listaHoras.map(value =>
                                                        <option key={value.campo} value={value.campo}>{value.campo}</option>
                                                    )
                                                : null
                                        }
                                        </select>
                                    :<span><img src={loader} alt="loader" width="35"/></span>
                                }
                                
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
                {
                    this.state.listadeGrupoDisplay?
                        this.state.mapaDisplay ?
                            <CuadroMapa  
                                estadoMarcador={this.state.marcadorCerrado}
                                listaMarcadores={listaMarcadores}
                                agreparPasajeros={this.agreparPasajeros}
                                mostrarMapa={this.mostrarMapa}
                                pre_solicitud={this.state.pre_solicitud}
                                quitarPasajero={this.quitarPasajero}
                                agregarSolicitud={this.agregarSolicitud}
                                btn_botonReserva={this.state.btn_botonReserva}
                                reservarStatus={this.state.reservarStatus}
                                limpiarpreSolicitud = {this.limpiarpreSolicitud}
                                destino = "programacion.js"
                                numero_servicio = "0"
                                />
                        :  <hr style={{border:'1.2px solid #F4F4F4'}}/>
                    :null
                }
                {
                    this.state.listadeGrupoDisplay?
                    <div className="grupos">
                        <div style={{margin:'5px 0px', display:'flex', alignItems:'center'}}>
                            <h4>Lista de Grupos</h4>
                            <input type="button" value="Mostrar mapa" id="mostrarMapa" className="mostrarMapa" onClick={()=>{this.setState({mapaDisplay: true})}}/>
                            {
                                cantidadPasajeros ? <input type="button" value="Guardar Servicios" className="mostrarMapa" onClick={()=> this.BtnSeve_Services2()} />   : null
                            }
                        </div>
                        <Solicitudes 
                            eliminarServiciosSolicitud={this.eliminarServiciosSolicitud}  
                            retirarPasajeroSolicitud={this.retirarPasajeroSolicitud}  
                            eliminarPasajeroSolicitud = {this.eliminarPasajeroSolicitud}
                            modifyService = {this.modifyService}
                            modificarGrupo = {this.modificarGrupo}
                            nuevoPasajeroServicio = {this.nuevoPasajeroServicio}
                            todosPasajeros = {this.todosPasajeros}
                            asignarHoraServicio = {this.asignarHoraServicio}
                            AumentarNumeroServicio = {this.AumentarNumeroServicio}
                            numeroServicio={this.state.numeroServicio}  
                            listaMarcadores={listaMarcadores}
                            solicitud={this.state.solicitud}  
                            pasajeros={this.state.Pasajeros}
                            listPassanger = {this.state.listPassanger}
                            pasajeroServicio = {this.state.pasajeroServicio}
                            aerolinea = {this.state.aerolinea}
                            servicioReprogramados = {this.state.servicioReprogramados}
                            nombre_componente = 'reprogramacion'
                        />
                    </div>:
                    null   
                }
            </div>
        )
    }

}
