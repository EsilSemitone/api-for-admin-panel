import { IsNumber, Min } from 'class-validator';

export class ProductAddByStockDto {
    @IsNumber()
    productId: number;

    @Min(1)
    @IsNumber()
    amount: number;
}
