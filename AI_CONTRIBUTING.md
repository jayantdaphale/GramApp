# Contributing / Dev Setup

Goals:
- Provide quick steps for new contributors and tooling automation (CI / AI assistants).

Setup (local):
1. Ensure PostgreSQL is running and connection string in `GramApp.Server/appsettings.Development.json` is correct.
2. Restore and build:

```powershell
cd D:\GitProjects\GramApp
dotnet restore
dotnet build
```

3. Apply EF migrations (if not present):

```powershell
dotnet ef migrations add Initial -s GramApp.Server -p GramApp.Domain
dotnet ef database update -s GramApp.Server -p GramApp.Domain
```

4. Run backend and frontend in separate terminals:

```powershell
# backend
cd GramApp.Server
dotnet run --urls http://localhost:5099

# frontend
cd gramapp.client
npm install
npm start
```

Testing auth flow:
- Use Postman or PowerShell to POST `/api/auth/register` then `/api/auth/login` and verify `accessToken` and `refreshToken` are returned.
- Trigger a protected API call without an `Authorization` header to validate the `AuthInterceptor` and refresh flow.

When opening issues or PRs, include:
- Repro steps, terminal output, and relevant log excerpts.
- Any DB migration or seed data needed to reproduce.

If you want, I can also add these files to repository README links or update existing READMEs. Let me know.
