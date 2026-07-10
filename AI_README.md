# GramApp — AI-friendly Project Summary

Short summary:
- Full-stack sample with Angular frontend (`gramapp.client`) and ASP.NET Core backend (`GramApp.Server`). Uses PostgreSQL (EF Core) and ASP.NET Identity.

Quick run (development):
- Backend: `cd GramApp.Server` then `dotnet run --urls http://localhost:5099`.
- Frontend: `cd gramapp.client` then `npm install` and `npm start` (serves at `https://127.0.0.1:64405` in dev environment).

Important project locations:
- Server project: GramApp.Server (API controllers, auth, JwtAuthService)
- Domain/data: GramApp.Domain (EF Core models, ApplicationDbContext)
- Client: gramapp.client/src (Angular app, services, components)

Auth summary:
- JWT access tokens and persisted refresh tokens are used.
- Endpoints: `/api/auth/login`, `/api/auth/register`, `/api/auth/refresh`.
- Frontend stores auth object in `localStorage` under key `auth` (contains `accessToken` and `refreshToken`).

Useful commands:
- Create EF migration: `dotnet ef migrations add <Name> -s GramApp.Server -p GramApp.Domain`
- Apply migrations: `dotnet ef database update -s GramApp.Server -p GramApp.Domain`

Notes for automation/AI:
- The server derives a 256-bit HMAC key from the configured `JwtSettings.SigningKey` to satisfy HS256 key-size requirements.
- Ensure the database is available (Postgres connection in `appsettings.Development.json`).

For more details see AI_AUTH.md and AI_DEV_NOTES.md.
