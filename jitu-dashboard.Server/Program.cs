using Microsoft.EntityFrameworkCore;
using jitu_dashboard.Server.DbContext;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

var sqlServerConnectionString = builder.Configuration.GetConnectionString("SqlServerContext");
if (string.IsNullOrWhiteSpace(sqlServerConnectionString))
{
    throw new InvalidOperationException("ConnectionStrings:SqlServerContext is missing or empty in appsettings.json.");
}

builder.Services.AddDbContext<JituDashboardContext>(options =>
    options.UseSqlServer(sqlServerConnectionString));

builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    });
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
