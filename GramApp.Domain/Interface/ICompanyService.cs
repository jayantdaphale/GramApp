using GramApp.Domain.DTOs;

namespace GramApp.Domain.Interface;

public interface ICompanyService
{
    Task<IEnumerable<CompanyDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<PaginatedResult<CompanyDto>> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default);
    Task<CompanyDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<CompanyDto> CreateAsync(CreateCompanyDto dto, CancellationToken cancellationToken = default);
    Task<CompanyDto?> UpdateAsync(int id, CreateCompanyDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}
