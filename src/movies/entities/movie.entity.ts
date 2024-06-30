import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  imdbID!: string;

  @Column()
  title!: string;

  @Column()
  year!: string;

  @Column({ length: 7 })
  imdbRating!: string;

  @Column()
  poster!: string;
}
