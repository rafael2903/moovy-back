import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostgresConfigService } from './config/postgres.config.service';
import { LibraryModule } from './library/library.module';
import { MoviesModule } from './movies/movies.module';
import { UsersModule } from './users/users.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

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
  ],
})
export class AppModule {}
