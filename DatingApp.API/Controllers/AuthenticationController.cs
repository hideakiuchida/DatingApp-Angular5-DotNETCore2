using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using DatingApp.API.Repositories.Authentication;
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
        private readonly Seed seed;
        private readonly IMapper mapper;

        public AuthenticationController(IAuthenticationRepository repository, IConfiguration config, IMapper mapper, Seed seed)
        {
            this.mapper = mapper;
            this.seed = seed;
            _config = config;
            _repository = repository;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]UserForRegisterDTO userForRegisterDTO)
        {
            if (!string.IsNullOrEmpty(userForRegisterDTO.Password))
                userForRegisterDTO.Username = userForRegisterDTO.Username.ToLower();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            userForRegisterDTO.Username = userForRegisterDTO.Username.ToLower();
            if (await _repository.UserExists(userForRegisterDTO.Username))
                return BadRequest("Username is already taken");

            var userToCreate = this.mapper.Map<User>(userForRegisterDTO);

            var createdUser = await _repository.Register(userToCreate, userForRegisterDTO.Password);

            var userToReturn = this.mapper.Map<UserForDetailDto>(createdUser);

            return CreatedAtRoute("GetUser", new {Controller="Users", id = createdUser.ID}, userToReturn);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]UserForLoginDTO userForLoginDTO)
        {
            var userEntity = await _repository.Login(userForLoginDTO.Username.ToLower(), userForLoginDTO.Password);
            if (userEntity == null)
                return Unauthorized();

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config.GetSection("AppSettings:Token").Value);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, userEntity.ID.ToString()),
                    new Claim(ClaimTypes.Name, userEntity.UserName)
                }),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            var user = this.mapper.Map<UserForListDto>(userEntity);
            return Ok(new { tokenString, user });
        }

        [HttpGet("seed")]
        public void Seed()
        {
            this.seed.SeedUsers();
        }
    }
}