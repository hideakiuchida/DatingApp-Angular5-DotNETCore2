using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    public class AuthenticationController : Controller
    {
        private readonly IAuthenticationRepository _repository;

        public AuthenticationController(IAuthenticationRepository repository)
        {
            _repository = repository;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]UserForRegisterDTO userForRegisterDTO)
        {
            userForRegisterDTO.Username = userForRegisterDTO.Username.ToLower();
            if(await _repository.UserExists(userForRegisterDTO.Username))
                return BadRequest("Username is already taken");

            var userToCreate = new User{
                UserName = userForRegisterDTO.Username
            };

            var createUser = await _repository.Register(userToCreate, userForRegisterDTO.Password);
            return Created("", createUser);
        }
    }
}