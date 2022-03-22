using Cyjack.Models;

namespace Cyjack.Functions.Services
{
    public interface IIoTServiceClientService
    {
        Task SendSecurityActionMessageAsync(
            string deviceId,
            SecurityActionMessage message);
    }
}