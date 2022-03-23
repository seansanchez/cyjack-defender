using Azure.Messaging.EventHubs;
using Cyjack.Extensions;
using Cyjack.Functions.Services;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

namespace Cyjack.Functions
{
    public class DeviceSecurityAlertFunctions
    {
        private readonly IIoTServiceClientService _ioTServiceClientService;
        private readonly ILogger<DeviceSecurityAlertFunctions> _logger;

        public DeviceSecurityAlertFunctions(
            IIoTServiceClientService ioTServiceClientService,
            ILogger<DeviceSecurityAlertFunctions> logger)
        {
            ioTServiceClientService.ShouldNotBeNull(nameof(ioTServiceClientService));
            logger.ShouldNotBeNull(nameof(logger));

            _ioTServiceClientService = ioTServiceClientService;
            _logger = logger;
        }

        [FunctionName("DeviceSecurityAlertFunctions")]
        public async Task Run(
            [EventHubTrigger("cyjack-defender/am-securityalert", Connection = "AzureEventHubConnectionString")] EventData[] events,
            ILogger log)
        {
            var exceptions = new List<Exception>();

            foreach (var eventData in events)
            {
                try
                {
                    var messageBody = eventData.Body.ToString();

                    // Replace these two lines with your processing logic.
                    log.LogInformation($"C# Event Hub trigger function processed a message: {messageBody}");
                    await Task.Yield();
                }
                catch (Exception e)
                {
                    // We need to keep processing the rest of the batch - capture this exception and continue.
                    // Also, consider capturing details of the message that failed processing so it can be processed again later.
                    exceptions.Add(e);
                }
            }

            // Once processing of the batch is complete, if any messages in the batch failed processing throw an exception so that there is a record of the failure.

            if (exceptions.Count > 1)
                throw new AggregateException(exceptions);

            if (exceptions.Count == 1)
                throw exceptions.Single();
        }
    }
}
