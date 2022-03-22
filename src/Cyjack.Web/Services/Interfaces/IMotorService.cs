using System.Device.Gpio;

namespace Cyjack.Web.Services
{
    public interface IMotorService
    {
        void Off();

        PinValue GetForwardValue();

        void Forward();

        void Backward();

        PinValue GetBackwardValue();
    }
}
