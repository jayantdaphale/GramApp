using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using GramApp.Domain.Data;
using GramApp.Domain.DTOs;
using GramApp.Domain.Interface;
using GramApp.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GramApp.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MenuAccessController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IMenuAccessService _menuAccessService;

    public MenuAccessController(ApplicationDbContext context, IMenuAccessService menuAccessService)
    {
        _context = context;
        _menuAccessService = menuAccessService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MenuAccessDto>>> GetAll(CancellationToken cancellationToken) => Ok(
        await _context.MenuAccesses.AsNoTracking().OrderBy(x => x.Name)
            .Select(x => new MenuAccessDto
            {
                Id = x.Id,
                Name = x.Name,
                IsActive = x.IsActive,
                MenuIds = x.MenuAccessMenus.Select(link => link.MenuId).ToList()
            }).ToListAsync(cancellationToken));

    [HttpGet("current")]
    public async Task<ActionResult<IReadOnlyList<NavigationMenuDto>>> Current(CancellationToken cancellationToken)
    {
        var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub) ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId)) return Unauthorized();
        return Ok(await _menuAccessService.GetAllowedMenusAsync(userId, cancellationToken));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<MenuAccessDto>> Get(int id, CancellationToken cancellationToken)
    {
        var dto = await _context.MenuAccesses.AsNoTracking().Where(x => x.Id == id)
            .Select(x => new MenuAccessDto { Id = x.Id, Name = x.Name, IsActive = x.IsActive, MenuIds = x.MenuAccessMenus.Select(link => link.MenuId).ToList() })
            .SingleOrDefaultAsync(cancellationToken);
        return dto is null ? NotFound() : Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<MenuAccessDto>> Create(MenuAccessDto dto, CancellationToken cancellationToken)
    {
        if (await _context.MenuAccesses.AnyAsync(x => x.Name == dto.Name, cancellationToken)) return Conflict(new { message = "A menu access profile with this name already exists." });
        var menuIds = await ValidMenuIds(dto.MenuIds, cancellationToken);
        var item = new MenuAccess { Name = dto.Name.Trim(), IsActive = dto.IsActive };
        item.MenuAccessMenus = menuIds.Select(menuId => new MenuAccessMenu { MenuId = menuId }).ToList();
        _context.MenuAccesses.Add(item); await _context.SaveChangesAsync(cancellationToken);
        dto.Id = item.Id; dto.MenuIds = menuIds;
        return CreatedAtAction(nameof(Get), new { id = item.Id }, dto);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<MenuAccessDto>> Update(int id, MenuAccessDto dto, CancellationToken cancellationToken)
    {
        var item = await _context.MenuAccesses.Include(x => x.MenuAccessMenus).SingleOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (item is null) return NotFound();
        if (await _context.MenuAccesses.AnyAsync(x => x.Id != id && x.Name == dto.Name, cancellationToken)) return Conflict(new { message = "A menu access profile with this name already exists." });
        var menuIds = await ValidMenuIds(dto.MenuIds, cancellationToken);
        item.Name = dto.Name.Trim(); item.IsActive = dto.IsActive;
        _context.MenuAccessMenus.RemoveRange(item.MenuAccessMenus);
        item.MenuAccessMenus = menuIds.Select(menuId => new MenuAccessMenu { MenuAccessId = id, MenuId = menuId }).ToList();
        await _context.SaveChangesAsync(cancellationToken);
        dto.Id = id; dto.MenuIds = menuIds;
        return Ok(dto);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var item = await _context.MenuAccesses.Include(x => x.Users).SingleOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (item is null) return NotFound();
        if (item.Users.Count != 0) return Conflict(new { message = "Reassign users before deleting this access profile." });
        _context.MenuAccesses.Remove(item); await _context.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private async Task<List<int>> ValidMenuIds(IEnumerable<int> requestedIds, CancellationToken cancellationToken)
    {
        var ids = requestedIds.Distinct().ToList();
        return await _context.Menus.Where(x => ids.Contains(x.Id)).Select(x => x.Id).ToListAsync(cancellationToken);
    }
}
