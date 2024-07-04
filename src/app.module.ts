import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostgresConfigService } from './config/postgres.config.service';
import { LibraryModule } from './library/library.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { MoviesModule } from './movies/movies.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useClass: PostgresConfigService,
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    MoviesModule,
    UsersModule,
    AuthModule,
    LibraryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
