import './App.scss';

import React, { useState } from 'react';

import { CheckApiAlive } from '../Services/controller.service';
import { GamePad } from './GamePad/GamePad';

function App() {
    const [apiUrl, setApiUrl] = useState('http://localhost:8800');
    const [apiAlive, setApiAlive] = useState(false);
    const [checkingApiAlive, setCheckingApiAlive] = useState(false);

    const updateApiUrl = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const apiUrl = ev.currentTarget.value.trim();
        setCheckingApiAlive(true);
        setApiUrl(apiUrl);
        if (apiUrl.length > 0 && apiUrl.includes('http://')) {
            CheckApiAlive(apiUrl).then(alive => {
                setApiAlive(alive);
                setCheckingApiAlive(false);
            }).catch(() => {
                setApiAlive(false);
                setCheckingApiAlive(false);
            });
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
            </header>
            <GamePad
                apiUrl={apiUrl}
                apiAlive={apiAlive}
                checkingApiAlive={checkingApiAlive} />
        </div>
    );
}

export default App;
