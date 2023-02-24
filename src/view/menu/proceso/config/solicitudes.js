import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react';
import GruposMapa from './GruposMapa';
import mapa from '../../../../assets/map.svg';
import addUserP from '../../../../assets/userPruebaAdd.svg';
import edit_mapa from '../../../../assets/edit_map.svg';
import CuadroMapa from './CuadroMapa';
import cerrar_modal from '../../../../assets/close.svg';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import swal from 'sweetalert';
import ModalAgregarPasajero from './ModalAgregarPasajero';

export default class solicitudes extends Component {

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
    
    state = {
        displayMapa: false,
        displayMapaActualizar:false,
        marcadorCerrado: true,
        reservarStatus: true,
        modalNuevoPasajero: false,
        bloqueServicio: null,
        gruposView: [],
        grupos: [],
        preGrupos: [],
        newArrayPassenger: [],
        pasajeroSeleccionado: [{descripcion: ''}],
        btn_botonReserva: 'Reservar',
        indice_modificar: 0,
        horaServicio : "",
        aerolinea : "",
        numero_servicio : "0"
    }

    mostrarMapa = (e, numero_servicio) =>{ this.setState({displayMapa: true, gruposView: e, numero_servicio: numero_servicio}) }

    mostrarMapaActualizar = (e, key, numero_servicio) =>{
        let preS = this.state.preGrupos
        if(preS.length > 0){
            swal({
                title: "Mensaje",
                text: "¿Quieres descartar los cambios?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              .then((willDelete) => {
                if (willDelete) {
                    preS.forEach((valor)=>{
                        this.props.pasajeros.forEach((index, conta) => {
                            if(index.id_pasajero === valor.id_pasajero) this.props.pasajeros[conta].estado = true
                        })
                    })
                    this.setState({ displayMapaActualizar: !this.state.displayMapaActualizar, preGrupos:[]})
                } 
            });
        }else{
            this.setState({displayMapaActualizar: !this.state.displayMapaActualizar, grupos: e, indice_modificar: key, numero_servicio: numero_servicio})
        }
    }

    agreparPasajeros = (data) =>{
        if(!this.validarPasajeroDuplicado(data)){
            this.setState({preGrupos: [...this.state.preGrupos,data], grupos: [...this.state.grupos,data]})
        }
        this.props.pasajeros.map((index, conta) =>  (index.id_pasajero === data.id_pasajero) ? this.props.pasajeros[conta].estado = false : null)
        this.props.modificarGrupo(this.props.pasajeros)  
        setTimeout(()=>{
            let estado = (this.state.grupos.length < 1) ? true: false
            this.setState({ reservarStatus : estado})
        }, 1000)
        
    }

    validarPasajeroDuplicado(data){
        let duplicado = false
        this.state.grupos.forEach((index)=>{
            if(index.id_pasajero === data.id_pasajero){ duplicado = true }
        })
        return duplicado
    }

    quitarPasajero = (id_pasajero) =>{
        swal({
            title: "Mensaje",
            text: "¿Segura que retirar a este pasajerodasdasd?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                const grupos = this.state.grupos.filter(index => index.id_pasajero !== id_pasajero)
                setTimeout(()=>{
                    let estado = (this.state.grupos.length < 1) ? true: false
                    this.setState({ reservarStatus : estado, grupos:grupos})
                }, 1000)
                this.props.pasajeros.map(value => value.id_pasajero === id_pasajero ? ((value['estado'] = true, value['numServicio'] = 0)) : null )
                this.props.modificarGrupo(this.props.pasajeros)               
            } 
        });
    }

    agregarSolicitud = () =>{
        this.setState({btn_botonReserva: 'Cargando...'})
        this.setState({marcadorCerrado:false})
        document.getElementById('botonReserva').disabled = true
        const promesa = new Promise ((resolve, reject)=>{
            const pre_solicitud = {data:[]}
            this.state.grupos.map(index => pre_solicitud.data.push(index))
            setTimeout(function(){
                resolve(pre_solicitud);
            }, 1000);
        })
        promesa.then( resolve => {
            resolve.data.map((value, index) => value['numServicio'] = (index+1))
            let hora_servicio =  this.props.solicitud[this.state.indice_modificar].cab.hora_servicio
            let nro_servicio =  this.props.solicitud[this.state.indice_modificar].cab.nro_servicio
            resolve.cab = {hora_servicio: hora_servicio, nro_servicio: nro_servicio}
            this.props.solicitud.splice(this.state.indice_modificar,1,resolve)
            if(this.props.nombre_componente === 'reprogramacion'){
                this.state.preGrupos.forEach(value =>{
                    this.props.servicioReprogramados.push({id_pasajero: value.id_pasajero, data_start: nro_servicio, data_end: nro_servicio})
                })
            }
            this.setState({btn_botonReserva: 'Reservar', reservarStatus:true, marcadorCerrado:true, displayMapaActualizar: !this.state.displayMapaActualizar, preGrupos: []})
        })
    }

    cerrarModal = ()=>{ 
        this.setState({modalNuevoPasajero: false, pasajeroSeleccionado: [{descripcion:''}], newArrayPassenger: [], bloqueServicio: null}) 
    }

    agregarUsuarioServicio = async(value, key, horaServicio) =>{
        await this.props.todosPasajeros()
        this.setState({modalNuevoPasajero: true, bloqueServicio: key, horaServicio: horaServicio})
    }

    guarDardatosModal = (e) =>{
        e.preventDefault()
        if(this.state.pasajeroSeleccionado[0]['id_pasajero'] === undefined){
            swal("Mensaje", "No se encontro a este pasajero, por favor ingresarlo de ser necesario", "info")
        }else{
            this.props.nuevoPasajeroServicio(this.state.pasajeroSeleccionado, this.state.horaServicio, this.state.bloqueServicio, this.state.aerolinea)
            this.setState({modalNuevoPasajero: false, aerolinea: '', horaServicio:''})
        }
    }

    buscarPasajero = text =>{
        if(text.target.value.length > 0){ 
            this.searchPassenger(text.target.value) 
        }else{ 
            this.setState({newArrayPassenger: []}) 
        }
        this.setState({pasajeroSeleccionado:[{descripcion: text.target.value}]})
    }

    agregarHora = text =>{ 
        this.setState({horaServicio:text.target.value})  
    }

    agregarAerolinea = text =>{ 
        this.setState({aerolinea:text.target.value})  
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

    render() {
        const listaMarcadores = this.props.pasajeros.filter(index => index.estado === true)
        return (              
            <div>
                <div style={{overflowY: 'scroll',  maxHeight: '800px', marginTop: '15px'}}>
                    <table border="1" style={{width:'100%', borderCollapse:'collapse'}} className="table_solicitudes" bordercolor="#d9a600">
                        <thead style={{background: '#d9a600', color: 'white', fontSize: '0.8em'}}>
                            <tr>
                                <th style={{width:"20px", padding:'10px', position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>N° Orden</th>
                                <th style={{width:"60px", position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>Hora</th>
                                <th style={{width:"40px", position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>D.N.I</th>
                                <th style={{width:"40px",  position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>Aerolinea</th>
                                <th style={{width:"250px",  position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>Nombre</th>
                                <th style={{width:"250px",  position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>Dirección</th>
                                <th style={{width:"120px",  position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>Distrito</th>
                                <th style={{width:"20px",  position:'sticky', top:'0', zIndex: '10', background: '#e6b012'}}>Opciones</th>
                            </tr>
                        </thead>
                        <DragDropContext onDragEnd={(result) => {
                            const {source, destination} = result
                            if(!destination){ return}
                            if(source.index === destination.index && source.droppableId === destination.droppableId){return}
                            this.props.modifyService(this.props.solicitud, source, destination)
                            }}
                        >          
                            {this.props.solicitud.map((value, key) =>
                                <Droppable droppableId={""+key} key={key}>   
                                {(droppableProvided)=>(
                                    <tbody ref={droppableProvided.innerRef}>      
                                    <tr>
                                        <td colSpan="7" style={{padding:'5px', fontSize:'0.8em'}}>
                                            <span>Servicio <b>{value.cab.nro_servicio}</b></span>
                                            <span onClick={()=>{this.mostrarMapa(value.data, key+1)}} style={{fontSize: '0.9em', marginLeft: '15px', cursor:'pointer'}}> <img src={mapa} alt="ver mapa" width="15"/></span>
                                            <span onClick={()=>{this.mostrarMapaActualizar(value.data, key, key+1)}} style={{fontSize: '0.9em', marginLeft: '15px', cursor:'pointer'}}> <img src={edit_mapa} alt="actualizar mapa" width="15"/> </span>
                                            <span onClick={()=>{this.agregarUsuarioServicio(value.data, key, value.data[0] === undefined ? '' : value.data[0].hora)}} style={{fontSize: '0.9em', marginLeft: '15px', cursor:'pointer'}}> <img src={addUserP} alt="agregar nuevo usuario" width="18"/></span>
                                            <b><span style={{marginLeft: '15px'}}>Hora de Inicio: </span></b>
                                            <input required className="invalido" style={{marginLeft: '3px', width:'40px', paddingLeft: '3px'}}  name="_horaS" type="text" autoComplete="off" value={value.cab.hora_servicio || ''} 
                                            onChange={(text)=>this.props.asignarHoraServicio(text, key)} pattern="^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$" maxLength="5"
                                            />
                                        </td>
                                        <td colSpan="1" style={{padding:'5px', fontSize:'0.8em'}} align='center'>
                                            <span className='botonEliminar' 
                                                //onClick={()=> this.props.eliminarServiciosSolicitud(value)}
                                                >Eliminar servicio</span>
                                        </td>
                                    </tr>
                                        {value.data.map((subValue, subKey) => 
                                            <Draggable  draggableId={subValue.id_pasajero} index={subKey} key={subValue.id_pasajero}>
                                                {(draggableProvided) =>(
                                                    <tr  
                                                    ref={draggableProvided.innerRef}
                                                    {...draggableProvided.draggableProps}
                                                    {...draggableProvided.dragHandleProps}>
                                                        <>  
                                                            <td style={{width:"20px", padding:"4px", fontSize: '0.7em'}} align="center" >{subValue.numServicio}</td>
                                                            <td style={{width:"60px", padding:"4px", fontSize: '0.7em'}} align="center" >{subValue.hora}</td>
                                                            <td style={{width:"40px", padding:"4px", fontSize: '0.7em'}} align="center">{subValue.id_pasajero}</td>
                                                            <td style={{width:"40px", padding:"4px", fontSize: '0.7em'}} align="center">{ subValue.id_cuenta}</td>
                                                            <td style={{maxWidth:"250px", height:'30px', padding:' 5px 4px'}}>
                                                                <div style={{tableLayout:'fixed', overflow:'hidden', whiteSpace:'nowrap', width:'100%', fontSize: '0.7em'}}>{subValue.descripcion_pasajero}</div>
                                                                </td>
                                                            <td style={{maxWidth:"250px", height:'30px', padding:' 5px 4px'}}>
                                                                <div style={{tableLayout:'fixed', overflow:'hidden', whiteSpace:'nowrap', width:'100%', fontSize: '0.7em'}}>{subValue.direccion}</div>
                                                            </td>
                                                            <td style={{maxWidth:"120px", height:'30px', padding:' 5px 4px'}}>
                                                                <div style={{tableLayout:'fixed', overflow:'hidden', whiteSpace:'nowrap', width:'100%', fontSize: '0.7em'}}>{subValue.descripcion_distrito}</div>
                                                            </td>
                                                            <td style={{width:"20px", padding:"4px", fontSize: '0.7em'}} align="center" >
                                                                <>
                                                                <span className='botonLiberar' onClick={()=> this.props.retirarPasajeroSolicitud(key, subKey, subValue.id_pasajero)}>Liberar</span>
                                                                <span className='botonEliminar' onClick={()=> this.props.eliminarPasajeroSolicitud(key, subKey, subValue)}>Eliminar</span>
                                                                </>
                                                            </td>
                                                        </>
                                                    </tr>
                                                )}
                                            </Draggable>
                                        )}
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
                        guarDardatosModal = {this.guarDardatosModal}
                        newArrayPassenger = {this.state.newArrayPassenger}
                        pasajeroSeleccionado = {this.state.pasajeroSeleccionado}
                        horaServicio = {this.state.horaServicio}
                        aerolinea = {this.props.aerolinea}
                        cuenta= {this.state.aerolinea}
                        />
                    :
                    null
                }                                    
                {
                    this.state.displayMapa ? 
                        <div style={this.StyleCompleted()}>
                            <div style={{display:'flex', flexDirection:'column', width:'100%', height:'100%'}}>
                                <GoogleMapReact
                                    bootstrapURLKeys={{ key: "AIzaSyDrq4sz8y-iJt4wEOWpbdOFVGDy8XUQqbY" }}
                                    defaultCenter={this.props.center}
                                    defaultZoom={this.props.zoom}
                                    onClick={(e)=>console.log(e)}
                                >
                                    {this.state.gruposView.map((e, indice) => 
                                        //<GruposMapa  key={e.id_pasajero} lat={e.longitud} lng={e.latitud} data={e} />)
                                        <GruposMapa  key={e.id_pasajero} lat={e.latitud} lng={e.longitud} data={e} />)
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
                    this.state.displayMapaActualizar ? 
                        <CuadroMapa  
                            agreparPasajeros={this.agreparPasajeros}
                            mostrarMapa={this.mostrarMapaActualizar}
                            quitarPasajero={this.quitarPasajero}
                            agregarSolicitud={this.agregarSolicitud}
                            estadoMarcador={this.state.marcadorCerrado}
                            listaMarcadores={listaMarcadores}
                            btn_botonReserva={this.state.btn_botonReserva}
                            reservarStatus={this.state.reservarStatus}
                            pre_solicitud= {this.state.grupos}
                            numero_servicio = {this.state.numero_servicio}
                            destino = "solicitudes.js"
                        />
                    : null
                }
            </div>
        )
    }
}
