using Cyjack.Web.Machine.Entities;

namespace Cyjack.Web.Machine
{
    public interface IAxle
    {
        void Control(ControlState controlState);

        ControlState GetControlState();
    }
}
