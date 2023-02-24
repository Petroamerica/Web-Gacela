import React, { Component } from 'react'
import {NavLink} from 'react-router-dom'
import './header_footer.css';
import usuairoP from '../../assets/user_prueba.svg'
import {global} from '../../global/global'
export default class Header extends Component {

  state = {
    data: ''
  }
  
  async componentDidMount(){
    const {estadoLocalStorage, data} = await global.obtenerDatosLocalStorage()
    if(estadoLocalStorage){
      this.setState({data})
    }else{
      this.setState({data: false})
    }
  }

  render() {
    const {name} = this.state.data ? this.state.data[1] : {name: ''}
    const {descripcion_corta} = this.state.data ? this.state.data[0] : {descripcion_corta: ''}
        return (
            <header >
              <div className="header_div">
                <div className="header_div2">
                  <img src={usuairoP} alt="icon" />
                  <label>Bienvenido(a) : <b>{name}</b></label>
                  <label>Compañia : <b>{descripcion_corta}</b></label>
                </div>
              </div>
                <ul className="nav">
                  <li><NavLink exact to="/GacelaWeb" activeClassName="active" token="dsd">Inicio</NavLink></li>
                  <li><NavLink exact to="/programacion" activeClassName="active">Procesos </NavLink> 
                    <ul>
                        <li><NavLink exact to="/programacion" activeClassName="active">Programacion </NavLink></li> 
                        <li><NavLink exact to="/reprogramacion" activeClassName="active">ReProgramacion </NavLink></li> 
                        <li><NavLink exact to="/liquidacion" activeClassName="active">Liquidacion </NavLink></li> 
                        <li><NavLink exact to="/eliminarLista" activeClassName="active">Eliminar Lista de Pasajeros</NavLink></li> 
                    </ul>
                  </li>
                  <li><NavLink exact to="/carga_ListaPasajeros" activeClassName="active">Carga de informacion </NavLink>
                    <ul>
                      <li><NavLink exact to="/carga_ListaPasajeros" activeClassName="active">Cargar Lista de Pasajeros</NavLink></li> 
                      <li><NavLink exact to="/carga_Pasajero" activeClassName="active">Cargar de Pasajeros</NavLink></li> 
                    </ul>
                  </li>
                  <li><NavLink  exact to="/pasajero" activeClassName="active">Mantenimiento</NavLink>
                  <ul>
                      <li><NavLink exact to="/pasajero" activeClassName="active">Pasajero</NavLink></li> 
                      <li><NavLink exact to="/distrito" activeClassName="active">Distrito</NavLink></li> 
                      <li><NavLink exact to="/precio" activeClassName="active">Precio</NavLink></li> 
                      <li><NavLink exact to="/tipoServicio" activeClassName="active">Tipo de Servicio</NavLink></li> 
                      <li><NavLink exact to="/aerolinea" activeClassName="active">Aerolinea</NavLink></li> 
                      <li><NavLink exact to="/vehiculo" activeClassName="active">Vehiculo</NavLink></li> 
                      <li><NavLink exact to="/chofer" activeClassName="active">Chofer</NavLink></li> 
                      <li><NavLink exact to="/estadoMovilizacion" activeClassName="active">Estado de Movilización</NavLink></li> 
                      <li><NavLink exact to="/cliente" activeClassName="active">Cliente</NavLink></li> 
                    </ul>
                  </li>
                  <li><NavLink exact to="/reporte_liquidacion" activeClassName="active">Repote</NavLink>
                    <ul>
                        <li><NavLink exact to="/reporte_programacion" activeClassName="active">Programacion</NavLink></li> 
                        <li><NavLink exact to="/reporte_liquidacion" activeClassName="active">Liquidacion</NavLink></li> 
                    </ul>
                  </li>
                  <li><a href="/" onClick={()=>{global.cerrarSesion()}}>Cerrar sesión</a></li>
                </ul>
            </header>
        );
    }
}
