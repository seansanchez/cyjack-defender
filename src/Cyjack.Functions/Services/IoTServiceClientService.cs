using System.Text;
using Cyjack.Extensions;
using Cyjack.Models;
using Microsoft.Azure.Devices;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Cyjack.Functions.Services
{
    public class IoTServiceClientService : IIoTServiceClientService
    {
        private readonly ILogger<IoTServiceClientService> _logger;
        private readonly ServiceClient _serviceClient;

        public IoTServiceClientService(
            IOptions<CyjackFunctionsOptions> options,
            ILogger<IoTServiceClientService> logger)
        {
            options.ShouldNotBeNull(nameof(options));
            options.Value.ShouldNotBeNull($"{nameof(options)}.{nameof(options.Value)}");
            logger.ShouldNotBeNull(nameof(logger));

            _logger = logger;
            _serviceClient = ServiceClient.CreateFromConnectionString(options.Value.IoTHubConnectionString);
        }

        public async Task SendSecurityActionMessageAsync(
            string deviceId,
            SecurityActionMessage message)
        {
            var bytes = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(message));

            await _serviceClient.SendAsync(deviceId, new Message(bytes)).ConfigureAwait(false);
        }
    }
}
