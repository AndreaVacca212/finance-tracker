using FinanceTracker.Core.Models;
using FinanceTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Api.Endpoints;

public static class AccountEndpoints
{
    public static void MapAccountEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/accounts");

        group.MapGet("/", async (AppDbContext db) =>
            Results.Ok(await db.Accounts.ToListAsync()));

        group.MapGet("/{id:guid}", async (Guid id, AppDbContext db) =>
            await db.Accounts.FindAsync(id) is Account account
                ? Results.Ok(account)
                : Results.NotFound());

        group.MapPost("/", async (Account account, AppDbContext db) =>
        {
            account.Id = Guid.NewGuid();
            account.CreatedAt = DateTime.UtcNow;
            db.Accounts.Add(account);
            await db.SaveChangesAsync();
            return Results.Created($"/api/accounts/{account.Id}", account);
        });

        group.MapDelete("/{id:guid}", async (Guid id, AppDbContext db) =>
        {
            var account = await db.Accounts.FindAsync(id);
            if (account is null) return Results.NotFound();
            db.Accounts.Remove(account);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}