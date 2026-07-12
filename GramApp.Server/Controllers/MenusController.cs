using GramApp.Domain.Data;
using GramApp.Domain.DTOs;
using GramApp.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GramApp.Server.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MenusController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public MenusController(ApplicationDbContext context) => _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MenuDto>>> GetAll(CancellationToken cancellationToken) => Ok(
        await _context.Menus.AsNoTracking().OrderBy(x => x.MenuGroup!.SortOrder).ThenBy(x => x.SortOrder).ThenBy(x => x.Name)
            .Select(x => new MenuDto { Id = x.Id, MenuGroupId = x.MenuGroupId, MenuGroupName = x.MenuGroup!.Name, Name = x.Name, Code = x.Code, Icon = x.Icon, SortOrder = x.SortOrder, IsActive = x.IsActive })
            .ToListAsync(cancellationToken));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<MenuDto>> Get(int id, CancellationToken cancellationToken)
    {
        var dto = await _context.Menus.AsNoTracking().Where(x => x.Id == id)
            .Select(x => new MenuDto { Id = x.Id, MenuGroupId = x.MenuGroupId, MenuGroupName = x.MenuGroup!.Name, Name = x.Name, Code = x.Code, Icon = x.Icon, SortOrder = x.SortOrder, IsActive = x.IsActive })
            .SingleOrDefaultAsync(cancellationToken);
        return dto is null ? NotFound() : Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<MenuDto>> Create(MenuDto dto, CancellationToken cancellationToken)
    {
        if (!await _context.MenuGroups.AnyAsync(x => x.Id == dto.MenuGroupId, cancellationToken)) return BadRequest(new { message = "Select a valid menu group." });
        if (await _context.Menus.AnyAsync(x => x.Code == dto.Code, cancellationToken)) return Conflict(new { message = "A menu with this code already exists." });
        var item = new Menu { MenuGroupId = dto.MenuGroupId, Name = dto.Name.Trim(), Code = dto.Code.Trim(), Icon = dto.Icon?.Trim(), SortOrder = dto.SortOrder, IsActive = dto.IsActive };
        _context.Menus.Add(item); await _context.SaveChangesAsync(cancellationToken);
        dto.Id = item.Id;
        return CreatedAtAction(nameof(Get), new { id = item.Id }, dto);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<MenuDto>> Update(int id, MenuDto dto, CancellationToken cancellationToken)
    {
        var item = await _context.Menus.FindAsync([id], cancellationToken);
        if (item is null) return NotFound();
        if (!await _context.MenuGroups.AnyAsync(x => x.Id == dto.MenuGroupId, cancellationToken)) return BadRequest(new { message = "Select a valid menu group." });
        if (await _context.Menus.AnyAsync(x => x.Id != id && x.Code == dto.Code, cancellationToken)) return Conflict(new { message = "A menu with this code already exists." });
        item.MenuGroupId = dto.MenuGroupId; item.Name = dto.Name.Trim(); item.Code = dto.Code.Trim(); item.Icon = dto.Icon?.Trim(); item.SortOrder = dto.SortOrder; item.IsActive = dto.IsActive;
        await _context.SaveChangesAsync(cancellationToken); dto.Id = id;
        return Ok(dto);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var item = await _context.Menus.FindAsync([id], cancellationToken);
        if (item is null) return NotFound();
        _context.Menus.Remove(item); await _context.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}
