using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using DatingApp.API.Repositories.Dating;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    public class PhotosController : Controller
    {
        private readonly IDatingRepository repository;
        private readonly IMapper mapper;
        private readonly IOptions<CloudinarySettings> cloudinaryConfig;
        private Cloudinary cloudinary;

        public PhotosController(IDatingRepository repository,
                                IMapper mapper,
                                IOptions<CloudinarySettings> cloudinaryConfig)
        {
            this.cloudinaryConfig = cloudinaryConfig;
            this.mapper = mapper;
            this.repository = repository;

            Account account = new Account(
                this.cloudinaryConfig.Value.CloudName,
                this.cloudinaryConfig.Value.ApiKey,
                this.cloudinaryConfig.Value.ApiSecret
            );

            this.cloudinary = new Cloudinary(account);
        }

        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photo = await this.repository.GetPhoto(id);

            if(photo==null)
                return NotFound("Photo not found");
            
            var photoDto = this.mapper.Map<PhotoForReturnDto>(photo);
            return Ok(photoDto);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, PhotoForCreationDto photoDto)
        {
            var user = await this.repository.GetUser(userId);
            if(user == null)
                return NotFound("User not found");

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if(currentUserId != user.ID)
                return Unauthorized();

            var file = photoDto.File;

            var uploadResult = new ImageUploadResult();

            if(file.Length > 0)
            {
                using(var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams() 
                    {
                        File = new FileDescription(file.Name, stream)
                    };
                    uploadResult = this.cloudinary.Upload(uploadParams);
                }     
            }

            photoDto.Url = uploadResult.Uri.ToString();
            photoDto.PublicId = uploadResult.PublicId;

            var photo = this.mapper.Map<Photo>(photoDto);
            photo.User = user;

            if(!user.Photos.Any(m => m.IsMain))
                photo.IsMain = true;
            
            user.Photos.Add(photo);

            if(!(await this.repository.SaveAll()))
                return BadRequest("Could not add the photo");

            var photoToReturn = this.mapper.Map<PhotoForReturnDto>(photo);

            return CreatedAtRoute("GetPhoto", new { id = photo.ID}, photoToReturn);
        }
    }
}