export * from './data/index';

export * from './conversation/index';
import { init_conversation } from './conversation/index';


export const init_databases = async () => {

    console.log('init_databases...');
    await init_conversation();
};