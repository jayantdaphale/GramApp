using GramApp.Domain.Interface;
using Microsoft.AspNetCore.Mvc;

namespace GramApp.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenuAccessController : ControllerBase
{
    private readonly IMenuAccessService _menuAccessService;

    public MenuAccessController(IMenuAccessService menuAccessService)
    {
        _menuAccessService = menuAccessService;
    }

    [HttpGet]
    public ActionResult<IEnumerable<string>> GetMenus(bool isSuperAdmin)
    {
        return Ok(_menuAccessService.GetAllowedMenus(isSuperAdmin));
    }
}
