import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { HttpConfigService } from 'src/config/http.config.service';
import { LibraryEntry } from 'src/library/entities/library.entity';
import { Movie } from './entities/movie.entity';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MovieProfile } from './profile/movie.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie, LibraryEntry]),
    HttpModule.registerAsync({
      inject: [ConfigService],
      useClass: HttpConfigService,
    }),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, MovieProfile],
  exports: [MoviesService],
})
export class MoviesModule {}
