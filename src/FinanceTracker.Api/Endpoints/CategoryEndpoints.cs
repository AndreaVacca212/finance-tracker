using FinanceTracker.Core.Models;
using FinanceTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Api.Endpoints;

public static class CategoryEndpoints
{
    public static void MapCategoryEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/categories");

        group.MapGet("/", async (AppDbContext db) =>
            Results.Ok(await db.Categories.OrderBy(c => c.Name).ToListAsync()));

        group.MapPost("/", async (Category category, AppDbContext db) =>
        {
            category.Id = Guid.NewGuid();
            db.Categories.Add(category);
            await db.SaveChangesAsync();
            return Results.Created($"/api/categories/{category.Id}", category);
        });

        group.MapDelete("/{id:guid}", async (Guid id, AppDbContext db) =>
        {
            var category = await db.Categories.FindAsync(id);
            if (category is null) return Results.NotFound();
            db.Categories.Remove(category);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}