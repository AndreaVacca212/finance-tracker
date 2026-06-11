namespace FinanceTracker.Core.Models;

public class Budget
{
    public Guid Id { get; set; }
    public decimal Limit { get; set; }
    public int Month { get; set; }   // 1-12
    public int Year { get; set; }

    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    // Calcolato a runtime, non persistito
    public decimal Spent { get; set; }
    public decimal Remaining => Limit - Spent;
    public bool IsOverBudget => Spent > Limit;
}