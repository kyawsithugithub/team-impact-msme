using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;

namespace MSME.Controllers
{
    public class UsersController : Controller
    {

        private readonly IStringLocalizer<UsersController> _localizer;


        public UsersController(IStringLocalizer<UsersController> localizer)
        {
           
            _localizer = localizer;
        }
        public IActionResult Register()
        {
            return View();
        }

        public IActionResult Activate()
        {
            return View();
        }

        public IActionResult SignIn()
        {
            return View();
        }

        public IActionResult Authenticate()
        {
            return View();
        }
    }
}