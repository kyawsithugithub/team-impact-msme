using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace MSME.Models
{
    public class User
    {
        [Required(ErrorMessage = "Required")]
        [Display(Name = "Name")]
        public string Name { get; set; }

        [EmailAddress(ErrorMessage = "The Email field is not a valid e-mail address")]
        [Display(Name = "Email (Optional)")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Required")]
        [Display(Name = "Mobile No.")]
        public string MobileNo { get; set; }

        [Required(ErrorMessage = "Required")]
        [Display(Name = "Password PIN")]
        public string PasswordPIN { get; set; }


    }
}
