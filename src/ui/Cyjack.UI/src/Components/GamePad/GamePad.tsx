import './GamePad.scss';

import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface IGamePadState {
    gamepadWasConnected: boolean;
    gamepadConnected: boolean;
    gamepadId: string | null;
    upDown: number;
    leftRight: number;
    brake: boolean;
}

enum standardButtons {
    brake = 0,
}

enum standardAxis {
    leftVert = 1,
    rightHoriz = 2
}

export class GamePad extends React.Component<Record<string, unknown>, IGamePadState> {

    private gamepadInterval: NodeJS.Timer | null = null;

    constructor(props: Record<string, unknown>) {
        super(props);

        this.state = {
            gamepadWasConnected: false,
            gamepadConnected: false,
            gamepadId: null,
            upDown: 0,
            leftRight: 0,
            brake: false
        };
    }

    componentDidMount() {
        window.addEventListener('gamepadconnected', (e) => this.handleGamepadConnected(e));
        window.addEventListener('gamepaddisconnected', (e) => this.handleGamepadDisconnected(e));
    }

    componentWillUnmount() {
        window.removeEventListener('gamepadconnected', this.handleGamepadConnected);
        window.removeEventListener('gamepaddisconnected', this.handleGamepadConnected);
        this.stopGamepadInterval();
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

            this.startGamepadInterval();
        }
    }

    private buttonPressed(button: GamepadButton): boolean {
        if (typeof (button) == 'object') {
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

    private startGamepadInterval() {
        if (this.gamepadInterval === null) {
            this.gamepadInterval = setInterval(() => this.checkGamepadState(), 50);
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
                let upDown = this.state.upDown;
                let brake = this.state.brake;
                let leftRight = this.state.leftRight;

                brake = this.buttonPressed(gamepad.buttons[standardButtons.brake]);

                const vert = gamepad.axes[standardAxis.leftVert];
                if (this.axisPressed(vert)) {
                    upDown = vert * 100 * -1;
                } else {
                    upDown = 0;
                }

                const horiz = gamepad.axes[standardAxis.rightHoriz];
                if (this.axisPressed(horiz)) {
                    leftRight = horiz * 100;
                } else {
                    leftRight = 0;
                }

                this.setState({
                    upDown: upDown,
                    brake: brake,
                    leftRight: leftRight
                });
            }
        }
    }

    private trackVertPointer(ev: React.PointerEvent, reset?: boolean) {
        if (reset) {
            this.setState({
                upDown: 0
            });
            return;
        }
        const padBoundingRect = ev.currentTarget.getBoundingClientRect();
        let upDown = (padBoundingRect.height / 2) - (ev.pageY - padBoundingRect.y);
        if (upDown < 0) {
            upDown = Math.max(upDown, -100);
        } else if (upDown > 0) {
            upDown = Math.min(upDown, 100);
        }
        this.setState({
            upDown: upDown
        });
    }

    private trackHorizPointer(ev: React.PointerEvent, reset?: boolean) {
        if (reset) {
            this.setState({
                leftRight: 0
            });
            return;
        }
        const padBoundingRect = ev.currentTarget.getBoundingClientRect();
        let leftRight = (padBoundingRect.width / 2) - (ev.pageX - padBoundingRect.x);
        if (leftRight < 0) {
            leftRight = Math.max(leftRight, -100) * -1;
        } else if (leftRight > 0) {
            leftRight = Math.min(leftRight, 100) * -1;
        }
        this.setState({
            leftRight: leftRight
        });
    }

    render() {
        return (
            <div className='GamePad'>
                <div className='LeftPad'
                    onPointerDown={(ev) => this.trackVertPointer(ev)}
                    onPointerCancel={(ev) => this.trackVertPointer(ev, true)}
                    onPointerUp={(ev) => this.trackVertPointer(ev, true)}
                    onPointerMove={(ev) => this.trackVertPointer(ev)}>
                    <div className="VertDragArea">
                        <motion.div
                            className='ThumbDrag'
                            drag={false}
                            initial={{ y: 0 }}
                            animate={{ y: this.state.upDown * -0.8 }} />
                    </div>
                </div>
                <div className='RightPad'
                    onPointerDown={(ev) => this.trackHorizPointer(ev)}
                    onPointerCancel={(ev) => this.trackHorizPointer(ev, true)}
                    onPointerUp={(ev) => this.trackHorizPointer(ev, true)}
                    onPointerMove={(ev) => this.trackHorizPointer(ev)}>
                    <div className="HorizDragArea">
                        <motion.div
                            className='ThumbDrag'
                            drag={false}
                            initial={{ x: 0 }}
                            animate={{ x: this.state.leftRight * 0.8 }} />
                    </div>
                </div>
                <motion.button
                    className='BrakeButton'
                    initial={{ scale: 1 }}
                    animate={this.state.gamepadId ? { scale: this.state.brake ? 1.2 : 1 } : undefined}
                    transition={{ type: 'spring', bounce: 0.5 }} >
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
            </div>
        );
    }
}