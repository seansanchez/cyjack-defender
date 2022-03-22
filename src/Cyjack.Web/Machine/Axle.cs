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
            if (this.IsStopped(controlState))
            {
                _leftMotor.Off();
                _rightMotor.Off();
            }
            else if (this.IsDrivingForward(controlState) && this.IsNotTurning(controlState))
            {
                _leftMotor.Forward();
                _rightMotor.Forward();
            }
            else if (this.IsDrivingBackward(controlState) && this.IsNotTurning(controlState))
            {
                _leftMotor.Backward();
                _rightMotor.Backward();
            }
            else if (this.IsTurningRight(controlState) && this.IsNotDriving(controlState))
            {
                _leftMotor.Forward();
                _rightMotor.Backward();
            }
            else if (this.IsTurningLeft(controlState) && this.IsNotDriving(controlState))
            {
                _leftMotor.Backward();
                _rightMotor.Forward();
            }
            else if (this.IsDrivingForward(controlState) && this.IsTurningRight(controlState))
            {
                _leftMotor.Forward();
                _rightMotor.Off();
            }
            else if (this.IsDrivingForward(controlState) && this.IsTurningLeft(controlState))
            {
                _leftMotor.Off();
                _rightMotor.Forward();
            }
            else if (this.IsDrivingBackward(controlState) && this.IsTurningRight(controlState))
            {
                _leftMotor.Backward();
                _rightMotor.Off();
            }
            else if (this.IsDrivingBackward(controlState) && this.IsTurningLeft(controlState))
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

        private bool IsTurningRight(ControlState controlState) {
            return controlState.LeftRight > 0;
        }

        private bool IsTurningLeft(ControlState controlState) {
            return controlState.LeftRight < 0;
        }

        private bool IsNotTurning(ControlState controlState) {
            return controlState.LeftRight == 0;
        }

        private bool IsDrivingForward(ControlState controlState) {
            return controlState.UpDown > 0;
        }

        private bool IsDrivingBackward(ControlState controlState) {
            return controlState.UpDown < 0;
        }

        private bool IsNotDriving(ControlState controlState) {
            return controlState.UpDown == 0;
        }

        private bool IsStopped(ControlState controlState) {
            return controlState.Brake || (this.IsNotTurning(controlState) && this.IsNotDriving(controlState));
        }
    }
}
