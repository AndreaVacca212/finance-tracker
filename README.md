# 💰 Finance Tracker

Personal finance tracker con Angular frontend e .NET 10 backend, con supporto futuro per Open Banking (GoCardless).

## 🛠️ Stack tecnologico

| Layer | Tecnologia |
|---|---|
| Frontend | Angular 22, Angular Material, Chart.js |
| Backend | ASP.NET Core 10 Minimal API |
| Database | SQLite + Entity Framework Core |
| Open Banking | GoCardless (fase 5) |

## 📁 Struttura del progetto

```
finance-tracker/
├── finance-tracker-ui/          # Angular 22 app
│   └── src/app/
│       ├── layout/shell         # Layout con sidebar
│       ├── pages/
│       │   ├── dashboard        # Dashboard con grafici
│       │   ├── accounts         # Lista conti + add/delete
│       │   ├── transactions     # Lista transazioni + filtri + add/delete
│       │   └── budget           # Budget mensili con progress bar
│       ├── shared/
│       │   └── confirm-dialog   # Dialog di conferma riutilizzabile
│       └── services/
│           ├── account          # HTTP service conti
│           ├── transaction      # HTTP service transazioni
│           ├── category         # HTTP service categorie
│           └── budget           # HTTP service budget
└── src/
    ├── FinanceTracker.sln
    ├── FinanceTracker.Api/              # ASP.NET Core Minimal API
    │   └── Endpoints/
    │       ├── AccountEndpoints.cs
    │       ├── TransactionEndpoints.cs
    │       ├── CategoryEndpoints.cs
    │       └── BudgetEndpoints.cs
    ├── FinanceTracker.Core/             # Domain models
    └── FinanceTracker.Infrastructure/  # EF Core, DbContext
```

## 🚀 Come avviare il progetto

### Opzione A — VS Code (consigliata)

Apri il progetto in VS Code e premi **Cmd+Shift+D**, poi seleziona **🚀 Full Stack** e clicca play. Avvia backend e frontend insieme.

### Opzione B — Terminale

**Backend**
```bash
cd src
dotnet run --project FinanceTracker.Api
# API disponibile su http://localhost:5097
```

**Frontend**
```bash
cd finance-tracker-ui
ng serve
# App disponibile su http://localhost:4200
```

## 📡 API Endpoints

| Metodo | Endpoint | Descrizione |
|---|---|---|
| GET | `/api/accounts` | Lista conti |
| POST | `/api/accounts` | Crea conto |
| DELETE | `/api/accounts/{id}` | Elimina conto |
| GET | `/api/transactions` | Lista transazioni (con category e account) |
| POST | `/api/transactions` | Crea transazione |
| DELETE | `/api/transactions/{id}` | Elimina transazione |
| GET | `/api/categories` | Lista categorie |
| POST | `/api/categories` | Crea categoria |
| DELETE | `/api/categories/{id}` | Elimina categoria |
| GET | `/api/budgets` | Lista budget (con Spent calcolato a runtime) |
| POST | `/api/budgets` | Crea budget |
| DELETE | `/api/budgets/{id}` | Elimina budget |
| GET | `/health` | Health check |

## 🗺️ Roadmap

- [x] **Fase 1** — Scaffold progetto, modelli di dominio, EF Core + SQLite
- [x] **Fase 2** — UI Angular con Dashboard, Conti, Transazioni (lista)
- [x] **Fase 3** — Form dialogs per aggiunta conti e transazioni, delete con conferma
- [x] **Fase 4** — Pagina Budget con progress bar e calcolo speso a runtime
- [ ] **Fase 5** — Integrazione Open Banking (GoCardless)
- [ ] **Fase 6** — Autenticazione JWT
- [ ] **Fase 7** — Deploy su Oracle Cloud Free Tier

## 🧱 Modelli di dominio

### Account
```csharp
Guid Id, string Name, string? BankName, decimal Balance,
string Currency, string? Iban, string? ExternalAccountId
```

### Transaction
```csharp
Guid Id, string Description, decimal Amount,
TransactionType Type (Income/Expense), DateTime Date,
string? Notes, Guid AccountId, Guid? CategoryId
```

### Category
```csharp
Guid Id, string Name, string Icon, string Color
```

### Budget
```csharp
Guid Id, decimal Limit, int Month, int Year, Guid CategoryId
// Calcolati a runtime: decimal Spent, decimal Remaining, bool IsOverBudget
```

## 🏷️ Categorie predefinite

| Emoji | Nome | Colore |
|---|---|---|
| 💼 | Stipendio | #22c55e |
| 🛒 | Spesa | #f97316 |
| 🍽️ | Ristorante | #ef4444 |
| 🚗 | Trasporti | #3b82f6 |
| ⚡ | Bollette | #eab308 |
| 🎬 | Svago | #a855f7 |