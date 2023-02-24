var url =  ""
let dominio = document.domain
if(dominio === "localhost" || dominio === "192.168.1.12"){
    url =  "http://192.168.1.12:8082/api"
}else{
    url =  "http://190.116.6.12:8082/api"
}


export const api = {
    searchClient_fetch : async (token) =>{
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer '+token);
        const solicitud = await fetch(url+"/Cliente", {method: 'GET', headers: headers})
        const res = await solicitud.json()
        return res
    },

    searchClient_fetchSinToken : async () =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            const solicitud = await fetch(url+"/Cliente", {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res
        }catch(err){
            return {error: 'Ocurrio un error con el servidor, intentelo mas tarde.'}
        }
    },

    searchListaPasajero : async(token, cli, fec, ori, hora1, hora2, query ) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            let shoraIni = hora1+":00"
            let shoraFin = hora2+":00"
            const solicitud = await fetch(url+"/listapasajero/"+cli+"/"+fec+"/"+ori+"/"+query+"/"+shoraIni+"/"+shoraFin, {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res
        }catch(err){
            return {error: 'No se proceso la lista de pasajeros'}
        }
    },

    createPassenger_fetch : async (token, body) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/pasajero", {method: 'POST', headers: headers, body: JSON.stringify(body)})
            return solicitud
        }catch(e){
            return {error: 'Ocurrio un error al crear el pasajero'}
        }
    },

    searchPassenger_fetch : async (token, cli, cod) =>{
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer '+token);
        const solicitud = await fetch(url+"/pasajero/"+cli+"/"+cod, {method: 'GET', headers: headers})
        const res = await solicitud.json()
        return res
    },

    searchDistrict_fetch : async (token) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/Distrito", {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res
        }catch(err){
            return {error: 'Ocurrio un error en el servidor'}
        }
    },

    passanger_fetch: async(token, client) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/Pasajero/"+client, {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res
        }catch(e){
            return {error:'Ocurrio un error en el servidor.'}
        }
        
    },

    passangerProgramacion_fetch: async(token, client) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/Pasajero/"+client+"/d", {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res

        }catch(err){
            return {error:'Ocurrio un error en el servidor.'}
        }
    },

    updatePassenger_fecth: async(token, client, passenger, data) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/Pasajero/"+client+"/"+passenger, {method: 'PUT', headers: headers, body: JSON.stringify(data)})
            return solicitud
        }catch(e){
            return {error:'Ocurrio un error al actualizar los datos del pasajero'}
        }
    },

    updateListaPasajeros_fecth: async(token, data, mod) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/ListaPasajero/"+mod, {method: 'PUT', headers: headers, body: JSON.stringify(data)})
            return solicitud
        }catch(err){
            return {error:'Ocurrio un error al actualizar la lista de pasajeros'}
        }
    },

    searchPricePassenger_fetch: async(token, client, num_passenger, fecha) =>{
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer '+token);
        const solicitud = await fetch(url+"/Pasajero/"+client+"/"+num_passenger+"/"+fecha, {method: 'GET', headers: headers})
        const res = await solicitud.json()
        return res
    },

    saveServices_fetch: async(token, service, methodType) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json'); 
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/listapasajero/"+methodType, {method: 'POST', headers: headers, body: JSON.stringify(service)})
            return solicitud
        }catch(err){
            return {error:'Ocurrio un error en el servidor.'}
        }
    },

    savePasajerosXLSX_fetch: async(token, service) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(`${url}/pasajero/BLOQUE`, {method: 'POST', headers: headers, body: JSON.stringify(service)})
            return solicitud
        }catch(err){
            return{error: 'Ocurrio un error en el servidor para guardar el XLSX'}
        }
    },

    searchPrices_fetch: async(token, client, _date) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/listapreciopasajero/"+client+"/"+_date, {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res
        }catch(err){
            return{error: 'Ocurrio un error en encontrar el regitro de tarifa'}
        }
    },

    searchFFTA_fetch: async(token) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/TipoEstadoMov", {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res
        }catch(err){
            return {error:'Ocurrio un error en el servidor.'}
        }
    },

    searchArea_fetch: async(token, client) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/area/"+client, {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res
        }catch(err){
            return {error:'Ocurrio un error en el servidor.'}
        }
    },

    searchHora_fetch : async(token, client, fecha, origen)=>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/listapasajero/"+client+"/"+fecha+"/"+origen, {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res
        }catch(err){
            return {error:'Ocurrio un error en el servidor para obtener la hora.'}
        }
    },

    searchHoraReprogramacion_fetch : async(token, client, fecha, origen)=>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/listapasajero2/"+client+"/"+fecha+"/"+origen, {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res
        }catch(err){
            return {error:'Ocurrio un error al solicitar la hora de programación'}
        }
    },

    searchNumeroServicio_fetch : async(token, cliente, fecha)=>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/servicio/"+cliente+"/"+fecha+"/max", {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res
        }catch(err){
            return {error:'No se proceso el numero de servicio'}
        }
    },
    
    searchListaReprogramados_fetch : async(token, cliente, fecha, servicio)=>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/ListaReprogramados/"+cliente+"/"+fecha+"/"+servicio, {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res
        }catch(err){
            return {error:'No se proceso el numero de servicio'}
        }
    },

    searchServiciosfetch : async(token, cliente, fecha, origen, hora1, hora2)=>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/servicio/"+cliente+"/"+fecha+"/"+origen+"/"+hora1+"/"+hora2, {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res
        }catch(err){
            return {error:'Ocurrio un error al buscar los servicios.'}
        }
    },

    updateFFAT_fecth: async(token, data) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/TipoEstadoMov", {method: 'PUT', headers: headers, body: JSON.stringify(data)})
            return solicitud
        }catch(err){
            return {error: 'Ocurrio un error al actualizar el Estado de Movilización'}
        }
    },

    saveFFAT_fecth: async(token, data) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/TipoEstadoMov", {method: 'POST', headers: headers, body: JSON.stringify(data)})
            return solicitud
        }catch(err){
            return {error: 'Ocurrio un error al crear el Estado de Movilización'}
        }
    },
    //REPORTE CABECERA
    reporteLiquidacionCabecera_fetch: async (token,cliente,fechaI,fechaII,origen,hora1,hora2, nro_servicio) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/servicio/"+cliente+"/"+fechaI+"/"+fechaII+"/"+origen+"/"+hora1+"/"+hora2+"/"+nro_servicio, {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res
        }catch(e){
            return {error: 'Ocurrio un error al buscar la cabecera del reporte'}
        }
    },
    //REPORTE DETALLE
    reporteLiquidacionDetalle_fetch: async (token,cliente,fechaI,fechaII,origen,hora1,hora2, nro_servicio) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/listapasajero/"+cliente+"/"+fechaI+"/"+fechaII+"/"+origen+"/"+hora1+"/"+hora2+"/"+nro_servicio, {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res
        }catch(e){
            return {error: 'Ocurrio un error al buscar el detalle del reporte'}
        }
    },
    //ELIMINAR LISTA DE PASAJEROS
    eliminarListaPasajero_fetch: async(token, cliente, fecha1, hora1, fecha2, hora2)=> {
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/ListaPasajero/"+cliente+"/"+fecha1+' '+hora1+":00/"+fecha2+' '+hora2+":00", {method: 'DELETE', headers: headers})
            return solicitud
        }catch(err){
            return {error: 'Ocurrio un error en el servidor al eliminar la lista de pasajero.'}
        }
    },
    //ELIMINAR PASAJERO DE LA PROGRAMACION
    eliminarPasajero_fetch :async (token, cliente, codigo, fecha, origen, hora) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(`${url}/ListaPasajero/${cliente}/${codigo}/${fecha}/${origen}/${hora}`, {method: 'DELETE', headers: headers})
            return solicitud
        }catch(err){
            return {error: 'Ocurrio un error al eliminar al pasajero.'}
        }
    },
    //ELIMINAR ESTADO DE MOVILIZACION
    eliminarEstadoMovilizacion_fetch :async (token, sTipoEstadoMov) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(`${url}/TipoEstadoMov/${sTipoEstadoMov}`, {method: 'DELETE', headers: headers})
            return solicitud            
        }catch(err){
            return {error: 'Ocurrio un error al eliminar el Estado de Movilización'}
        }
    },
    reprogramacion_fetch : async (token, cliente, fecha, origen, hora)=>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/listapasajero/"+cliente+"/"+fecha+"/"+origen+"/"+hora, {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res
        }catch(err){
            return {error: 'Error en la consulta de ReProgramacion'}
        }
    },

    //DISTRITO
    GET_distrito_fetch : async (token)=>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(`${url}/distrito`, {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res
        }catch(e){
            return {error: 'Ocurrio un error con el servidor.'}
        }
    },
    POST_distrito_fetch: async(token, data) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(`${url}/distrito`, {method: 'POST', headers: headers, body: JSON.stringify(data)})
            return solicitud
        }catch(err){
            return {error: 'Ocurrio un error al crear un nuevo distrito, es posible que ya exista.'}
        }
    },
    PUT_distrito_fecth: async(token, data) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(`${url}/distrito`, {method: 'PUT', headers: headers, body: JSON.stringify(data)})
            return solicitud
        }catch(e){
            return {error: 'Ocurrio un error al actualizar el distrito'}
        }
    },
    DELETE_distrito_fetch: async(token, id_distrito) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(`${url}/distrito/${id_distrito}`, {method: 'DELETE', headers: headers})
            return solicitud
        }catch(e){
            return {error: 'Ocurrio un error al eliminar el distrito'}
        }
    },

    //AEROLINEA
    searchAerolineafetch: async(token, cliente) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/cuenta/"+cliente+"/01", {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res
        }catch(err){
            return {error:'Ocurrio un error con la lista de aerolineas'}
        }
    },
    searchAerolineafetch_02: async(token, cliente) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/cuenta/"+cliente+"/02", {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res
        }catch(err){
            return {error:'Ocurrio un error en el servidor.'}
        }
    },
    POST_aerolinea_fetch: async(token, data) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(`${url}/Cuenta`, {method: 'POST', headers: headers, body: JSON.stringify(data)})
            return solicitud
        }catch(err){
            return {error: 'Ocurrio un error al crear una nueva aerolinea, es posible que ya exista.'}
        }
    },
    PUT_aerolinea_fecth: async(token, data) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(`${url}/Cuenta`, {method: 'PUT', headers: headers, body: JSON.stringify(data)})
            return solicitud
        }catch(e){
            return {error: 'Ocurrio un error al actualizar la aerolinea'}
        }
    },
    DELETE_aerolinea_fetch: async(token,id_cliente, id_distrito) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(`${url}/Cuenta/${id_cliente}/${id_distrito}`, {method: 'DELETE', headers: headers})
            return solicitud
        }catch(e){
            return {error: 'Ocurrio un error al eliminar una aerolinea'}
        }
    },

    //CHOFER
    searchUnidadesChofer_fetch : async(token, _solicitud, estado)=>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/"+_solicitud+"/"+estado, {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res
        }catch(err){
            return {error:'Ocurrio un error en el servidor.'}
        }
    },
    POST_chofer_fetch: async(token, data) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(`${url}/chofer`, {method: 'POST', headers: headers, body: JSON.stringify(data)})
            return solicitud
        }catch(err){
            return {error: 'El chofer ya se encuentra registrado'}
        }
    },
    PUT_chofer_fecth: async(token, data) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(`${url}/chofer`, {method: 'PUT', headers: headers, body: JSON.stringify(data)})
            return solicitud
        }catch(e){
            return {error: 'Ocurrio un error con la información enviada.'}
        }
    },
    DELETE_chofer_fetch: async(token, id_chofer) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(`${url}/chofer/${id_chofer}/`, {method: 'DELETE', headers: headers})
            return solicitud
        }catch(e){
            return {error: 'Ocurrio un error al eliminar un chofer'}
        }
    },
    //VEHICULO
    POST_vehiculo_fetch: async(token, data) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(`${url}/UNIDAD`, {method: 'POST', headers: headers, body: JSON.stringify(data)})
            return solicitud
        }catch(err){
            return {error: 'Ocurrio un error al actualizar la unidad.'}
        }
    },
    PUT_vehiculo_fecth: async(token, data) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(`${url}/UNIDAD`, {method: 'PUT', headers: headers, body: JSON.stringify(data)})
            return solicitud
        }catch(e){
            return {error: 'Ocurrio un error con la información enviada.'}
        }
    },
    DELETE_vehiculo_fetch: async(token, id_unidad) =>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(`${url}/UNIDAD/${id_unidad}/`, {method: 'DELETE', headers: headers})
            return solicitud
        }catch(e){
            return {error: 'Ocurrio un error al eliminar la unidad.'}
        }
    },
    //TARIFA
    searchTarifa_fetch : async(token, cliente)=>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/ListaPrecioManten/"+cliente, {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res
        }catch(err){
            return {error:'Ocurrio un error en el servidor.'}
        }
    },
    deleteTarifa_fetch : async(token, cliente, des, fechaI, fechaF)=>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/ListaPrecioManten/"+cliente+"/"+des+"/"+fechaI+"/"+fechaF, {method: 'DELETE', headers: headers})
            return solicitud
        }catch(err){
            return {error:'Ocurrio un error en el servidor.'}
        }
    },
    postTarifa_fetch : async(token, data)=>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/listaPrecioManten", {method: 'POST', headers: headers, body: JSON.stringify(data)})
            return solicitud
        }catch(err){
            return {error:'Ocurrio un error en el servidor.'}
        }
    },
    //TIPO SERVICIO
    searchTipoServicio_fetch : async(token)=>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/tipoServicio", {method: 'GET', headers: headers})
            const res = await solicitud.json()
            return res
        }catch(err){
            return {error:'Ocurrio un error en el servidor.'}
        }
    },
    deleteTipoServicio_fetch : async(token, tipo_servicio)=>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/tipoServicio/"+tipo_servicio, {method: 'DELETE', headers: headers})
            return solicitud
        }catch(err){
            return {error:'Ocurrio un error en el servidor.'}
        }
    },  
    postTipoServicio_fetch : async(token, data)=>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/tipoServicio", {method: 'POST', headers: headers, body: JSON.stringify(data)})
            return solicitud
        }catch(err){
            return {error:'Ocurrio un error en el servidor.'}
        }
    },  
    putTipoServicio_fetch : async(token, data)=>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/tipoServicio", {method: 'PUT', headers: headers, body: JSON.stringify(data)})
            return solicitud
        }catch(err){
            return {error:'Ocurrio un error en el servidor.'}
        }
    }, 

    //CLIENTE
    postCliente_fetch : async(token, data)=>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/cliente", {method: 'POST', headers: headers, body: JSON.stringify(data)})
            return solicitud
        }catch(err){
            return {error:'Ocurrio un error en el servidor.'}
        }
    },
    putCliente_fetch : async(token, data)=>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/cliente", {method: 'PUT', headers: headers, body: JSON.stringify(data)})
            return solicitud
        }catch(err){
            return {error:'Ocurrio un error en el servidor.'}
        }
    },
    deleteCliente_fetch : async(token, cliente)=>{
        try{
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'Bearer '+token);
            const solicitud = await fetch(url+"/cliente/"+cliente, {method: 'DELETE', headers: headers})
            return solicitud
        }catch(err){
            return {error:'Ocurrio un error en el servidor.'}
        }
    },
}