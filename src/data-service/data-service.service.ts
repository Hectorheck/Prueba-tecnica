import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DataServiceService {
    constructor(private readonly httpService: HttpService){}
    async getData(): Promise<Array<any>> {
        const url = 'http://api.tsensor.online/api-tsensor/v2/reporte/diario/1d815363ef41de1e45f50dc9e56a8a4b/'+ obtenerFechaActual();
        const respuesta = await this.httpService.get(url).toPromise();
        return respuesta.data;
    }

    async indexData():Promise<Array<any>>{
        const data = await this.getData();
        var result = [];
        for (let i = 0; i < data.length; i++) {
            if(data[i].data.length>0)
            {
                result.push({
                    "codigo":data[i].codigo,
                    "sucursal":data[i].sucursal,
                    "sector":data[i].sector,
                    "nombre_sensor":data[i].nombre_sensor,
                    "clasificacion":data[i].clasificacion,
                    "fecha-ultimo":data[i].data[data.length-1].fecha,
                    "ultimo-promedio":data[i].data[data.length-1].prom
                });
            }
            else{
                result.push({
                    "codigo":data[i].codigo,
                    "sucursal":data[i].sucursal,
                    "sector":data[i].sector,
                    "nombre_sensor":data[i].nombre_sensor,
                    "clasificacion":data[i].clasificacion,
                    "fecha-ultimo":"",
                    "ultimo-promedio":""
                });
            }
        }
        /*
        const result = data.map(info => {
            if(info.data.length>0)
            {
                return {
                    "codigo":info.codigo,
                    "sucursal":info.sucursal,
                    "sector":info.sector,
                    "nombre_sensor":info.nombre_sensor,
                    "clasificacion":info.clasificacion,
                    "fecha-ultimo":info.data[data.length-1].fecha,
                    "ultimo-promedio":info.data[data.length-1].prom
                }
            }
            else{
                return {
                    "codigo":info.codigo,
                    "sucursal":info.sucursal,
                    "sector":info.sector,
                    "nombre_sensor":info.nombre_sensor,
                    "clasificacion":info.clasificacion
                }
            }
     
       })
       */
       return result;
    }
    async htmldata(): Promise<any>{
        const data = await this.indexData();
        var html =``
        for(let i= 0; i<data.length; i++)
        {
            var html = html + `
            <div class="sensor-info" id='${ data[i].codigo}'>
            <h2>Información del Sensor</h2>
            <p><strong>Código:</strong> ${ data[i].codigo }</p>
            <p><strong>Nombre:</strong> ${ data[i].sucursal+'-'+data[i].sector+'-'+data[i].nombre_sensor }</p>
            <p><strong>Clasificación:</strong> ${ data[i].clasificacion }</p>
            <p><strong>Fecha del Último Promedio:</strong>${ data[i]['fecha-ultimo'] }</p>
            <p><strong>Último Promedio Registrado:</strong> ${ data[i]['ultimo-promedio']}</p>
            <button onclick="openModal('${data[i].codigo}')">INFO</button>
            </div>
        `;
        }
        return html;
    }
    async htmlmodaldata(id):Promise<any>{
        const data = await this.getData();
        for(let i=0; i<data.length; i++)
        {
            if(data[i].codigo==id)
            {
                if(data[i].data.length>0)
                {   
                    var infotable = data[i].data;
                    var tmax = 0;
                    var tmin = 100;
                    var tablebody = `<table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Temperatura</th>
                        </tr>
                    </thead>
                    <tbody>`;
                    for(let i=0; i<infotable.length; i++)
                    {
                        tmax = parseFloat(infotable[i].prom) > tmax ? infotable[i].prom : tmax;
                        tmin = parseFloat(infotable[i].prom) < tmin ? infotable[i].prom : tmin;
                        tablebody = tablebody + `
                        <tr>
                            <td>${ infotable[i].fecha }</td>
                            <td>${ infotable[i].prom }</td>
                        </tr>
                        `;
                    }
                    tablebody = tablebody + `
                    </tbody>
                    </table>`;
                }
                else{
                    var tablebody = 'S/D'
                }

                


                var modal = `<div class="modal-content" onclick="event.stopPropagation();">
                <h2>Información Detallada del Sensor</h2>
                <p>Nombre:  ${ data[i].sucursal+'-'+data[i].sector+'-'+data[i].nombre_sensor }</p>
                <p>Temperatura Máxima: ${tmax}°C</p>
                <p>Temperatura Mínima: ${tmin}°C</p>
        
                <!-- Tabla para los Registros Históricos -->
                <h2>Registros Históricos del Sensor</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Temperatura</th>
                        </tr>
                    </thead>
                    ${tablebody}
                </div>`;
                break;
            }
        }
        return modal;

    }
}


function obtenerFechaActual() {
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
    const anio = fecha.getFullYear();
  
    const fechaFormateada = `${anio}-${mes}-${dia}`;
  
    return fechaFormateada;
  }