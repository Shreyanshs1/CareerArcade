using CareerArcadeAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CareerArcadeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto model)
        {
            if (_context.Users.Any(u => u.Email == model.Email))
            {
                return BadRequest(new { message = "Email already exists." });
            }

            var user = new User
            {
                Name = model.Name,
                Email = model.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password), // Hash password
                Role = model.Role
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new { message = "User registered successfully!" });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto model)
        {
            var user = _context.Users.SingleOrDefault(u => u.Email == model.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid credentials." });
            }

            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }

        private string GenerateJwtToken(User user)
        {
            var key = Encoding.UTF8.GetBytes("YourSuperLongSecretKeyWithMoreThan32Characters!");
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Role, user.Role.ToString())
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(3),
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
    public class RegisterDto
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; }
        [EmailAddress]
        [MaxLength(256)]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public User.UserRole Role { get; set; }
    }

    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
