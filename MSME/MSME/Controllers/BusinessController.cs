using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace MSME.Controllers
{
    public class BusinessController : Controller
    {
        public IActionResult Register()
        {
            ViewBag.Login = "Yes";
            return View();
        }

        public IActionResult Listing()
        {
            ViewBag.Login = "Yes";
            return View();
        }

        public IActionResult Payment()
        {
            ViewBag.Login = "Yes";
            return View();
        }
    }
}