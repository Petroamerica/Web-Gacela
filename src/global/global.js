import Cookies  from 'universal-cookie'
const cookies = new Cookies()

export const global = {
    cerrarSesion : ()=> {
        cookies.remove('status')
        localStorage.clear()
        //window.location = "/"
        window.location.reload()
    },

    iniciarSesion : (token, _name, arrayCli) =>{
        var fechaH = new Date();
        fechaH.setHours(fechaH.getHours()+1);
        let _localStorage = []
        _localStorage.push(arrayCli)
        _localStorage.push({name: _name})
        localStorage.setItem('status', true) 
        localStorage.setItem('token',token)
        localStorage.setItem('user',_name)
        localStorage.setItem('data', JSON.stringify(_localStorage))
        cookies.set('status', true,{expires: new Date(fechaH)})
    },

    validarCookies : ()=>{
        if(cookies.get('status')){
            return true
        }
    },

    obtenerDatosLocalStorage : async () =>{
        const data = await JSON.parse(localStorage.getItem('data'))
        const token = localStorage.getItem('token')
        let estadoLocalStorage = false
        if(data && token){
            const {id_cliente, descripcion} = data[0]
            const {name} = data[1]
            estadoLocalStorage = true
            return  {
                data,
                id_cliente,
                descripcion,
                name,
                token,
                estadoLocalStorage
            }   
        }
        return {
            estadoLocalStorage
        }
    }
}

