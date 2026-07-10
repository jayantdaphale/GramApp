using AutoMapper;
using GramApp.Domain.DTOs;
using GramApp.Domain.Models;

namespace GramApp.Domain.Profiles;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<ApplicationUser, UserDto>();
        CreateMap<CreateUserDto, ApplicationUser>();
        CreateMap<UpdateUserDto, ApplicationUser>();
    }
}
