import { AppPlugin } from '@grafana/data';
import { Config } from './components/AppConfig';
import { GlobalSettings } from './types';

/**
 * Application Plugin
 */
export const plugin = new AppPlugin<GlobalSettings>().addConfigPage({
    title: 'Config',
    body: Config,
    id: 'config',
});
