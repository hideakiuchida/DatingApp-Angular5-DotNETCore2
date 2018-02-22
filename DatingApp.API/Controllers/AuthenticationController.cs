using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    public class AuthenticationController : Controller
    {
        private readonly IAuthenticationRepository _repository;
        private readonly IConfiguration _config;

        public AuthenticationController(IAuthenticationRepository repository, IConfiguration config)
        {
            _config = config;
            _repository = repository;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]UserForRegisterDTO userForRegisterDTO)
        {
            userForRegisterDTO.Username = userForRegisterDTO.Username.ToLower();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            userForRegisterDTO.Username = userForRegisterDTO.Username.ToLower();
            if (await _repository.UserExists(userForRegisterDTO.Username))
                return BadRequest("Username is already taken");

            var userToCreate = new User
            {
                UserName = userForRegisterDTO.Username
            };

            var createUser = await _repository.Register(userToCreate, userForRegisterDTO.Password);
            return Created("", createUser);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]UserForLoginDTO userForLoginDTO)
        {
            var user = await _repository.Login(userForLoginDTO.Username.ToLower(), userForLoginDTO.Password);
            if (user == null)
                return Unauthorized();

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config.GetSection("AppSettings:Token").Value);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.ID.ToString()),
                    new Claim(ClaimTypes.Name, user.UserName)
                }),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new { tokenString });
        }
    }
}