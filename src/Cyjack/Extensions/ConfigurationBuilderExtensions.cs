using Microsoft.Extensions.Configuration;

namespace Cyjack.Extensions
{
    /// <summary>
    ///     Provides extension methods for <see cref="IConfigurationBuilder"/>.
    /// </summary>
    public static class ConfigurationBuilderExtensions
    {
        /// <summary>
        ///     Adds the common <see cref="IConfigurationProvider"/> to the <see cref="IConfigurationBuilder"/>.
        /// </summary>
        /// <param name="source">The source <see cref="IConfigurationBuilder"/>.</param>
        /// <param name="applicationRootPath">The application root path.</param>
        public static void Configure(
            this IConfigurationBuilder source,
            string? applicationRootPath = null)
        {
            source.ShouldNotBeNull(nameof(source));

            source.AddEnvironmentVariables();
            source.AddJsonConfigurationProvider(applicationRootPath);
        }

        private static void AddJsonConfigurationProvider(
            this IConfigurationBuilder source,
            string? applicationRootPath = null)
        {
            source.ShouldNotBeNull(nameof(source));

            var appSettingsFileName = "appsettings.json";

            source
                .AddJsonFile(
                    path: applicationRootPath == null ? appSettingsFileName : Path.Combine(applicationRootPath, appSettingsFileName),
                    optional: true,
                    reloadOnChange: false);

            var environment = Environment.GetEnvironmentVariable(CyjackConstants.EnvironmentSettings.Environment);

            if (!string.IsNullOrWhiteSpace(environment))
            {
                var appSettingsWithEnvironmentFileName = $"appsettings.{environment}.json";

                source
                    .AddJsonFile(
                        path: applicationRootPath == null ? appSettingsWithEnvironmentFileName : Path.Combine(applicationRootPath, appSettingsWithEnvironmentFileName),
                        optional: true,
                        reloadOnChange: false);
            }
        }
    }
}