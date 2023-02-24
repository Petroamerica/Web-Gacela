import React, { Component } from 'react'
import MantenimientoTarifa from './mantenimiento'
import '../styles.css'
import swal from 'sweetalert'
import moment from 'moment'
import { api } from '../../../../global/api'
import { global } from '../../../../global/global'
export default class tariafa extends Component {

    state = {
        token: '',
        id_cliente: '',
        name: '',
        tipoServicio: [],
        nuevoTipoServicio: [],
        editarTipoServicio:{
            id_tipo_servicio: '',
            min_rango: '',
            max_rango: '',
            id_estado: ''
        },
        display_editar : false,
        search_cliente: 'select_Client',
        estadosCarga:false
    }

    async componentDidMount(){
        const {estadoLocalStorage, token, id_cliente, name} = await global.obtenerDatosLocalStorage()
        console.log(name)
        if(estadoLocalStorage){
            this.setState({token, id_cliente, name})
            await this.obtenerListaTipoServicio(token)
            this.setState({estadosCarga:true})
        }else{
            await swal("Mensaje", 'No se encontro información para hacer consultas al servidor.\nCerrar Sesión y volver a iniciar.', "error")
            this.setState({token: '', id_cliente: ''})
        }
    }

    obtenerListaTipoServicio = async(token) => {
        const tipoServicio = await api.searchTipoServicio_fetch(token)
        if(tipoServicio.error){
            if(!global.validarCookies()){ 
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion() 
            }
            swal("Mensaje", tipoServicio.error, "error")
            return
        }
        this.setState({tipoServicio})
    }

    eliminarTarifa = async (data) =>{
        const {id_tipo_servicio} = data
        const resDelete = await api.deleteTipoServicio_fetch(this.state.token, id_tipo_servicio)        
        if(resDelete.error){
            swal("Mensaje", "Hubo un error cuando se intento eliminar.", "error")
            return
        }
        let nuevoTipoServicio = this.state.tipoServicio
        const tipoServicioFilter =  nuevoTipoServicio.filter(value => value.id_tipo_servicio !== id_tipo_servicio)
        this.setState({tipoServicio:tipoServicioFilter})
    }

    crearTipoServicio = () =>{
        this.setState({nuevoTipoServicio: [{id_tipo_servicio: '', min_rango: '', max_rango: '', id_estado: '01', fecha_sistema: moment().format()}], display_editar:true})
    }

    ocultarTipoServicio = () =>{
        this.setState({nuevoTipoServicio: [], display_editar:false})
    }

    changeText = text => { 
        let id = [text.target.name]
        this.state.nuevoTipoServicio.map(valor=> valor[id] = text.target.value )
        this.setState({nuevoTipoServicio: this.state.nuevoTipoServicio})
    }

    changeText_client = text =>{
        this.setState({search_cliente: text.target.value})
    }

    formBtn = async (e) =>{
        e.preventDefault()
        let datosGrabar = this.state.nuevoTipoServicio[0]
        if(!datosGrabar.id_tipo_servicio || datosGrabar.id_tipo_servicio === ''){
            swal("Mensaje", "Debe completar todos los campos.", "warning")
            return
        }
        if(parseInt(datosGrabar.min_rango) > parseInt(datosGrabar.max_rango)){
            swal("Mensaje", "Debe respetar los rangos de menor y mayor", "warning")
            return
        }
        datosGrabar.id_tipo_servicio = datosGrabar.id_tipo_servicio.toUpperCase()
        datosGrabar.usuario_sistema = this.state.name
        const res = await api.postTipoServicio_fetch(this.state.token, datosGrabar)
        if(res.error){
            swal("Mensaje", "No puede crear dos registros en la misma fecha.", "error")
            return
        }
        let nuevoTipoServicio = this.state.tipoServicio
        nuevoTipoServicio.push(datosGrabar)
        swal("Mensaje", "Se registro correctamente.", "success")
        this.setState({tipoServicio:nuevoTipoServicio})
        this.ocultarTipoServicio()
    }

    cambiarTexto = (text) =>{
        if(text.target.value.trim().length < 1){
            this.setState({editarTipoServicio:{...this.state.editarTipoServicio, [text.target.name]: null}})
        }else{
            this.setState({editarTipoServicio:{...this.state.editarTipoServicio, [text.target.name]: text.target.value.toUpperCase()}})
        }
    }

    cambiarValoresEditarServicio = (value) => {
        this.setState({editarTipoServicio: value})
    }
    
    actualizarDatos = async (value) => {
        const res = await api.putTipoServicio_fetch(this.state.token, value)
        if(res.error){
            swal("Mensaje", "Hubo un error cuando se actualiza los datos", "error")
            return
        }
        let nuevoTipoServicio = this.state.tipoServicio
        let indexOf = nuevoTipoServicio.findIndex(element => element.id_tipo_servicio === value.id_tipo_servicio)
        if(indexOf < 0) return
        nuevoTipoServicio.splice(indexOf,1,value)
        this.setState({tipoServicio: nuevoTipoServicio})
        swal("Mensaje", "Se Actualizo correctamente.", "success")
    }

    render() {
        return (
            <div>
                <p className="historial">Mantenimiento &gt; Tipo Servicio</p>
                    <MantenimientoTarifa 
                        tipoServicio={this.state.tipoServicio} 
                        nuevoTipoServicio={this.state.nuevoTipoServicio} 
                        display_editar={this.state.display_editar} 
                        search_cliente = {this.state.search_cliente}
                        editarTipoServicio = {this.state.editarTipoServicio}
                        estadosCarga = {this.state.estadosCarga}
                        ocultarTipoServicio={this.ocultarTipoServicio}
                        changeText={this.changeText}
                        formBtn = {this.formBtn}
                        crearTipoServicio = {this.crearTipoServicio}
                        changeText_client = {this.changeText_client}
                        eliminarTarifa={this.eliminarTarifa}
                        cambiarTexto={this.cambiarTexto}
                        cambiarValoresEditarServicio={this.cambiarValoresEditarServicio}
                        actualizarDatos={this.actualizarDatos}
                    />
            </div>
        )
    }
}
