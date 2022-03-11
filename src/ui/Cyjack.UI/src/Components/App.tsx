import './App.scss';

import React from 'react';

import { GamePad } from './GamePad/GamePad';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <p>
                    CyJack Defender
                </p>
            </header>
            <GamePad />
        </div>
    );
}

export default App;
