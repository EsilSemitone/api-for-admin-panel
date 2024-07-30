import { Product } from '../entity/product.entity';
import { ProductsFilterQueryParams } from '../dto/products.query.dto';
import { ProductsCreateDto } from '../dto/products.create.dto';
import { ProductAddByStockDto } from '../dto/product.addByStock.dto';
import { ProductOfStock } from '../entity/product_Of_Stock.entity';
import { ProductAndStock } from '../entity/product_And_Stock.entity';
import { ProductDeleteDto } from '../dto/product.delete.dto';
import { ProductUpdateDto } from '../dto/product.update.dto';

export interface IProductsService {
    getAll(query?: ProductsFilterQueryParams): Promise<Product[]>;
    create(product: ProductsCreateDto): Promise<Product | null>;
    getAllByStock(): Promise<ProductAndStock[]>;
    addByStock(productAddDto: ProductAddByStockDto): Promise<ProductOfStock | null>;
    delete(dto: ProductDeleteDto): Promise<boolean>;
    update(dto: ProductUpdateDto): Promise<Product | null>;
}
