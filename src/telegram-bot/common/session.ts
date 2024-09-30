import { Scenes } from 'telegraf';
import { CartStorage } from './cart';
import { ProductsType } from '../../products/products.types';

export interface MySessionScene extends Scenes.SceneSessionData {
    productsScene: ProductsSceneProps;
}

export interface MySession extends Scenes.SceneSession<MySessionScene> {
    city: string;
    address: string;
    cart: CartStorage | undefined;
}

export interface MyWizardSession extends Scenes.SceneSession<MyWizardSessionScene> {
    city: string;
    address: string;
    cart: CartStorage | undefined;
}

export interface MyWizardSessionScene extends Scenes.WizardSessionData {
    productsScene: ProductsSceneProps;
}

export interface ProductsSceneProps {
    category: ProductsType | undefined;
    page: number;
    currentProductId: number | undefined;
}
