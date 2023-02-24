import React, { Component } from 'react'
import { api } from '../../../../global/api'
import { global } from '../../../../global/global'
import TablaAerolinea from './TablaAerolinea'
import '../styles.css'
import swal from 'sweetalert'
import moment from 'moment'
export default class aerolinea extends Component {

    state = {
        cliente: '',
        token: '',
        usuario: '',
        aerolineas: [],
        nuevaAerolinea: {},
        crearAerolinea: {id_cuenta: '', descripcion: ''},
        estadosCarga:{
            tabla:false
        }
    }

    async componentDidMount(){
        const {estadoLocalStorage, token, id_cliente, name} = await global.obtenerDatosLocalStorage()
        if(estadoLocalStorage){
            this.setState({cliente: id_cliente, usuario: name, token})
            await this.aerolinea(token, id_cliente)   
        }else{
            await swal("Mensaje", 'No se encontro información para hacer consultas al servidor.\nCerrar Sesión y volver a iniciar.', "error")
            this.setState({cliente: '', usuario: '', token: ''})
        }
    }

    aerolinea = async (token, cliente) =>{
        this.setState({estadosCarga:{...this.state.estadosCarga,tabla:false}})
        const activo = await api.searchAerolineafetch(token, cliente)
        const inactivo = await api.searchAerolineafetch_02(token, cliente)
        if(activo.error || inactivo.error){
            if(!global.validarCookies()){
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion()
            }
            await swal("Mensaje", activo.error || inactivo.error, 'error')
            return
        }
        this.setState({aerolineas:activo.concat(inactivo), estadosCarga:{...this.state.estadosCarga,tabla:true}})
    }

    cambiarTexto = (text) =>{
        if(text.target.value.trim().length < 0){
            this.setState({nuevaAerolinea:{...this.state.nuevaAerolinea, [text.target.name]: null}})
        }else{
            this.setState({nuevaAerolinea:{...this.state.nuevaAerolinea, [text.target.name]: text.target.value.toUpperCase()}})
        }
    }

    modificarDatosCrear = (text)=>{
        if(text.target.value.trim().length < 1){
            this.setState({crearAerolinea:{...this.state.crearAerolinea, [text.target.name]: null}})
        }else{
            this.setState({crearAerolinea:{...this.state.crearAerolinea, [text.target.name]: text.target.value.toUpperCase()}})
        }
    }

    editarAerolinea = (val) =>{
        this.setState({nuevaAerolinea:val})
    }

    eliminarAerolinea = async (value, index) =>{
        let confirm = await swal({
            title: "Mensaje",
            text: `¿Estas seguro de eliminar la Aerolinea:  ${value.descripcion}?`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
        if(confirm){
            let res =  await api.DELETE_aerolinea_fetch(this.state.token, this.state.cliente, value.id_cuenta)
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
        
            swal("Mensaje","Aerolinea eliminada.", "success")
            let indice = this.buscarIndice(value)
            this.state.aerolineas.splice(indice,1)
        }
    }

    crearNuevaAerolinea = async (valores) =>{
        valores.id_cliente = this.state.cliente
        valores.usuario_sistema = this.state.usuario
        valores.fecha_sistema = moment().format('YYYY-MM-DD')
        valores.id_estado = '01'
        const res = await api.POST_aerolinea_fetch(this.state.token, valores)
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
        this.state.aerolineas.push(valores)
        this.setState({crearAerolinea: {id_cuenta: '', descripcion: ''}})    
    }

    actualizarDatos = async (value, index) =>{         
        const res  = await api.PUT_aerolinea_fecth(this.state.token, value)
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
        this.state.aerolineas.splice(indice, 1, value)
    }

    limpiarAerolinea = () =>{
        this.setState({ crearAerolinea: {id_cuenta: '', descripcion: '', id_estado: '01'}})
    }

    buscarIndice = (value) =>{
        let aerolineas = this.state.aerolineas
        for (let index = 0; index < aerolineas.length; index++) {
            if(value.id_cuenta === aerolineas[index].id_cuenta){
                return index
            }
        }    
    }

    render() {
        return (
            <div >
                <p className="historial">Mantenimiento &gt; Aerolinea</p>
                <TablaAerolinea
                    aerolineas = {this.state.aerolineas}
                    nuevaAerolinea = {this.state.nuevaAerolinea}
                    crearAerolinea = {this.state.crearAerolinea}
                    estadosCarga = {this.state.estadosCarga}
                    editarAerolinea = {this.editarAerolinea}
                    eliminarAerolinea = {this.eliminarAerolinea}
                    cambiarTexto = {this.cambiarTexto}
                    modificarDatosCrear = {this.modificarDatosCrear}
                    limpiarAerolinea = {this.limpiarAerolinea}
                    crearNuevaAerolinea = {this.crearNuevaAerolinea}
                    actualizarDatos = {this.actualizarDatos}
                />
            </div>
        )
    }
}
