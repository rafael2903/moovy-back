import { LibraryEntry } from 'src/library/entities/library.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  imdbID!: string;

  @Column()
  title!: string;

  @Column({ length: 4 })
  year!: string;

  @Column({ length: 3 })
  imdbRating!: string;

  @Column()
  poster!: string;

  @OneToMany(() => LibraryEntry, (libraryEntry) => libraryEntry.movie)
  libraries!: LibraryEntry[];
}
