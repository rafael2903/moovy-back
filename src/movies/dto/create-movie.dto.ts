import { IsNotEmpty, IsNumberString, IsUrl } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  imdbID!: string;

  @IsNotEmpty()
  title!: string;

  @IsNumberString()
  year!: string;

  @IsNotEmpty()
  imdbRating!: string;

  @IsUrl()
  poster!: string;
}
