import './App.scss';

import React from 'react';

import { IInputMapping } from '../Models/IInputMapping';
import { CheckApiAlive, GetInputMappings, GetLastApiAddress, GetLastInputMapping, SaveLastApiAddress, SaveLastInput as SaveLastInputMapping } from '../Services/controller.service';
import { GamePad } from './GamePad/GamePad';

interface IAppState {
    apiAddress: string;
    apiAlive: boolean;
    checkingApiAlive: boolean;
    inputMapping: IInputMapping;
}

export class App extends React.Component<Record<never, never>, IAppState> {

    constructor(props: Record<never, never>) {
        super(props);

        this.state = {
            apiAddress: GetLastApiAddress(),
            apiAlive: false,
            checkingApiAlive: false,
            inputMapping: GetLastInputMapping()
        };
    }

    componentDidMount() {
        this.checkApi();
    }

    private checkApi() {
        if (!this.state.apiAddress || this.state.apiAddress.length === 0) {
            return;
        }

        const apiAddress = this.state.apiAddress;
        this.setState({
            apiAlive: false,
            checkingApiAlive: true
        });
        CheckApiAlive(apiAddress).then(() => {
            this.setState({
                apiAlive: true,
                checkingApiAlive: false
            });
            SaveLastApiAddress(apiAddress);
        }).catch(() => {
            this.setState({
                apiAlive: false,
                checkingApiAlive: false
            });
        });
    }

    private updateApiAddress(ev: React.ChangeEvent<HTMLInputElement>) {
        const apiAddress = ev.currentTarget.value.trim();
        this.setState({
            apiAddress: apiAddress
        });
    }

    private handleInputEnter(ev: React.KeyboardEvent<HTMLInputElement>) {
        if (ev.key === 'Enter' || ev.key === 'enter') {
            this.checkApiAddress();
        }
    }

    private checkApiAddress() {
        if (this.state.apiAddress.length > 0) {
            this.checkApi();
        }
    }

    private updateInputMapping(ev: React.ChangeEvent<HTMLSelectElement>) {
        const inputMappingName = ev.target.value;
        const selectedInputMapping = GetInputMappings().find(m => m.name === inputMappingName);
        if (selectedInputMapping) {
            this.setState({
                inputMapping: selectedInputMapping
            });
            SaveLastInputMapping(selectedInputMapping);
        }
    }

    render() {

        return (
            <div className="App" >
                <header className="App-header">
                    <p className='AppNameLabel'>
                        CyJack<br/>Defender
                    </p>

                    <div className='ApiAddressWrapper'>
                        <span className='InputLabel'>API IP Address:</span>
                        <input
                            className='ApiAddressInput'
                            disabled={this.state.apiAlive || this.state.checkingApiAlive}
                            value={this.state.apiAddress}
                            onChange={(ev) => this.updateApiAddress(ev)}
                            onBlur={() => this.checkApiAddress()}
                            onKeyUp={(ev) => this.handleInputEnter(ev)} />
                    </div>

                    <div className='ControllerMapWrapper'>
                        <span className='InputLabel'>Controller Mapping:</span>
                        <select
                            className='ControllerMapSelect'
                            defaultValue={this.state.inputMapping.name}
                            onChange={(ev) => this.updateInputMapping(ev)}>
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
                    apiAddress={this.state.apiAddress}
                    apiAlive={this.state.apiAlive}
                    checkingApiAlive={this.state.checkingApiAlive}
                    inputMapping={this.state.inputMapping} />
            </div>
        )
    }
}

export default App;
