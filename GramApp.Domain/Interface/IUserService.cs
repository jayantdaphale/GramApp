using GramApp.Domain.DTOs;

namespace GramApp.Domain.Interface;

public interface IUserService
{
    Task<PaginatedResult<UserDto>> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default);
    Task<UserDto?> GetByIdAsync(string id, CancellationToken cancellationToken = default);
    Task<UserDto?> CreateAsync(CreateUserDto dto, CancellationToken cancellationToken = default);
    Task<UserDto?> UpdateAsync(string id, UpdateUserDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(string id, CancellationToken cancellationToken = default);
}
