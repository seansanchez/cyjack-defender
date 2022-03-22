using System.Device.Gpio;

namespace Cyjack.Web.Machine
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
