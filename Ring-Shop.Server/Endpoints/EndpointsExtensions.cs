namespace Ring_Shop.Server.Endpoints
{
    public static class EndpointsExtensions
    {
        public static void MapEndpoints(this WebApplication app)
        {
            new UserEndpoints().MapEndpoints(app);
        }
    }
}
