using RaspberryPi.Api.Controllers;
using Restup.Webserver.Http;
using Restup.Webserver.Rest;
using Windows.ApplicationModel.Background;

namespace RaspberryPi.Api
{
    public sealed class Startup : IBackgroundTask
    {
        private HttpServer _httpServer;

        private BackgroundTaskDeferral _deferral;

        /// <remarks>
        /// If you start any asynchronous methods here, prevent the task
        /// from closing prematurely by using BackgroundTaskDeferral as
        /// described in http://aka.ms/backgroundtaskdeferral
        /// </remarks>
        public async void Run(IBackgroundTaskInstance taskInstance)
        {
            // This deferral should have an instance reference, if it doesn't... the GC will
            // come some day, see that this method is not active anymore and the local variable
            // should be removed. Which results in the application being closed.
            _deferral = taskInstance.GetDeferral();
            var restRouteHandler = new RestRouteHandler();
            restRouteHandler.RegisterController<ParameterController>();

            var configuration = new HttpServerConfiguration()
                .ListenOnPort(5000)
                .RegisterRoute("api", restRouteHandler)
                .EnableCors();

            var httpServer = new HttpServer(configuration);
            httpServer.StartServerAsync().GetAwaiter().GetResult();


            // Don't release deferral, otherwise app will stop
        }
    }
}
