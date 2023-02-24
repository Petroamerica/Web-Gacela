import React, { Component } from 'react'
import '../style.css'
import { global } from '../../../global/global'
import "react-datepicker/dist/react-datepicker.css";
import Solicitudes from './config/solicitudes'; 
import CuadroMapa from './config/CuadroMapa';
import loader from '../../../assets/loader.gif'
import {api} from '../../../global/api'
import swal from 'sweetalert'
export default class Programacion extends Component {

    state = {
        user: '',
        token: '',
        fechaI: "",
        cliente: "",
        horaI : "",
        usuario: '',
        cliente_descp: '',
        origen: "_ori_NA",
        btn_botonReserva: 'Reservar',
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
        aerolinea:[]
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
            await swal("Mensaje", listPassanger.error, "Error")
            return
        }
        this.setState({listPassanger})
    }

    onsubmit = async (e) => { 
        e.preventDefault()
        let procesar = false
        if(this.state.solicitud.length > 0){
            let confirm = await swal({
                title: "Mensaje",
                text: 'Tiene servicios creados sin guardar, ¿Deseas continuar y perder los cambios realizados?',
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            if(confirm){
                procesar = true
            }
        }else{
            procesar = true
        }
        if(procesar){
            if(this.state.fechaI  &&  this.state.cliente && this.state.cliente !== '_cli_NA' && this.state.origen && this.state.origen !== '_ori_NA' && this.state.horaI !== ''){
                this.setState({Pasajeros:[], pre_solicitud:[], solicitud:[], viewLoader: false})
                const listPassanger =  await api.searchListaPasajero(this.state.token, this.state.cliente, this.state.fechaI, this.state.origen,  this.state.horaI, this.state.horaI, 'a')
                const listAerolinea =  await api.searchAerolineafetch(this.state.token, this.state.cliente)
                const numeroServicio = await api.searchNumeroServicio_fetch(this.state.token, this.state.cliente, this.state.fechaI)
                if(listPassanger.error || listAerolinea.error || numeroServicio.error){
                    if(!global.validarCookies()){
                        await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                        global.cerrarSesion()
                    }
                    this.setState({listadeGrupoDisplay:true, viewLoader: true})
                    await swal("Mensaje", listPassanger.error || listAerolinea.error || numeroServicio.error, "error")
                    return
                }

                listPassanger.forEach((value, index) => {
                    value['estado'] =  true
                    value['numViaje'] = (index+1)
                    value['numServicio'] = 0
                })
                this.setState({numeroServicio: numeroServicio[0].campo, numeroServicio_fetch: numeroServicio[0].campo, aerolinea: listAerolinea, Pasajeros: listPassanger})
                this.setState({listadeGrupoDisplay:true, viewLoader: true})
            }else{
                swal("Mensaje","Debe completar todos los campos para procesar la programación.", "info")
            }
        }
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

    quitarPasajero = (id_pasajero) =>{
        swal({
            title: "Mensaje",
            text: "¿Seguro de retirar a este pasajero?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                const pre_solicitud = this.state.pre_solicitud.filter(index => index.id_pasajero !== id_pasajero)
                pre_solicitud.map((index, num) => index['numServicio'] = (num+1))
                this.state.Pasajeros.map(value => value.id_pasajero === id_pasajero ? ((value['estado'] = true, value['numServicio'] = 0)) : null )
                this.setState({pre_solicitud:pre_solicitud, Pasajeros: this.state.Pasajeros, reservarStatus : (this.state.pre_solicitud.length-1 < 1) ? true: false})
            } 
        });
    }

    modificarGrupo = (arreglo) =>{ 
        this.setState({Pasajeros:arreglo}) 
    }

    agregarSolicitud = () =>{
        this.setState({btn_botonReserva: 'Cargando...'})
        this.setState({marcadorCerrado:false})
        document.getElementById('botonReserva').disabled = true
        const promesa = new Promise ((resolve, reject)=>{
            const pre_solicitud = {data:[], cab:[]}
            this.state.pre_solicitud.map(index => pre_solicitud.data.push(index))
            pre_solicitud.cab = {hora_servicio : '', nro_servicio : (this.state.numeroServicio+1)}
            setTimeout(function(){resolve(pre_solicitud);}, 1000);
        })
        promesa.then( resolve => {
            this.setState({ solicitud: [...this.state.solicitud, resolve], pre_solicitud: [], 
                btn_botonReserva: 'Reservar', reservarStatus:true, marcadorCerrado:true, numeroServicio: (this.state.numeroServicio+1) })
        })
    }

    retirarPasajeroSolicitud = (_key, _indice, id) =>{
        swal({
            title: "Mensaje",
            text: "¿Estas seguro de LIBERAR a este pasajero del servicio para volver a seleccionarlo?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                this.state.solicitud.forEach((valores, key)=>{
                    if(key === _key){
                        if(valores.data.length === 1) this.state.solicitud.splice(_key,1)
                        valores.data.splice(_indice,1)
                        this.state.Pasajeros.map((index, conta)=> (index.id_pasajero === id) ? ((index['estado'] = true, index['numServicio'] = 0)): null )
                        this.setState({Pasajeros: this.state.Pasajeros})
                    }
                })
                this.state.solicitud.map((valores, key)=> (key === _key) ? valores.data.map((data, num)=> data['numServicio'] = (num+1) ) : null)
                let arreglo = this.recorrerNumeroServicio(this.state.solicitud)
                this.setState({solicitud: arreglo})
            } 
        });
    }

    eliminarPasajeroSolicitud = async (_key, _indice, value) =>{
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
                await swal("Mensaje", res.error, "error")
                return
            }
            if(res.status !== 200){
                swal('Mensaje', 'Ocurrio un error en el proceso de la eliminacion, intentarlo nuevamente por favor.', 'error')
                return
            }

            swal('Mensaje', value.descripcion_pasajero + ' se elimino de la Lista de Pasajeros.', 'success')
                
            this.state.solicitud.forEach((valores, key)=>{
                if(key === _key){
                    if(valores.data.length === 1) this.state.solicitud.splice(_key,1)
                    valores.data.splice(_indice,1)
                    this.state.Pasajeros.map((index, conta)=> (index.id_pasajero === value.id_pasajero) ?  this.state.Pasajeros.splice(conta, 1) : null )
                    this.setState({Pasajeros: this.state.Pasajeros})
                }
            })
            this.state.solicitud.map((valores, key)=> (key === _key) ? valores.data.map((data, num)=> data['numServicio'] = (num+1) ) : null)
            let arreglo = this.recorrerNumeroServicio(this.state.solicitud)
            this.setState({solicitud: arreglo})

        }
    }

    mostrarMapa = () =>{
        let preS = this.state.pre_solicitud
        if(preS.length > 0){
            swal({
                title: "Mensaje",
                text: "¿Quieres descartar los cambios?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              .then((willDelete) => {
                if (willDelete) {
                    this.state.Pasajeros.map((value, index)=>
                        preS.map((subValue, subIndex)=> 
                            (value.id_pasajero === subValue.id_pasajero) ? ((subValue['estado'] = true, value['numServicio'] = 0)) : null
                        )
                    )
                    this.setState({ mapaDisplay: false, pre_solicitud: []})
                } 
            });
        }else{
            this.setState({ mapaDisplay: false})
        }
    }

    BtnSave_Services = async () =>{
        var patt = new RegExp(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/)
        let comprobarHoraServicio = false
        this.state.solicitud.map(value => value.cab.hora_servicio === '' || !patt.test(value.cab.hora_servicio) ? comprobarHoraServicio = true : null) 
        if(!comprobarHoraServicio) {
            const confirmac = await swal({
                title:"Mensaje",
                text: "¿Estas seguro de guardar los servicios?",
                icon: "warning",
                buttons: true,
                dangerMode: true
            })
            if(confirmac){
                const data = []
                let contador = -1
                this.state.solicitud.forEach((value, index)=>{
                    value.data.forEach((dat, indice) => {
                        data.push({
                            id_cliente: this.state.cliente,
                            id_pasajero: dat.id_pasajero,
                            fecha: this.state.fechaI,
                            origen: this.state.origen,
                            hora: dat.hora,
                            nro_servicio: value.cab.nro_servicio,
                            usuario: this.state.user.toUpperCase(),
                            Orden_recojo: dat.numServicio,
                            id_cuenta: dat.id_cuenta
                        })
                    })
                    if(contador !== index){
                        data.push({
                            hora_inicio: value.cab.hora_servicio,
                            id_cliente: this.state.cliente,
                            nro_servicio:value.cab.nro_servicio,
                            fecha: this.state.fechaI,
                            hora: value.data[0].hora,
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
                    await swal("Mensaje", res.error, "error")
                    return
                }

                if(res.status !== 200){
                    swal("Mensaje","Se genero un error. Por favor intentarlo nuevamente.", "error")
                    return
                }

                swal("Mensaje","Servicio guardado satisfactoriamente.", "success")
                this.setState({solicitud:[]})
                this.filtrarHoras()
            }
        }else{
            swal("Mensaje", "La hora del servicio esta ingresado incorrectamente.", "info")
        }
    }

    modifyService = (list, startIndex, endIndex) =>{
        const result = [...list]
        let start = {}
        result.forEach( (value, index) => {
            if(index === parseInt(startIndex.droppableId)){
                start = value.data[startIndex.index]
                value.data.splice(startIndex.index, 1)
            }
        })
        result.forEach((value, index)=>{
            if(index === parseInt(endIndex.droppableId)){
                value.data.splice(endIndex.index, 0, start)
            }
        })
        result.forEach(values=>{
            let contador = 1
            values.data.forEach(subValue=>{
                subValue['numServicio'] = contador++
            })
        })
        let servicio = this.validadServicioVacio(list)
        let arreglo = []
        if(servicio !== null){
            result.splice(servicio, 1)
            arreglo = this.recorrerNumeroServicio(result)
        }else{
            arreglo = result
        }
        this.setState({solicitud: arreglo})
    }

    validadServicioVacio = (arreglo) =>{
        let index = null
        arreglo.forEach((value, indice)=>{
            if(value.data.length === 0){
                index = indice
            }
        })
        return index
    }

    recorrerNumeroServicio = (arreglo) =>{
        let num_servicio = this.state.numeroServicio_fetch +1
        arreglo.map(value => ((value.cab.nro_servicio = num_servicio, num_servicio++)))
        this.setState({numeroServicio: (num_servicio-1)})
        return arreglo
    }
    
    nuevoPasajeroServicio = async (pasajero, hora, posicion, erolinea) =>{
        const validarPasajero = this.state.Pasajeros.filter(value => value.id_pasajero === pasajero[0].id_pasajero)
        if(validarPasajero.length>0){
            swal("Mensaje", "Este pasajero ya se encuentra en servicio", "error")
        }else{
            let cantidadSolicitud = this.state.solicitud[posicion].data.length
            pasajero.map(value => ((
                value['estado'] = false, 
                value['numServicio'] = (cantidadSolicitud+1), 
                value['hora'] = hora, 
                value['descripcion_pasajero']= value.descripcion,
                value['numViaje'] = 0,
                value['descripcion_distrito'] = value.id_distrito,
                value['id_cuenta'] = erolinea,
                value['fecha'] = this.state.fechaI,
                value['origen'] = this.state.origen,
                value['usuario'] = this.state.user.toUpperCase()
            )))
            const res = await api.saveServices_fetch(this.state.token, pasajero, 'i')
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

            this.state.Pasajeros.push(pasajero[0])
            this.state.solicitud[posicion].data.push(pasajero[0])
            this.setState({solicitud:this.state.solicitud})
            swal("Mensaje", "Nuevo pasajero agregado.", "success")
        }
    }

    change_hora = (text) =>{
        if(text.target.name === "fechaI"){ this.setState({fechaI:text.target.value}) }
        if(text.target.name === "origen"){ this.setState({origen:text.target.value}) }
        this.setState({viewHora:false})
        setTimeout(()=>{
            if(this.state.fechaI !== "" && this.state.origen !== "_ori_NA"){ this.filtrarHoras() }
        }, 1000)
    }

    filtrarHoras =  async ()=> {
        const listHOra =  await api.searchHora_fetch(this.state.token, this.state.cliente, this.state.fechaI, this.state.origen)
        if(listHOra.error){
            if(!global.validarCookies()){
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion()
            }
            await swal("Mensaje", listHOra.error, "error")
            return
        }
        this.setState({listaHoras: listHOra, viewHora: true})   
    }

    asignarHoraServicio = (valor, _servicio) =>{
        this.state.solicitud.map((value, servicio) => servicio === _servicio ? value.cab.hora_servicio = valor.target.value : null )
        this.setState({solicitud: this.state.solicitud})
    }

    AumentarNumeroServicio = (num) =>{
        this.setState({numeroServicio: num}) 
    }

    render() {
        const listaMarcadores = this.state.Pasajeros.filter(index => index.estado === true)
        const cantidadPasajeros = (this.state.solicitud.length > 0) ? true: false
        return (
            <div>
                <p className="historial">Proceso &gt; Programacion</p>
                <div className="cuadro_PROCESO_PROGRAMACION">
                    <form onSubmit={this.onsubmit}>
                    <div>
                        <div className="col1">
                            <div>
                                <span>Fecha</span>
                                <input type="date" name="fechaI" 
                                    value={this.state.fechaI} 
                                    style={{width:'150px', border:'1px solid #d9a600', padding:'3px', fontSize: '1em'}} 
                                    onChange={e=> this.change_hora(e)}/>
                            </div>                       
                            <div>
                                <span>Servicio</span>
                                <select name="origen" value={this.state.origen} onChange={e=>this.change_hora(e)}>
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
                                        style={{width:'150px', border:'1px solid #d9a600', padding:'3px', fontSize: '1em'}} 
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
                                cantidadPasajeros ? <input type="button" value="Guardar Servicios" className="mostrarMapa" onClick={()=> this.BtnSave_Services()} />   : null
                            }
                        </div>
                        <Solicitudes 
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
                            nombre_componente = 'programacion'
                        />
                    </div>:
                    null   
                }
            </div>
        )
    }
}