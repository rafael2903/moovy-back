import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  constructor(private configService: ConfigService) {}
  createHttpOptions(): HttpModuleOptions {
    return {
      baseURL: 'http://www.omdbapi.com',
      params: { apikey: this.configService.get('OMDb_API_KEY') },
    };
  }
}
