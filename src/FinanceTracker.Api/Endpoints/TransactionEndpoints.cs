using FinanceTracker.Core.Models;
using FinanceTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Api.Endpoints;

public static class TransactionEndpoints
{
    public static void MapTransactionEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/transactions");

        group.MapGet("/", async (AppDbContext db) =>
            Results.Ok(await db.Transactions
                .Include(t => t.Category)
                .Include(t => t.Account)
                .OrderByDescending(t => t.Date)
                .ToListAsync()));

        group.MapGet("/{id:guid}", async (Guid id, AppDbContext db) =>
            await db.Transactions
                .Include(t => t.Category)
                .Include(t => t.Account)
                .FirstOrDefaultAsync(t => t.Id == id) is Transaction t
                    ? Results.Ok(t)
                    : Results.NotFound());

        group.MapPost("/", async (Transaction transaction, AppDbContext db) =>
        {
            transaction.Id = Guid.NewGuid();
            db.Transactions.Add(transaction);
            await db.SaveChangesAsync();
            return Results.Created($"/api/transactions/{transaction.Id}", transaction);
        });

        group.MapDelete("/{id:guid}", async (Guid id, AppDbContext db) =>
        {
            var transaction = await db.Transactions.FindAsync(id);
            if (transaction is null) return Results.NotFound();
            db.Transactions.Remove(transaction);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}