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
public class MenuGroupsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public MenuGroupsController(ApplicationDbContext context) => _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MenuGroupDto>>> GetAll(CancellationToken cancellationToken) => Ok(
        await _context.MenuGroups.AsNoTracking()
            .OrderBy(x => x.SortOrder).ThenBy(x => x.Name)
            .Select(x => new MenuGroupDto { Id = x.Id, Name = x.Name, SortOrder = x.SortOrder, IsActive = x.IsActive })
            .ToListAsync(cancellationToken));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<MenuGroupDto>> Get(int id, CancellationToken cancellationToken)
    {
        var item = await _context.MenuGroups.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id, cancellationToken);
        return item is null ? NotFound() : Ok(new MenuGroupDto { Id = item.Id, Name = item.Name, SortOrder = item.SortOrder, IsActive = item.IsActive });
    }

    [HttpPost]
    public async Task<ActionResult<MenuGroupDto>> Create(MenuGroupDto dto, CancellationToken cancellationToken)
    {
        if (await _context.MenuGroups.AnyAsync(x => x.Name == dto.Name, cancellationToken))
            return Conflict(new { message = "A menu group with this name already exists." });
        var item = new MenuGroup { Name = dto.Name.Trim(), SortOrder = dto.SortOrder, IsActive = dto.IsActive };
        _context.MenuGroups.Add(item);
        await _context.SaveChangesAsync(cancellationToken);
        dto.Id = item.Id;
        return CreatedAtAction(nameof(Get), new { id = item.Id }, dto);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<MenuGroupDto>> Update(int id, MenuGroupDto dto, CancellationToken cancellationToken)
    {
        var item = await _context.MenuGroups.FindAsync([id], cancellationToken);
        if (item is null) return NotFound();
        if (await _context.MenuGroups.AnyAsync(x => x.Id != id && x.Name == dto.Name, cancellationToken))
            return Conflict(new { message = "A menu group with this name already exists." });
        item.Name = dto.Name.Trim(); item.SortOrder = dto.SortOrder; item.IsActive = dto.IsActive;
        await _context.SaveChangesAsync(cancellationToken);
        dto.Id = id;
        return Ok(dto);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var item = await _context.MenuGroups.Include(x => x.Menus).SingleOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (item is null) return NotFound();
        if (item.Menus.Count != 0) return Conflict(new { message = "Remove or reassign menus before deleting this group." });
        _context.MenuGroups.Remove(item);
        await _context.SaveChangesAsync(cancellationToken);
        return NoContent();
    }
}
