using AutoMapper;
using GramApp.Domain.DTOs;
using GramApp.Domain.Interface;
using GramApp.Domain.Models;
using GramApp.Domain.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GramApp.Domain.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _context;

    public UserService(UserManager<ApplicationUser> userManager, IMapper mapper, ApplicationDbContext context)
    {
        _userManager = userManager;
        _mapper = mapper;
        _context = context;
    }

    public async Task<PaginatedResult<UserDto>> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _context.Set<ApplicationUser>()
            .AsNoTracking()
            .Include(u => u.Company)
            .Include(u => u.MenuAccess)
            .OrderBy(u => u.Email);
        var total = await query.CountAsync(cancellationToken);
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);

        return new PaginatedResult<UserDto>
        {
            Items = items.Select(ToDto),
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        };
    }

    public async Task<UserDto?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var user = await _context.Users.AsNoTracking()
            .Include(x => x.Company)
            .Include(x => x.MenuAccess)
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);
        return user is null ? null : ToDto(user);
    }

    public async Task<UserDto?> CreateAsync(CreateUserDto dto, CancellationToken cancellationToken = default)
    {
        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            CompanyId = dto.CompanyId,
            MenuAccessId = dto.IsSuperAdmin ? null : dto.MenuAccessId,
            IsSuperAdmin = dto.IsSuperAdmin,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return null;

        return await GetByIdAsync(user.Id, cancellationToken);
    }

    public async Task<UserDto?> UpdateAsync(string id, UpdateUserDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null) return null;

        user.Email = dto.Email;
        user.UserName = dto.Email;
        user.CompanyId = dto.CompanyId;
        user.MenuAccessId = dto.IsSuperAdmin ? null : dto.MenuAccessId;
        user.IsSuperAdmin = dto.IsSuperAdmin;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded) return null;

        return await GetByIdAsync(user.Id, cancellationToken);
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null) return false;

        var result = await _userManager.DeleteAsync(user);
        return result.Succeeded;
    }

    private static UserDto ToDto(ApplicationUser user) => new()
    {
        Id = user.Id,
        Email = user.Email ?? string.Empty,
        CompanyId = user.CompanyId,
        CompanyName = user.Company?.Name ?? string.Empty,
        MenuAccessId = user.MenuAccessId,
        MenuAccessName = user.MenuAccess?.Name,
        IsSuperAdmin = user.IsSuperAdmin
    };
}
