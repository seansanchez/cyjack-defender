using System.ComponentModel.DataAnnotations;

namespace Cyjack.Functions
{
    public class CyjackFunctionsOptions
    {
        [Required]
        public string IoTHubConnectionString { get; set; }
    }
}
