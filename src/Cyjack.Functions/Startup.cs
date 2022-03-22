using Cyjack.Extensions;
using Cyjack.Functions;
using Cyjack.Functions.Services;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(Startup))]

namespace Cyjack.Functions
{
    /// <inheritdoc />
    public class Startup : FunctionsStartup
    {
        /// <inheritdoc />
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddConfigurationOptions<CyjackFunctionsOptions>(nameof(CyjackFunctionsOptions));
            builder.Services.AddSingleton<IIoTServiceClientService, IoTServiceClientService>();
        }

        /// <inheritdoc />
        public override void ConfigureAppConfiguration(IFunctionsConfigurationBuilder builder)
        {
            builder.ShouldNotBeNull(nameof(builder));

            var context = builder.GetContext();
            builder.ConfigurationBuilder.Configure(context.ApplicationRootPath);
        }
    }
}