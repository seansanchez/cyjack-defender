import './App.scss';

import React, { useState } from 'react';

import { CheckApiAlive, GetInputMappings, GetLastApiUrl, GetLastInputMapping, SaveLastApiUrl, SaveLastInput as SaveLastInputMapping } from '../Services/controller.service';
import { GamePad } from './GamePad/GamePad';

function App() {
    const [apiUrl, setApiUrl] = useState(GetLastApiUrl());
    const [apiAlive, setApiAlive] = useState(false);
    const [checkingApiAlive, setCheckingApiAlive] = useState(false);
    const [inputMapping, setInputMapping] = useState(GetLastInputMapping());

    const updateApiUrl = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const apiUrl = ev.currentTarget.value.trim();
        setCheckingApiAlive(true);
        setApiUrl(apiUrl);
        SaveLastApiUrl(apiUrl);
        if (apiUrl.length > 0 && apiUrl.includes('http://')) {
            CheckApiAlive(apiUrl).then(() => {
                setApiAlive(true);
                setCheckingApiAlive(false);
            }).catch(() => {
                setApiAlive(false);
                setCheckingApiAlive(false);
            });
        }
    };

    const updateInputMapping = (ev: React.ChangeEvent<HTMLSelectElement>) => {
        const inputMappingName = ev.target.value;
        const selectedInputMapping = GetInputMappings().find(m => m.name === inputMappingName);
        if (selectedInputMapping) {
            setInputMapping(selectedInputMapping);
            SaveLastInputMapping(selectedInputMapping);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <p className='AppNameLabel'>
                    CyJack Defender
                </p>

                <div style={{ position: 'relative' }}>
                    <span className='ApiUrlLabel'>API URL:</span>
                    <input className='ApiUrlInput' value={apiUrl} onChange={(ev) => updateApiUrl(ev)} />
                </div>

                <div style={{ position: 'relative', marginTop: '1rem' }}>
                    <span className='ApiUrlLabel'>Controller Mapping:</span>
                    <select
                        className='ApiUrlInput Select'
                        defaultValue={inputMapping.name}
                        onChange={(ev) => updateInputMapping(ev)}>
                        {
                            GetInputMappings().map(inputMapping => (
                                <option
                                    key={inputMapping.name}
                                    value={inputMapping.name}>
                                    {inputMapping.name}
                                </option>
                            ))
                        }
                    </select>
                </div>
            </header>
            <GamePad
                apiUrl={apiUrl}
                apiAlive={apiAlive}
                checkingApiAlive={checkingApiAlive}
                inputMapping={inputMapping} />
        </div>
    );
}

export default App;
