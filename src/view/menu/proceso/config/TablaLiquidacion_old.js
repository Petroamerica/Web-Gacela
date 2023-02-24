import React, { Component, Fragment } from 'react'
import swal from 'sweetalert'
import addUser from '../../../../assets/addUser.svg'
import mensaje from '../../../../assets/message.svg'
import puntos from '../../../../assets/3_points.svg'
import ModalAgregarPasajero from './ModalAgregarPasajero'
import ModalComentario from './ModalComentario'
import ModalAgregarServicio from './ModalAgregarServicio'
import ModalMoficacion from './ModalMoficacion'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'

export default class TablaLiquidacion extends Component {
    

    state={
        pasajeroSeleccionado: [{descripcion:''}],
        newArrayPassenger:[],
        pasajeroComentario: [],
        newArrayVehiculo: [],
        newArrayChofer: [],
        modalNuevoPasajero:false,
        modalComentario : false,
        modalNuevoServicio: false,
        modalModificacion: false,
        bloqueServicio: null,
        horaServicio: '',
        aerolinea:'',
        comentario: '',
        ffat: '',
        horaDelServicio: '',
        MAS_vehiculo : '',
        MAS_chofer: '',
        posicion:[]
    }

    /*FUNCIONES PARA EL MODAL DE NUEVO PASAJERO*/
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

    /*AGREGAR DATOS*/
    agregarHora = text =>{ this.setState({horaServicio:text.target.value})  }
    agregarHoraServicio = text =>{ this.setState({horaDelServicio:text.target.value})  }
    agregarAerolinea = text =>{ this.setState({aerolinea:text.target.value})  }
    agregarffat = text =>{ this.setState({ffat:text.target.value})  }


    /*FUNCIONES PARA EL MODAL DE COMENTARIO*/
    modalComentario = (value, key, subKey) =>{ 
        this.setState({pasajeroComentario: value, modalComentario: true, comentario: value['comentario'], posicion: {key, subKey}}) 
    }

    cerrarModalComentario = () =>{ this.setState({modalComentario: false, pasajeroComentario: [], comentario: '', posicion: []}) }

    modificarComentario = (value) =>{ this.setState({comentario: value.target.value}) }

    agregarComentario = (e) =>{
        e.preventDefault()
        this.props.agregarComentario(this.state.pasajeroComentario, this.state.posicion, this.state.comentario)
    }

    /*FUNCIONES PARA EL MODAL DE SERVICIO*/
    modalServicio = async () =>{ 
        await this.props.todosPasajeros()
        this.setState({modalNuevoServicio: true}) 
    }

    cerrarModalServicio = () =>{
        this.setState({modalNuevoServicio: false})        
    }

    agregarServicio = (e) =>{
        e.preventDefault()
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
        //if(validarPasajero || validarChofer || validarAuto || this.state.ffat === ''){
        if(this.state.ffat === ''){
            swal("Mensaje", "Debe seleccionar un estado de movilización.", "info")
        }else{
            this.props.nuevoServcio_Pasajero(this.state.MAS_chofer, this.state.MAS_vehiculo, this.state.pasajeroSeleccionado, this.state.horaDelServicio, this.state.horaServicio, this.state.ffat, this.state.aerolinea, e)
            this.setState({modalNuevoPasajero: false, aerolinea: '', horaServicio:'', ffat: '', horaDelServicio: '', MAS_vehiculo: '', MAS_chofer: ''})
        }
    }

    //VEHICULO
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
        /*let vehiculo = this.props.filtrarAutoSeleccionado()
        let validar = false
        for (let index = 0; index < vehiculo.length; index++) {
            if(vehiculo[index] === id_vehiculo){
                validar = true
                break
            }
        }*/
        //if(!validar){
            this.setState({MAS_vehiculo: id_vehiculo, newArrayVehiculo: []})
        /*}else{
            swal("Mensaje", "Chofer ya fue seleccionado anteriormente", "info")
        } */   
    }

    //CHOFER
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
        /*let chofer = this.props.filtrarChoferSeleccionado()
        let validar = false
        for (let index = 0; index < chofer.length; index++) {
            if(chofer[index] === id_chofer){
                validar = true
                break
            }
        }*/
        //if(!validar){
            this.setState({MAS_chofer: id_chofer, newArrayChofer: []})
        /*}else{
            swal("Mensaje", "Chofer ya fue seleccionado anteriormente", "info")
        }   */ 
    }

    //VER QUIEN MODIFICO
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

    render() {
        return (
            <div style={{marginTop: '15px', padding:'0px 15px', marginBottom:'15px'}} onKeyDown={this.onKeyPressed} tabIndex={-1}>
                <div style={{display:'flex', justifyContent:'space-between', fontSize: '1.2em', fontWeight:'bold', marginBottom: '10px'}}>
                    <div style={ {display:'flex' ,flexDirection:'row'}}>
                        <div  style={{marginRight:'15px'}}>
                            <input onClick={()=> {this.modalServicio()} } type="button" value="Nuevo servicio" style={{backgroundColor:'#F0A500', border:'1px solid #F0A500', padding:'5px 15px', color:'white', cursor:'pointer'}}/>
                        </div>
                        <div >
                            <input onClick={()=> {this.props.guardarCambios()} } type="button" value="Guardar cambios" style={{backgroundColor:'#F0A500', border:'1px solid #F0A500', padding:'5px 15px', color:'white', cursor:'pointer'}}/>
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
                <table border="1" style={{width:'100%', borderCollapse:'collapse'}} className="table_solicitudes">
                    <thead style={{background: '#F0A500', color: 'white', fontSize: '0.8em'}}>
                        <tr>
                            <th style={{width:"20px", padding:'6px', position:'sticky', top:'0', zIndex: '10', background: '#F0A500'}}>N° Orden</th>
                            <th style={{width:"60px", position:'sticky', top:'0', zIndex: '10', background: '#F0A500'}}>Hora</th>
                            <th style={{width:"40px", position:'sticky', top:'0', zIndex: '10', background: '#F0A500'}}>Aerolinea</th>
                            <th style={{width:"40px", position:'sticky', top:'0', zIndex: '10', background: '#F0A500'}}>Area</th>
                            <th style={{width:"40px", position:'sticky', top:'0', zIndex: '10', background: '#F0A500'}}>Cod</th>
                            <th style={{width:"250px", position:'sticky', top:'0', zIndex: '10', background: '#F0A500'}}>nombre</th>
                            <th style={{width:"250px", position:'sticky', top:'0', zIndex: '10', background: '#F0A500'}}>Direccion</th>
                            <th style={{width:"90px", position:'sticky', top:'0', zIndex: '10', background: '#F0A500'}}>Distrito</th>
                            <th style={{width:"40px", position:'sticky', top:'0', zIndex: '10', background: '#F0A500'}}>Telefono</th>
                            <th style={{width:"30px", position:'sticky', top:'0', zIndex: '10', background: '#F0A500'}}>Automovil</th>
                            <th style={{width:"30px", position:'sticky', top:'0', zIndex: '10', background: '#F0A500'}}>Costo</th>
                            <th style={{width:"30px", position:'sticky', top:'0', zIndex: '10', background: '#F0A500'}}>FF A T</th>
                            <th style={{width:"10px", position:'sticky', top:'0', zIndex: '10', background: '#F0A500'}}>Comentario</th>
                            <th style={{width:"10px", position:'sticky', top:'0', zIndex: '10', background: '#F0A500'}}>Cambios</th>
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

                            <tbody ref={droppableProvided.innerRef} style={{position:'relative'}}>
                                <tr style={{backgroundColor: value.data.length > 0 ? 'white': '#F66767', color:value.data.length > 0 ? 'black': 'white'}}>
                                    <td colSpan="14" style={{padding:'5px', fontSize:'0.8em'}}>
                                        <span>Servicio <b>{(value.cabecera.nro_servicio)}</b></span>
                                        <span onClick={()=>{this.agregarUsuarioServicio(value, key)}} style={{fontSize: '0.9em', marginLeft: '15px', cursor:'pointer'}}> <img src={addUser} alt="agregar nuevo usuario" width="18"/></span>
                                        <b><span style={{marginLeft: '15px'}}>Hora de Inicio: </span></b>
                                        <input className="invalido" style={{marginLeft: '3px', width:'50px', textAlign:'center'}} name="_horaS" type="text" autoComplete="off"  maxLength="5" 
                                            pattern="^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$" 
                                            value={value.cabecera.hora}
                                            onChange={(text)=>this.props.cambiarHora(text, value.cabecera.nro_servicio )}
                                            required
                                            readOnly = { value.data.length > 0 ? false : true}
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
                                                    <div style={{position:'absolute', left:'260px', height:'95px', display:'flex', flexDirection:'column', backgroundColor:'white', width:'250px', overflowY:'scroll', padding:'7px'}}>
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
                                            <div style={{position:'absolute', left:'570px', height:'95px', display:'flex', flexDirection:'column', backgroundColor:'white', width:'250px', overflowY:'scroll', padding:'7px'}}>
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
                                    </td>
                                </tr>
                                {
                                    value.data.length > 0 ?    
                                
                                value.data.map((subValue, subKey) => 
                                <Draggable  draggableId={subValue.id_pasajero+subValue.nro_servicio} index={subKey} key={subValue.id_pasajero+subValue.nro_servicio}>
                                {(draggableProvided) =>(
                                    <tr 
                                    ref={draggableProvided.innerRef}
                                                    {...draggableProvided.draggableProps}
                                                    {...draggableProvided.dragHandleProps}>
                                        <>      
                                        <td style={{width:"20px", padding:"4px", fontSize: '0.7em'}} align="center" >{subValue.orden_recojo}</td>
                                        <td style={{width:"60px", padding:"4px", fontSize: '0.7em'}} align="center" >{subValue.hora}</td>
                                        <td style={{width:"40px", padding:"4px", fontSize: '0.7em'}} align="center" >
                                            <select id={[key ,subValue.id_pasajero]} value={subValue.id_cuenta} name="id_cuenta" onChange={this.props.changeText}>
                                                <option value="">-</option>
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
                                        <td className="eliminar" style={{width:"40px", padding:"4px", fontSize: '0.7em'}} align="center">{subValue.id_area}</td>
                                        <td className="eliminar" style={{width:"40px", padding:"4px", fontSize: '0.7em'}} align="center">{subValue.id_pasajero}</td>
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
                                            <select id={[key ,subValue.id_pasajero, value.cabecera.nro_servicio]} value={subValue.id_tipo_estado_mov || ''} name="id_tipo_estado_mov" onChange={this.props.changeText}>
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
                                            <button onClick={()=>{this.modalComentario(subValue, key, subKey)}} type="button" style={{border:'none', cursor:'pointer'}}>
                                                <img  src={mensaje} alt="mensaje" width="17"/>
                                            </button>
                                        </td>
                                        <td style={{width:"10px", padding:"4px", fontSize: '0.7em'}} align="center" >
                                            <button onClick={()=>{this.modalModificacion(subValue)}} type="button" style={{border:'none', cursor:'pointer'}}>
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
