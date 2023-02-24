import React, { Component } from 'react'
import swal from 'sweetalert'

import { api } from '../../../../global/api'
import { global } from '../../../../global/global'

import TablaCliente from './TablaCliente'

const datosCliente = {
    id_cliente: '', 
    descripcion: '', 
    descripcion_corta: '',
    email: '',
    direccion: null,
    fono: null,
    id_estado: '01',
    nro_di: null
}

export default class Cliente extends Component {

    state = {
        token: '',
        clientes: [],
        nuevoCliente: {},
        crearCliente: datosCliente,
        estadosCarga:{ tabla: false }
    }

    async componentDidMount(){
        const {estadoLocalStorage, token} = await global.obtenerDatosLocalStorage()
        if(estadoLocalStorage){
            this.setState({token})
            await this.listaCliente(token)
        }else{
            await swal("Mensaje", 'No se encontro información para hacer consultas al servidor.\nCerrar Sesión y volver a iniciar.', "error")
            this.setState({token: ''})
        }
    }

    listaCliente = async (token) =>{
        this.setState({estadosCarga:{...this.state.estadosCarga,tabla:false}})
        let listaClientes = await api.searchClient_fetchSinToken()
        if(listaClientes.error){
            if(!global.validarCookies()){
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion()
            }
            await swal("Mensaje", listaClientes.error, "error")
            return
        }
        this.setState({clientes:listaClientes, estadosCarga:{...this.state.estadosCarga,tabla:true}})
    }

    modificarDatos = (text)=>{
        if(text.target.value.trim().length < 1){
            this.setState({nuevoCliente:{...this.state.nuevoCliente, [text.target.name]: null}})
        }else{
            this.setState({nuevoCliente:{...this.state.nuevoCliente, [text.target.name]: text.target.value.toUpperCase()}})
        }
    }

    modificarDatosCrear = (text)=>{
        if(text.target.value.trim().length < 1){
            this.setState({crearCliente:{...this.state.crearCliente, [text.target.name]: null}})
        }else{
            this.setState({crearCliente:{...this.state.crearCliente, [text.target.name]: text.target.value.toUpperCase()}})
        }
    }

    crearNuevoCliente = async (value) =>{
        const res = await api.postCliente_fetch(this.state.token, value)
        if(res.error){
            if(!global.validarCookies()){
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion()
            }
            await swal("Mensaje",res.error, "error")
            return
        }
        if(res.status !== 200){
            await swal("Mensaje","Ocurrio un error inesperado.", "error")
            return
        }
        await swal("Mensaje","Nuevos datos ingresados satisfactoriamente.", "success")
        this.listaCliente()
        /*this.state.clientes.push(value)*/
        this.setState({crearCliente: datosCliente})
    }

    actualizarDatos = async (value, index) =>{
        const res  = await api.putCliente_fetch(this.state.token, value)
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
        this.listaCliente()
        //let indice = this.buscarIndice(value)
        //this.state.clientes.splice(indice, 1, value)
    }

    eliminarCliente = async(value, index) =>{
        let confirm = await swal({
            title: "Mensaje",
            text: `¿Estas seguro de ELIMINAR el cliente ${value.descripcion}?`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
        if(confirm){
            let res =  await api.deleteCliente_fetch(this.state.token, value.id_cliente)
            if(res.error){
                if(!global.validarCookies()){
                    await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                    global.cerrarSesion()
                }
                await swal("Mensaje",res.error, "error")
                return
            }

            if(res.status !== 200){
                await swal("Mensaje","Ocurrio un error inesperado.", "error")
                return
            }
            swal("Mensaje","Cliente eliminado.", "success")
            this.listaCliente()
            //let indice = this.buscarIndice(value)
            //this.state.distrito.splice(indice,1)
        }
    }

    clienteRepetido = (id_cliente) =>{
        let repetido = false
        for (let index = 0; index < this.state.clientes.length; index++) {
            if(id_cliente === this.state.distrito[index].id_cliente){
                repetido = true
                break
            }
        }
        return repetido
    }

    editarCliente = (valores) =>{
        this.setState({nuevoCliente:valores})
    }

    limpiarCrearCliente = () =>{
        this.setState({ crearCliente: datosCliente})
    }

    buscarIndice = (value) =>{
        let clientes = this.state.clientes
        for (let index = 0; index < clientes.length; index++) {
            if(value.id_cliente === clientes[index].id_cliente){
                return index
            }
        }    
    }

    render() {
        return (
            <div>
                <p className="historial">Mantenimiento &gt; Cliente</p>
                <TablaCliente
                    modificarDatos = {this.modificarDatos}
                    limpiarCrearCliente = {this.limpiarCrearCliente}
                    eliminarCliente = {this.eliminarCliente}
                    crearNuevoCliente = {this.crearNuevoCliente}
                    actualizarDatos = {this.actualizarDatos}
                    editarCliente = {this.editarCliente}
                    modificarDatosCrear = {this.modificarDatosCrear}
                    clientes = {this.state.clientes}
                    nuevoCliente = {this.state.nuevoCliente}
                    crearCliente = {this.state.crearCliente}
                    estadosCarga = {this.state.estadosCarga}
                />
            </div>
        )
    }
}
