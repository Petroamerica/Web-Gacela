import React, { Component } from 'react'
import {api} from '../../../global/api'
import {global} from '../../../global/global'
import * as XLSX from 'xlsx'
import swal from 'sweetalert'

export default class CargarXlsx extends Component {

    state = {
        file: null,
        pasajeros: [],
        pasajerosActivos: [],
        noExistentes: [],
        pasajerosRepetidos: [],
        alertCant:0,
        alert:false,
        alert2: false,
        alert3: false,
        btnState: false,
        estadoBtn: true,
        btnValue: 'Cargar',
        respuesta: '',
        usuario: "",
        token: '',
        user: ""
    }

    async componentDidMount(){
        /*const data = await JSON.parse(localStorage.getItem('data'))
        this.setState({usuario: data[0]['id_cliente'], user: data[1]['name']})*/
        await document.getElementById('form_XLSX').reset()
        const {estadoLocalStorage, name, id_cliente, token} = await global.obtenerDatosLocalStorage()
        if(estadoLocalStorage){
            this.setState({usuario: id_cliente, user: name,token})
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
            this.setState({usuario: '', user: '',token : ''})
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

        /*.then((data) =>{
            this.setState({pasajeros:data})
        })
        .then(()=>{this.setState({btnValue: 'Cargar', btnState: false})})
        .catch((err)=>{console.log(err)})*/
    }
    //NO EXISTEN EN EL REGISTRO
    compararPasajeros_NO = (valor) =>{
        let pasajerosA = this.state.pasajerosActivos
        let contador = 0
        if(pasajerosA.length > 0){
            for (let index = 0; index < pasajerosA.length; index++) {
                if(pasajerosA[index].id_pasajero.toString() !== valor.toString()){
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
    //SI EXISTEN EN EL REGISTRO
    compararPasajeros_SI = (valor) =>{
        let pasajerosA = this.state.pasajerosActivos
        let contador = 0
        for (let index = 0; index < pasajerosA.length; index++) {
            if(pasajerosA[index].id_pasajero.toString() !== valor.toString()){
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
    
    onsubmit = async(e) =>{
        e.preventDefault();
        this.setState({btnValue: 'Procesando...', respuesta : 'Procesando..', btnState: true, alertCant:0, alert: false, alert2: false, estadoBtn: false})
        if(this.state.file){
            const file = await this.state.file.target.files[0]
            try{
                let pasajerosXLSX = await this.readExcel(file)
                this.setState({pasajeros: pasajerosXLSX, btnValue: 'Cargar', btnState: false})   
            }catch(e){
                throw await swal('Mensaje', 'No se puede leer el archivo .xlsx', 'error')
            }
            let pasajero_NO
            let pasajero_SI
            try{
                pasajero_NO = this.state.pasajeros.filter(value => this.compararPasajeros_NO(value.DNI))
                console.log(pasajero_NO)
                pasajero_SI = this.state.pasajeros.filter(value => this.compararPasajeros_SI(value.DNI))
                console.log(pasajero_SI)
                pasajero_NO.forEach(element => {
                    let horaXLSX = XLSX.SSF.parse_date_code(element.HORA)
                    element.HORA =  `${horaXLSX.H}:${horaXLSX.M}`
                });
            }catch(e){
                throw await swal('Mensaje', 'Por favor revisar la estructura del xlsx antes de ingresar la lista de pasajeros.', 'error')
            }
            if(pasajero_SI.length > 0 && pasajero_NO.length > 0){
                swal({
                    title: "Mensaje",
                    text: "No todos los pasajeros del excel estan registrados en el sistema, ¿desea cargar los existentes?\nRecuerda: Despues de cargar los existentes deberas organizar de nuevo el excel para volver a ingresar los faltantes",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                .then(async (willDelete) => {
                    if (willDelete){
                        await this.IngresarRegistro(pasajero_SI, pasajero_NO)
                    }else{
                        this.setState({noExistentes:pasajero_NO, alert2: true, btnState: false,btnValue: 'Cargar'})
                    }
                }); 
            }else if(pasajero_SI.length > 0){
                await this.IngresarRegistro(pasajero_SI, pasajero_NO)
            }else if(pasajero_NO.length > 0){
                swal('Mensaje', 'Debe ingresar todos los registros del excel previamente, porque no se encontraron en el Sistema.', 'info')
                this.setState({noExistentes:pasajero_NO, alert2: true, btnState: false,btnValue: 'Cargar'})
            }else{
                swal('Mensaje', 'No se encontro ningun registro', 'info')
                this.setState({btnState: false,btnValue: 'Cargar'})
            }
        }else{
            console.log('no')
        }
        document.getElementById('form_XLSX').reset()
    }

    pasajerosRepetidos = (todosLosPasajeros, valorAEncontrar, tipoDeRetorno) =>{
        let contador = 0
        for (let index = 0; index < todosLosPasajeros.length; index++) {
            if(todosLosPasajeros[index]['DNI'] === valorAEncontrar['DNI'] && todosLosPasajeros[index]['TIPO SERVICIO'] === valorAEncontrar['TIPO SERVICIO'] && todosLosPasajeros[index]['HORA'] === valorAEncontrar['HORA']){
                contador += 1
            }
            if(index+1 === todosLosPasajeros.length){
                if(tipoDeRetorno === 1){
                    if(contador > 1){
                        return false
                    }else{
                        return true
                    }
                }else if(tipoDeRetorno === 2){
                    if(contador > 1){
                        return true
                    }else{
                        return false
                    }
                }
            }
        }
    }

    IngresarRegistro = async(pasajero_SI, pasajero_NO) =>{
        let pasajerosR = pasajero_SI
        const pasajerosNoRepetidos = pasajerosR.filter(value => this.pasajerosRepetidos(pasajero_SI ,value, 1))
        const pasajerosRepetidos = pasajerosR.filter(value => this.pasajerosRepetidos(pasajero_SI ,value, 2))
        pasajerosRepetidos.forEach(element => {
            let horaXLSX = XLSX.SSF.parse_date_code(element.HORA)
            element.HORA =  `${horaXLSX.H}:${horaXLSX.M}`
        });
        let arregloPasajero = []
        pasajerosNoRepetidos.forEach(value=>{
            let hora = XLSX.SSF.parse_date_code(value.HORA)
            arregloPasajero.push({
                id_cliente: value.CIA,
                id_pasajero: `${value.DNI}`,
                fecha: value.FECHA,
                origen: value['TIPO SERVICIO'],
                hora: `${hora.H}:${hora.M}`,
                nro_servicio: null,
                usuario: this.state.user.toLocaleUpperCase(),
                Orden_recojo: null,
                id_cuenta: value.AEROLINEA === undefined ? null : value.AEROLINEA
            })
        })

        const res = await api.saveServices_fetch(this.state.token, arregloPasajero, 'i')

        if(res.error){
            if(!global.validarCookies()){
                await swal("Mensaje", 'Tiempo de conexión culminado, cerrar sesión y volver a conectarse.', "error")
                global.cerrarSesion()
            }
            await swal("Mensaje", res.error, "error")
            return
        }
        
        if(res.status !== 200){
            swal("Mensaje","Se genero un error. Es posible que esta lista ya ha sido ingresada anteriormente.\nPor favor intentarlo nuevamente.", "error")
            this.setState({btnValue: 'Cargar ', respuesta: 'NO Procesados', btnState: false, pasajeros:[], alertCant: pasajerosNoRepetidos.length, alert: true})
            return
        }

        this.setState({btnValue: 'Cargar', respuesta: 'Procesados' ,btnState: false, pasajeros:[], alertCant: pasajerosNoRepetidos.length, alert: true})
        swal("Mensaje","Lista de pasajeros guardado satisfactoriamente.", "success")

        if(pasajerosRepetidos.length > 0){
            this.setState({pasajerosRepetidos:pasajerosRepetidos, alert3:true})
        }
        if(pasajero_NO.length > 0){
            this.setState({noExistentes:pasajero_NO, alert2: true})
        }
    }

    render() {
        return (
            <div>
                <p className="historial">Carga de informacion &gt; Cargar Lista de Pasajeros .xlsx</p>
                <div className="cuadro">
                    <label>Seleccionar rango de fecha para iniciar proceso de carga</label>
                    <form onSubmit={(e)=>this.onsubmit(e)} id="form_XLSX" >
                        <input type="file" onChange={(e)=>{ this.setState({file: e})}} accept=".xlsx, .xls"/>                       
                        <input type="submit"  value={this.state.btnValue} disabled={this.state.btnState}/>
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
                    (this.state.alert3)
                        ?
                        <div style={{lineHeight:'1.5', padding:'15px', marginTop:'10px', color:'brown', backgroundColor:'#FFD36E'}}>
                             {this.state.pasajerosRepetidos.length > 0 ?
                                <span>Se encontraron más de un pasajero en el mismo tipo de servicio.</span>
                                : null
                            }
                            <ul>
                                {this.state.pasajerosRepetidos.map((value, index) => 
                                    <li style={{listStyle:'none'}} key={index}><b>DNI: </b>{value.DNI} - <b>Nombre: </b>{value.NOMBRE} - <b>Tipo de servicio: </b> {value['TIPO SERVICIO']} - <b>Hora: </b> {value.HORA} - <b>Fecha:</b> {value['FECHA']} </li>
                                )}
                            </ul>
                        </div>
                        :null
                }
                {
                    this.state.alert2 ? 
                    <div style={{lineHeight:'1.5', padding:'15px', marginTop:'10px', color:'#A20A0A', backgroundColor:'#f8d7da'}}>
                            {this.state.noExistentes.length > 0 ?
                            <span>No encontrados en el sistema.</span>
                            : null
                            }
                            <ul>
                                {this.state.noExistentes.map((value, index) => 
                                    <li style={{listStyle:'none'}} key={index}><b>DNI: </b>{value.DNI} - <b>Nombre: </b>{value.NOMBRE} - <b>Tipo de servicio: </b> {value['TIPO SERVICIO']} - <b>Hora: </b> {value.HORA} - <b>Fecha:</b> {value['FECHA']} </li>
                                )}
                            </ul>
                        </div>
                    : null
                }
            </div>
        )
    }
}
