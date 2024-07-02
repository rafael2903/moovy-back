import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('search')
  search(@Query('title') title: string, @Query('page') page: number) {
    return this.moviesService.searchByTitle(title, page);
  }

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const movie = await this.moviesService.findOneById(id);

    if (movie) return movie;
    else {
      throw new HttpException(
        `Movie with id = ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.moviesService.remove(id).catch((err) => {
      throw new HttpException(err.message, HttpStatus.NOT_FOUND);
    });
  }
}
