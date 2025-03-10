import { Module } from '@nestjs/common';
//import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { CategoriesModule } from './categories/categories.module';
import { TypesModule } from './types/types.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    //HttpModule, // <--- Adicione o HttpModule aqui
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    EventsModule,
    CategoriesModule,
    TypesModule,
    OrdersModule,
  ],
})
export class AppModule {}
