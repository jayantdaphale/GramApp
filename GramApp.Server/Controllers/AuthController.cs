using GramApp.Domain.DTOs;
using GramApp.Domain.Models;
using GramApp.Domain.Data;
using GramApp.Server.DTOs;
using GramApp.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GramApp.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly JwtAuthService _jwtAuthService;
    private readonly ApplicationDbContext _context;

    public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, JwtAuthService jwtAuthService, ApplicationDbContext context)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtAuthService = jwtAuthService;
        _context = context;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user is null)
        {
            return Unauthorized(new { message = "Invalid login attempt." });
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, lockoutOnFailure: false);
        if (!result.Succeeded)
        {
            return Unauthorized(new { message = "Invalid login attempt." });
        }

        var accessToken = await _jwtAuthService.CreateAccessTokenAsync(user);
        var refreshToken = Guid.NewGuid().ToString("N");
        var refreshTokenEntity = new RefreshToken
        {
            Token = refreshToken,
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsRevoked = false
        };

        _context.RefreshTokens.Add(refreshTokenEntity);
        await _context.SaveChangesAsync();

        return Ok(new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            UserId = user.Id,
            Email = user.Email ?? string.Empty,
            CompanyId = user.CompanyId,
            IsSuperAdmin = user.IsSuperAdmin
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterUserDto dto)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            CompanyId = dto.CompanyId,
            IsSuperAdmin = false,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        return Ok(new { user.Id, user.Email, user.CompanyId });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequestDto dto)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var refreshEntity = await _context.RefreshTokens
            .FirstOrDefaultAsync(x => x.Token == dto.RefreshToken && !x.IsRevoked && x.ExpiresAt > DateTime.UtcNow);

        if (refreshEntity is null)
        {
            return Unauthorized(new { message = "Invalid refresh token." });
        }

        var user = await _userManager.FindByIdAsync(refreshEntity.UserId);
        if (user is null)
        {
            return Unauthorized(new { message = "Invalid refresh token." });
        }

        refreshEntity.IsRevoked = true;
        var newRefreshToken = Guid.NewGuid().ToString("N");
        _context.RefreshTokens.Add(new RefreshToken
        {
            Token = newRefreshToken,
            UserId = user.Id,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IsRevoked = false
        });

        await _context.SaveChangesAsync();

        return Ok(new AuthResponseDto
        {
            AccessToken = await _jwtAuthService.CreateAccessTokenAsync(user),
            RefreshToken = newRefreshToken,
            UserId = user.Id,
            Email = user.Email ?? string.Empty,
            CompanyId = user.CompanyId,
            IsSuperAdmin = user.IsSuperAdmin
        });
    }
}
