import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { LibraryService } from './library.service';

@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post('add')
  addMovie(@Req() req: Request, @Body() body: { imdbID: string }) {
    return this.libraryService
      .addOMDbMovieToUserLibrary(body.imdbID, req['user'].sub)
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
  }

  @Delete('remove/:imdbID')
  removeMovie(@Req() req: Request, @Param('imdbID') imdbID: string) {
    return this.libraryService
      .removeMovieFromUserLibrary(imdbID, req['user'].sub)
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
  }

  @Get()
  getUserLibrary(@Req() req: Request) {
    return this.libraryService.getUserLibrary(req['user'].sub);
  }
}
