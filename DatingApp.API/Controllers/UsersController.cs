using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Repositories.Dating;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [ServiceFilter(typeof(LogUserActivity))]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly IDatingRepository repository;
        private readonly IMapper mapper;
        public UsersController(IDatingRepository repository, IMapper mapper)
        {
            this.mapper = mapper;
            this.repository = repository;

        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await this.repository.GetUsers();
            var usersToReturn = this.mapper.Map<IEnumerable<UserForListDto>>(users);
            return Ok(usersToReturn);
        }

        [HttpGet("{id}", Name="GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await this.repository.GetUser(id);
            var userToReturn = this.mapper.Map<UserForDetailDto>(user);
            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
         public async Task<IActionResult> UpdateUser(int id, [FromBody] UserForUpdateDto userForUpdateDto)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var userFromRepo = await this.repository.GetUser(id);

            if(userFromRepo==null)
                return NotFound($"Could not find user with an ID of {id}");

            if(currentUserId != userFromRepo.ID)
                return Unauthorized();

            this.mapper.Map(userForUpdateDto, userFromRepo);

            if(await repository.SaveAll())
                return NoContent();

            throw new Exception($"Updating user {id} failed on save");
        }
    }
}