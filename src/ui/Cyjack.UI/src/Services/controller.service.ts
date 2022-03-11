import axios, { AxiosResponse } from 'axios';

import { IControllerState } from '../Models/IControllerState';

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