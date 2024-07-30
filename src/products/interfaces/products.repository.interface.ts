import { ProductAddByStockDto } from '../dto/product.addByStock.dto';
import { ProductDeleteDto } from '../dto/product.delete.dto';
import { ProductUpdateDto } from '../dto/product.update.dto';
import { ProductsCreateDto } from '../dto/products.create.dto';
import { ProductsFilterQueryParams } from '../dto/products.query.dto';
import { Product } from '../entity/product.entity';
import { ProductAndStock } from '../entity/product_And_Stock.entity';
import { ProductOfStock } from '../entity/product_Of_Stock.entity';

export interface IProductsRepository {
    findByTitle(title: string): Promise<Product | null>;
    findById(id: number): Promise<Product | null>;
    findAtStock(productId: number): Promise<ProductOfStock | null>;
    getAll(): Promise<Product[]>;
    getAllByFilter(filter: ProductsFilterQueryParams): Promise<Product[]>;
    create(product: ProductsCreateDto): Promise<Product>;
    getAllByStock(): Promise<ProductAndStock[]>;
    addByStock(productId: number, amount: number): Promise<ProductOfStock>;
    createByStock(productId: number, amount: number): Promise<ProductOfStock>;
    delete(title: string): Promise<boolean>;
    update(id: number, data: Omit<ProductUpdateDto, 'id'>): Promise<Product>;
}
