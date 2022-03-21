using System.Device.Gpio;

namespace RP.Web
{
    public class Motor : IDisposable
    {
        private readonly int _forwardPin;
        private readonly int _backwardPin;
        private readonly GpioController _gpio;

        public Motor(int forwardPin, int backwardPin)
        {
            _forwardPin = forwardPin;
            _backwardPin = backwardPin;
            _gpio = new GpioController();

            _gpio.OpenPin(_forwardPin, PinMode.Output, PinValue.Low);
            _gpio.OpenPin(_backwardPin, PinMode.Output, PinValue.Low);
        }

        public void Off()
        {
            _gpio.Write(_backwardPin, PinValue.Low);
            _gpio.Write(_forwardPin, PinValue.Low);
        }

        public void Forward()
        {
            this.Off();

            _gpio.Write(_forwardPin, PinValue.High);
        }

        public void Backward()
        {
            this.Off();

            _gpio.Write(_backwardPin, PinValue.High);
        }

        public void Dispose()
        {
            this.Off();

            this.TryClosePin(_backwardPin);
            this.TryClosePin(_forwardPin);

            _gpio.Dispose();
        }

        private void TryClosePin(int pinNumber)
        {
            if (_gpio.IsPinOpen(pinNumber))
            {
                _gpio.ClosePin(pinNumber);
            }
        }
    }
}