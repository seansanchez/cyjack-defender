using System.ComponentModel.DataAnnotations;

namespace Cyjack.Web
{
    public class CyjackWebOptions
    {
        [Required]
        public int LeftBackwardPin { get; set; }

        [Required]
        public int LeftForwardPin { get; set; }

        [Required]
        public int RightBackwardPin { get; set; }

        [Required]
        public int RightForwardPin { get; set; }

        public string DeviceConnectionString { get; set; }
    }
}
