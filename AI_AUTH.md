# Auth Reference

Overview:
- Login (`POST /api/auth/login`): accepts `{ email, password }` -> returns `AuthResponseDto` with `accessToken` (JWT), `refreshToken`, `userId`, `email`, `companyId`, `isSuperAdmin`.
- Register (`POST /api/auth/register`): accepts `{ email, password, companyId }` -> creates user.
- Refresh (`POST /api/auth/refresh`): accepts `{ refreshToken }` -> returns new `accessToken` and `refreshToken`.

Token behavior:
- `accessToken` is a JWT signed with HS256 derived key; short lived (configurable minutes).
- `refreshToken` is a GUID-like string persisted in DB (`RefreshTokens` table) with expiration (default 7 days).
- On `refresh`, server revokes the old refresh token and issues a new one.

Frontend integration notes:
- `AuthService` stores the returned auth object in `localStorage` under key `auth`.
- `AuthInterceptor` attaches `Authorization: Bearer <accessToken>` to requests and attempts a refresh on 401.
- If refresh fails, the interceptor should call `AuthService.logout()` and redirect to login.

DB notes:
- Ensure migrations include creation of `RefreshTokens` table. Model: `GramApp.Domain.Models.RefreshToken`.
