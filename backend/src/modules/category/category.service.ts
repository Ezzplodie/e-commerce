import { categoryRepository } from './category.repository';
import { CreateCategoryDto, EditCategoryDto } from './category.dto';
import { Category } from './category.entity';

export class CategoryService {

  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = categoryRepository.create({
      ...dto, 
    });

    return await categoryRepository.save(category);
  }


  async edit(cat_id: number, dto: EditCategoryDto): Promise<Category> {
    const category = await categoryRepository.findOne({
      where: { id: cat_id }, 
    });

    if (!category) {
      throw new Error('Category not found');
    }

    Object.assign(category, dto);

    return await categoryRepository.save(category);
  }


  async findAll(): Promise<Category[]> {
    return await categoryRepository.find();
  }


  async findOne(cat_id: number): Promise<Category | null> {
    return await categoryRepository.findOne({
      where: { id: cat_id },
    });
  }


  async delete(cat_id: number): Promise<void> {
    const category = await categoryRepository.findOne({
      where: { id: cat_id },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    await categoryRepository.remove(category);
  }
}
