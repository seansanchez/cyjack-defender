using Microsoft.AspNetCore.Mvc;

namespace RP.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GpioController : ControllerBase
    {
        private const int LeftForwardPin = 17;
        private const int LeftBackwardPin = 18;
        private const int RightForwardPin = 23;
        private const int RightBackwardPin = 22;

        private readonly Axle _axle;

        public GpioController()
        {
            var leftMotor = new Motor(forwardPin: LeftForwardPin, backwardPin: LeftBackwardPin);
            var rightMotor = new Motor(forwardPin: RightForwardPin, backwardPin: RightBackwardPin);

            _axle = new Axle(leftMotor: leftMotor, rightMotor: rightMotor);
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