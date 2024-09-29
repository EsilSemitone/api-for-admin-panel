import 'reflect-metadata';
import { injectable } from 'inversify';
import { MyContext } from '../../common/context';
import { Scenes } from 'telegraf';
import { IScene } from './scene.interface';

@injectable()
export abstract class MyScene implements IScene {
    scene: Scenes.BaseScene<MyContext>;
}
