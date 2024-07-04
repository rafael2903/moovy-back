import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from 'src/movies/movies.module';
import { LibraryEntry } from './entities/library.entity';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LibraryEntry]),
    forwardRef(() => MoviesModule),
  ],
  controllers: [LibraryController],
  providers: [LibraryService],
  exports: [LibraryService],
})
export class LibraryModule {}
