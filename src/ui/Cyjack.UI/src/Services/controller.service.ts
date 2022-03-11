import axios, { AxiosResponse } from 'axios';

import { environment } from '../environment';
import { IControllerState } from '../Models/IControllerState';

export async function SendControllerCommands(controllerState: IControllerState) {
    // const response: AxiosResponse = await axios.post(`${environment.apiUrl}/ControllerState`,
    //     controllerState,
    //     { headers: { 'Content-Type': 'application/json' } }
    // );

    // return response.data;

    return new Promise(resolve => resolve(true));
}