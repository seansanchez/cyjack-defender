using RaspberryPi.Api.Models;
using Restup.Webserver.Attributes;
using Restup.Webserver.Models.Contracts;
using Restup.Webserver.Models.Schemas;

namespace RaspberryPi.Api.Controllers
{
    [RestController(InstanceCreationType.Singleton)]
    public class ParameterController
    {
        [UriFormat("/simpleparameter/{id}/property/{propName}")]
        public IGetResponse GetWithSimpleParameters(int id, string propName)
        {
            return new GetResponse(
                GetResponse.ResponseStatus.OK,
                new DataReceived() { ID = id, PropName = propName });
        }
    }
}
