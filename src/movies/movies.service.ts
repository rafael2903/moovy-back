import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { HttpService } from '@nestjs/axios';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { LibraryService } from 'src/library/library.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { GetMovieResponseDto } from './dto/get-movie-response.dto';
import { OMDbMovieDto } from './dto/OMDb-movie.dto';
import { ResponseMovieDto } from './dto/response-movie.dto';
import { SearchMovieResponseDto } from './dto/search-movie-response.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => LibraryService))
    private libraryService: LibraryService,
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

  private async fetchOMDbMovieData(imdbId: string) {
    const fetchMovieObservableResponse =
      this.httpService.get<GetMovieResponseDto>('/', {
        params: { i: imdbId },
      });
    const { data } = await firstValueFrom(fetchMovieObservableResponse);

    return data;
  }

  async imporFromOMDb(imdbId: string) {
    const movie = await this.findOneByImdbID(imdbId);
    if (movie) return movie;

    const data = await this.fetchOMDbMovieData(imdbId);

    if (data.Response === 'False') throw new Error(data.Error);

    const createMovieDto = this.mapper.map(data, OMDbMovieDto, CreateMovieDto);

    return this.create(createMovieDto).catch();
  }

  private async fetchIMDbRating(imdbId: string) {
    const data = await this.fetchOMDbMovieData(imdbId);

    if (data.Response === 'False') return 'N/A';
    return data.imdbRating;
  }

  async searchByTitle(title: string, page: number, userId: number) {
    const searchMovieObservableResponse =
      this.httpService.get<SearchMovieResponseDto>('/', {
        params: { s: title, type: 'movie', page },
      });

    const { data } = await firstValueFrom(searchMovieObservableResponse);

    if (data.Response === 'False') {
      return {
        movies: [],
        totalResults: 0,
        totalPages: 0,
        page: 0,
      };
    }

    const transformMovieDto = (OMDbMovie: OMDbMovieDto) =>
      this.mapper.map(OMDbMovie, OMDbMovieDto, CreateMovieDto);

    const setRating = async (
      movie: CreateMovieDto,
    ): Promise<CreateMovieDto> => ({
      ...movie,
      imdbRating: await this.fetchIMDbRating(movie.imdbID),
    });

    const setWatched = async (
      movieData: Promise<CreateMovieDto>,
    ): Promise<ResponseMovieDto> => {
      const { imdbID } = await movieData;
      let watched = false;
      const movie = await this.findOneByImdbID(imdbID);

      if (movie) {
        watched = await this.libraryService.isInUserLibrary(movie.id, userId);
      }

      return {
        ...(await movieData),
        watched,
      };
    };

    const convertAndSetAttributes = (OMDbMovie: OMDbMovieDto) =>
      setWatched(setRating(transformMovieDto(OMDbMovie)));

    const movies = await Promise.all(data.Search.map(convertAndSetAttributes));

    return {
      movies,
      totalResults: parseInt(data.totalResults),
      totalPages: Math.ceil(parseInt(data.totalResults) / 10),
      page: +page,
    };
  }
}
