using System.Device.Gpio;

namespace RP.Web
{
    public class Axle
    {
        private readonly Motor _leftMotor;
        private readonly Motor _rightMotor;

        public Axle(Motor leftMotor, Motor rightMotor)
        {
            _leftMotor = leftMotor ?? throw new ArgumentNullException(nameof(leftMotor));
            _rightMotor = rightMotor ?? throw new ArgumentNullException(nameof(rightMotor));
        }

        public void Control(ControlState controlState)
        {
            if (controlState.Brake)
            {
                _leftMotor.Off();
                _rightMotor.Off();
            }
            else
            {
                if (controlState.UpDown == 0)
                {
                    _leftMotor.Off();
                    _rightMotor.Off();
                }
                else if (controlState.UpDown > 0)
                {
                    _leftMotor.Forward();
                    _rightMotor.Forward();
                }
                else if (controlState.UpDown < 0)
                {
                    _leftMotor.Backward();
                    _rightMotor.Backward();
                }
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
    }
}