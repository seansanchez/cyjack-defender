using Cyjack.Extensions;
using Microsoft.Azure.Devices.Client;
using Microsoft.Extensions.Options;

namespace Cyjack.Web.Services
{
    public class DefenderService : BackgroundService
    {
        private const string DefenderMicroAgentConnectionStringFile = "/etc/defender_iot_micro_agent/connection_string.txt";

        private readonly IOptions<CyjackWebOptions> _options;
        private readonly ILogger<DefenderService> _logger;

        private DeviceClient? _deviceClient;

        public DefenderService(
            IOptions<CyjackWebOptions> options,
            ILogger<DefenderService> logger)
        {
            options.ShouldNotBeNull(nameof(options));
            options.Value.ShouldNotBeNull($"{nameof(options)}.{nameof(options.Value)}");
            logger.ShouldNotBeNull(nameof(logger));

            _options = options;
            _logger = logger;
        }

        public override async Task StartAsync(CancellationToken cancellationToken)
        {
            await TryInitializeDeviceClientAsync(cancellationToken).ConfigureAwait(false);

            if (_deviceClient != null)
            {
                await _deviceClient
                    .SetReceiveMessageHandlerAsync(messageHandler: MessageHandler, _deviceClient, cancellationToken)
                    .ConfigureAwait(false);
            }
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
        }

        private async Task MessageHandler(Message message, object _)
        {
            if (_deviceClient != null)
            {
                await _deviceClient.CompleteAsync(message).ConfigureAwait(false);
            }
        }

        private async Task TryInitializeDeviceClientAsync(CancellationToken cancellationToken)
        {
            if (_deviceClient == null)
            {
                if (File.Exists(DefenderMicroAgentConnectionStringFile))
                {
                    var connectionString = await File
                        .ReadAllTextAsync(path: DefenderMicroAgentConnectionStringFile, cancellationToken: cancellationToken)
                        .ConfigureAwait(false);

                    if (!string.IsNullOrWhiteSpace(connectionString))
                    {
                        _deviceClient = DeviceClient.CreateFromConnectionString(connectionString);
                    }
                }
            }
        }
    }
}
