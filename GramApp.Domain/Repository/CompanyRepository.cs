using GramApp.Domain.Data;
using GramApp.Domain.Interface;
using GramApp.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace GramApp.Domain.Repository;

public class CompanyRepository : ICompanyRepository
{
    private readonly ApplicationDbContext _context;

    public CompanyRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<Company>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Companies.ToListAsync(cancellationToken);
    }

    public async Task<(IEnumerable<Company> Items, int TotalCount)> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _context.Companies.AsNoTracking().OrderBy(c => c.Name);
        var total = await query.CountAsync(cancellationToken);
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return (items, total);
    }

    public async Task<Company?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Companies.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    } 

    public async Task<Company> AddAsync(Company company, CancellationToken cancellationToken = default)
    {
        _context.Companies.Add(company);
        await _context.SaveChangesAsync(cancellationToken);
        return company;
    }

    public async Task<Company> UpdateAsync(Company company, CancellationToken cancellationToken = default)
    {
        _context.Companies.Update(company);
        await _context.SaveChangesAsync(cancellationToken);
        return company;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var company = await _context.Companies.FindAsync(new object?[] { id }, cancellationToken);
        if (company is null)
        {
            return false;
        }

        _context.Companies.Remove(company);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
