import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';

void ConfigModule.forRoot();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

export default AppDataSource;
