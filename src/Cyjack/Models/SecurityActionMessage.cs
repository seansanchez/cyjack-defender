using Cyjack.Enums;

namespace Cyjack.Models
{
    public class SecurityActionMessage
    {
        public SecurityActionEnum SecurityAction { get; set; } = SecurityActionEnum.None;

        public string Message { get; set; }
    }
}