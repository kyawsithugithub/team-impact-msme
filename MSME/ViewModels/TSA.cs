using System;
using System.ComponentModel.DataAnnotations;

namespace ViewModels
{
    public class  TSA
    {
        [Required(ErrorMessage = "Required")]
        [EmailAddress(ErrorMessage = "The Email field is not a valid e-mail address")]
        [Display(Name = "Name")]
        public string Name { get; set; }
    }
}
