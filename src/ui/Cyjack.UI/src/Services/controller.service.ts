import axios, { AxiosResponse } from 'axios';

import { IControllerState } from '../Models/IControllerState';
import { IInputMapping, InputType } from '../Models/IInputMapping';

const inputMappingsKey = 'InputMappings';

export async function CheckApiAlive(apiUrl: string) {
    const response: AxiosResponse = await axios.get<boolean>(`${apiUrl}/Alive`,
        { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data;
}

export async function SendControllerCommands(apiUrl: string, controllerState: IControllerState) {
    const response: AxiosResponse = await axios.post(`${apiUrl}/ControllerState`,
        controllerState,
        { headers: { 'Content-Type': 'application/json' } }
    );

    return response.data;
}

export function AddInputMapping(inputMapping: IInputMapping) {
    const inputMappingsJson = localStorage.getItem(inputMappingsKey);
    if (inputMappingsJson) {
        let inputMappings: IInputMapping[] = JSON.parse(inputMappingsJson);
        inputMappings = inputMappings.filter(im => im.name !== inputMapping.name);
        inputMappings.push(inputMapping);
        inputMappings.sort((a, b) => a.name.localeCompare(b.name));
        localStorage.setItem(inputMappingsKey, JSON.stringify(inputMappings));
    } else {
        const inputMappings: IInputMapping[] = [inputMapping];
        localStorage.setItem(inputMappingsKey, JSON.stringify(inputMappings));
    }
}

export function GetInputMappings(): IInputMapping[] {
    const inputMappingsJson = localStorage.getItem(inputMappingsKey);
    if (inputMappingsJson) {
        return JSON.parse(inputMappingsJson);
    } else {
        const inputMappings: IInputMapping[] = [
            {
                name: 'Xbox Controller',
                forward: { type: InputType.Analog, index: 1 },
                reverse: { type: InputType.Analog, index: 1 },
                left: { type: InputType.Analog, index: 2 },
                right: { type: InputType.Analog, index: 2 },
                brake: { type: InputType.Button, index: 0 }
            },
            {
                name: 'Sega Genesis',
                forward: { type: InputType.Button, index: 12 },
                reverse: { type: InputType.Button, index: 13 },
                left: { type: InputType.Button, index: 14 },
                right: { type: InputType.Button, index: 15 },
                brake: { type: InputType.Button, index: 0 }
            }
        ];
        return inputMappings;
    }
}