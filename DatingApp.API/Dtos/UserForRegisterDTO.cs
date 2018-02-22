using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dtos
{
    public class UserForRegisterDTO
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(10, MinimumLength = 4, ErrorMessage = "You must specify a password bewteen 4 and 8 characters")]
        public string Password { get; set; }
    }
}