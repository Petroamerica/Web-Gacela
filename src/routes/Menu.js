import React, { Component } from 'react'
import Header from '../view/header_footer/Header'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
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
import Error404 from '../view/menu/Error404'
export default class Menu extends Component {
    render() {
        return (
            <BrowserRouter>
              <Header name={this.props.name} />
              <Switch>
                <Route exact path="/GacelaWeb" component={Inicio} />
                <Route exact path="/GacelaWeb/programacion" component={Programacion}/>
                <Route exact path="/GacelaWeb/reprogramacion" component={ReProgramacion}/>
                <Route exact path="/GacelaWeb/liquidacion" component={Liquidacion}/>
                <Route exact path="/GacelaWeb/eliminarLista" component={EliminarListaPasajero}/>
                <Route exact path="/GacelaWeb/carga_ListaPasajeros" component={CargarXlsxListaPasajero}/>
                <Route exact path="/GacelaWeb/carga_Pasajero" component={CargaXlsxPasajero}/>
                <Route exact path="/GacelaWeb/pasajero"  component={Pasajero}/>
                <Route exact path="/GacelaWeb/aerolinea"  component={Aerolinea}/>
                <Route exact path="/GacelaWeb/distrito"  component={Distrito}/>
                <Route exact path="/GacelaWeb/vehiculo"  component={Vehiculo}/>
                <Route exact path="/GacelaWeb/chofer"  component={Chofer}/>
                <Route exact path="/GacelaWeb/precio"  component={Precio}/>
                <Route exact path="/GacelaWeb/tipoServicio"  component={Tarifa}/>
                <Route exact path="/GacelaWeb/cliente"  component={Cliente}/>
                <Route exact path="/GacelaWeb/estadoMovilizacion"  component={EstadoMovilizacion}/>
                <Route exact path="/GacelaWeb/reporte_liquidacion" component={ReporteLiquidacion}/> 
                <Route exact path="/GacelaWeb/reporte_programacion" component={ReporteProgramacion}/> 
                <Route path="*" render={()=><Error404/>} />
              </Switch>
          </BrowserRouter>
        )
    }
}
