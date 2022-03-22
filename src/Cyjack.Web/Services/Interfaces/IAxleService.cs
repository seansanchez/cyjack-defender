using Cyjack.Web.Machine.Entities;

namespace Cyjack.Web.Machine
{
    public interface IAxleService
    {
        void Control(ControlState controlState);

        ControlState GetControlState();
    }
}
