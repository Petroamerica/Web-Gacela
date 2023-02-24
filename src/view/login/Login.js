import React, { Component } from 'react'
import './login.css'
import logo_gasela from '../../assets/logGasela.png' 
import {global} from '../../global/global'
import {api} from '../../global/api'
import loader from '../../assets/loader.gif' 
import swal from 'sweetalert'

export default class Login extends Component {
    
    settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false
    }

    state = { usuario: '', password: '', client: 'X', stateBtn: true, allClient: [], stateDisabled : false, url: 'http://192.168.1.12:8082/api' }

    componentDidMount(){
        let dominio = document.domain
        if(dominio === "localhost" || dominio === "192.168.1.12"){
            this.setState({url:"http://192.168.1.12:8082/api"})
        }else{
            this.setState({url:"http://190.116.6.12:8082/api"})
        }

        const buscarClientes = async () =>{
            const allClient =  await api.searchClient_fetchSinToken()
            if(allClient.error){
                swal("Mensaje", allClient.error)
                return
            }
            this.setState({allClient})            
        }
        buscarClientes()


        
    }

    validar = async e => {
        e.preventDefault()
        if(this.state.client !== 'X'){
            this.setState({stateBtn: false, stateDisabled: true})
            const validar = await this.login_fetch()
            if(validar.error){
                swal("Mensaje",validar.error, "error")
                this.setState({stateBtn: true, stateDisabled: false})
                return 
            }
            if(!validar.token){
                swal("Mensaje","Credenciales no validas.", "info")
                this.setState({stateBtn: true, stateDisabled: false})
                return
            }
            let cli = this.state.allClient.filter(value => value.id_cliente === this.state.client)
            global.iniciarSesion(validar.token, this.state.usuario, cli[0])
            await this.props.accesoLogin(true, this.state.usuario, validar.token)
        }else{
            swal("Mensaje","Debe de seleccionar una Compañia.", "info")
        }
    }

    login_fetch = async () =>{
        try{
            let body = {id_usuario:this.state.usuario,pass_word:this.state.password}
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            const solicitud = await fetch(this.state.url+"/login", {method: 'POST', headers: headers, body:JSON.stringify(body)})
            const res = await solicitud.json()
            return res
        }catch(err){
            return {error: 'Ocurrio un error con el servicio de acceso.'}
        }
    }

    changeText = text => { this.setState({ [text.target.name]: text.target.value }) }
    
    render() {
        return (
            <div style={{height:'100vh', backgroundColor:'#F4F4F4'}}>
                <div style={{backgroundColor:'#9e2b19', height:'10px'}}></div>
                <div className="loginPrueba">
                    <div className="logoPrueba">
                        <img src={logo_gasela}  alt="logo" style={{maxWidth:'60%'}}/>
                    </div>
                    <div className="formPrueba">
                        <form onSubmit={this.validar} method="POST" className="form">
                            <input 
                                type="text" 
                                name="usuario" 
                                placeholder="Usuario" 
                                required 
                                value={this.state.usuario} 
                                onChange={this.changeText}
                                disabled = {this.state.stateDisabled}
                                autoComplete="off"
                            />
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Contraseña" 
                                required 
                                value={this.state.password} 
                                onChange={this.changeText} 
                                disabled = {this.state.stateDisabled}
                            />
                            <select 
                                name="client" 
                                value={this.state.client} 
                                onChange={this.changeText}
                                disabled = {this.state.stateDisabled}
                            >
                                <option value="X" >Seleccionar Compañia..</option>    
                                {
                                    this.state.allClient.map(value=> <option value={value.id_cliente} key={value.id_cliente}>{value.descripcion_corta}</option> )
                                }
                            </select>
                            {
                                this.state.stateBtn ? 
                                    <input type="submit" value="INGRESAR" />
                                :
                                    <span > <img src={loader} width="45"  alt="loader" /></span>
                            }
                        </form>
                    </div>
                    <div className="comentarioPrueba">
                        <p>Desarrollado por: Area de Sistemas Grupo Petroamerica</p>
                    </div>
                </div>
            </div>
        )
    }
}
/*
            <div>
                <div style={{backgroundColor:'#CF7500', height:'10px'}}></div>
                <div style={{textAlign:'center', marginTop:"50px", marginBottom: "50px"}}>
                    <img src={logo_gasela} width="200" alt="logo"/>
                </div>
                <div className="login">
                    <div className="imagen">
                        <Slider {...this.settings}>
                            <div >
                                <img src={imagen2} alt="logo"/>
                            </div>
                            <div>
                                <img src={imagen3} alt="logo" />
                            </div>
                            <div>
                                <img src={imagen2} alt="logo" />
                            </div>
                            <div>
                                <img src={imagen3} alt="logo" />
                            </div>
                            <div>
                                <img src={imagen2} alt="logo" />
                            </div>
                            <div>
                                <img src={imagen3} alt="logo" />
                            </div>
                        </Slider>
                    </div>
                    <div className="formulario">
                        <form onSubmit={this.validar} method="POST">
                            <label>Iniciar Sesión</label>
                            <input type="text" name="usuario" placeholder="Usuario" required value={this.state.usuario} onChange={this.changeText} />
                            <input type="password" name="password" placeholder="Contraseña" required value={this.state.password} onChange={this.changeText} />
                            <input type="submit" value="Ingresar" />
                        </form>
                    </div>
                </div>
            </div>
*/


/*
    <div>
        <div style={{backgroundColor:'#CF7500', height:'10px'}}></div>
        <div style={{textAlign:'center', marginTop:"50px", marginBottom: "50px"}}>
            <img src={logo_gasela} width="200" alt="logo"/>
        </div>
        <div className="login">
            <div className="imagen">
                <Slider {...this.settings}>
                    <div >
                        <img src={imagen2} alt="logo"/>
                    </div>
                    <div>
                        <img src={imagen3} alt="logo" />
                    </div>
                    <div>
                        <img src={imagen2} alt="logo" />
                    </div>
                    <div>
                        <img src={imagen3} alt="logo" />
                    </div>
                    <div>
                        <img src={imagen2} alt="logo" />
                    </div>
                    <div>
                        <img src={imagen3} alt="logo" />
                    </div>
                </Slider>
            </div>
            <div className="formulario">
                <form onSubmit={this.validar} method="POST">
                    <label>Iniciar Sesión</label>
                    <input type="text" name="usuario" placeholder="Usuario" required value={this.state.usuario} onChange={this.changeText} />
                    <input type="password" name="password" placeholder="Contraseña" required value={this.state.password} onChange={this.changeText} />
                    <input type="submit" value="Ingresar" />
                </form>
            </div>
        </div>
    </div>
*/