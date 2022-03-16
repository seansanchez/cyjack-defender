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

        private readonly Motor _leftMotor;
        private readonly Motor _rightMotor;

        public GpioController()
        {
            _leftMotor = new Motor(forwardPin: LeftForwardPin, backwardPin: LeftBackwardPin);
            _rightMotor = new Motor(forwardPin: RightForwardPin, backwardPin: RightBackwardPin);
        }

        [HttpGet("forward")]
        public IActionResult GoForward()
        {
            _leftMotor.Forward();
            _rightMotor.Forward();

            return Ok();
        }
    }
}