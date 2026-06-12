using FinanceTracker.Core.Models;
using FinanceTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Api.Endpoints;

public static class BudgetEndpoints
{
    public static void MapBudgetEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/budgets");

        group.MapGet("/", async (AppDbContext db) =>
        {
            var budgets = await db.Budgets
                .Include(b => b.Category)
                .OrderBy(b => b.Year)
                .ThenBy(b => b.Month)
                .ThenBy(b => b.Category.Name)
                .ToListAsync();

            foreach (var budget in budgets)
            {
                budget.Spent = await db.Transactions
                    .Where(t =>
                        t.CategoryId == budget.CategoryId &&
                        t.Type == TransactionType.Expense &&
                        t.Date.Month == budget.Month &&
                        t.Date.Year == budget.Year)
                    .SumAsync(t => t.Amount);
            }

            return Results.Ok(budgets);
        });

        group.MapPost("/", async (Budget budget, AppDbContext db) =>
        {
            budget.Id = Guid.NewGuid();
            db.Budgets.Add(budget);
            await db.SaveChangesAsync();
            return Results.Created($"/api/budgets/{budget.Id}", budget);
        });

        group.MapDelete("/{id:guid}", async (Guid id, AppDbContext db) =>
        {
            var budget = await db.Budgets.FindAsync(id);
            if (budget is null) return Results.NotFound();
            db.Budgets.Remove(budget);
            await db.SaveChangesAsync();
            return Results.NoContent();
        });
    }
}