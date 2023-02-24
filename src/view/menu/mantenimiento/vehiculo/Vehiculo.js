import React, { Component } from 'react'
import { api } from '../../../../global/api'
import { global } from '../../../../global/global'
import TablaVehiculo from './TablaVehiculo'
import '../styles.css'
import swal from 'sweetalert'
import moment from 'moment'

export default class vehiculo extends Component {

    state = {
        token: '',
        vehiculos: [],
        usuario: '',
        nuevoVehiculo:{},
        crearVehiculo:  {id_unidad: '', marca: '', modelo: '', placa :''},
        estadosCarga:{ tabla: false }
    }

    async componentDidMount(){
        const {estadoLocalStorage, token, name} = await global.obtenerDatosLocalStorage()
        if(estadoLocalStorage){
            this.setState({usuario: name, token})
            await this.vehiculo(token, 'unidad', '01')
        }else{
            await swal("Mensaje", 'No se encontro información para hacer consultas al servidor.\nCerrar Sesión y volver a iniciar.', "error")
            this.setState({usuario: '', token: ''})
        }
    }

    vehiculo = async (token, unidad, estado) =>{
        this.setState({estadosCarga:{tabla:false}})
        const listaVehiculo = await api.searchUnidadesChofer_fetch(token, unidad, estado)
        if(listaVehiculo.error){
            if(!global.validarCookies()){
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion()
            }
            await swal("Mensaje", listaVehiculo.error, "error")
            return
        }
        this.setState({vehiculos:listaVehiculo, estadosCarga:{...this.state.estadosCarga,tabla:true}})
    }

    editarVehiculo = (val) =>{
        this.setState({nuevoVehiculo:val})
    }

    cambiarTexto = (text) =>{
        if(text.target.value.trim().length < 1){
            this.setState({nuevoVehiculo:{...this.state.nuevoVehiculo, [text.target.name]: null}})
        }else{
            this.setState({nuevoVehiculo:{...this.state.nuevoVehiculo, [text.target.name]: text.target.value.toUpperCase()}})
        }
    }

    modificarDatosCrear = (text)=>{
        if(text.target.value.trim().length < 1){
            this.setState({crearVehiculo:{...this.state.crearVehiculo, [text.target.name]: null}})
        }else{
            this.setState({crearVehiculo:{...this.state.crearVehiculo, [text.target.name]: text.target.value.toUpperCase()}})
        }
    }

    crearNuevoVehiculo = async (value) =>{
        value.fecha_sistema = moment().format('YYYY-MM-DD')
        value.usuario_sistema = this.state.usuario
        value.id_estado = '01'
        const res = await api.POST_vehiculo_fetch(this.state.token, value)
        if(res.error){
            if(!global.validarCookies()){
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion()
            }
            await swal("Mensaje", res.error, "error")
            return
        }

        if(res.status !== 200){
            await swal("Mensaje","Ocurrio un error inesperado.", "error")
            return
        }
        await swal("Mensaje","Nuevos datos ingresados satisfactoriamente.", "success")
        this.state.vehiculos.push(value)
        this.setState({crearVehiculo:  {id_unidad: '', marca: '', modelo: '', placa :''}})    
    }

    actualizarDatos = async (value, index) =>{ 
        value.usuario_mod = this.state.usuario.toUpperCase()
        value.fecha_mod = moment().format('YYYY-MM-DD') 
        const res = await api.PUT_vehiculo_fecth(this.state.token, value)
        if(res.error){
            if(!global.validarCookies()){
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion()
            }
            await swal("Mensaje", res.error, "error")
            return
        }
        if(res.status !== 200){
            await swal("Mensaje","Ocurrio un error inesperado.", "error")
            return
        }
        await swal("Mensaje","Nuevos datos ingresados satisfactoriamente.", "success")
        let indice = this.buscarIndice(value)
        this.state.vehiculos.splice(indice, 1, value)
    }

    eliminarVehiculo = async (value, index) =>{
        let confirm = await swal({
            title: "Mensaje",
            text: `¿Estas seguro de ELIMINAR el auto ${value.id_unidad}?`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
        if(confirm){
            let res =  await api.DELETE_vehiculo_fetch(this.state.token, value.id_unidad)
            if(res.error){
                if(!global.validarCookies()){
                    await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                    global.cerrarSesion()
                }
                await swal("Mensaje", res.error, "error")
                return
            }
            if(res.status !== 200){
                await swal("Mensaje","Ocurrio un error inesperado.", "error")
                return
            }
        
            swal("Mensaje","Vehiculo eliminado", "success")
            let indice = this.buscarIndice(value)
            this.state.vehiculos.splice(indice,1)
        }
    }

    limpiarVehiculo = () =>{
        this.setState({ crearVehiculo: {id_unidad: '', marca: '', modelo: '', placa :''}})
    }

    buscarIndice = (value) =>{
        let vehiculos = this.state.vehiculos
        for (let index = 0; index < vehiculos.length; index++) {
            if(value.id_unidad === vehiculos[index].id_unidad){
                return index
            }
        }    
    }

    render() {
        return (
            <div >
                <p className="historial">Mantenimiento &gt; Vehiculo</p>
                <TablaVehiculo
                    vehiculos = {this.state.vehiculos}
                    nuevoVehiculo = {this.state.nuevoVehiculo}
                    crearVehiculo = {this.state.crearVehiculo}
                    estadosCarga = {this.state.estadosCarga}
                    cambiarTexto = {this.cambiarTexto}
                    eliminarVehiculo = {this.eliminarVehiculo}
                    editarVehiculo = {this.editarVehiculo}
                    modificarDatosCrear = {this.modificarDatosCrear}
                    limpiarVehiculo = {this.limpiarVehiculo}
                    crearNuevoVehiculo = {this.crearNuevoVehiculo}
                    actualizarDatos = {this.actualizarDatos}
                />
            </div>
        )
    }
}
