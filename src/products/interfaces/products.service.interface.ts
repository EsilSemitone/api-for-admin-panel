import { Product } from '../entity/product.entity';
import { ProductsFilterQueryParams } from '../dto/products.query.dto';
import { ProductsCreateDto } from '../dto/products.create.dto';
import { ProductAddByStockDto } from '../dto/product.addByStock.dto';
import { ProductOfStock } from '../entity/product_Of_Stock.entity';
import { ProductAndStock } from '../entity/product_And_Stock.entity';
import { ProductDeleteDto } from '../dto/product.delete.dto';
import { ProductUpdateDto } from '../dto/product.update.dto';

export type ProductServiceInputParamsGetAll = ProductsFilterQueryParams;
export type ProductServiceInputParamsAddByStock = ProductAddByStockDto;
export type ProductServiceInputParamsCreate = ProductsCreateDto;
export type ProductServiceInputParamsDelete = ProductDeleteDto;
export type ProductServiceInputParamsUpdate = ProductUpdateDto;

export interface IProductsService {
    getAll(query?: ProductServiceInputParamsGetAll): Promise<Product[]>;
    create(product: ProductServiceInputParamsCreate): Promise<Product | null>;
    getAllByStock(): Promise<ProductAndStock[]>;
    addByStock(productAddDto: ProductServiceInputParamsAddByStock): Promise<ProductOfStock | null>;
    delete(dto: ProductServiceInputParamsDelete): Promise<Product | null>;
    update(dto: ProductServiceInputParamsUpdate): Promise<Product | null>;
}
