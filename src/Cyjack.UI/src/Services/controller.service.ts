import axios, { AxiosResponse } from 'axios';

import { IControllerState } from '../Models/IControllerState';
import { IInputMapping, InputType } from '../Models/IInputMapping';

const ApiAddressKey = 'ApiAddress';
const inputMappingsKey = 'InputMappings';

export async function CheckApiAlive(ipAddress: string) {
    const response: AxiosResponse = await axios.get(`${ipAddress}/api/Gpio/Alive`,
        { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data;
}

export async function SendControllerCommands(ipAddress: string, controllerState: IControllerState) {
    const response: AxiosResponse = await axios.post(`${ipAddress}/api/Gpio/ControllerState`,
        controllerState,
        { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data;
}

export function SaveLastApiAddress(apiAddress: string) {
    localStorage.setItem(ApiAddressKey, apiAddress);
}

export function GetLastApiAddress(): string {
    const apiAddress = localStorage.getItem(ApiAddressKey);
    return apiAddress && apiAddress.length > 0 ? apiAddress : 'http://192.168.0.38';
}

export function SaveLastInput(inputMapping: IInputMapping) {
    localStorage.setItem(inputMappingsKey, inputMapping.name);
}

export function GetLastInputMapping(): IInputMapping {
    const lastInputMappingName = localStorage.getItem(inputMappingsKey);
    if (lastInputMappingName) {
        const inputMapping = GetInputMappings().find(m => m.name === lastInputMappingName);
        if (inputMapping) {
            return inputMapping;
        }
    }
    return GetInputMappings()[0];
}

export function GetInputMappings(): IInputMapping[] {
    const inputMappings: IInputMapping[] = [
        {
            name: 'Xbox Controller (Left Stick Drive)',
            forward: { type: InputType.Analog, index: 1 },
            reverse: { type: InputType.Analog, index: 1 },
            left: { type: InputType.Analog, index: 0 },
            right: { type: InputType.Analog, index: 0 },
            brake: { type: InputType.Button, index: 0 }
        },
        {
            name: 'Xbox Controller (Twin Sticks Drive)',
            forward: { type: InputType.Analog, index: 1 },
            reverse: { type: InputType.Analog, index: 1 },
            left: { type: InputType.Analog, index: 2 },
            right: { type: InputType.Analog, index: 2 },
            brake: { type: InputType.Button, index: 0 }
        },
        {
            name: 'Xbox Controller (Triggers Drive)',
            forward: { type: InputType.Trigger, index: 7 },
            reverse: { type: InputType.Trigger, index: 6 },
            left: { type: InputType.Analog, index: 0 },
            right: { type: InputType.Analog, index: 0 },
            brake: { type: InputType.Button, index: 0 }
        },
        {
            name: 'Sega Genesis (D-Pad Drive)',
            forward: { type: InputType.Button, index: 12 },
            reverse: { type: InputType.Button, index: 13 },
            left: { type: InputType.Button, index: 14 },
            right: { type: InputType.Button, index: 15 },
            brake: { type: InputType.Button, index: 0 }
        },
        {
            name: 'Sega Genesis (Bumpers Drive)',
            forward: { type: InputType.Button, index: 5 },
            reverse: { type: InputType.Button, index: 4 },
            left: { type: InputType.Button, index: 14 },
            right: { type: InputType.Button, index: 15 },
            brake: { type: InputType.Button, index: 0 }
        }
    ];
    return inputMappings;
}