import { IsString } from 'class-validator';

export class ProductDeleteDto {
    @IsString()
    title: string;
}
