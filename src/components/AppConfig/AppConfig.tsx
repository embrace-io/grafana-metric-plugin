import React, {FC, useCallback, useEffect, useState} from 'react';
import {AppPluginMeta, PluginConfigPageProps} from '@grafana/data';
import {getBackendSrv} from '@grafana/runtime';
import {Button, InlineField, Input} from '@grafana/ui';
import {ApplicationName, ApplicationRoot} from '../../constants';
import {GlobalSettings} from '../../types';

/**
 * Page Properties
 */
export interface Props extends PluginConfigPageProps<AppPluginMeta<GlobalSettings>> {
}

/**
 * Config component
 */
export const Config: FC<Props> = (props) => {
    const [isEnabled, setIsEnabled] = useState(!!props.plugin.meta?.enabled);
    const [apiToken, setApiToken] = useState('');
    const [validToken, setValidToken] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    /**
     * Plugin Settings
     *
     * @param settings Plugin Settings
     */
    const updatePluginSettings = useCallback((settings: { enabled: boolean; jsonData: unknown; pinned: boolean }): Promise<undefined> => {
        return getBackendSrv().post(`api/plugins/${props.plugin.meta.id}/settings`, settings);
    }, [props]);

    /**
     * Plugin disable
     */
    const onDisable = () => {
        updatePluginSettings({enabled: false, jsonData: {}, pinned: false}).then(() => {
            window.location.reload();
        });
    };

    /**
     * Plugin enable
     */
    const onEnable = async () => {
        let dataSourceInfo;

        // Check to see if Embrace Metrics API datasource exists already
        await getBackendSrv()
            .get('/api/datasources').then((results) => {
                results.forEach((dataSource: { name: string; uid: string; }) => {
                    if (dataSource.name === 'Embrace Metrics API') {
                        dataSourceInfo = dataSource;
                    }
                })
            });

        // If it does not exist not, create it
        if (dataSourceInfo === undefined && !showErrorMessage) {
            const results = await getBackendSrv()
                .post('/api/datasources', {
                    name: "Embrace Metrics API",
                    type: "prometheus",
                    access: 'proxy',
                });
            dataSourceInfo = results.datasource;
        }

        // Make PUT request configuring the URL and Authorization header for the datasource
        await getBackendSrv()
            .put(`api/datasources/uid/${dataSourceInfo.uid}`, {
                ...dataSourceInfo,
                url: 'https://api.embrace.io/metrics',
                jsonData: {httpMethod: 'POST', httpHeaderName1: 'Authorization'},
                secureJsonData: {httpHeaderValue1: 'Bearer ' + apiToken},
            });

        // Test if token is valid
        await getBackendSrv().get(`api/datasources/proxy/${dataSourceInfo.id}/api/v1/status/buildinfo`).catch((error) => {
            if (error.status === 405) {
                setValidToken(true);
            } else {
                setShowErrorMessage(true);
            }
        })
    };

    useEffect(() => {
        if (validToken) {
            updatePluginSettings({enabled: true, jsonData: {}, pinned: true}).then(() => {
                setIsEnabled(true);
                window.location.assign(ApplicationRoot);
            });
        }
    }, [validToken, updatePluginSettings]);

    return (
        <React.Fragment>
            <h2>{ApplicationName}</h2>
            <p>The Embrace Mobile App is a plugin for Grafana that gives teams an easy way to visualize Embrace dashboards using Embrace Metrics API data powered by Prometheus.</p>
            {!isEnabled && (
                <React.Fragment>
                    <p>
                        Get out-of-the-box Embrace dashboards in minutes with our simple configuration. Enter your Embrace API Token below and click to Enable the Application.
                    </p>
                    <InlineField
                        label="Embrace API Token"
                        error="Your API token was invalid. Please try again"
                        invalid={showErrorMessage}
                    >
                        <Input placeholder="Token"
                               onChange={(e) => setApiToken(e.currentTarget.value)}
                               value={apiToken}
                               width={50}
                               />
                    </InlineField>
                </React.Fragment>
            )}
            <div className="gf-form gf-form-button-row">
                {isEnabled ? (
                    <Button variant="destructive" onClick={onDisable}>
                        Disable
                    </Button>
                ) : (
                    <Button onClick={onEnable} disabled={apiToken === ''}>Enable</Button>
                )}
            </div>
        </React.Fragment>
    );
}
