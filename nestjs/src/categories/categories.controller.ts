import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Cria uma nova categoria
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  // Retorna todas as categorias
  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  // Busca uma categoria pelo ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    // Convertendo id de string para number (ex.: +id)
    return this.categoriesService.findOne(+id);
  }

  // Atualiza uma categoria existente
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  // Remove uma categoria pelo ID
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.categoriesService.remove(+id);
  }
}
