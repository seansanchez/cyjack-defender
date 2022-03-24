using Cyjack.Extensions;
using Cyjack.Web.Machine;
using Cyjack.Web.Machine.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security;

namespace Cyjack.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GpioController : ControllerBase
    {
        private readonly IAxle _axle;

        public GpioController(IAxle axle)
        {
            axle.ShouldNotBeNull(nameof(axle));

            _axle = axle;
        }

        [HttpGet("Alive")]
        public IActionResult GetHealth()
        {
            return Ok();
        }

        [HttpPost("ControllerState")]
        public IActionResult Control(ControlState controlState)
        {
            try
            {
                this._axle.Control(controlState);

                return Ok();
            }
            catch (IOException ex)
            {
                return Problem(detail: ex.Message, statusCode: (int)HttpStatusCode.FailedDependency);
            }
            catch (SecurityException ex)
            {
                return Problem(detail: ex.Message, statusCode: (int)HttpStatusCode.ServiceUnavailable);

            }
        }
    }
}