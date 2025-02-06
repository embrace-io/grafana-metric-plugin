import React from 'react';
import { render } from '@testing-library/react';
import { PluginType } from '@grafana/data';
import AppConfig, { type AppConfigProps } from './AppConfig';

describe('Components/AppConfig', () => {
  let props: AppConfigProps;

  beforeEach(() => {
    jest.resetAllMocks();

    props = {
      plugin: {
        meta: {
          id: 'sample-app',
          name: 'Sample App',
          type: PluginType.app,
          enabled: false,
          jsonData: {},
        },
      },
      query: {},
    } as unknown as AppConfigProps;
  });

  test('renders without an error"', () => {
    const screen = render(<AppConfig plugin={props.plugin} query={props.query} />);
    expect(screen.container).toMatchSnapshot();
  });

  test('renders an "Enable" button if the plugin is disabled', () => {
    const plugin = { meta: { ...props.plugin.meta, enabled: false } };

    // @ts-ignore - We don't need to provide `addConfigPage()` and `setChannelSupport()` for these tests
    const screen = render(<AppConfig plugin={plugin} query={props.query} />);

    expect(screen.queryByText('Enable')).toBeInTheDocument();
    expect(screen.queryByText('Disable')).not.toBeInTheDocument();
  });

  test('renders a "Disable" button if the plugin is enabled', () => {
    const plugin = { meta: { ...props.plugin.meta, enabled: true } };

    // @ts-ignore - We don't need to provide `addConfigPage()` and `setChannelSupport()` for these tests
    const screen = render(<AppConfig plugin={plugin} query={props.query} />);

    expect(screen.queryByText('Disable')).toBeInTheDocument();
    expect(screen.queryByText('Enable')).not.toBeInTheDocument();
  });
});
