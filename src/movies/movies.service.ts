import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMovieDto } from './dto/create-movie.dto';
// import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  create(createMovieDto: CreateMovieDto) {
    const movie = this.moviesRepository.create(createMovieDto);
    return this.moviesRepository.insert(movie);
  }

  findAll() {
    return this.moviesRepository.find();
  }

  async findOne(id: number) {
    const movie = await this.moviesRepository.findOneBy({ id });
    if (movie) return movie;
    throw new Error(`Movie with id = ${id} not found`);
  }

  async remove(id: number) {
    if (await this.moviesRepository.existsBy({ id })) {
      return await this.moviesRepository.delete(id);
    }
    throw new Error(`Movie with id = ${id} not found`);
  }
}
