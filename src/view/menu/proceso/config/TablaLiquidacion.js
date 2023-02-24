import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react';
import swal from 'sweetalert'
import addUser from '../../../../assets/userPruebaAdd.svg'
import mensaje from '../../../../assets/mensajeP.svg'
import puntos from '../../../../assets/3_points.svg'
import print from '../../../../assets/print.svg'
import mapa from '../../../../assets/map.svg';
import cerrar_modal from '../../../../assets/close.svg';
import ModalAgregarPasajero from './ModalAgregarPasajero'
import ModalComentario from './ModalComentario'
import ModalAgregarServicio from './ModalAgregarServicio'
import ModalMoficacion from './ModalMoficacion'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import GruposMapa from './GruposMapa';
import moment from 'moment'

export default class TablaLiquidacion extends Component {
    
    StyleCompleted(){
        return {
            'display': 'flex',
            'flexDirection': 'row',
            'height':' 100vh',
            'width': '100vw',
            'flexWrap': 'wrap',
            'position': 'fixed',
            'zIndex': '100',
            'padding': '100px',
            'left': '0',
            'top': '0',
            'overflow': 'auto',
            'backgroundColor': 'rgba(0,0,0,0.4)'
        }
    }

    static defaultProps = {
        center: { 
            lat: -12.046198828462366,
            lng: -77.04127501255363
        },
        zoom: 11
    };

    state={
        pasajeroSeleccionado: [{descripcion:''}],
        newArrayPassenger:[],
        pasajeroComentario: [],
        newArrayVehiculo: [],
        newArrayChofer: [],
        posicion:[],
        gruposView: [],
        modalNuevoPasajero:false,
        modalComentario : false,
        modalNuevoServicio: false,
        modalModificacion: false,
        displayMapa: false,
        bloqueServicio: null,
        horaServicio: '',
        aerolinea:'',
        comentario: '',
        ffat: '',
        horaDelServicio: '',
        MAS_vehiculo : '',
        MAS_chofer: '',
        numero_servicio: ''
    }

    //inicia el modal de nuevo Pasajero
    agregarUsuarioServicio = async (value, key) =>{
        await this.props.todosPasajeros()
        this.setState({modalNuevoPasajero: true, bloqueServicio: key, horaServicio: value.cabecera.hora})
    }
    cerrarModal = ()=>{ this.setState({modalNuevoPasajero: false, pasajeroSeleccionado: [{descripcion:''}], newArrayPassenger: [], bloqueServicio: null}) }
    guarDardatosModal = (e) =>{
        e.preventDefault()
        let id_pasajero = this.state.pasajeroSeleccionado[0].id_pasajero
        let arregloPasajero = this.props.listPassanger
        let validarPasajero = false
        for (let index = 0; index < arregloPasajero.length; index++) {
            if(arregloPasajero[index].id_pasajero === id_pasajero){
                validarPasajero = true
                break
            }
        }
        if(this.state.pasajeroSeleccionado[0]['id_pasajero'] === undefined || !validarPasajero || this.state.ffat === ''){
            swal("Mensaje", "Datos del formulario ingresados incorrectamente, por favor validarlo y volverlo a ingresar.", "info")
        }else{
            this.props.nuevoPasajeroServicio(this.state.pasajeroSeleccionado, this.state.horaServicio, this.state.bloqueServicio, this.state.aerolinea, this.state.ffat)
            this.setState({modalNuevoPasajero: false, aerolinea: '', horaServicio:'', ffat: ''})
        }
    }
    buscarPasajero = text =>{
        if(text.target.value.length > 0){
            this.searchPassenger(text.target.value)
        }
        else{
            this.setState({newArrayPassenger: []})
        }
        this.setState({pasajeroSeleccionado:[{descripcion: text.target.value}]})
    }
    searchPassenger = (value) =>{
        const nuevo = this.props.listPassanger.filter((val) => val.id_pasajero.indexOf(value) !== -1 ||  val.descripcion.indexOf(value.toUpperCase()) !== -1 )
        this.setState({newArrayPassenger: nuevo})
    }
    escogerPasajero = (val) =>{
        let arrayVal = val.target.id
        let splitVal = arrayVal.split(',')
        this.props.listPassanger.forEach( valor =>  {
            if(valor.id_pasajero === splitVal[0]) return this.setState({pasajeroSeleccionado: [valor]})
        })
        this.setState({newArrayPassenger: []})
    }
    
    //Asignar datos
    agregarHora = text =>{ this.setState({horaServicio:text.target.value})  }
    agregarHoraServicio = text =>{ this.setState({horaDelServicio:text.target.value})  }
    agregarAerolinea = text =>{ this.setState({aerolinea:text.target.value})  }
    agregarffat = text =>{ this.setState({ffat:text.target.value})  }


    //Inicia modal de comentarios
    modalComentario = (value, key, subKey) =>{ 
        this.setState({pasajeroComentario: value, modalComentario: true, comentario: value['comentario'], posicion: {key, subKey}}) 
    }
    cerrarModalComentario = () =>{ this.setState({modalComentario: false, pasajeroComentario: [], comentario: '', posicion: []}) }
    modificarComentario = (value) =>{ this.setState({comentario: value.target.value}) }
    agregarComentario = (e) =>{
        e.preventDefault()
        this.props.agregarComentario(this.state.pasajeroComentario, this.state.posicion, this.state.comentario)
    }

    //Inicia modal de servicio
    modalServicio = async () =>{ 
        await this.props.todosPasajeros()
        this.setState({modalNuevoServicio: true}) 
    }
    cerrarModalServicio = () =>{
        this.setState({modalNuevoServicio: false})        
    }
    agregarServicio = (e) =>{
        e.preventDefault()
        /*
            let id_pasajero = this.state.pasajeroSeleccionado[0].id_pasajero
            let validarPasajero = false
            let arregloPasajero = this.props.filtrarPasajeroSeleccionado()
            let validarChofer = false
            let arregloChofer = this.props.filtrarChoferSeleccionado()
            let validarAuto = false
            let arregloAuto = this.props.filtrarAutoSeleccionado()
            for (let index = 0; index < arregloPasajero.length; index++) {
                if(arregloPasajero[index] === id_pasajero){ validarPasajero = true; break }
            }
            for (let index = 0; index < arregloChofer.length; index++) {
                if(arregloChofer[index] === this.state.MAS_chofer.toUpperCase()){ validarChofer = true; break }
            }
            for (let index = 0; index < arregloAuto.length; index++) {
                if(arregloAuto[index] === this.state.MAS_vehiculo.toUpperCase()){ validarAuto = true; break }
            }
        */
        //if(validarPasajero || validarChofer || validarAuto || this.state.ffat === ''){
        if(this.state.ffat === ''){
            swal("Mensaje", "Debe seleccionar un estado de movilización.", "info")
        }else{
            this.props.nuevoServcio_Pasajero(this.state.MAS_chofer, this.state.MAS_vehiculo, this.state.pasajeroSeleccionado, this.state.horaDelServicio, this.state.horaServicio, this.state.ffat, this.state.aerolinea, e)
            this.setState({modalNuevoPasajero: false, aerolinea: '', horaServicio:'', ffat: '', horaDelServicio: '', MAS_vehiculo: '', MAS_chofer: ''})
        }
    }

    //Asignar Vehiculo
    agregarVehiculo = (text) =>{
        if(text.target.value.length > 0){
            this.searchVichulo(text.target.value)
            this.setState({newArrayChofer: []})
        }
        else{
            this.setState({newArrayVehiculo: []})
        }
        this.setState({MAS_vehiculo: text.target.value})
    }
    searchVichulo = (value) =>{
        const nuevo = this.props.listaAuto.filter((val) => val.id_unidad.indexOf(value) !== -1)
        this.setState({newArrayVehiculo: nuevo})
    }
    seleccionarVehiculo = (id_vehiculo) =>{
        this.setState({MAS_vehiculo: id_vehiculo, newArrayVehiculo: []})
        /*let vehiculo = this.props.filtrarAutoSeleccionado()
        let validar = false
        for (let index = 0; index < vehiculo.length; index++) {
            if(vehiculo[index] === id_vehiculo){
                validar = true
                break
            }
        }
        if(!validar){
            this.setState({MAS_vehiculo: id_vehiculo, newArrayVehiculo: []})
        }else{
            swal("Mensaje", "Chofer ya fue seleccionado anteriormente", "info")
        } */   
    }
    //Asignar Chofer
    agregarChofer = (text) =>{
        if(text.target.value.length > 0){
            this.searchChofer(text.target.value)
            this.setState({newArrayVehiculo: []})
        }
        else{
            this.setState({newArrayChofer: []})
        }
        this.setState({MAS_chofer: text.target.value})
    }
    searchChofer = (value) =>{
        const nuevo = this.props.listaChofer.filter((val) => val.id_chofer.indexOf(value) !== -1 || val.descripcion.indexOf(value.toUpperCase()) !== -1)
        this.setState({newArrayChofer: nuevo})
    }
    seleccionarChofer = (id_chofer) =>{
        this.setState({MAS_chofer: id_chofer, newArrayChofer: []})
        /*let chofer = this.props.filtrarChoferSeleccionado()
        let validar = false
        for (let index = 0; index < chofer.length; index++) {
            if(chofer[index] === id_chofer){
                validar = true
                break
            }
        }
        if(!validar){
            this.setState({MAS_chofer: id_chofer, newArrayChofer: []})
        }else{
            swal("Mensaje", "Chofer ya fue seleccionado anteriormente", "info")
        }   */ 
    }

    //Inicia modal de mofificaciones
    modalModificacion = (value) =>{ this.setState({pasajeroComentario: value, modalModificacion: true}) }
    cerrarVentanaModificacion = () =>{ this.setState({pasajeroComentario: [], modalModificacion: false}) }
    
    componentDidMount() { 
        document.addEventListener("keydown", this.onKeyPressed, false); 
    }
    componentWillUnmount() { document.removeEventListener("keydown", this.onKeyPressed, false); }    
    
    onKeyPressed = (e) =>{
        if(e.key.toUpperCase() === 'B' && e.ctrlKey){
            this.props.guardarCambios()
        }
    }

    mostrarMapa = (e, numero_servicio) =>{ this.setState({displayMapa: true, gruposView: e, numero_servicio: numero_servicio}) }

    imprimir = (data) =>{
        var mywindow = window.open('', 'Reporte', 'height=400,width=600');
        mywindow.document.write('<html><head><title>Reporte</title>');
        mywindow.document.write('</head><body>');
        mywindow.document.write(`<table border='1' style="border-collapse: collapse;">`);
        mywindow.document.write(`<thead><tr>`);
        mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em; background: #FFF323;">${data.cabecera.id_cliente}</td>`);
        mywindow.document.write(`</tr><tr>`);
        mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em; background: #FFF323; min-width: 50px">FECHA</td>`);
        mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em; background: #FFF323;">TIPO SERVICIO</td>`);
        mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em; background: #FFF323;">HORA INICIO</td>`);
        mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em; background: #FFF323;">HORA LLEGADA</td>`);
        mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em; background: #FFF323;">N° SERVICIO</td>`);
        mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em; background: #FFF323;">AREA</td>`);
        mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em; background: #FFF323;">AEROLINEA</td>`);
        mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em; background: #FFF323;">NOMBRE</td>`);
        mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em; background: #FFF323;">TELEFONO</td>`);
        mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em; background: #FFF323;">DIRECCION</td>`);
        mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em; background: #FFF323;">DISTRITO</td>`);
        mywindow.document.write(`</tr></thead>`);
        mywindow.document.write(`<tbody>`);

        data.data.forEach(value => {
            if(!["RE", "CA", "re", "ca"].includes(value.id_tipo_estado_mov)){
                mywindow.document.write(`<tr>`);
                mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em;">${moment(data.cabecera.fecha).format('YYYY-MM-DD')}</td>`);
                mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em;">${value.origen_servicio === 'E' ? 'ENTRADA' : 'SALIDA'}</td>`);
                mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em;">${data.cabecera.hora_inicio}</td>`);
                mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em;">${value.hora}</td>`);
                mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em;" align='center'>${data.cabecera.nro_servicio}</td>`);
                mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em;">${value.id_area || ''}</td>`);
                mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em;">${value.id_cuenta || ''}</td>`);
                mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em;">${value.descripcion_pasajero || ''}</td>`);
                mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em;">${value.celular || ''}</td>`);
                mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em;">${value.direccion || ''}</td>`);
                mywindow.document.write(`<td style="padding: 4px; font-size: 0.6em;">${value.descripcion_distrito || ''}</td>`);
                mywindow.document.write(`</tr>`);
            }
        })

        mywindow.document.write(`</tbody></table>`);
        mywindow.document.write('</body></html>');
        mywindow.print();
        mywindow.close();
        return true;
    }

    render() {
        return (
            <div style={{marginTop: '15px', padding:'0px 15px', marginBottom:'15px'}} onKeyDown={this.onKeyPressed} tabIndex={-1}>
                <div style={{display:'flex', justifyContent:'space-between', fontSize: '1.2em', fontWeight:'bold', marginBottom: '10px'}}>
                    <div style={ {display:'flex' ,flexDirection:'row'}}>
                        <div  style={{marginRight:'15px'}}>
                            <input onClick={()=> {this.modalServicio()} } type="button" value="Nuevo servicio" 
                                className='botonAccionLiquidacion'/>
                        </div>
                        <div >
                            <input onClick={()=> {this.props.guardarCambios()} } type="button" value="Guardar cambios" 
                                className='botonAccionLiquidacion'/>
                        </div>
                    </div>
                    <div>
                        <span style={{color:'green'}}>Estado de la liquidacion:  ACTIVO</span>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <span style={{color:'red'}}>Costo: </span>
                        <span style={{color:'red'}}>{ parseFloat(this.props.costoTotal).toFixed(3)}</span>
                    </div>
                </div>
                <div style={{overflowY: 'scroll',  maxHeight: '800px'}}>
                <table border="1" style={{width:'100%', borderCollapse:'collapse'}} className="table_solicitudes" bordercolor="#d9a600">
                    <thead style={{background: '#e6b012', color: 'white', fontSize: '0.8em'}}>
                        <tr>
                            <th style={{width:"20px", padding:'6px', position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>N° Orden</th>
                            <th style={{width:"60px", position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>Hora</th>
                            <th style={{width:"40px", position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>Aerolinea</th>
                            <th style={{width:"40px", position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>Area</th>
                            <th style={{width:"40px", position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>D.N.I</th>
                            <th style={{width:"250px", position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>Nombre</th>
                            <th style={{width:"250px", position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>Direccion</th>
                            <th style={{width:"90px", position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>Distrito</th>
                            <th style={{width:"40px", position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>Telefono</th>
                            <th style={{width:"30px", position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>Automovil</th>
                            <th style={{width:"30px", position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>Costo</th>
                            <th style={{width:"30px", position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>Est. Mov.</th>
                            <th style={{width:"10px", position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>Comentario</th>
                            <th style={{width:"10px", position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>Cambios</th>
                        </tr>
                    </thead>
                        <DragDropContext onDragEnd={(result) => {
                                const {source, destination} = result
                                if(!destination){ return}
                                if(source.index === destination.index && source.droppableId === destination.droppableId){return}
                                this.props.modifyService(this.props.servicio, source, destination)
                                }}
                        >

                        {this.props.servicio.map((value, key) => 
                            <Droppable droppableId={""+key} key={key}>   
                            {(droppableProvided)=>(
                                <tbody ref={droppableProvided.innerRef} style={{position:'relative'}} key={key}>
                                    <tr style={{backgroundColor: value.data.length > 0 ? 'white': '#F66767', color:value.data.length > 0 ? 'black': 'white'}}>
                                        <td colSpan="14" style={{padding:'5px', fontSize:'0.8em'}}>
                                            <span>Servicio <b>{(value.cabecera.nro_servicio)}</b></span>
                                            <span onClick={()=>{this.imprimir(value, key)}} style={{fontSize: '0.9em', marginLeft: '15px', cursor:'pointer'}}> <img src={print} alt="imprimir" width="18"/></span>
                                            <span onClick={()=>{this.agregarUsuarioServicio(value, key)}} style={{fontSize: '0.9em', marginLeft: '15px', cursor:'pointer'}}> <img src={addUser} alt="agregar nuevo usuario" width="18"/></span>
                                            <span onClick={()=>{this.mostrarMapa(value.data, value.cabecera.nro_servicio)}} style={{fontSize: '0.9em', marginLeft: '15px', cursor:'pointer'}}> <img src={mapa} alt="ver mapa" width="15"/></span>
                                            
                                            <b><span style={{marginLeft: '15px'}}>Hora de Inicio: </span></b>
                                            <input className="invalido" style={{marginLeft: '3px', width:'50px', textAlign:'center'}} name="_horaS" type="text" autoComplete="off"  maxLength="5" 
                                                pattern="^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$" 
                                                value={value.cabecera.hora_inicio}
                                                onChange={(text)=>this.props.cambiarHoraCabecera(text, value.cabecera.nro_servicio )}
                                                required
                                                />
                                            <b><span style={{marginLeft: '15px'}}>Codigo del Automovil: </span></b>
                                            <input style={{marginLeft: '3px', width:'45px', paddingLeft:'5px'}} name="_auto" type="text" 
                                                onChange = {(text)=>this.props.buscarListaAuto(text, key,value.cabecera.nro_servicio )}
                                                autoComplete="off"
                                                value={value.cabecera.id_unidad || ''}
                                                readOnly = { value.data.length > 0 ? false : true}
                                            />
                                            {
                                                this.props.numero_servicio === key ? 
                                                    this.props.filtroAuto.length > 0 ? 
                                                        <div style={{position:'absolute', left:'320px', height:'95px', display:'flex', flexDirection:'column', backgroundColor:'white', width:'250px', overflowY:'scroll', padding:'7px', zIndex:'1'}}>
                                                        {
                                                            this.props.filtroAuto.map( auto =>
                                                                <span style={{cursor:'pointer', overflow:'hidden', whiteSpace:'nowrap', minHeight: '25px', borderRadius: '4px', border: '1px solid #1A1C20', color:'#1A1C20', margin:'3px', padding:'4px'}} key={auto.id_unidad} 
                                                                    onClick={(valor)=>this.props.seleccionarAuto(valor)} id={[auto.id_unidad, value.nro_servicio, auto.placa]}>
                                                                        {auto.id_unidad}
                                                                </span>
                                                            )
                                                        }
                                                        </div>
                                                    : null 
                                                : null
                                            }
                                            <b><span style={{marginLeft: '15px'}}>Placa del Automovil: </span></b>
                                            <input style={{marginLeft: '3px', paddingLeft:'5px', width:'70px'}} name="_autoDescripcion" type="text" 
                                                autoComplete="off"
                                                readOnly
                                                value={value.cabecera.placa || ''}
                                            />
                                            
                                            <b><span style={{marginLeft: '15px'}}>Codigo del chofer: </span></b>
                                            <input style={{marginLeft: '3px', paddingLeft:'5px', width:'75px'}} name="_chofer" type="text" 
                                                onChange = {(text)=>this.props.buscarListaChofer(text, key,value.nro_servicio )}
                                                autoComplete="off"
                                                value={value.cabecera.id_chofer|| ''}
                                                readOnly = { value.data.length > 0 ? false : true}
                                            />
                                            {
                                                this.props.numero_servicio === key ? 
                                                this.props.filtroChofer.length > 0 ? 
                                                    <div style={{position:'absolute', left:'715px', height:'95px', display:'flex', flexDirection:'column', backgroundColor:'white', width:'250px', overflowY:'scroll', padding:'7px', zIndex:'1'}}>
                                                    {
                                                        this.props.filtroChofer.map( chofer =>
                                                            <span style={{cursor:'pointer', overflow:'hidden', whiteSpace:'nowrap', minHeight: '25px', borderRadius: '4px', border: '1px solid #1A1C20', color:'#1A1C20', margin:'3px', padding:'4px'}} key={chofer.id_chofer} 
                                                                onClick={(valor)=>this.props.seleccionarChofer(valor)} id={[chofer.id_chofer, value.nro_servicio, chofer.descripcion]}>
                                                                    {chofer.id_chofer} - {chofer.descripcion}
                                                            </span>
                                                        )
                                                    }
                                                    </div>
                                                : null 
                                                : null
                                            }
                                            <b><span style={{marginLeft: '15px'}}>Nombre del Chofer: </span></b>
                                            <input style={{marginLeft: '3px'}} name="_choferDescripcion" type="text" 
                                                autoComplete="off"
                                                readOnly
                                                value={value.cabecera.descripcion || ''}
                                            />
                                            <b><span style={{marginLeft: '15px'}}>Hora llegada: </span></b>
                                            <input style={{marginLeft: '3px', width:'50px', textAlign:'center'}}  type="text" 
                                                name="_horaLlegada" 
                                                autoComplete="off" 
                                                pattern="^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$" 
                                                className="invalido" value={value.cabecera.hora_llegada|| ''}
                                                onChange={(text)=>this.props.cambiarHora_llegada(text, value.cabecera.nro_servicio )}
                                                maxLength="5" 
                                                />
                                        </td>
                                    </tr>
                                    {
                                    value.data.length > 0 ?    
                                        value.data.map((subValue, subKey) => 
                                        <Draggable  draggableId={subValue.id_pasajero+subValue.nro_servicio} index={subKey} key={subValue.id_pasajero+subValue.nro_servicio}>
                                            {(draggableProvided) =>(
                                            <tr key={subKey}
                                                ref={draggableProvided.innerRef}
                                                {...draggableProvided.draggableProps}
                                                {...draggableProvided.dragHandleProps}>
                                                <>      
                                                <td style={{width:"20px", padding:"4px", fontSize: '0.7em'}} align="center" >{subValue.orden_recojo}</td>
                                                <td style={{width:"60px", padding:"4px", fontSize: '0.7em'}} align="center" >
                                                    <input type="text" value={subValue.hora === null ? '' : subValue.hora} style={{width:'35px'}} maxLength='5'  className="invalido"
                                                        onChange={(text)=>{this.props.cambiarHoraDetalle(text, key, subKey, value.cabecera.nro_servicio)}}
                                                        pattern="^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$" 
                                                        />
                                                </td>
                                                <td style={{width:"40px", padding:"4px", fontSize: '0.7em'}} align="center" >
                                                    <select id={[key ,subValue.id_pasajero]} value={subValue.id_cuenta === null ? '' : subValue.id_cuenta} name="id_cuenta" onChange={(e)=>{this.props.changeText(e, value.cabecera.nro_servicio)}}>
                                                        <option value=''>-</option>
                                                        {
                                                            this.props.aerolinea.map(value =>
                                                                <option key={value.id_cuenta} 
                                                                    value={value.id_cuenta} 
                                                                    defaultValue={value.id_cuenta}
                                                                    >{value.descripcion}</option>
                                                            )
                                                        }
                                                    </select>
                                                </td>
                                                <td style={{width:"40px", padding:"4px", fontSize: '0.7em'}} align="center">
                                                    {/* {subValue.id_area} */}
                                                    <select id={[key ,subValue.id_pasajero]} 
                                                        value={subValue.id_area === null ? '' : subValue.id_area} 
                                                        name="id_area" 
                                                        onChange={(e)=>{this.props.changeText(e, value.cabecera.nro_servicio)}}>
                                                        <option value=''>-</option>
                                                        {
                                                            this.props.listArea.map(value =>
                                                                <option key={value.id_area} 
                                                                    value={value.id_area} 
                                                                    defaultValue={value.id_area}
                                                                    >{value.id_area}</option>
                                                            )
                                                        }
                                                    </select>
                                                </td>
                                                <td style={{width:"40px", padding:"4px", fontSize: '0.7em'}} align="center">{subValue.id_pasajero}</td>
                                                <td style={{maxWidth:"250px", height:'30px', padding:' 5px 4px'}}>
                                                    <div style={{tableLayout:'fixed', overflow:'hidden', whiteSpace:'nowrap', width:'100%', fontSize: '0.7em'}}>{subValue.descripcion_pasajero}</div>
                                                </td>
                                                <td style={{maxWidth:"250px", height:'30px', padding:' 5px 4px'}}>
                                                    <div style={{tableLayout:'fixed', overflow:'hidden', whiteSpace:'nowrap', width:'100%', fontSize: '0.7em'}}>{subValue.direccion}</div>
                                                </td>
                                                <td style={{maxWidth:"90px", height:'30px', padding:' 5px 4px'}} align="center">
                                                    <div style={{tableLayout:'fixed', overflow:'hidden', whiteSpace:'nowrap', width:'100%', fontSize: '0.7em'}}>{subValue.descripcion_distrito}</div>
                                                </td>
                                                <td style={{maxWidth:"90px", height:'30px', padding:' 5px 4px'}}  align="center">
                                                    <div style={{tableLayout:'fixed', overflow:'hidden', whiteSpace:'nowrap', width:'100%', fontSize: '0.7em'}}>{subValue.celular}</div>
                                                </td>   
                                                <td style={{width:"30px", padding:"4px", fontSize: '0.7em'}} align="center" >{subValue.id_tipo_servicio}</td>
                                                <td style={{width:"30px", padding:"4px", fontSize: '0.7em'}} align="center" >{subValue.costo_pasajero && subValue.costo_pasajero !== "NaN" ? subValue.costo_pasajero : ''}</td>
                                                <td style={{width:"30px", padding:"4px", fontSize: '0.7em'}} align="center" >
                                                    <select id={[key ,subValue.id_pasajero, value.cabecera.nro_servicio, subValue.descripcion_pasajero, subValue.descripcion_distrito]} value={subValue.id_tipo_estado_mov || ''} name="id_tipo_estado_mov" onChange={(e)=>{this.props.changeText(e, value.cabecera.nro_servicio)}}>
                                                        <option value="" >-</option>
                                                        {
                                                            this.props.ffat.map(value =>
                                                                <option key={value.id_tipo_estado_mov} 
                                                                    value={value.id_tipo_estado_mov} 
                                                                    >{value.id_tipo_estado_mov}</option>
                                                            )
                                                        }
                                                    </select>
                                                </td>
                                                <td style={{width:"10px", padding:"4px", fontSize: '0.7em'}} align="center" >
                                                    <button onClick={()=>{this.modalComentario(subValue, key, subKey)}} type="button" style={{border:'none', cursor:'pointer', background:'none'}}>
                                                        <img  src={mensaje} alt="mensaje" width="17"/>
                                                    </button>
                                                </td>
                                                <td style={{width:"10px", padding:"4px", fontSize: '0.7em'}} align="center" >
                                                    <button onClick={()=>{this.modalModificacion(subValue)}} type="button" style={{border:'none', cursor:'pointer', background:'none'}}>
                                                        <img  src={puntos} alt="puntos" width="17"/>
                                                    </button>
                                                </td>
                                                </>
                                            </tr>   
                                            )}
                                            </Draggable>
                                        )
                                    : <tr align='center'>
                                        <td style={{color:'gray', padding:'5px 4px'}}>vacio</td>
                                        <td style={{color:'gray', padding:'5px 4px'}}>vacio</td>
                                        <td style={{color:'gray', padding:'5px 4px'}}>vacio</td>
                                        <td style={{color:'gray', padding:'5px 4px'}}>vacio</td>
                                        <td style={{color:'gray', padding:'5px 4px'}}>vacio</td>
                                        <td style={{color:'gray', padding:'5px 4px'}}>vacio</td>
                                        <td style={{color:'gray', padding:'5px 4px'}}>vacio</td>
                                        <td style={{color:'gray', padding:'5px 4px'}}>vacio</td>
                                        <td style={{color:'gray', padding:'5px 4px'}}>vacio</td>
                                        <td style={{color:'gray', padding:'5px 4px'}}>vacio</td>
                                        <td style={{color:'gray', padding:'5px 4px'}}>vacio</td>
                                        <td style={{color:'gray', padding:'5px 4px'}}>vacio</td>
                                        <td style={{color:'gray', padding:'5px 4px'}}>vacio</td>
                                        <td style={{color:'gray', padding:'5px 4px'}}>vacio</td>
                                    </tr>
                                }
                                {droppableProvided.placeholder}
                                </tbody>
                            )}
                            </Droppable>
                        )}  
                        </DragDropContext>
                </table>
                </div>
                {
                    this.state.displayMapa ? 
                        <div style={this.StyleCompleted()}>
                            <div style={{display:'flex', flexDirection:'column', width:'100%', height:'100%'}}>
                                <GoogleMapReact
                                    bootstrapURLKeys={{ key: "AIzaSyDrq4sz8y-iJt4 wEOWpbdOFVGDy8XUQqbY" }}
                                    defaultCenter={this.props.center}
                                    defaultZoom={this.props.zoom}
                                    onClick={(e)=>console.log(e)}
                                >
                                    {this.state.gruposView.map((e, indice) => 
                                        //<GruposMapa  key={e.id_pasajero} lat={e.longitud} lng={e.latitud} data={e} numero_viaje = {e.orden_recojo}/>)
                                        <GruposMapa  key={e.id_pasajero} lat={e.latitud} lng={e.longitud} data={e} numero_viaje = {e.orden_recojo}/>)
                                        }
                                </GoogleMapReact>
                                <div style={{width:'100%', backgroundColor:'black', display:'flex', justifyContent:'space-between', padding:'5px 4px'}}>
                                    <span style={{color:'white'}}>{this.state.numero_servicio === "0" ? "Pasajeros sin servicio" : "servicio " + this.state.numero_servicio}</span>
                                    <span style={{cursor:'pointer'}} onClick={()=>{this.setState({displayMapa: false})}}><img src={cerrar_modal} width="15" alt="img" /></span>
                                </div>
                            </div>
                        </div>
                    : null
                }
                {
                    this.state.modalNuevoPasajero ? 
                        <ModalAgregarPasajero
                        cerrarModal = {this.cerrarModal}
                        buscarPasajero = {this.buscarPasajero}
                        escogerPasajero = {this.escogerPasajero}
                        agregarHora = {this.agregarHora}
                        agregarAerolinea = {this.agregarAerolinea}
                        agregarffat = {this.agregarffat}
                        guarDardatosModal = {this.guarDardatosModal}
                        aerolinea = {this.props.aerolinea}
                        ffat = {this.props.ffat}
                        newArrayPassenger = {this.state.newArrayPassenger}
                        pasajeroSeleccionado = {this.state.pasajeroSeleccionado}
                        horaServicio = {this.state.horaServicio}
                        cuenta= {this.state.aerolinea}
                        _ffat = {this.state.ffat}
                        />
                    :
                    null
                } 
                {
                    this.state.modalNuevoServicio ?
                        <ModalAgregarServicio
                        cerrarModalServicio = {this.cerrarModalServicio}
                        agregarServicio = {this.agregarServicio}
                        buscarPasajero = {this.buscarPasajero}
                        escogerPasajero = {this.escogerPasajero}
                        agregarHora = {this.agregarHora}
                        agregarAerolinea = {this.agregarAerolinea}
                        agregarffat = {this.agregarffat}
                        agregarHoraServicio = {this.agregarHoraServicio}
                        agregarVehiculo = {this.agregarVehiculo}
                        agregarChofer = {this.agregarChofer}
                        seleccionarVehiculo = {this.seleccionarVehiculo}
                        seleccionarChofer = {this.seleccionarChofer}
                        seleccionarAuto = {this.seleccionarAuto}
                        buscarListaAuto = {this.props.buscarListaAuto}
                        aerolinea = {this.props.aerolinea}
                        ffat = {this.props.ffat}
                        numero_servicio = {this.props.numero_servicio}
                        filtroAuto = {this.props.filtroAuto}
                        newArrayPassenger = {this.state.newArrayPassenger}
                        pasajeroSeleccionado = {this.state.pasajeroSeleccionado}
                        horaServicio = {this.state.horaServicio}
                        cuenta= {this.state.aerolinea}
                        _ffat = {this.state.ffat}
                        horaDelServicio = {this.state.horaDelServicio}
                        newArrayVehiculo = {this.state.newArrayVehiculo}
                        newArrayChofer = {this.state.newArrayChofer}
                        MAS_vehiculo = {this.state.MAS_vehiculo}
                        MAS_chofer = {this.state.MAS_chofer}
                        />
                    :null
                }
                {
                    this.state.modalComentario ? 
                        <ModalComentario 
                            cerrarModalComentario = {this.cerrarModalComentario}
                            agregarComentario = {this.agregarComentario}
                            modificarComentario = {this.modificarComentario}
                            pasajeroComentario = {this.state.pasajeroComentario}
                            comentario = {this.state.comentario}
                        />
                    : null
                }{
                    this.state.modalModificacion 
                    ? <ModalMoficacion 
                        pasajeroComentario={this.state.pasajeroComentario} 
                        cerrarVentanaModificacion = {this.cerrarVentanaModificacion}
                        />
                    : null
                }
            </div>
        )
    }
}
