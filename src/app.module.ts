import { Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { DataServiceService } from './data-service/data-service.service';


@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, DataServiceService],
})
export class AppModule {}
