using FinanceTracker.Core.Models;
using FinanceTracker.Infrastructure.Data;
using FinanceTracker.Infrastructure.Tink;

namespace FinanceTracker.Api.Endpoints;

public static class TinkEndpoints
{
    public static void MapTinkEndpoints(this WebApplication app)
    {
        // Avvia flusso: restituisce Tink Link URL
        app.MapGet("/api/tink/link", () =>
        {
            var url = "https://link.tink.com/1.0/transactions/connect-accounts/?client_id=232de4b914a44030b9120f1a50c27548&redirect_uri=http%3A%2F%2Flocalhost%3A5097%2Fapi%2Ftink%2Fcallback&market=IT&locale=it_IT";
            return Results.Ok(new { url });
        });

        // Callback dopo autenticazione banca
        app.MapGet("/api/tink/callback", async (
            string code,
            TinkService tink,
            AppDbContext db) =>
        {
            var userToken = await tink.ExchangeCodeForUserTokenAsync(code);

            // Fetch e salva accounts
            var tinkAccounts = await tink.GetAccountsAsync(userToken);
            foreach (var ta in tinkAccounts)
            {
                var exists = db.Accounts.Any(a => a.ExternalAccountId == ta.Id);
                if (!exists)
                {
                    db.Accounts.Add(new Account
                    {
                        Name = ta.Name,
                        BankName = $"Tink ({ta.Type})",
                        Balance = ta.Balance,
                        Currency = ta.CurrencyCode,
                        ExternalAccountId = ta.Id
                    });
                }
            }
            await db.SaveChangesAsync();

            // Fetch e salva transactions
            var tinkTx = await tink.GetTransactionsAsync(userToken);
            foreach (var tx in tinkTx)
            {
                var account = db.Accounts.FirstOrDefault(a => a.ExternalAccountId == tx.AccountId);
                if (account == null) continue;

                var exists = db.Transactions.Any(t => t.ExternalId == tx.Id);
                if (!exists)
                {
                    db.Transactions.Add(new Transaction
                    {
                        Description = tx.Description,
                        Amount = Math.Abs(tx.Amount),
                        Type = tx.Amount >= 0 ? TransactionType.Income : TransactionType.Expense,
                        Date = DateTime.Parse(tx.Date),
                        AccountId = account.Id,
                        ExternalId = tx.Id
                    });
                }
            }
            await db.SaveChangesAsync();

            // Redirect al frontend
            return Results.Redirect("http://localhost:4200/accounts?synced=true");
        });

        // Sync manuale (da implementare)
        app.MapPost("/api/tink/sync", () =>
        {
            return Results.Ok(new { message = "Sync completata" });
        });
    }
}