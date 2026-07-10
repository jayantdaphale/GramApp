namespace GramApp.Server.Models;

public class JwtSettings
{
    public string Issuer { get; set; } = "GramApp";
    public string Audience { get; set; } = "GramAppUsers";
    public string SigningKey { get; set; } = "S3cureKey_ThisIsATestKey_ForDevOnly_ChangeInProduction_12345678";
    // NOTE: HS256 requires a sufficiently long secret (>= 32 bytes). Use a longer key in production.
    // Example default below is 64 characters (512 bits).
    // Replace with a secure value stored in configuration for real deployments.
    // public string SigningKey { get; set; } = "<your-secure-signing-key-goes-here>";
    public int AccessTokenExpirationMinutes { get; set; } = 60;
    public int RefreshTokenExpirationDays { get; set; } = 7;
}
