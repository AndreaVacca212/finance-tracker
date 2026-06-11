# 💰 Finance Tracker

Personal finance tracker con Angular frontend e .NET 10 backend, con supporto futuro per Open Banking (GoCardless).

## 🛠️ Stack tecnologico

| Layer | Tecnologia |
|---|---|
| Frontend | Angular 22, Angular Material, Chart.js |
| Backend | ASP.NET Core 10 Minimal API |
| Database | SQLite + Entity Framework Core |
| Open Banking | GoCardless (fase 3) |

## 📁 Struttura del progetto

```
finance-tracker/
├── finance-tracker-ui/          # Angular 22 app
│   └── src/app/
│       ├── layout/shell         # Layout con sidebar
│       ├── pages/
│       │   ├── dashboard        # Dashboard con grafici
│       │   ├── accounts         # Lista conti
│       │   └── transactions     # Lista transazioni
│       └── services/
│           ├── account          # HTTP service conti
│           └── transaction      # HTTP service transazioni
└── src/
    ├── FinanceTracker.sln
    ├── FinanceTracker.Api/          # ASP.NET Core Minimal API
    ├── FinanceTracker.Core/         # Domain models
    └── FinanceTracker.Infrastructure/  # EF Core, DbContext
```

## 🚀 Come avviare il progetto

### Backend

```bash
cd src
dotnet run --project FinanceTracker.Api
# API disponibile su http://localhost:5097
```

### Frontend

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
| GET | `/api/transactions` | Lista transazioni |
| POST | `/api/transactions` | Crea transazione |
| DELETE | `/api/transactions/{id}` | Elimina transazione |
| GET | `/health` | Health check |

## 🗺️ Roadmap

- [x] **Fase 1** — Scaffold progetto, modelli di dominio, API mock
- [x] **Fase 2** — UI Angular con Dashboard, Conti, Transazioni
- [ ] **Fase 3** — Form aggiunta conti e transazioni
- [ ] **Fase 4** — Budget mensili con progress bar
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
Guid AccountId, Guid? CategoryId
```

### Category
```csharp
Guid Id, string Name, string Icon, string Color
```

### Budget
```csharp
Guid Id, decimal Limit, int Month, int Year, Guid CategoryId
```