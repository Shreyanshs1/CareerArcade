using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using CareerArcadeAPI.Models;

namespace CareerArcadeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/users
        // Only Admin can view the entire list of users.
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    Role = u.Role.ToString()
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/users/{id}
        // Anyone can view a user's profile.
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    Role = u.Role.ToString()
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(user);
        }

        // PUT: api/users/{id}
        // Only allow a user to update their own profile.
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto updatedUser)
        {
            int tokenUserId = GetUserIdFromToken();

            if (tokenUserId != id)
                return Forbid("You can only update your own profile.");

            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            // Update allowed fields
            user.Name = updatedUser.Name;
            user.Email = updatedUser.Email;
            // Optionally: Update password only if provided (and hash it)
            if (!string.IsNullOrEmpty(updatedUser.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updatedUser.Password);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "User updated successfully" });
        }

        // DELETE: api/users/{id}
        // Admin can delete any user.
        // A non-admin can delete only their own profile.
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteUser(int id)
        {
            int tokenUserId = GetUserIdFromToken();
            string tokenUserRole = GetUserRoleFromToken();

            // Allow delete if user is admin or deleting their own profile
            if (tokenUserRole != "Admin" && tokenUserId != id)
            {
                return Forbid("You are not authorized to delete this user.");
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "User deleted successfully" });
        }

        // Helper method to extract the user id from the JWT token.
        private int GetUserIdFromToken()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null)
                return 0;

            var claim = identity.FindFirst(ClaimTypes.NameIdentifier);
            return claim != null ? int.Parse(claim.Value) : 0;
        }

        // Helper method to extract the user role from the JWT token.
        private string GetUserRoleFromToken()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null)
                return string.Empty;

            var claim = identity.FindFirst(ClaimTypes.Role);
            return claim?.Value ?? string.Empty;
        }
    }

    // DTO for updating a user profile.
    public class UpdateUserDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        // Optional: Include password if you want to allow password updates.
        public string Password { get; set; }
    }
}
