import React, { Component } from 'react'
import moment from 'moment'
import {api} from '../../../global/api'
import {global} from '../../../global/global'
import '../style.css'
import swal from 'sweetalert'

export default class EliminarListaPasajero extends Component {

    state = {
        fecha1: null,
        fecha2: null,
        cliente: '',
        usuario: '',
        token: localStorage.getItem('token')
    }

    componentDidMount(){
        const data = JSON.parse(localStorage.getItem('data'))
        this.setState({cliente: data[0]['id_cliente'], usuairo: data[1]['name']})
    }

    formSubmit = async (e) =>{
        e.preventDefault()
        let splitFecha1 = this.state.fecha1.split('T')
        let splitFecha2 = this.state.fecha2.split('T')
        let fecha1 = moment(splitFecha1[0]);
        let fecha2 = moment(splitFecha2[0]);
        let diferencia = fecha2.diff(fecha1, 'days')
        if(diferencia < 0){
            swal('Mensaje', 'Rango de fecha no permitido, validarlo nuevamente.', 'info')
        }else{
            //let res = await this.eliminarListaPasajeros(this.state.token, this.state.cliente, splitFecha1[0], splitFecha1[1], splitFecha2[0], splitFecha1[1])
            let res = await this.eliminarListaPasajeros(this.state.token, this.state.cliente, splitFecha1[0], splitFecha1[1], splitFecha2[0], splitFecha2[1])
            if(res.error){
                if(!global.validarCookies()){ 
                    await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                    global.cerrarSesion() 
                }
                await swal("Mensaje",res.error,"errro")
                return
            }
            if(res.status !== 200){
                swal('Mensaje', 'Ocurrio un error, intentarlo nuevamente.', 'error')
            }
            swal('Mensaje', 'Lista de pasajeros eliminado.', 'success')
        }
    }

    eliminarListaPasajeros = async (token, cliente, fech1, hora1, fecha2, hora2) =>{
        return await api.eliminarListaPasajero_fetch(token, cliente, fech1, hora1, fecha2, hora2)
    }

    render() {
        return (
            <div>
                <p className="historial">Proceso &gt; Eliminar lista de pasajero</p>
                <div className="cuadro_PROCESO_PROGRAMACION cuadro_PROCESO_PROGRAMACION550px">
                    <form onSubmit={(e)=>this.formSubmit(e)}>
                    <div className="col1" style={{justifyContent:'space-around'}}>
                        <div style={{alignItems:'center'}}>
                            <span>Fecha Inicial</span>
                            <input type="datetime-local" style={{width:'180px', border:'1px solid #F0A500', padding:'3px', fontSize: '1em'}} 
                                onChange={(e)=>this.setState({fecha1:e.target.value})}/>
                        </div>                       
                        <div style={{alignItems:'center'}}>
                        <span>Fecha Final</span>
                            <input type="datetime-local" style={{width:'180px', border:'1px solid #F0A500', padding:'3px', fontSize: '1em'}} 
                            onChange={(e)=>this.setState({fecha2:e.target.value})}/>
                        </div>
                    </div>
                    <div className="col1">
                        <input type="submit" value="Eliminar" style={{fontSize:'1.1em'}}/>
                    </div>
                    </form>
                </div>
            </div>
        )
    }
}
