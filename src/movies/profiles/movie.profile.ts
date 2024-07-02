import { createMap, forMember, mapFrom, type Mapper } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from '../dto/create-movie.dto';
import { OMDbMovieDto } from '../dto/OMDb-movie.dto';

@Injectable()
export class MovieProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        OMDbMovieDto,
        CreateMovieDto,
        forMember(
          (d) => d.title,
          mapFrom((s) => s.Title),
        ),
        forMember(
          (d) => d.year,
          mapFrom((s) => s.Year),
        ),
        forMember(
          (d) => d.poster,
          mapFrom((s) => s.Poster),
        ),
      );
    };
  }
}
