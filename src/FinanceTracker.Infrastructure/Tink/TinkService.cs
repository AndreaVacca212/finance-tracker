using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Configuration;

namespace FinanceTracker.Infrastructure.Tink;

public class TinkService(IConfiguration config, HttpClient http)
{
    private readonly string _clientId = config["Tink:ClientId"]!;
    private readonly string _clientSecret = config["Tink:ClientSecret"]!;
    private readonly string _redirectUri = config["Tink:RedirectUri"]!;

    // Step 1 — Client access token (app-level)
    public async Task<string> GetClientAccessTokenAsync()
    {
        var form = new Dictionary<string, string>
        {
            ["client_id"] = _clientId,
            ["client_secret"] = _clientSecret,
            ["grant_type"] = "client_credentials",
            ["scope"] = "authorization:grant,user:create"
        };

        var res = await http.PostAsync(
            "https://api.tink.com/api/v1/oauth/token",
            new FormUrlEncodedContent(form));

        res.EnsureSuccessStatusCode();
        var json = await res.Content.ReadFromJsonAsync<JsonElement>();
        return json.GetProperty("access_token").GetString()!;
    }

    // Step 2 — Crea utente Tink e ottieni authorization code per Tink Link
    public async Task<string> GetAuthorizationCodeAsync(string clientToken, string externalUserId)
    {
        http.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", clientToken);

        var form = new Dictionary<string, string>
        {
            ["external_user_id"] = externalUserId,
            ["scope"] = "accounts:read,balances:read,transactions:read,credentials:read",
        };

        var res = await http.PostAsync(
            "https://api.tink.com/api/v1/oauth/authorization-grant",
            new FormUrlEncodedContent(form));

        res.EnsureSuccessStatusCode();
        var json = await res.Content.ReadFromJsonAsync<JsonElement>();
        return json.GetProperty("code").GetString()!;
    }

    // Step 3 — Scambia callback code → user access token
    public async Task<string> ExchangeCodeForUserTokenAsync(string code)
    {
        var form = new Dictionary<string, string>
        {
            ["client_id"] = _clientId,
            ["client_secret"] = _clientSecret,
            ["grant_type"] = "authorization_code",
            ["code"] = code
        };

        var res = await http.PostAsync(
            "https://api.tink.com/api/v1/oauth/token",
            new FormUrlEncodedContent(form));

        res.EnsureSuccessStatusCode();
        var json = await res.Content.ReadFromJsonAsync<JsonElement>();
        return json.GetProperty("access_token").GetString()!;
    }

    // Step 4 — Fetch accounts
    public async Task<List<TinkAccount>> GetAccountsAsync(string userToken)
    {
        http.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", userToken);

        var res = await http.GetAsync("https://api.tink.com/data/v2/accounts");
        res.EnsureSuccessStatusCode();

        var json = await res.Content.ReadFromJsonAsync<JsonElement>();
        var accounts = new List<TinkAccount>();

        foreach (var item in json.GetProperty("accounts").EnumerateArray())
        {
            accounts.Add(new TinkAccount
            {
                Id = item.GetProperty("id").GetString()!,
                Name = item.GetProperty("name").GetString()!,
                Type = item.GetProperty("type").GetString()!,
                Balance = decimal.Parse(
                    item.GetProperty("balances")
                    .GetProperty("booked")
                    .GetProperty("amount")
                    .GetProperty("value")
                    .GetProperty("unscaledValue").GetString()!) / 100m,
                CurrencyCode = item.GetProperty("balances")
                                   .GetProperty("booked")
                                   .GetProperty("amount")
                                   .GetProperty("currencyCode").GetString()!
            });
        }

        return accounts;
    }

    // Step 5 — Fetch transactions
    public async Task<List<TinkTransaction>> GetTransactionsAsync(string userToken)
    {
        http.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", userToken);

        var res = await http.GetAsync("https://api.tink.com/data/v2/transactions?pageSize=100");
        res.EnsureSuccessStatusCode();

        var json = await res.Content.ReadFromJsonAsync<JsonElement>();
        var transactions = new List<TinkTransaction>();

        foreach (var item in json.GetProperty("transactions").EnumerateArray())
        {
            transactions.Add(new TinkTransaction
            {
                Id = item.GetProperty("id").GetString()!,
                AccountId = item.GetProperty("accountId").GetString()!,
                Description = item.GetProperty("descriptions")
                                  .GetProperty("display").GetString()!,
                Amount = decimal.Parse(
                    item.GetProperty("amount")
                    .GetProperty("value")
                    .GetProperty("unscaledValue").GetString()!) / 100m,
                Date = item.GetProperty("dates")
                           .GetProperty("booked").GetString()!,
                Status = item.GetProperty("status").GetString()!
            });
        }

        return transactions;
    }
}

// DTOs
public record TinkAccount(string Id, string Name, string Type, decimal Balance, string CurrencyCode)
{
    public TinkAccount() : this("", "", "", 0, "") { }
    public string Id { get; init; } = Id;
    public string Name { get; init; } = Name;
    public string Type { get; init; } = Type;
    public decimal Balance { get; init; } = Balance;
    public string CurrencyCode { get; init; } = CurrencyCode;
}

public record TinkTransaction(string Id, string AccountId, string Description, decimal Amount, string Date, string Status)
{
    public TinkTransaction() : this("", "", "", 0, "", "") { }
    public string Id { get; init; } = Id;
    public string AccountId { get; init; } = AccountId;
    public string Description { get; init; } = Description;
    public decimal Amount { get; init; } = Amount;
    public string Date { get; init; } = Date;
    public string Status { get; init; } = Status;
}