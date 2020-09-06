using System;
using System.ComponentModel.DataAnnotations;

namespace MSME.Models
{
    public class About
    {
        [Required(ErrorMessage = "Required")]
        [EmailAddress(ErrorMessage = "The Email field is not a valid e-mail address")]
        [Display(Name = "Name")]
        public string Name { get; set; }

        
    }
}
