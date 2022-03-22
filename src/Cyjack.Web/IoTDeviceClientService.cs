using Cyjack.Enums;
using Cyjack.Extensions;
using Cyjack.Models;
using Cyjack.Web.Machine;
using Cyjack.Web.Machine.Entities;
using Microsoft.Azure.Devices.Client;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Cyjack.Web
{
    public class IoTDeviceClientService : BackgroundService
    {
        private readonly IAxle _axle;
        private readonly IOptions<CyjackWebOptions> _options;
        private readonly ILogger<IoTDeviceClientService> _logger;

        private DeviceClient? _deviceClient;

        public IoTDeviceClientService(
            IAxle axle,
            IOptions<CyjackWebOptions> options,
            ILogger<IoTDeviceClientService> logger)
        {
            axle.ShouldNotBeNull(nameof(axle));
            options.ShouldNotBeNull(nameof(options));
            options.Value.ShouldNotBeNull($"{nameof(options)}.{nameof(options.Value)}");
            logger.ShouldNotBeNull(nameof(logger));

            _axle = axle;
            _options = options;
            _logger = logger;
        }

        public override async Task StartAsync(CancellationToken cancellationToken)
        {
            TryInitializeDeviceClient(cancellationToken);

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
                try
                {
                    using (var streamReader = new StreamReader(message.BodyStream))
                    {
                        var json = await streamReader.ReadToEndAsync().ConfigureAwait(false);

                        _logger.LogInformation($"Received message: {json}");

                        var securityActionMessage = JsonConvert.DeserializeObject<SecurityActionMessage>(json);

                        switch (securityActionMessage.SecurityAction)
                        {
                            case SecurityActionEnum.None:
                                break;
                            case SecurityActionEnum.Stop:
                                _axle.Control(new ControlState()
                                {
                                    Brake = true
                                });
                                break;
                            default:
                                break;
                        }
                    }
                }
                catch (Exception e)
                {
                    _logger.LogError(e, "An exception occurred attempting to process message.");
                }


                await _deviceClient.CompleteAsync(message).ConfigureAwait(false);
            }
        }

        private void TryInitializeDeviceClient(CancellationToken cancellationToken)
        {
            if (_deviceClient == null)
            {
                if (!string.IsNullOrWhiteSpace(_options.Value.DeviceConnectionString))
                {
                    _deviceClient = DeviceClient.CreateFromConnectionString(_options.Value.DeviceConnectionString);
                }
            }
        }
    }
}
