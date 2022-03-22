namespace Cyjack.Web.Services
{
    public class DefenderService : BackgroundService, IDefenderService
    {
        public DefenderService()
        {
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            throw new NotImplementedException();
        }
    }
}
