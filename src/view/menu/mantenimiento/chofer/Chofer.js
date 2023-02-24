import React, { Component } from 'react'
import { api } from '../../../../global/api'
import { global } from '../../../../global/global'
import TablaChofer from './TablaChofer'
import '../styles.css'
import swal from 'sweetalert'
import moment from 'moment'

export default class vehiculo extends Component {

    state = {
        token: '',
        usuario: '',
        chofer: [],
        nuevoChofer:{},
        crearChofer: {id_chofer:'', descripcion:'', direccion: '', licencia:'', telefono: '', id_chofer_velsat: '', login_velsat: '', clave_velsat: ''},
        estadosCarga:{ tabla: false }
    }

    async componentDidMount(){
        const {estadoLocalStorage, token, name} = await global.obtenerDatosLocalStorage()
        if(estadoLocalStorage){
            this.setState({usuario: name, token})
            await this.chofer(token, 'chofer', '01')
        }else{
            await swal("Mensaje", 'No se encontro información para hacer consultas al servidor.\nCerrar Sesión y volver a iniciar.', "error")
            this.setState({usuario: '', token: ''})
        }
    }

    cambiarTexto = (text) =>{
        if(text.target.value.trim().length < 0){
            this.setState({nuevoChofer:{...this.state.nuevoChofer, [text.target.name]: null}})
        }else{
            this.setState({nuevoChofer:{...this.state.nuevoChofer, [text.target.name]: text.target.value.toUpperCase()}})
        }
    }

    modificarDatosCrear = (text)=>{
        if(text.target.value.trim().length < 1){
            this.setState({crearChofer:{...this.state.crearChofer, [text.target.name]: null}})
        }else{
            this.setState({crearChofer:{...this.state.crearChofer, [text.target.name]: text.target.value.toUpperCase()}})
        }
    }

    chofer = async (token, unidad, estado) =>{
        this.setState({estadosCarga:{...this.state.estadosCarga,tabla:false}})
        const listaChofer = await api.searchUnidadesChofer_fetch(token, unidad, estado)
        if(listaChofer.error){
            if(!global.validarCookies()){
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion()
            }
            await swal("Mensaje", listaChofer.error ,"error")
            return
        }
        this.setState({chofer:listaChofer, estadosCarga:{...this.state.estadosCarga,tabla:true}})
    }

    crearNuevoChofer = async (value) =>{
        value.fecha_sistema = moment().format('YYYY-MM-DD')
        value.usuario_sistema = this.state.usuario
        value.id_estado = '01'
        const res = await api.POST_chofer_fetch(this.state.token, value)
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
        this.state.chofer.push(value)
        this.setState({crearChofer: {id_chofer:'', descripcion:'', direccion: '', licencia:'', telefono: '', id_chofer_velsat: '', usuario_velsat: '', clave_velsat: ''}})    
    }

    actualizarDatos = async (value, index) =>{
        value.usuario_mod = this.state.usuario.toUpperCase()
        value.fecha_mod = moment().format('YYYY-MM-DD') 
        const res = await api.PUT_chofer_fecth(this.state.token, value)
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
        this.state.chofer.splice(indice, 1, value)
    }

    editarChofer = (val) =>{
        this.setState({nuevoChofer:val})
    }    

    eliminarChofer = async (value, index) =>{
        let confirm = await swal({
            title: "Mensaje",
            text: `¿Estas seguro de ELIMINAR a ${value.descripcion}?`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
        if(confirm){
            let res =  await api.DELETE_chofer_fetch(this.state.token, value.id_chofer)
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
        
            swal("Mensaje","Chofer eliminado", "success")
            let indice = this.buscarIndice(value)
            this.state.chofer.splice(indice,1)
        }
    }

    limpiarChofer = () =>{
        this.setState({crearChofer: {id_chofer:'', descripcion:'', direccion: '', licencia:'', telefono: '', id_chofer_velsat: '',usuario_velsat: '', clave_velsat: ''}})
    }

    buscarIndice = (value) =>{
        let chofer = this.state.chofer
        for (let index = 0; index < chofer.length; index++) {
            if(value.id_chofer === chofer[index].id_chofer){
                return index
            }
        }    
    }

    render() {
        return (
            <div >
                <p className="historial">Mantenimiento &gt; Chofer</p>
                <TablaChofer
                    chofer = {this.state.chofer}
                    nuevoChofer = {this.state.nuevoChofer}
                    buscarChofer = {this.state.buscarChofer}
                    crearChofer = {this.state.crearChofer}
                    estadosCarga = {this.state.estadosCarga}
                    editarChofer = {this.editarChofer}
                    cambiarTexto = {this.cambiarTexto}
                    eliminarChofer = {this.eliminarChofer}
                    limpiarChofer = {this.limpiarChofer}
                    modificarDatosCrear = {this.modificarDatosCrear}
                    actualizarDatos = {this.actualizarDatos}
                    crearNuevoChofer = {this.crearNuevoChofer}
                />
            </div>
        )
    }
}
