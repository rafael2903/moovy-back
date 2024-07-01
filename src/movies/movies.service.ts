import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { CreateMovieDto } from './dto/create-movie.dto';
// import { UpdateMovieDto } from './dto/update-movie.dto';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GetMovieDto, GetMovieDtoSuccess } from './dto/get-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    private readonly httpService: HttpService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    const { imdbID } = createMovieDto;
    if (await this.moviesRepository.existsBy({ imdbID })) {
      throw new Error(`Movie with imdbID = ${imdbID} already exists.`);
    }
    const movie = this.moviesRepository.create(createMovieDto);
    return this.moviesRepository.save(movie);
  }

  findAll() {
    return this.moviesRepository.find();
  }

  private findOneBy(
    where: FindOptionsWhere<Movie> | FindOptionsWhere<Movie>[],
  ) {
    return this.moviesRepository.findOneBy(where);
  }

  findOneById(id: number) {
    return this.findOneBy({ id });
  }

  findOneByImdbID(imdbID: string) {
    return this.findOneBy({ imdbID });
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

  async importMovieFromOMDb(imdbId: string) {
    const movie = await this.findOneByImdbID(imdbId);
    if (movie) return movie;

    const observableResponse = this.httpService.get<GetMovieDto>('/', {
      params: { i: imdbId },
    });
    const data = (await firstValueFrom(observableResponse)).data;

    if (data.Response === 'False') throw new Error(data.Error);

    const createMovieDto = this.mapper.map(
      data,
      GetMovieDtoSuccess,
      CreateMovieDto,
    );

    return this.create(createMovieDto).catch();
  }
}
