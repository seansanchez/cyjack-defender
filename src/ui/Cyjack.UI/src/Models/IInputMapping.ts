export enum InputType {
    Button,
    Analog
}

export interface IInput {
    type: InputType;
    index: number;
}

export interface IInputMapping {
    name: string;
    forward: IInput;
    reverse: IInput;
    left: IInput;
    right: IInput;
    brake: IInput;
}
