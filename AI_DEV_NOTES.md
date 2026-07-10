# Dev & Troubleshooting Notes

Common issues and fixes seen in this repository:

1) JWT key length (IDX10720)
- Symmetric HS256 requires a key >= 256 bits. The server derives a 256-bit HMAC key from the configured `JwtSettings.SigningKey` using SHA256 before creating `SymmetricSecurityKey`.
- For production, use a securely stored long secret and avoid deriving if you supply a full-length base64 key.

2) File locks when rebuilding
- Stop any running `dotnet run` server processes before rebuilding to avoid MSB3027 errors. Use PowerShell: `Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*GramApp.Server*' } | Stop-Process -Force -WhatIf` (remove `-WhatIf` to actually stop).

3) Missing DB table `RefreshTokens`
- Create and apply EF Core migrations in the `GramApp.Domain`/`GramApp.Server` context. Example:

```powershell
cd D:\GitProjects\GramApp
dotnet ef migrations add AddRefreshTokens -s GramApp.Server -p GramApp.Domain -o Migrations
dotnet ef database update -s GramApp.Server -p GramApp.Domain
```

4) Ports and dev servers
- Angular dev server may prompt for an alternate port; accept if conflicts occur. Default dev server address: `https://127.0.0.1:64405/` (project-specific).
- Backend default dev URL used here: `http://localhost:5099`.

5) Package warnings
- Some NuGet packages (e.g., AutoMapper, Microsoft.OpenApi) show advisories. Review and update packages as needed.

6) Useful log checks
- Server console output shows EF queries and exceptions. Re-run server in a terminal to inspect detailed DeveloperExceptionPage traces during debugging.
