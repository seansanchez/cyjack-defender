using System.Device.Gpio;
using Cyjack.Extensions;
using Cyjack.Web.Machine.Entities;
using Microsoft.Extensions.Options;

namespace Cyjack.Web.Machine
{
    public class Axle : IAxle
    {
        private readonly ILogger<Axle> _logger;
        private readonly Motor _leftMotor;
        private readonly Motor _rightMotor;

        public Axle(
            IOptions<CyjackWebOptions> options,
            ILogger<Axle> logger)
        {
            options.ShouldNotBeNull(nameof(options));
            options.Value.ShouldNotBeNull($"{nameof(options)}.{nameof(options.Value)}");
            logger.ShouldNotBeNull(nameof(logger));

            _logger = logger;

            _leftMotor = new Motor(
                forwardPin: options.Value.LeftForwardPin,
                backwardPin: options.Value.LeftBackwardPin);

            _rightMotor = new Motor(
                forwardPin: options.Value.RightForwardPin,
                backwardPin: options.Value.RightBackwardPin);
        }

        public void Control(ControlState controlState)
        {
            if (this.isStopped(controlState))
            {
                _leftMotor.Off();
                _rightMotor.Off();
            }
            else if (this.isDrivingForward(controlState) && this.isNotTurning(controlState))
            {
                _leftMotor.Forward();
                _rightMotor.Forward();
            }
            else if (this.isDrivingBackward(controlState) && this.isNotTurning(controlState))
            {
                _leftMotor.Backward();
                _rightMotor.Backward();
            }
            else if (this.isTurningRight(controlState) && this.isNotDriving(controlState))
            {
                _leftMotor.Forward();
                _rightMotor.Backward();
            }
            else if (controthis.isTurningLeft(controlState) && this.isNotDriving(controlState))
            {
                _leftMotor.Backward()
                _rightMotor.Forward();
            }
            else if (this.isDrivingForward(controlState) && this.isTurningRight(controlState))
            {
                _leftMotor.Forward();
                _rightMotor.Off();
            }
            else if (this.isDrivingForward(controlState) && this.isTurningLeft(controlState))
            {
                _leftMotor.Off();
                _rightMotor.Forward();
            }
            else if (this.isDrivingBackward(controlState) && this.isTurningRight(controlState))
            {
                _leftMotor.Backward();
                _rightMotor.Off();
            }
            else if (this.isDrivingBackward(controlState) && this.isTurningLeft(controlState))
            {
                _leftMotor.Off();
                _rightMotor.Backward();
            }
        }

        public ControlState GetControlState()
        {
            var left = (_leftMotor.GetForwardValue() == PinValue.High ? 100 : 0) -
                       (_leftMotor.GetBackwardValue() == PinValue.High ? 100 : 0);

            var right = (_rightMotor.GetForwardValue() == PinValue.High ? 100 : 0) -
                       (_rightMotor.GetBackwardValue() == PinValue.High ? 100 : 0);

            return new ControlState()
            {
                Brake = left == 0 && right == 0,
                LeftRight = 0,
                UpDown = left + right
            };
        }

        private isTurningRight(ControlState controlState) {
            return controlState.LeftRight > 0;
        }

        private isTurningLeft(ControlState controlState) {
            return controlState.LeftRight < 0;
        }

        private isNotTurning(ControlState controlState) {
            return controlState.LeftRight == 0;
        }

        private isDrivingForward(ControlState controlState) {
            return controlState.UpDown > 0;
        }

        private isDrivingBackward(ControlState controlState) {
            return controlState.UpDown < 0;
        }

        private isNotDriving(ControlState controlState) {
            return controlState.UpDown == 0;
        }

        private isStopped(ControlState controlState) {
            return controlState.Brake || (this.isNotTurning(controlState) && this.isNotDriving(controlState));
        }
    }
}
