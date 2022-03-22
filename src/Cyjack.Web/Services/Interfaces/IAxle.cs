using Cyjack.Web.Services.Entities;

namespace Cyjack.Web.Services
{
    public interface IAxle
    {
        void Control(ControlState controlState);

        ControlState GetControlState();
    }
}
