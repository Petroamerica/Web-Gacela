import React, { Component } from 'react'
import {api} from '../../../global/api'
import {global} from '../../../global/global'
import * as XLSX from 'xlsx'
import swal from 'sweetalert'

export default class CargaXlsxPasajeros extends Component {

    state = {
        file: null,
        pasajeros: [],
        pasajerosActivos: [],
        siExistentes: [],
        alertCant:0,
        alert:false,
        alert2: false,
        btnState: false,
        estadoBtn: true,
        btnValue: 'Cargar',
        respuesta: '',
        usuario: '',
        token: ''
    }

    async componentDidMount(){
        /*const data = await JSON.parse(localStorage.getItem('data'))
        this.setState({usuario: data[0]['id_cliente'], user: data[1]['name']})*/
        await document.getElementById('form_XLSX').reset()
        const {estadoLocalStorage, id_cliente, token} = await global.obtenerDatosLocalStorage()
        if(estadoLocalStorage){
            this.setState({usuario: id_cliente ,token})
            let pasajerosActivos = await api.passanger_fetch(token, id_cliente)
            if(pasajerosActivos.error){
                if(!global.validarCookies()){
                    await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                    global.cerrarSesion()
                }
                await swal("Mensaje", pasajerosActivos.error, "error")
                return
            }
            this.setState({pasajerosActivos})
        }else{
            await swal("Mensaje", 'No se encontro información para hacer consultas al servidor.\nCerrar Sesión y volver a iniciar.', "error")
            this.setState({usuario: '',token: ''})
        }
    }

    readExcel = async (file) =>{
        return await new Promise((resolve, reject) =>{
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file)
            fileReader.onload = (e) =>{
                const bufferArray = e.target.result
                const wb = XLSX.read(bufferArray, {type:'buffer'})
                const wsname = wb.SheetNames[0]
                const ws = wb.Sheets[wsname]
                const data = XLSX.utils.sheet_to_json(ws)
                setTimeout(()=>{resolve(data)}, 1000)
            }
            fileReader.onerror=((error)=>{
                setTimeout(()=>{reject(error)}, 1000)
            })
        })
    }

//PASAJEROS QUE NO ESTAN REGISTRADOS EN EL SISTEMA
    compararPasajeros_NO = (valor, id_cliente) =>{
        let pasajerosA = this.state.pasajerosActivos
        let contador = 0
        if(pasajerosA.length > 0){
            for (let index = 0; index < pasajerosA.length; index++) {
                if(pasajerosA[index].id_pasajero.toString() !== valor.toString() && pasajerosA[index].id_cliente.toString().toUpperCase() === id_cliente.toString().toUpperCase()){
                    contador += 1
                }
                if(index+1 === pasajerosA.length){
                    if(index === contador){
                        return false
                    }else{
                        return true
                    }
                }
            }
        }else{
            return true
        }
    }
//PASAJEROS QUE SI ESTAN REGISTRADOS EN EL SISTEMA
    compararPasajeros_SI = (valor, id_cliente) =>{
        let pasajerosA = this.state.pasajerosActivos
        let contador = 0
        for (let index = 0; index < pasajerosA.length; index++) {
            if(pasajerosA[index].id_pasajero.toString() !== valor.toString() && pasajerosA[index].id_cliente.toString().toUpperCase() === id_cliente.toString().toUpperCase()){
                contador += 1
            }
            if(index+1 === pasajerosA.length){
                if(index === contador){
                    return true
                }else{
                    return false
                }
            }
        }
    }

    depurarLista = (lista) =>{
        const setObj = new Set();
        return lista.reduce((acc, persona) => {
            if (!setObj.has(persona.id_pasajero.toString())){
              setObj.add(persona.id_pasajero.toString(), persona)
              acc.push(persona)
            }
            return acc;
        },[]);
    }

    onsubmit = async(e) =>{
        e.preventDefault();
        this.setState({btnValue: 'Procesando...', respuesta : 'Procesando..', btnState: true, alertCant:0, alert: false, alert2: false, estadoBtn: false})
        if(this.state.file){
            const file = await this.state.file.target.files[0]
            try{
                let pasajerosXLSX = await this.readExcel(file)
                let pasajerosXLSXNuevo = this.depurarLista(pasajerosXLSX)
                this.setState({pasajeros: pasajerosXLSXNuevo, btnValue: 'Cargar', btnState: false})   
            }catch(e){
                throw await swal('Mensaje', 'No se puede leer el archivo .xlsx', 'error')
            }
            let pasajero_NO
            let pasajero_SI
            try{
                pasajero_NO = this.state.pasajeros.filter(value => this.compararPasajeros_NO(value.id_pasajero, value.id_cliente))
                pasajero_SI = this.state.pasajeros.filter(value => this.compararPasajeros_SI(value.id_pasajero, value.id_cliente))
            }catch(e){
                throw await swal('Mensaje', 'Por favor revisar la estructura del xlsx antes de ingresar los pasajeros.', 'error')
            }
            if(pasajero_SI.length > 0 && pasajero_NO.length > 0){
                swal({
                    title: "Mensaje",
                    text: "Algunos pasajeros del excel ya estan ingresados en el sistema, ¿Desea ingresar lo faltante?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  })
                  .then(async (willDelete) => {
                    if (willDelete){
                        await this.IngresarRegistro(pasajero_SI, pasajero_NO)
                    }else{
                        this.setState({siExistentes:pasajero_SI, alert2: true, btnState: false,btnValue: 'Cargar'})
                    }
                }); 
            }else if(pasajero_SI.length > 0){
                swal('Mensaje', 'Los pasajeros ya se encuentran ingresados en el sistema.', 'info')
                this.setState({siExistentes:pasajero_SI, alert2: true, btnState: false,btnValue: 'Cargar'})
            }else if(pasajero_NO.length > 0){
                await this.IngresarRegistro(pasajero_SI, pasajero_NO)
            }else{
                swal('Mensaje', 'No se encontro ningun registro', 'info')
                this.setState({btnState: false,btnValue: 'Cargar'})
            }
        }else{
            console.log('no')
        }
        document.getElementById('form_XLSX').reset()
    }

    IngresarRegistro = async(pasajero_SI, pasajero_NO) =>{
        let arregloPasajero = []
        pasajero_NO.forEach(value=>{
            arregloPasajero.push({
                id_cliente: value.id_cliente.toString(),
                id_pasajero: value.id_pasajero.toString(),
                descripcion: value.descripcion !== undefined ? value.descripcion.toUpperCase() : null,
                id_tipo_di: 'DNI',
                nro_di: value.id_pasajero.toString(),
                direccion: value.direccion !== undefined ? value.direccion.toUpperCase() : null,
                id_distrito: value.id_distrito !== undefined ? value.id_distrito.toString().trim() : null,
                latitud: value.latitud !== undefined ? value.latitud.toString() : null,
                longitud: value.longitud !== undefined ? value.longitud.toString() : null,
                celular: value.celular !== undefined ? value.celular.toString() : null,
                id_area: value.id_area !== undefined ? value.id_area.toUpperCase() : null
            })
        })
        
        const res = await api.savePasajerosXLSX_fetch(this.state.token, arregloPasajero)
        if(res.error){
            if(!global.validarCookies()){
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion()
            }
            await swal("Mensaje", res.error, "error")
            return
        }

        if(res.status !== 200){
            swal("Mensaje","Ocurrio un error al momento de ingresar la informacion de los pasajeros.", "error")
            this.setState({btnValue: 'Cargar ', respuesta: 'NO Procesados', btnState: false, pasajeros:[], alertCant: pasajero_NO.length, alert: true})
            return
        }
        
        this.setState({btnValue: 'Cargar', respuesta: 'Procesados' ,btnState: false, pasajeros:[], alertCant: pasajero_NO.length, alert: true})
        swal("Mensaje","Lista de pasajeros guardado satisfactoriamente.", "success")
        if(pasajero_SI.length > 0){
            this.setState({siExistentes:pasajero_SI, alert2: true})
        }
    }

    render() {
        return (
            <div>
                <p className="historial">Carga de informacion &gt; Cargar Pasajeros .xlsx</p>
                <div className="cuadro">
                    <label>Seleccionar rango de fecha para iniciar proceso de carga</label>
                    <form onSubmit={(e)=>this.onsubmit(e)} id="form_XLSX" >
                        <input type="file" onChange={(e)=>{ this.setState({file: e})}} accept=".xlsx, .xls"/>                       
                        <input type="submit" value={this.state.btnValue} disabled={this.state.btnState}/>
                        <input type="reset" value="Limpiar" className='botonCargarINFO'/>
                    </form>
                </div>
                {
                    this.state.alert ? 
                        <div className="alerta">
                            <p>{this.state.respuesta} ({this.state.alertCant}) pasajeros. </p>
                        </div>
                    : null
                }
                {
                    this.state.alert2 ? 
                    <div style={{lineHeight:'1.5', padding:'15px', marginTop:'10px', color:'#A20A0A', backgroundColor:'#f8d7da'}}>
                            {this.state.siExistentes.length > 0 ?
                            <span>Encontrados en el sistema.</span>
                            : null
                            }
                            <ul>
                                {this.state.siExistentes.map((value, index) => 
                                    <li style={{listStyle:'none'}} key={value.id_pasajero+index}><b>DNI: </b>{value.id_pasajero} - <b>Nombre: </b>{value.descripcion}</li>
                                )}
                            </ul>
                        </div>
                    : null
                }
            </div>
        )
    }
}
