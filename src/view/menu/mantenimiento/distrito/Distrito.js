import React, { Component } from 'react'
import TablaDistrito from './TablaDistrito'
import { api } from '../../../../global/api'
import { global } from '../../../../global/global'
import swal from 'sweetalert'
export default class Distrito extends Component {

    state = {
        token: '',
        distrito: [],
        nuevoDistrito: {},
        crearDistrito: {id_distrito: '', descripcion: ''},
        estadosCarga:{ tabla: false }
    }

    async componentDidMount(){
        const {estadoLocalStorage, token} = await global.obtenerDatosLocalStorage()
        if(estadoLocalStorage){
            this.setState({token})
            await this.listarDistrito(token)
        }else{
            await swal("Mensaje", 'No se encontro información para hacer consultas al servidor.\nCerrar Sesión y volver a iniciar.', "error")
            this.setState({token: ''})
        }
    }

    listarDistrito = async (token) =>{
        this.setState({estadosCarga:{...this.state.estadosCarga,tabla:false}})
        let listaDistrito = await api.GET_distrito_fetch(token)
        if(listaDistrito.error){
            if(!global.validarCookies()){
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion()
            }
            await swal("Mensaje",listaDistrito.error, "error")
            return
        }
        this.setState({distrito:listaDistrito, estadosCarga:{...this.state.estadosCarga,tabla:true}})
    }

    modificarDatos = (text)=>{
        if(text.target.value.trim().length < 1){
            this.setState({nuevoDistrito:{...this.state.nuevoDistrito, [text.target.name]: null}})
        }else{
            this.setState({nuevoDistrito:{...this.state.nuevoDistrito, [text.target.name]: text.target.value.trim().toUpperCase()}})
        }
    }

    modificarDatosCrear = (text)=>{
        if(text.target.value.trim().length < 1){
            this.setState({crearDistrito:{...this.state.crearDistrito, [text.target.name]: null}})
        }else{
            this.setState({crearDistrito:{...this.state.crearDistrito, [text.target.name]: text.target.value.trim().toUpperCase()}})
        }
    }

    crearNuevoDistrito = async (value) =>{
        const res = await api.POST_distrito_fetch(this.state.token, value)
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
        this.state.distrito.push(value)
        this.setState({crearDistrito: {id_distrito: '', descripcion: ''}})    
    }

    actualizarDatos = async (value, index) =>{         
        const res  = await api.PUT_distrito_fecth(this.state.token, value)
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
        this.state.distrito.splice(indice, 1, value)
    }

    eliminarDistrito = async(value, index) =>{
        let confirm = await swal({
            title: "Mensaje",
            text: `¿Estas seguro de ELIMINAR el estado ${value.descripcion}?`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
        if(confirm){
            let res =  await api.DELETE_distrito_fetch(this.state.token, value.id_distrito)
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
            
            swal("Mensaje","Distrito eliminado.", "success")
            let indice = this.buscarIndice(value)
            this.state.distrito.splice(indice,1)
        }
    }

    distritoRepetivo = (id_distrito) =>{
        let repetido = false
        for (let index = 0; index < this.state.distrito.length; index++) {
            if(id_distrito === this.state.distrito[index].id_distrito){
                repetido = true
                break
            }
        }
        return repetido
    }

    editarDistrito = (valores) =>{
        this.setState({nuevoDistrito:valores})
    }

    limpiarCrearDistrito = () =>{
        this.setState({ crearDistrito: {id_distrito: '', descripcion: ''}})
    }

    buscarIndice = (value) =>{
        let distrito = this.state.distrito
        for (let index = 0; index < distrito.length; index++) {
            if(value.id_distrito === distrito[index].id_distrito){
                return index
            }
        }    
    }

    render() {
        return (
            <div>
                <p className="historial">Mantenimiento &gt; Distrito</p>
                <TablaDistrito
                    modificarDatos = {this.modificarDatos}
                    limpiarCrearDistrito = {this.limpiarCrearDistrito}
                    eliminarDistrito = {this.eliminarDistrito}
                    crearNuevoDistrito = {this.crearNuevoDistrito}
                    actualizarDatos = {this.actualizarDatos}
                    editarDistrito = {this.editarDistrito}
                    modificarDatosCrear = {this.modificarDatosCrear}
                    distrito = {this.state.distrito}
                    nuevoDistrito = {this.state.nuevoDistrito}
                    Creardistrito = {this.state.crearDistrito}
                    estadosCarga = {this.state.estadosCarga}
                />
            </div>
        )
    }
}
