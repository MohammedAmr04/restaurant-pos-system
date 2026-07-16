using System;
using System.IO;
using System.Runtime.Remoting.Contexts;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Web.Http;
using FluentValidation;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Owin;
using Microsoft.Owin.FileSystems;
using Microsoft.Owin.StaticFiles;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Owin;
using RestaurantPOS.Shared;
using Serilog;
using Unity;
using Unity.AspNet.WebApi;

namespace RestaurantPOS
{
    class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.Use(async (context, next) =>
            {
        
                try
                {
                    await next();
                }
                catch (System.Exception ex)
                {
                    Log.Error(ex, "Unhandled exception in OWIN pipeline");
                    context.Response.StatusCode = 500;
                    context.Response.ContentType = "application/json";
                    var errorBody = Newtonsoft.Json.JsonConvert.SerializeObject(new
                    {
                        success = false,
                        message = ex.Message,
                        stackTrace = ex.StackTrace,
                        innerException = ex.InnerException?.Message
                    });
                    await context.Response.WriteAsync(errorBody);
                }
            });
            // CORS Middleware
            app.Use(async (context, next) =>
            {
                var origin = context.Request.Headers.Get("Origin");

                // Allow Next.js development server
                if (origin == "http://localhost:3000")
                {
                    context.Response.Headers.Append("Access-Control-Allow-Origin", origin);
                    context.Response.Headers.Append("Vary", "Origin");
                    context.Response.Headers.Append("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
                    context.Response.Headers.Append("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
                    context.Response.Headers.Append("Access-Control-Allow-Credentials", "true");
                    context.Response.Headers.Append("Access-Control-Max-Age", "86400");
                }

                // Handle Preflight request
                if (context.Request.Method.Equals("OPTIONS", StringComparison.OrdinalIgnoreCase))
                {
                    context.Response.StatusCode = 200;
                    return;
                }

                await next();
            });


            app.UseJwtAuth();

            DatabaseMigration.RunMigrations();

            var container = new UnityContainer();
            DependencyConfig.RegisterDependencies(container);

            HttpConfiguration config = new HttpConfiguration();
            config.DependencyResolver = new UnityDependencyResolver(container);

            config.MapHttpAttributeRoutes();
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/v1/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            config.Formatters.Remove(config.Formatters.XmlFormatter);

            config.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.Always;

            config.MessageHandlers.Add(new CorsHandler());

            app.UseWebApi(config);

            ServeStaticFiles(app);

            Log.Information("Restaurant POS API configured successfully");
        }

        private void ServeStaticFiles(IAppBuilder app)
        {
            var fileSystem = new PhysicalFileSystem(@".\wwwroot");
            var options = new FileServerOptions
            {
                FileSystem = fileSystem,
                RequestPath = PathString.Empty,
                EnableDefaultFiles = true
            };

            options.DefaultFilesOptions.DefaultFileNames.Clear();
            options.DefaultFilesOptions.DefaultFileNames.Add("index.html");

            var fallbackFileSystem = new PhysicalFileSystem(@".\wwwroot");
            var fallbackOptions = new FileServerOptions
            {
                FileSystem = fallbackFileSystem,
                RequestPath = PathString.Empty
            };

            app.Use(async (context, next) =>
            {
                await next();
                if (context.Response.StatusCode == 404)
                {
                    var path = context.Request.Path.Value ?? "";
                    var htmlFile = Path.Combine(@".\wwwroot", (path.TrimStart('/') + ".html"));
                    if (File.Exists(htmlFile))
                    {
                        context.Response.StatusCode = 200;
                        context.Request.Path = new PathString(path + ".html");
                        await next();
                    }
                    else
                    {
                        context.Response.StatusCode = 200;
                        context.Request.Path = new PathString("/index.html");
                        await next();
                    }
                }
            });

            app.UseFileServer(options);
        }
    }

    public static class JwtAuthExtensions
    {
        public static IAppBuilder UseJwtAuth(this IAppBuilder app)
        {
            var secretKey = AuthHelper.GetSecretKey();
            var issuer = AuthHelper.GetIssuer();
            var audience = AuthHelper.GetAudience();

            app.Use(async (context, next) =>
            {
                var path = context.Request.Path.Value ?? "";
                if (path.StartsWith("/api/v1/auth/login") || path.StartsWith("/api/v1/auth/logout"))
                {
                    await next();
                    return;
                }

                if (path.StartsWith("/api/v1/"))
                {
                    var authHeader = context.Request.Headers.Get("Authorization");
                    if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                    {
                        context.Response.StatusCode = 401;
                        context.Response.ContentType = "application/json";
                        var body = JsonConvert.SerializeObject(new { success = false, message = "Unauthorized" });
                        await context.Response.WriteAsync(body);
                        return;
                    }

                    var token = authHeader.Substring("Bearer ".Length);
                    try
                    {
                        var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
                        var parameters = new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidIssuer = issuer,
                            ValidateAudience = true,
                            ValidAudience = audience,
                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                            ValidateLifetime = true,
                            ClockSkew = System.TimeSpan.Zero
                        };

                        var principal = handler.ValidateToken(token, parameters, out var validatedToken);
                        Thread.CurrentPrincipal = principal;
                        context.Set("owin.User", principal);
                    }
                    catch (Exception)
                    {
                        context.Response.StatusCode = 401;
                        context.Response.ContentType = "application/json";
                        var body = JsonConvert.SerializeObject(new { success = false, message = "Invalid or expired token" });
                        await context.Response.WriteAsync(body);
                        return;
                    }
                }

                await next();
            });

            return app;
        }
    }
}
