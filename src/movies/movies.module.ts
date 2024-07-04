import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpConfigService } from 'src/config/http.config.service';
import { LibraryModule } from 'src/library/library.module';
import { Movie } from './entities/movie.entity';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MovieProfile } from './profiles/movie.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]),
    HttpModule.registerAsync({
      inject: [ConfigService],
      useClass: HttpConfigService,
    }),
    forwardRef(() => LibraryModule),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, MovieProfile],
  exports: [MoviesService],
})
export class MoviesModule {}
