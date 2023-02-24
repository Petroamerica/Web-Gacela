import React, { Component } from 'react'
import { api } from '../../../../global/api'
import { global } from '../../../../global/global'
import TablaMovilizacion from './TablaMovilizacion'
import swal from 'sweetalert'
import '../styles.css'
export default class EstadoMovilizacion extends Component {

    state = {
        token: '',
        ffat: [],
        nuevoffat: {},
        crearffat:{id_tipo_estado_mov: '', descripcion: '', flg_facturable: ''},
        estadosCarga:{ tabla: false }
    }

    async componentDidMount(){
        const {estadoLocalStorage, token} = await global.obtenerDatosLocalStorage()
        if(estadoLocalStorage){
            this.setState({token})
           await this.ListarFFAT(token)
        }else{
            await swal("Mensaje", 'No se encontro información para hacer consultas al servidor.\nCerrar Sesión y volver a iniciar.', "error")
            this.setState({token: ''})
        }
    }

    ListarFFAT = async (token) =>{
        this.setState({estadosCarga:{...this.state.estadosCarga,tabla:false}})
        const listaFFAT = await api.searchFFTA_fetch(token)
        if(listaFFAT.error){
            if(!global.validarCookies()){
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion()
            }
            await swal("Mensaje", listaFFAT.error ,"error")
            return
        }
        this.setState({ffat:listaFFAT, estadosCarga:{...this.state.estadosCarga,tabla:true}})
    }

    modificarDatos = (text)=>{
        if(text.target.value.trim().length < 1){
            this.setState({nuevoffat:{...this.state.nuevoffat, [text.target.name]: null}})
        }else{
            this.setState({nuevoffat:{...this.state.nuevoffat, [text.target.name]: text.target.value.trim().toUpperCase()}})
        }
    }

    editarFFAT = (valores) =>{
        this.setState({nuevoffat: valores})
    }

    crearNuevoEstadoM = async (valores) =>{
        const res = await api.saveFFAT_fecth(this.state.token, valores)
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
        this.state.ffat.push(valores)
        this.setState({crearffat:{id_tipo_estado_mov: '', descripcion: '', flg_facturable: ''}})    
    }

    actualizarDatos = async (value, index) =>{         
        const res  = await api.updateFFAT_fecth(this.state.token, value)
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
        this.state.ffat.splice(indice, 1, value)
    }

    eliminarEstadoMovilizacion = async(value, index) =>{
        let confirm = await swal({
            title: "Mensaje",
            text: `¿Estas seguro de ELIMINAR el estado ${value.descripcion}?`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
        if(confirm){
            let res =  await api.eliminarEstadoMovilizacion_fetch(this.state.token, value.id_tipo_estado_mov)
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
        
            swal("Mensaje","Nuevos datos ingresados satisfactoriamente.", "success")
            let indice = this.buscarIndice(value)
            this.state.ffat.splice(indice,1)
        }
    }

    limpiarFFAT = () =>{
        this.setState({crearffat: [{id_tipo_estado_mov: '', descripcion: '', flg_facturable: ''}]})
    }

    editarFFATCrear = (text) =>{
        if(text.target.value.trim().length < 1){
            this.setState({crearffat:{...this.state.crearffat, [text.target.name]: null}})
        }else{
            this.setState({crearffat:{...this.state.crearffat, [text.target.name]: text.target.value.trim().toUpperCase()}})
        }
    }

    buscarIndice = (value) =>{
        let ffat = this.state.ffat
        for (let index = 0; index < ffat.length; index++) {
            if(value.id_tipo_estado_mov === ffat[index].id_tipo_estado_mov){
                return index
            }
        }    
    }

    render() {
        return (
            <div >
                <p className="historial">Mantenimiento &gt; Estado Movilización</p>
                <TablaMovilizacion 
                    modificarDatos = {this.modificarDatos}
                    editarFFAT = {this.editarFFAT}
                    crearNuevoEstadoM = {this.crearNuevoEstadoM}
                    eliminarEstadoMovilizacion = {this.eliminarEstadoMovilizacion}
                    limpiarFFAT = {this.limpiarFFAT}
                    editarFFATCrear = {this.editarFFATCrear}
                    actualizarDatos = {this.actualizarDatos}
                    ffat = {this.state.ffat}
                    nuevoffat = {this.state.nuevoffat}
                    crearffat = {this.state.crearffat}
                    estadosCarga = {this.state.estadosCarga}
                />
            </div>
        )
    }
}
