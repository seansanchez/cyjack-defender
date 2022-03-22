using Cyjack.Web.Services.Entities;

namespace Cyjack.Web.Services
{
    public interface IAxleService
    {
        void Control(ControlState controlState);

        ControlState GetControlState();
    }
}
