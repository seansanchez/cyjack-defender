import './GamePad.scss';

import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import { ApiErrorStatus, IApiException } from '../../Models/IApiException';
import { IControllerState } from '../../Models/IControllerState';
import { IInputMapping, InputType } from '../../Models/IInputMapping';
import { RecoverFromSecurityException, SendControllerCommands } from '../../Services/controller.service';

interface IGamePadProps {
    apiAddress: string;
    apiAlive: boolean;
    checkingApiAlive: boolean;
    inputMapping: IInputMapping;
}

interface IGamePadState {
    gamepadWasConnected: boolean;
    gamepadConnected: boolean;
    gamepadId: string | null;
    controllerState: IControllerState;
    prevControllerState: IControllerState;
    invertUpDown: boolean;
    invertLeftRight: boolean;
    apiStatus: {
        error: boolean;
        errorMessage: string;
        recovering: boolean;
    };
}

export class GamePad extends React.Component<IGamePadProps, IGamePadState> {

    private upKey = false;
    private downKey = false;
    private leftKey = false;
    private rightKey = false;
    private spaceKey = false;

    private gamepadInterval: NodeJS.Timer | null = null;

    private apiThrottheInterval: NodeJS.Timer | null = null;

    constructor(props: IGamePadProps) {
        super(props);

        this.state = {
            gamepadWasConnected: false,
            gamepadConnected: false,
            gamepadId: null,
            controllerState: {
                upDown: 0,
                leftRight: 0,
                brake: false
            },
            prevControllerState: {
                upDown: 0,
                leftRight: 0,
                brake: false
            },
            invertLeftRight: false,
            invertUpDown: false,
            apiStatus: {
                error: false,
                errorMessage: '',
                recovering: false
            }
        };
    }

    componentDidMount() {
        window.addEventListener('gamepadconnected', (e) => this.handleGamepadConnected(e));
        window.addEventListener('gamepaddisconnected', (e) => this.handleGamepadDisconnected(e));
        window.addEventListener('keydown', (e) => this.trackKeyboard(e));
        window.addEventListener('keyup', (e) => this.trackKeyboard(e, true));
        this.startGamepadInterval();
        this.startApiThrottler();
    }

    componentWillUnmount() {
        window.removeEventListener('gamepadconnected', this.handleGamepadConnected);
        window.removeEventListener('gamepaddisconnected', this.handleGamepadConnected);
        window.removeEventListener('keydown', (e) => this.trackKeyboard(e));
        window.removeEventListener('keyup', (e) => this.trackKeyboard(e, true));
        this.stopGamepadInterval();
        this.stopApiThrotther();
    }

    private startApiThrottler() {
        if (!this.apiThrottheInterval) {
            this.apiThrottheInterval = setInterval(() => {
                if (this.props.apiAlive && !this.state.apiStatus.error) {
                    const prevState = this.state.prevControllerState;
                    const currState = this.state.controllerState;
                    if (currState.upDown !== prevState.upDown ||
                        currState.leftRight !== prevState.leftRight ||
                        currState.brake !== prevState.brake) {
                        this.setState({
                            prevControllerState: currState
                        });
                        SendControllerCommands(this.props.apiAddress, {
                            upDown: Math.round(currState.upDown * (this.state.invertUpDown ? -1 : 1)),
                            leftRight: Math.round(currState.leftRight * (this.state.invertLeftRight ? -1 : 1)),
                            brake: currState.brake
                        }).then(() => null).catch((ex: IApiException) => {
                            if (ex.response.data.status === ApiErrorStatus.SecurityException) {
                                this.setState({
                                    apiStatus: {
                                        error: false,
                                        errorMessage: ex.response.data.detail,
                                        recovering: false
                                    }
                                });
                            }
                        });
                    }
                }
            }, 500);
        }
    }

    private stopApiThrotther() {
        if (this.apiThrottheInterval) {
            clearInterval(this.apiThrottheInterval);
            this.apiThrottheInterval = null;
        }
    }

    private handleGamepadConnected(e: GamepadEvent) {
        const gp = navigator.getGamepads()[e.gamepad.index];
        this.tryConnectGamepad(gp);
    }

    private handleGamepadDisconnected(e: GamepadEvent) {
        if (this.state.gamepadId && this.state.gamepadId === e.gamepad.id) {
            const gamepadWasConnected = this.state.gamepadConnected;
            this.setState({
                gamepadWasConnected: gamepadWasConnected,
                gamepadConnected: false,
                gamepadId: null
            });
            this.stopGamepadInterval();
        }
    }

    private tryConnectGamepad(gamepad: Gamepad | null) {
        if (gamepad && gamepad.buttons.length > 0) {
            const gamepadWasConnected = this.state.gamepadConnected;
            this.setState({
                gamepadWasConnected: gamepadWasConnected,
                gamepadConnected: true,
                gamepadId: gamepad.id
            });
        }
    }

    private buttonPressed(button: GamepadButton): boolean {
        if (typeof (button) === 'object') {
            return button.pressed;
        }
        return button == 1.0;
    }

    private axisPressed(axis: number): boolean {
        if (axis) {
            return Math.abs(axis) > 0.1;
        }
        return false;
    }

    private triggerPressed(button: GamepadButton): boolean {
        if (typeof (button) === 'object') {
            return button.touched || button.pressed;
        }
        return button == 1.0;
    }

    private startGamepadInterval() {
        if (this.gamepadInterval === null) {
            this.gamepadInterval = setInterval(() => this.checkGamepadState(), 10);
        }
    }

    private stopGamepadInterval() {
        if (this.gamepadInterval !== null) {
            clearInterval(this.gamepadInterval);
            this.gamepadInterval = null;
        }
    }

    private checkGamepadState() {
        const gamepadId = this.state.gamepadId;
        if (gamepadId) {
            const gamepad = navigator.getGamepads().find(g => g?.id === gamepadId);

            if (gamepad) {
                const inputMapping = this.props.inputMapping;
                let upDown = this.state.controllerState.upDown;
                let brake = this.state.controllerState.brake;
                let leftRight = this.state.controllerState.leftRight;

                if (inputMapping.brake.type === InputType.Button) {
                    brake = this.buttonPressed(gamepad.buttons[inputMapping.brake.index]);
                } else if (inputMapping.brake.type === InputType.Analog) {
                    const brakeAxis = gamepad.axes[inputMapping.brake.index];
                    brake = this.axisPressed(brakeAxis)
                }

                let up = 0;
                let down = 0;
                if (inputMapping.forward.type === InputType.Analog) {
                    const vert = gamepad.axes[inputMapping.forward.index];
                    if (this.axisPressed(vert)) {
                        up = Math.min(vert * 100 * -1, 0);
                    }
                } else if (inputMapping.forward.type === InputType.Button) {
                    if (this.buttonPressed(gamepad.buttons[inputMapping.forward.index])) {
                        up = 100;
                    }
                } else if (inputMapping.forward.type === InputType.Trigger) {
                    const trigger = gamepad.buttons[inputMapping.forward.index];
                    if (this.triggerPressed(trigger)) {
                        up = trigger.value * 100;
                    }
                }

                if (inputMapping.reverse.type === InputType.Analog) {
                    const vert = gamepad.axes[inputMapping.reverse.index];
                    if (this.axisPressed(vert)) {
                        down = Math.max(vert * 100 * -1, 0);
                    }
                } else if (inputMapping.reverse.type === InputType.Button) {
                    if (this.buttonPressed(gamepad.buttons[inputMapping.reverse.index])) {
                        down = -100;
                    }
                } else if (inputMapping.reverse.type === InputType.Trigger) {
                    const trigger = gamepad.buttons[inputMapping.reverse.index];
                    if (this.triggerPressed(trigger)) {
                        down = trigger.value * -100;
                    }
                }

                upDown = up + down;

                let left = 0;
                let right = 0;
                if (inputMapping.left.type === InputType.Analog) {
                    const vert = gamepad.axes[inputMapping.left.index];
                    if (this.axisPressed(vert)) {
                        left = Math.min(vert * 100, 0);
                    }
                } else if (inputMapping.left.type === InputType.Button) {
                    if (this.buttonPressed(gamepad.buttons[inputMapping.left.index])) {
                        left = -100;
                    }
                }
                if (inputMapping.right.type === InputType.Analog) {
                    const vert = gamepad.axes[inputMapping.right.index];
                    if (this.axisPressed(vert)) {
                        right = Math.max(vert * 100, 0);
                    }
                } else if (inputMapping.right.type === InputType.Button) {
                    if (this.buttonPressed(gamepad.buttons[inputMapping.right.index])) {
                        right = 100;
                    }
                }

                leftRight = left + right;

                this.updateControllerState(upDown, leftRight, brake);
            }
        }
    }

    private trackKeyboard(ev: KeyboardEvent, up?: boolean) {
        switch (ev.key) {
            case ('w'):
            case ('W'):
            case ('up'):
            case ('ArrowUp'):
                this.upKey = !up;
                break;
            case ('s'):
            case ('S'):
            case ('down'):
            case ('ArrowDown'):
                this.downKey = !up;
                break;
            case ('a'):
            case ('A'):
            case ('left'):
            case ('ArrowLeft'):
                this.leftKey = !up;
                break;
            case ('d'):
            case ('D'):
            case ('right'):
            case ('ArrowRight'):
                this.rightKey = !up;
                break;
            case ('space'):
            case (' '):
                this.spaceKey = !up;
                break;
            default:
                break;
        }
        const upDown = (this.upKey ? 100 : 0) + (this.downKey ? -100 : 0);
        const leftRight = (this.rightKey ? 100 : 0) + (this.leftKey ? -100 : 0);
        const brake = this.spaceKey;
        this.updateControllerState(upDown, leftRight, brake);
    }

    private trackVertPointer(ev: React.PointerEvent, reset?: boolean) {
        if (reset) {
            this.updateControllerState(0, this.state.controllerState.leftRight, this.state.controllerState.brake);
            return;
        }
        if (ev.pointerType === 'touch') {
            const padBoundingRect = ev.currentTarget.getBoundingClientRect();
            let upDown = (padBoundingRect.height / 2) - (ev.pageY - padBoundingRect.y);
            if (upDown < 0) {
                upDown = Math.max(upDown, -100);
            } else if (upDown > 0) {
                upDown = Math.min(upDown, 100);
            }
            this.updateControllerState(upDown, this.state.controllerState.leftRight, this.state.controllerState.brake);
        }
    }

    private trackHorizPointer(ev: React.PointerEvent, reset?: boolean) {
        if (reset) {
            this.updateControllerState(this.state.controllerState.upDown, 0, this.state.controllerState.brake);
            return;
        }
        if (ev.pointerType === 'touch') {
            const padBoundingRect = ev.currentTarget.getBoundingClientRect();
            let leftRight = (padBoundingRect.width / 2) - (ev.pageX - padBoundingRect.x);
            if (leftRight < 0) {
                leftRight = Math.max(leftRight, -100) * -1;
            } else if (leftRight > 0) {
                leftRight = Math.min(leftRight, 100) * -1;
            }
            this.updateControllerState(this.state.controllerState.upDown, leftRight, this.state.controllerState.brake);
        }
    }

    private updateBrake(brake: boolean) {
        this.updateControllerState(this.state.controllerState.upDown, this.state.controllerState.leftRight, brake);
    }

    private updateControllerState(upDown: number, leftRight: number, brake: boolean) {
        this.setState({
            controllerState: {
                upDown: upDown,
                leftRight: leftRight,
                brake: brake
            }
        });
    }

    private attemptToRecover() {
        this.setState({
            apiStatus: {
                ...this.state.apiStatus,
                recovering: true
            }
        });
        RecoverFromSecurityException(this.props.apiAddress).then(() => {
            this.setState({
                apiStatus: {
                    error: false,
                    errorMessage: '',
                    recovering: false
                }
            });
        }).catch(() => {
            this.setState({
                apiStatus: {
                    ...this.state.apiStatus,
                    recovering: false
                }
            });
        })
    }

    private preventContextMenu(ev: React.MouseEvent) {
        ev.preventDefault();
        ev.stopPropagation();
        return false;
    }

    render() {
        return (
            this.state.apiStatus.error ? (
                <div className='ErrorScreen'>
                    <div className='ErrorMessageWrapper'>
                        <span className='ErrorTitle'>!!! REMOTE CONTROLS COMPROMISED !!!</span>
                        <br />
                        <span className='ErrorMessage'>{this.state.apiStatus.errorMessage}</span>

                        <button
                            className='RecoverButton'
                            disabled={this.state.apiStatus.recovering}
                            onClick={() => this.attemptToRecover()}>
                            Attempt to recover
                        </button>
                    </div>
                </div>
            ) : (
                <div className='GamePad' onContextMenu={(ev) => this.preventContextMenu(ev)}>
                    <button
                        className='InvertVertButton'
                        style={this.state.invertUpDown ? { backgroundColor: 'palegreen', color: 'black' } : { backgroundColor: 'grey' }
                        }
                        onClick={() => this.setState({
                            invertUpDown: !this.state.invertUpDown
                        })}>
                        <div className='InnerTextWrapper'>
                            <span className='Label'>
                                Invert Y-Axis
                            </span>
                            <span className='InvertedYesNo'>
                                {this.state.invertUpDown ? 'yes' : 'no'}
                            </span>
                        </div>
                    </button >
                    <div className='LeftPad'
                        onPointerDown={(ev) => this.trackVertPointer(ev)}
                        onPointerCancel={(ev) => this.trackVertPointer(ev, true)}
                        onPointerUp={(ev) => this.trackVertPointer(ev, true)}
                        onPointerMove={(ev) => this.trackVertPointer(ev)}
                        onContextMenu={(ev) => this.preventContextMenu(ev)}>
                        <div className="VertDragArea">
                            <motion.div
                                className='ThumbDrag'
                                drag={false}
                                initial={{ y: 0 }}
                                animate={{ y: this.state.controllerState.upDown * -0.8 }} />
                        </div>
                    </div>
                    <button
                        className='InvertHorizButton'
                        style={this.state.invertLeftRight ? { backgroundColor: 'palegreen', color: 'black' } : { backgroundColor: 'grey' }}
                        onClick={() => this.setState({
                            invertLeftRight: !this.state.invertLeftRight
                        })}>
                        <div className='InnerTextWrapper'>
                            <span className='Label'>
                                Invert X-Axis
                            </span>
                            <span className='InvertedYesNo'>
                                {this.state.invertLeftRight ? 'yes' : 'no'}
                            </span>
                        </div>
                    </button>
                    <div className='RightPad'
                        onPointerDown={(ev) => this.trackHorizPointer(ev)}
                        onPointerCancel={(ev) => this.trackHorizPointer(ev, true)}
                        onPointerUp={(ev) => this.trackHorizPointer(ev, true)}
                        onPointerMove={(ev) => this.trackHorizPointer(ev)}
                        onContextMenu={(ev) => this.preventContextMenu(ev)}>
                        <div className="HorizDragArea">
                            <motion.div
                                className='ThumbDrag'
                                drag={false}
                                initial={{ x: 0 }}
                                animate={{ x: this.state.controllerState.leftRight * 0.8 }} />
                        </div>
                    </div>
                    <motion.button
                        className='BrakeButton'
                        initial={this.state.controllerState.brake ? { scale: 1 } : { scale: 1.2 }}
                        animate={this.state.controllerState.brake ? { scale: 1.2 } : { scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                        onPointerDown={() => this.updateBrake(true)}
                        onPointerUp={() => this.updateBrake(false)}
                        onPointerCancel={() => this.updateBrake(false)}
                        onContextMenu={(ev) => this.preventContextMenu(ev)} >
                        BRAKE
                    </motion.button>

                    <AnimatePresence>
                        {
                            this.state.gamepadConnected ? (
                                <motion.div
                                    key="ConnectedMessage"
                                    className="ConnectedMessage"
                                    initial={this.state.gamepadWasConnected ? { y: 0, scale: 1, opacity: 1 } : { y: 20, scale: 0.8, opacity: 0 }}
                                    animate={{ y: 0, scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', bounce: 0.5 }} >
                                    Controller Connected
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="DisconnectedMessage"
                                    className='ConnectedMessage'
                                    initial={this.state.gamepadWasConnected ? { y: 0, scale: 1, opacity: 1 } : { y: 20, scale: 0.8, opacity: 0 }}
                                    animate={{ y: 0, scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', bounce: 0.5 }} >
                                    Controller Disconnected
                                </motion.div>
                            )
                        }
                    </AnimatePresence>


                    <AnimatePresence>
                        {
                            this.props.checkingApiAlive ? (
                                <motion.div
                                    key="ValidatingApiAlive"
                                    className='ApiAliveMessage Validating'
                                    initial={{ y: 20, scale: 0.8, opacity: 0 }}
                                    animate={{ y: 0, scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', bounce: 0.5 }} >
                                    Validating API
                                </motion.div>
                            ) : (
                                this.props.apiAlive ? (
                                    <motion.div
                                        key="ApiAlive"
                                        className='ApiAliveMessage Success'
                                        initial={{ y: 20, scale: 0.8, opacity: 0 }}
                                        animate={{
                                            y: [20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20],
                                            scale: [0.8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.8],
                                            opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
                                        }}
                                        transition={{ type: 'spring', bounce: 0.5 }} >
                                        API Found
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="ApiNotAlive"
                                        className='ApiAliveMessage Failure'
                                        initial={{ y: 20, scale: 0.8, opacity: 0 }}
                                        animate={{ y: 0, scale: 1, opacity: 1 }}
                                        transition={{ type: 'spring', bounce: 0.5 }} >
                                        API Not Found
                                    </motion.div>
                                )
                            )
                        }
                    </AnimatePresence>
                </div >
            )
        );
    }
}