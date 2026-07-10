using AutoMapper;
using GramApp.Domain.DTOs;
using GramApp.Domain.Interface;
using GramApp.Domain.Models;

namespace GramApp.Domain.Services;

public class CompanyService : ICompanyService
{
    private readonly ICompanyRepository _repository;
    private readonly IMapper _mapper;

    public CompanyService(ICompanyRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CompanyDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var companies = await _repository.GetAllAsync(cancellationToken);
        return _mapper.Map<IEnumerable<CompanyDto>>(companies);
    }

    public async Task<PaginatedResult<CompanyDto>> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var (items, total) = await _repository.GetPagedAsync(page, pageSize, cancellationToken);
        return new PaginatedResult<CompanyDto>
        {
            Items = _mapper.Map<IEnumerable<CompanyDto>>(items),
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        };
    }

    public async Task<CompanyDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var company = await _repository.GetByIdAsync(id, cancellationToken);
        return _mapper.Map<CompanyDto>(company);
    }

    public async Task<CompanyDto> CreateAsync(CreateCompanyDto dto, CancellationToken cancellationToken = default)
    {
        var company = _mapper.Map<Company>(dto);
        company.CreatedDate = DateTime.UtcNow;
        company.UpdatedDate = DateTime.UtcNow;
        var created = await _repository.AddAsync(company, cancellationToken);
        return _mapper.Map<CompanyDto>(created);
    }

    public async Task<CompanyDto?> UpdateAsync(int id, CreateCompanyDto dto, CancellationToken cancellationToken = default)
    {
        var existing = await _repository.GetByIdAsync(id, cancellationToken);
        if (existing is null)
        {
            return null;
        }

        _mapper.Map(dto, existing);
        existing.UpdatedDate = DateTime.UtcNow;
        var updated = await _repository.UpdateAsync(existing, cancellationToken);
        return _mapper.Map<CompanyDto>(updated);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _repository.DeleteAsync(id, cancellationToken);
    }
}
