namespace FinanceTracker.Core.Models
{
    public class Account
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? BankName { get; set; }
        public decimal Balance { get; set; }
        public string Currency { get; set; } = "EUR";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Open Banking (da popolare in fase 3)
        public string? ExternalAccountId { get; set; }
        public string? Iban { get; set; }

        public ICollection<Transaction> Transactions { get; set; } = [];

    }
}