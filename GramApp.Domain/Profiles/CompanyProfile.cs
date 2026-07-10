using AutoMapper;
using GramApp.Domain.DTOs;
using GramApp.Domain.Models;

namespace GramApp.Domain.Profiles;

public class CompanyProfile : Profile
{
    public CompanyProfile()
    {
        CreateMap<Company, CompanyDto>();
        CreateMap<CreateCompanyDto, Company>();
    }
}
