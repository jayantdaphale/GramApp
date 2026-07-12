using AutoMapper;
using GramApp.Domain.DTOs;
using GramApp.Domain.Models;

namespace GramApp.Domain.Profiles;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<ApplicationUser, UserDto>()
            .ForMember(x => x.CompanyName, opt => opt.MapFrom(x => x.Company == null ? string.Empty : x.Company.Name))
            .ForMember(x => x.MenuAccessName, opt => opt.MapFrom(x => x.MenuAccess == null ? null : x.MenuAccess.Name));
        CreateMap<CreateUserDto, ApplicationUser>();
        CreateMap<UpdateUserDto, ApplicationUser>();
    }
}
