import 'reflect-metadata';
import { Scenes } from 'telegraf';
import { MyContext, MyWizardContext } from '../../common/context';

export interface IScene {
    scene: Scenes.BaseScene<MyContext> | Scenes.WizardScene<MyWizardContext>;
}
