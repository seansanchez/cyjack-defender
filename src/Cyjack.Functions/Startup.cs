using Cyjack.Extensions;
using Cyjack.Functions;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(Startup))]

namespace Cyjack.Functions
{
    /// <inheritdoc />
    public class Startup : FunctionsStartup
    {
        /// <inheritdoc />
        public override void Configure(IFunctionsHostBuilder builder)
        {
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