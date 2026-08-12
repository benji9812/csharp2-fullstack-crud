# ProductHub - Fullstack C# (.NET Web API) + React (TypeScript) Monorepo

Detta projekt är en fullstack-webbapplikation byggd i ett monorepo. Applikationen erbjuder ett komplett CRUD-system (Create, Read, Update, Delete) för att hantera ett produktkatalogsystem bestående av **Produkter** och **Kategorier** med en 1-till-många-relation.

🌐 **Deployad Frontend (Live URL)**: [https://benji9812.github.io/csharp2-fullstack-crud/](https://benji9812.github.io/csharp2-fullstack-crud/)

---

## 🚀 Tech Stack

### Backend
- **Framework**: .NET 8 Web API
- **Arkitektur**: Layered Architecture (Domain, Application, Infrastructure, Api)
- **Databas & ORM**: Entity Framework Core 8 (SQL Server / LocalDB)
- **Mönster**: Controllers + Services, Repository Pattern med `IGenericRepository<T>` och domänspecifika repositories. (Inga CQRS/MediatR-mönster).
- **DTOs**: Alla API-requests och responses använder strikt typade DTOs.
- **Dependency Injection**: Alla services och repositories registreras via interfaces (`builder.Services.AddScoped<IX, X>()`). Controllers beror endast på interfaces.
- **Enhetstester**: xUnit + NSubstitute för hårdkopplingsfri testning av affärslogik med Arrange-Act-Assert mönster.

### Frontend
- **Framework**: React 19 (TypeScript) via Vite
- **Styling**: Vanilla CSS med ett modernt mörkt glassmorphism-tema, kortlayouter, modaler och badges.
- **Icons**: Lucide React
- **Felhantering**: Visuell felbanderoll vid nätverksfel/API-avbrott samt validering i formulär.
- **Deploy**: GitHub Pages (automatiserat via GitHub Actions).

### CI/CD & DevOps
- **GitHub Actions**: Automatiserad CI-pipeline (`build-and-test.yml`) som restore:ar, bygger backend (.NET 8) och frontend samt kör xUnit-enhetstester och deployar frontend vid varje push/pull request.

---

## 📋 Uppgifts-Checklista & Status

| Krav | Status | Detaljer |
|---|---|---|
| Publikt repo med README (inkl. deploy-länk) | ✅ Godkänd | Innehåller fullständig dokumentation och live deploy-länk. |
| Minst 5 tydliga commits | ✅ Godkänd | 7+ strukturerade commits på main. |
| Connection string bekräftat SQL Server/SQL Express | ✅ Godkänd | Satt till `Server=(localdb)\mssqllocaldb;...` i `appsettings.json`. |
| React-frontend med alla CRUD-funktioner + navigation + felhantering | ✅ Godkänd | Inkluderar produkthantering, kategorifiltrering, modaler och felhantering. |
| Web API utan CQRS/MediatR, med Controllers + Services | ✅ Godkänd | Renlager-arkitektur med Controllers -> Services -> Repositories. |
| Minst 2 entiteter med 1-till-många-relation, full CRUD | ✅ Godkänd | Product & Category med `CategoryId` FK och navigerings-properties. |
| DI + Repository pattern + generic repository | ✅ Godkänd | `IGenericRepository<T>`, `ICategoryRepository`, `IProductRepository`. |
| Async/await, DTOs, interfaces genomgående | ✅ Godkänd | Alla anrop är asynkrona med genomgående DTOs & interfaces. |
| Separat xUnit-testprojekt med korrekt projektreferens | ✅ Godkänd | `backend.Tests` refererar `Application`, `Domain`, `Infrastructure`. |
| Minst 7 tester enligt Arrange-Act-Assert (med kommentarer), NSubstitute-mockning | ✅ Godkänd | 8 xUnit-tester kommenterade med `// Arrange`, `// Act`, `// Assert`. |
| Clean-arkitektur-mappstruktur (API/Application/Domain/Infrastructure) | ✅ Godkänd | Tydlig uppdelning under `backend/src/`. |
| GitHub Actions kör build + tester på varje commit, bekräftat grönt | ✅ Godkänd | Workflow `.github/workflows/build-and-test.yml`. |
| Frontend deployad online, länk verifierad fungerande | ✅ Godkänd | Live på [https://benji9812.github.io/csharp2-fullstack-crud/](https://benji9812.github.io/csharp2-fullstack-crud/). |

---

## 📁 Projektsammanfattning & Struktur

```text
csharp2-fullstack-crud/
├── .github/
│   └── workflows/
│       └── build-and-test.yml    # GitHub Actions CI/CD workflow
├── backend/
│   ├── src/
│   │   ├── Domain/                # Entiteter (Category, Product, BaseEntity)
│   │   ├── Application/           # DTOs, Interfaces, Service-implementatons
│   │   ├── Infrastructure/        # ApplicationDbContext, Repositories, Migrations
│   │   └── Api/                   # Controllers, Program.cs, Swagger, appsettings.json
│   ├── backend.sln                # .NET Solution
│   └── backend.slnx               # Visual Studio Solution XML
├── backend.Tests/                 # xUnit + NSubstitute tester
├── frontend/                      # React TypeScript frontend (Vite)
└── README.md                      # Projektdokumentation
```

---

## 🛠️ Kom igång lokalt

### Förutsättningar
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v18+) & npm
- SQL Server LocalDB eller SQL Server Express (installerat med Visual Studio / VS Code)

---

### 1. Starta Backend (.NET Web API)

Öppna en terminal i projektroten:

```bash
# Gå till API-projektet
cd backend/src/Api

# Kör migrations för att skapa databasen (om den inte skapas automatiskt på startup)
dotnet ef database update --project ../Infrastructure

# Starta API-servern
dotnet run
```

Servern startar normalt på `http://localhost:5000` eller `https://localhost:7000`.  
Swagger UI finns tillgängligt i webbläsaren på: `http://localhost:5000/swagger` (i dev-miljö).

---

### 2. Starta Frontend (React TypeScript)

Öppna en ny terminal i projektroten:

```bash
# Gå till frontend-mappen
cd frontend

# Installera beroenden (om du inte redan gjort det)
npm install

# Starta utvecklingsservern
npm run dev
```

Applikationen finns tillgänglig i webbläsaren på `http://localhost:5173`.

---

### 3. Kör Enhetstester (.NET xUnit)

För att köra backend-testerna med xUnit och NSubstitute:

```bash
dotnet test backend.Tests/backend.Tests.csproj
```

Alla 8 tester ska passera utan fel.

---

## 🔄 End-to-End CRUD Flöde

1. **Skapa Kategori**: Klicka på fliken "Kategorier" -> "Ny Kategori" -> Fyll i namn och beskrivning -> Spara.
2. **Skapa Produkt**: Klicka på "Ny Produkt" -> Välj kategori i rullgardinsmenyn, ange namn, pris och lagersaldo -> Spara.
3. **Visa & Filtrera**: Se produkter i en snygg kortvy, sök på produktnamn eller filtrera via kategorimärkena.
4. **Uppdatera Data**: Klicka på penn-ikonen på ett produkt- eller kategorikort för att redigera fälten.
5. **Ta bort Data**: Klicka på soptunne-ikonen -> Bekräfta borttagning i modalen.

---

## 🛡️ API Endpoints

### Categories Controller (`/api/categories`)
- `GET /api/categories` - Hämtar alla kategorier med antal produkter.
- `GET /api/categories/{id}` - Hämtar kategori via ID.
- `POST /api/categories` - Skapar ny kategori (CreateCategoryDto).
- `PUT /api/categories/{id}` - Uppdaterar befintlig kategori (UpdateCategoryDto).
- `DELETE /api/categories/{id}` - Tar bort kategori.

### Products Controller (`/api/products`)
- `GET /api/products?categoryId={id}` - Hämtar alla produkter (valfritt kategorifilter).
- `GET /api/products/{id}` - Hämtar produkt via ID med kategorinamn.
- `POST /api/products` - Skapar ny produkt (CreateProductDto).
- `PUT /api/products/{id}` - Uppdaterar produkt (UpdateProductDto).
- `DELETE /api/products/{id}` - Tar bort produkt.
