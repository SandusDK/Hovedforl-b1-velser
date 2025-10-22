WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Configure Kestrel to listen on all network interfaces
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(52488); // HTTP
    options.ListenAnyIP(44366, listenOptions =>
    {
        listenOptions.UseHttps(); // HTTPS
    });
});

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.CreateUmbracoBuilder()
    .AddBackOffice()
    .AddWebsite()
    .AddDeliveryApi()
    .AddComposers()
    .Build();

WebApplication app = builder.Build();

await app.BootUmbracoAsync();

// Enable CORS
app.UseCors("AllowAll");

// Add response caching middleware for static files
app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value?.ToLower() ?? "";

    // Cache static assets for 1 year
    if (path.StartsWith("/media/") ||
        path.StartsWith("/css/") ||
        path.StartsWith("/js/") ||
        path.EndsWith(".js") ||
        path.EndsWith(".css") ||
        path.EndsWith(".jpg") ||
        path.EndsWith(".jpeg") ||
        path.EndsWith(".png") ||
        path.EndsWith(".gif") ||
        path.EndsWith(".webp") ||
        path.EndsWith(".svg") ||
        path.EndsWith(".woff") ||
        path.EndsWith(".woff2"))
    {
        context.Response.Headers.CacheControl = "public, max-age=31536000, immutable";
    }

    await next();
});

app.UseUmbraco()
    .WithMiddleware(u =>
    {
        u.UseBackOffice();
        u.UseWebsite();
    })
    .WithEndpoints(u =>
    {
        u.UseBackOfficeEndpoints();
        u.UseWebsiteEndpoints();
    });

await app.RunAsync();
