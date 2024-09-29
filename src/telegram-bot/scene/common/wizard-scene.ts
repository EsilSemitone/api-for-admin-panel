import 'reflect-metadata';
import { injectable } from 'inversify';
import { MyWizardContext } from '../../common/context';
import { Scenes } from 'telegraf';
import { IScene } from './scene.interface';

@injectable()
export abstract class WizardScene implements IScene {
    scene: Scenes.WizardScene<MyWizardContext>;
}
