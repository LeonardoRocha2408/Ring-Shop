using StackExchange.Redis;

namespace Ring_Shop.Server.Services
{
    public class RedisServices
    {
        private readonly ConnectionMultiplexer _redis;

        public RedisServices (IConfiguration configuration)
        {
            var connectionString =
                configuration.GetConnectionString("Redis") ?? 
                throw new InvalidOperationException(
                    "Redis connection string is not configured"); 

            _redis = ConnectionMultiplexer.Connect(connectionString);
        }

        public IDatabase GetDatabase()
        {
            return _redis.GetDatabase();
        }
    }
}
