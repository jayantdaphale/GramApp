using GramApp.Domain.Data;
using GramApp.Domain.DTOs;
using GramApp.Domain.Interface;
using Microsoft.EntityFrameworkCore;

namespace GramApp.Domain.Services;

public class MenuAccessService : IMenuAccessService
{
    private readonly ApplicationDbContext _context;

    public MenuAccessService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<NavigationMenuDto>> GetAllowedMenusAsync(string userId, CancellationToken cancellationToken = default)
    {
        var user = await _context.Users.AsNoTracking()
            .Where(x => x.Id == userId)
            .Select(x => new { x.IsSuperAdmin, x.MenuAccessId })
            .SingleOrDefaultAsync(cancellationToken);

        if (user is null)
            return Array.Empty<NavigationMenuDto>();

        var query = _context.Menus.AsNoTracking()
            .Where(x => x.IsActive && x.MenuGroup != null && x.MenuGroup.IsActive);

        if (!user.IsSuperAdmin)
        {
            if (!user.MenuAccessId.HasValue)
                return Array.Empty<NavigationMenuDto>();

            var accessId = user.MenuAccessId.Value;
            query = query.Where(x => x.MenuAccessMenus.Any(link =>
                link.MenuAccessId == accessId && link.MenuAccess != null && link.MenuAccess.IsActive));
        }

        return await query
            .OrderBy(x => x.MenuGroup!.SortOrder)
            .ThenBy(x => x.MenuGroup!.Name)
            .ThenBy(x => x.SortOrder)
            .ThenBy(x => x.Name)
            .Select(x => new NavigationMenuDto
            {
                Id = x.Id,
                Name = x.Name,
                Code = x.Code,
                Icon = x.Icon,
                SortOrder = x.SortOrder,
                MenuGroupId = x.MenuGroupId,
                MenuGroupName = x.MenuGroup!.Name,
                MenuGroupSortOrder = x.MenuGroup.SortOrder
            })
            .ToListAsync(cancellationToken);
    }
}
