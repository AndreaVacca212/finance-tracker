namespace FinanceTracker.Core.Models;

public enum TransactionType { Income, Expense }

public class Transaction
{
    public Guid Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }
    public DateTime Date { get; set; }
    public string Currency { get; set; } = "EUR";
    public string? Notes { get; set; }
    public string? ExternalAccountId { get; set; }
    public string? ExternalId { get; set; }

    // Open Banking
    public string? ExternalTransactionId { get; set; }

    public Guid AccountId { get; set; }
    public Account Account { get; set; } = null!;

    public Guid? CategoryId { get; set; }
    public Category? Category { get; set; }
}