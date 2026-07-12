using GramApp.Domain.DTOs;

namespace GramApp.Domain.Interface;

public interface IMenuAccessService
{
    Task<IReadOnlyList<NavigationMenuDto>> GetAllowedMenusAsync(string userId, CancellationToken cancellationToken = default);
}
