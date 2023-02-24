import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, } from 'react-router-dom'
import Cookies  from 'universal-cookie'
import Login from '../view/login/Login'
//import Menu from './Menu'
import Error404 from '../view/menu/Error404'

/*NUEVAS IMPORTACIONES*/
import Header from '../view/header_footer/Header'
import Inicio from '../view/menu/inicio/Inicio'
import Programacion from '../view/menu/proceso/Programacion'
import ReProgramacion from '../view/menu/proceso/ReProgramacion'
import Liquidacion from '../view/menu/proceso/liquidacion'
import EliminarListaPasajero from '../view/menu/proceso/EliminarListaPasajero'
import CargarXlsxListaPasajero from '../view/menu/carga_informacion/CargarXlsxListaPasajero'
import CargaXlsxPasajero from '../view/menu/carga_informacion/CargaXlsxPasajeros'
import Pasajero from '../view/menu/mantenimiento/pasajeros/Pasajero'
import Aerolinea from '../view/menu/mantenimiento/aerolinea/Aerolinea'
import Distrito from '../view/menu/mantenimiento/distrito/Distrito'
import Vehiculo from '../view/menu/mantenimiento/vehiculo/Vehiculo'
import Chofer from '../view/menu/mantenimiento/chofer/Chofer'
import Precio from '../view/menu/mantenimiento/precio/precio'
import Tarifa from '../view/menu/mantenimiento/tarifa/tarifa'
import Cliente from '../view/menu/mantenimiento/cliente/Cliente'
import EstadoMovilizacion from '../view/menu/mantenimiento/FFAT/EstadoMovilizacion'
import ReporteLiquidacion from '../view/menu/reporte/liquidacion/ReporteLiquidacion'
import ReporteProgramacion from '../view/menu/reporte/programacion/ReporteProgramacion'

const cookies = new Cookies()
export default class router extends Component {
  
  state = {
    autenticarToken: false,
    _name: "",
    _token: ""
  }
  accesoLogin = (estado, name, token) =>{
    this.setState({autenticarToken: estado, _name: name, _token: token})
  }

  render() {
    return (
      
          (!this.state.autenticarToken && !cookies.get('status'))
            ? <BrowserRouter>
                <Route path='/' render={()=> <Login accesoLogin={this.accesoLogin}/>}  />
                <Route path="*" render={()=><Error404/>} />
              </BrowserRouter>
            : <BrowserRouter>
                <Header />
                  <Switch>
                    <Route exact path="/" component={Inicio} />
                    <Route exact path="/programacion" component={Programacion}/>
                    <Route exact path="/reprogramacion" component={ReProgramacion}/>
                    <Route exact path="/liquidacion" component={Liquidacion}/>
                    <Route exact path="/eliminarLista" component={EliminarListaPasajero}/>
                    <Route exact path="/carga_ListaPasajeros" component={CargarXlsxListaPasajero}/>
                    <Route exact path="/carga_Pasajero" component={CargaXlsxPasajero}/>
                    <Route exact path="/pasajero"  component={Pasajero}/>
                    <Route exact path="/aerolinea"  component={Aerolinea}/>
                    <Route exact path="/distrito"  component={Distrito}/>
                    <Route exact path="/vehiculo"  component={Vehiculo}/>
                    <Route exact path="/chofer"  component={Chofer}/>
                    <Route exact path="/precio"  component={Precio}/>
                    <Route exact path="/tipoServicio"  component={Tarifa}/>
                    <Route exact path="/cliente"  component={Cliente}/>
                    <Route exact path="/estadoMovilizacion"  component={EstadoMovilizacion}/>
                    <Route exact path="/reporte_liquidacion" component={ReporteLiquidacion}/> 
                    <Route exact path="/reporte_programacion" component={ReporteProgramacion}/> 
                    <Route path="*" render={()=><Error404/>} />
                  </Switch>
              </BrowserRouter>
        
    )
  }
}

