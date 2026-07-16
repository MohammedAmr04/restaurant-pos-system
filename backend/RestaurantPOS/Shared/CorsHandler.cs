using System.Net;
using System.Net.Http;
using System.Threading;
using System.Linq;
using System.Threading.Tasks;

namespace RestaurantPOS.Shared
{
    public class CorsHandler : DelegatingHandler
    {
        private const string AllowedOrigin = "http://localhost:3000";

        protected override async Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
        {
            if (request.Method == HttpMethod.Options)
            {
                var response = new HttpResponseMessage(HttpStatusCode.OK);
                AddCorsHeaders(request, response);
                return response;
            }

            var result = await base.SendAsync(request, cancellationToken);

            AddCorsHeaders(request, result);

            return result;
        }

        private void AddCorsHeaders(HttpRequestMessage request, HttpResponseMessage response)
        {
            if (request.Headers.Contains("Origin"))
            {
                var origin = request.Headers.GetValues("Origin").FirstOrDefault();

                if (origin == AllowedOrigin)
                {
                    response.Headers.TryAddWithoutValidation("Access-Control-Allow-Origin", origin);
                    response.Headers.TryAddWithoutValidation("Vary", "Origin");
                    response.Headers.TryAddWithoutValidation("Access-Control-Allow-Credentials", "true");
                }
            }

            response.Headers.TryAddWithoutValidation(
                "Access-Control-Allow-Methods",
                "GET,POST,PUT,DELETE,PATCH,OPTIONS");

            response.Headers.TryAddWithoutValidation(
                "Access-Control-Allow-Headers",
                "Content-Type, Authorization, X-Requested-With");

            response.Headers.TryAddWithoutValidation(
                "Access-Control-Max-Age",
                "86400");
        }
    }
}