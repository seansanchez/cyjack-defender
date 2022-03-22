using Cyjack.Extensions;
using Cyjack.Web.Services;
using Cyjack.Web.Services.Entities;
using Microsoft.AspNetCore.Mvc;

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
            this._axle.Control(controlState);

            return Ok();
        }
    }
}