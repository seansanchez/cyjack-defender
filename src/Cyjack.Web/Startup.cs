﻿using System.Text.Json;
using Cyjack.Extensions;
using Cyjack.Web.Services;

namespace Cyjack.Web
{
    /// <summary>
    ///     Represents the application startup.
    /// </summary>
    public class Startup
    {
        private const int LeftForwardPin = 17;
        private const int LeftBackwardPin = 18;
        private const int RightForwardPin = 23;
        private const int RightBackwardPin = 22;

        private readonly IConfiguration _configuration;

        /// <summary>
        ///     Initializes a new instance of the <see cref="Startup"/> class.
        /// </summary>
        /// <param name="configuration">The configuration.</param>
        public Startup(IConfiguration configuration)
        {
            configuration.ShouldNotBeNull(nameof(configuration));

            _configuration = configuration;
        }

        /// <summary>
        ///     This method gets called by the runtime. Use this method to add services to the container.
        /// </summary>
        /// <param name="services">The service collection.</param>
        public void ConfigureServices(IServiceCollection services)
        {
            services.ShouldNotBeNull(nameof(services));

            services.AddControllers().AddJsonOptions(x =>
            {
                x.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            services.AddSingleton<IAxleService>(
                new AxleService(
                    leftMotor: new MotorService(forwardPin: LeftForwardPin, backwardPin: LeftBackwardPin),
                    rightMotor: new MotorService(forwardPin: RightForwardPin, backwardPin: RightBackwardPin)));
        }

        /// <summary>
        ///     This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </summary>
        /// <param name="app">The app.</param>
        /// <param name="env">The environment.</param>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.ShouldNotBeNull(nameof(app));
            env.ShouldNotBeNull(nameof(env));

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseDefaultFiles()
                .UseStaticFiles()
                .UseWebSockets()
                .UseRouting()
                .UseAuthorization()
                .UseEndpoints(endpoints =>
                {
                    endpoints.MapControllers();
                });
        }
    }
}