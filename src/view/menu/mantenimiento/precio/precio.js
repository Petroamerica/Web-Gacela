import React, { Component } from 'react'
import MantenimientoTarifa from './mantenimiento'
import '../styles.css'
import swal from 'sweetalert'
import moment from 'moment'
import { api } from '../../../../global/api'
import { global } from '../../../../global/global'
export default class precio extends Component {

    state = {
        token: '',
        id_cliente: '',
        name: '',
        client: [
            {ID_CLIENTE: 'DH', ID_TIPO_SERVICIO: 'AUTO'}
        ],
        tarifa: [],
        listaTipoServicio: [],
        edit_tarifa: [],
        display_editar : false,
        search_cliente: 'select_Client',
        estadosCarga:false
    }

    async componentDidMount(){
        const {estadoLocalStorage, token, id_cliente, name} = await global.obtenerDatosLocalStorage()
        console.log(name)
        if(estadoLocalStorage){
            this.setState({token, id_cliente, name})
            await Promise.all([this.obtenerTipoServicio(token, id_cliente), this.obtenerListaTarifas(token, id_cliente)])
            this.setState({estadosCarga:true})
        }else{
            await swal("Mensaje", 'No se encontro información para hacer consultas al servidor.\nCerrar Sesión y volver a iniciar.', "error")
            this.setState({token: '', id_cliente: ''})
        }
    }

    obtenerTipoServicio =  async(token, id_cliente) =>{
        const listaTipoServicio = await api.searchTipoServicio_fetch(token)
        if(listaTipoServicio.error){
            if(!global.validarCookies()){ 
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion() 
            }
            swal("Mensaje", listaTipoServicio.error, "error")
            return
        }
        this.setState({listaTipoServicio})
    }

    obtenerListaTarifas = async(token, id_cliente) => {
        const listaTarifa = await api.searchTarifa_fetch(token, id_cliente)
        if(listaTarifa.error){
            if(!global.validarCookies()){ 
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion() 
            }
            swal("Mensaje", listaTarifa.error, "error")
            return
        }
        listaTarifa.map(value => value.pk = value.id_cliente+value.id_tipo_servicio+moment(value.fecha_ini).format('YYYYMMDD')+moment(value.fecha_fin).format('YYYYMMDD'))
        this.setState({tarifa:listaTarifa})
    }

    eliminarTarifa = async (data) =>{
        console.log(data)
        data.fecha_fin = moment(data.fecha_fin).format('YYYY-MM-DD')
        data.fecha_ini = moment(data.fecha_ini).format('YYYY-MM-DD')
        const date = moment().diff(moment(data.fecha_sistema).format(), 'hours')
        if(date > 5){
            swal("Mensaje", "Debe tener menos de 5 horas de creación para eliminar.", "error")
            return
        }
        const {id_cliente, id_tipo_servicio, fecha_ini, fecha_fin, pk} = data
        const resDelete = await api.deleteTarifa_fetch(this.state.token, id_cliente, id_tipo_servicio, fecha_ini, fecha_fin)        
        if(resDelete.error){
            swal("Mensaje", "Hubo un error cuando se intento eliminar.", "error")
            return
        }
        let nuevaTarifa = this.state.tarifa
        const tarifafilter =  nuevaTarifa.filter(value => value.pk !== pk)
        this.setState({tarifa:tarifafilter})
    }

    crearTarifa = () =>{
        this.setState({edit_tarifa: [{id_tipo_servicio: '', fecha_ini: moment().format('YYYY-MM-DD'), fecha_fin: moment().add('years',1).format('YYYY-MM-DD'), precio: ''}], display_editar:true})
    }

    ocultarTarifa = () =>{
        this.setState({edit_tarifa: [], display_editar:false})
    }

    changeText = text => { 
        let id = [text.target.name]
        this.state.edit_tarifa.map(valor=> valor[id] = text.target.value )
        this.setState({edit_tarifa: this.state.edit_tarifa})
    }

    changeText_client = text =>{
        this.setState({search_cliente: text.target.value})
    }

    formSearch = (e) =>{
        e.preventDefault()
    }

    formBtn = async (e) =>{
        e.preventDefault()
        let datosGrabar = this.state.edit_tarifa[0]
        if(!datosGrabar.id_tipo_servicio || datosGrabar.id_tipo_servicio === ''){
            swal("Mensaje", "Debe completar todos los campos.", "warning")
            return
        }
        datosGrabar.id_cliente = this.state.id_cliente
        datosGrabar.usuario_sistema = this.state.name
        datosGrabar.fecha_sistema = moment().format()
        datosGrabar.pk = datosGrabar.id_cliente+datosGrabar.id_tipo_servicio+moment(datosGrabar.fecha_ini).format('YYYYMMDD')+moment(datosGrabar.fecha_fin).format('YYYYMMDD')
        console.log(datosGrabar)
        const res = await api.postTarifa_fetch(this.state.token, datosGrabar)
        if(res.error){
            swal("Mensaje", "No puede crear dos registros en la misma fecha.", "error")
            return
        }
        let nuevaTarifa = this.state.tarifa
        nuevaTarifa.push(datosGrabar)
        console.log(nuevaTarifa)
        swal("Mensaje", "Se registro correctamente.", "success")
        this.setState({tarfa:nuevaTarifa})
        this.ocultarTarifa()
    }

    render() {
        return (
            <div>
                <p className="historial">Mantenimiento &gt; Precio</p>
                    <MantenimientoTarifa 
                        tarifa={this.state.tarifa} 
                        edit_tarifa={this.state.edit_tarifa} 
                        display_editar={this.state.display_editar} 
                        search_cliente = {this.state.search_cliente}
                        listaTipoServicio = {this.state.listaTipoServicio}
                        obtenerTarifa={this.obtenerTarifa} 
                        ocultarTarifa={this.ocultarTarifa}
                        changeText={this.changeText}
                        formBtn = {this.formBtn}
                        crearTarifa = {this.crearTarifa}
                        formSearch = {this.formSearch}
                        changeText_client = {this.changeText_client}
                        eliminarTarifa={this.eliminarTarifa}
                        estadosCarga = {this.state.estadosCarga}
                    />
            </div>
        )
    }
}
