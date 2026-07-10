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

        var query = _context.Set<ApplicationUser>().AsNoTracking().OrderBy(u => u.Email);
        var total = await query.CountAsync(cancellationToken);
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);

        return new PaginatedResult<UserDto>
        {
            Items = _mapper.Map<IEnumerable<UserDto>>(items),
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        };
    }

    public async Task<UserDto?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(id);
        return _mapper.Map<UserDto>(user);
    }

    public async Task<UserDto?> CreateAsync(CreateUserDto dto, CancellationToken cancellationToken = default)
    {
        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            CompanyId = dto.CompanyId,
            IsSuperAdmin = dto.IsSuperAdmin,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return null;

        return _mapper.Map<UserDto>(user);
    }

    public async Task<UserDto?> UpdateAsync(string id, UpdateUserDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null) return null;

        user.Email = dto.Email;
        user.UserName = dto.Email;
        user.CompanyId = dto.CompanyId;
        user.IsSuperAdmin = dto.IsSuperAdmin;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded) return null;

        return _mapper.Map<UserDto>(user);
    }

    public async Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user is null) return false;

        var result = await _userManager.DeleteAsync(user);
        return result.Succeeded;
    }
}
