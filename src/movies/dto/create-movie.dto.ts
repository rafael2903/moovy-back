import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsNumberString, IsUrl } from 'class-validator';

export class CreateMovieDto {
  @AutoMap()
  @IsNotEmpty()
  imdbID!: string;

  @AutoMap()
  @IsNotEmpty()
  title!: string;

  @AutoMap()
  @IsNumberString()
  year!: string;

  @AutoMap()
  @IsNotEmpty()
  imdbRating!: string;

  @AutoMap()
  @IsUrl()
  poster!: string;
}
