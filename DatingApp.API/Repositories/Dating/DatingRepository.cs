using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Repositories.Dating
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext context;

        public DatingRepository(DataContext context)
        {
            this.context = context;

        }
        public void Add<T>(T entity) where T : class
        {
            this.context.Add(entity);        
        }

        public void Delete<T>(T entity) where T : class
        {
            this.context.Remove(entity);
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            var photo = await this.context.Photos.FirstOrDefaultAsync(u => u.UserId == userId && u.IsMain);
            return photo;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await this.context.Photos.FirstOrDefaultAsync(u => u.ID == id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await this.context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.ID == id);
            return user;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
             var users = await this.context.Users.Include(p => p.Photos).ToListAsync();
            return users;
        }

        public async Task<bool> SaveAll()
        {
            return await this.context.SaveChangesAsync() > 0;
        }
    }
}