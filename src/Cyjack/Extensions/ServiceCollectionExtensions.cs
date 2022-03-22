using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Cyjack.Extensions
{
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="source"></param>
        /// <param name="section"></param>
        public static void AddConfigurationOptions<T>(
            this IServiceCollection source,
            string section) where T : class
        {
            source.ShouldNotBeNull(nameof(source));

            source
                .AddOptions<T>()
                .Configure<IConfiguration>((settings, configuration) => 
                {
                    configuration.GetSection(section).Bind(settings);
                })
                .ValidateDataAnnotations();
        }
    }
}
