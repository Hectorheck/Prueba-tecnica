import { Controller, Get, Param, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';
import { DataServiceService } from './data-service/data-service.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly httpService: HttpService, private readonly dataservice:DataServiceService) {}

  @Get()
  @Render('index')
  async index(): Promise<any>{
    const data = await this.dataservice.indexData();
     return {data};
  }

  @Get('/indexdata')
  async data(): Promise<any>{
    const data = await this.dataservice.indexData();
    return data;
    }

  @Get('/GetHTMLdata')
  async htmldata(): Promise<any>{
    const data = await this.dataservice.htmldata();
    return data;
    }
  @Get('/GetmodalHTML/:id')
  async htmlmodaldata(@Param() params): Promise<any>{
    const data = await this.dataservice.htmlmodaldata(params.id);
    return data;
    }
}
