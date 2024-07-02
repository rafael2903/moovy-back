import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoviesService } from 'src/movies/movies.service';
import { LibraryEntry } from './entities/library.entity';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(LibraryEntry)
    private libraryEntryRepository: Repository<LibraryEntry>,
    private readonly moviesService: MoviesService,
  ) {}

  async removeMovieFromUserLibrary(movieImdbId: string, userId: number) {
    const movie = await this.moviesService.findOneByImdbID(movieImdbId);
    if (!movie) {
      throw new Error(`Movie with imdbID = ${movieImdbId} not found.`);
    }

    return this.libraryEntryRepository.delete({ movieId: movie.id, userId });
  }

  async addOMDbMovieToUserLibrary(movieImdbId: string, userId: number) {
    const movie = await this.moviesService.imporFromOMDb(movieImdbId);
    if (!movie) {
      throw new Error(`Movie with imdbID = ${movieImdbId} not found.`);
    }

    const entry = this.libraryEntryRepository.create({
      movieId: movie.id,
      userId,
    });

    return this.libraryEntryRepository.save(entry);
  }

  async getUserLibrary(userId: number) {
    return this.libraryEntryRepository.find({
      where: { userId },
      relations: ['movie'],
    });
  }
}
