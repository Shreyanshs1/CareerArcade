using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CareerArcadeAPI.Models;
using System.ComponentModel.DataAnnotations;

namespace CareerArcadeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/admin/dashboard
        // Returns the count of users, jobs, applications, and distinct companies from the Jobs table.
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardCounts()
        {
            var userCount = await _context.Users.CountAsync();
            var jobCount = await _context.Jobs.CountAsync();
            var applicationCount = await _context.Applications.CountAsync();
            var companyCount = await _context.Jobs.Select(j => j.Company).Distinct().CountAsync();

            return Ok(new
            {
                Users = userCount,
                Jobs = jobCount,
                Applications = applicationCount,
                Companies = companyCount
            });
        }

        // 2. GET: api/admin/companies
        // Returns the list of all distinct companies from the Jobs table.
        [HttpGet("companies")]
        public async Task<IActionResult> GetCompanies()
        {
            var companies = await _context.Jobs
                .GroupBy(j => new { j.Company, j.CompanyDescription })
                .Select(g => new
                {
                    g.Key.Company,
                    g.Key.CompanyDescription
                })
                .ToListAsync();

            return Ok(companies);
        }


        // 3. POST: api/admin/add-admin
        // Only an existing admin can add a new admin. Accepts name, email, and password.
        // Role is set to Admin by default.
        [HttpPost("add-admin")]
        public async Task<IActionResult> AddAdmin([FromBody] AddAdminDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest(new { message = "Email already exists." });

            var adminUser = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = Models.User.UserRole.Admin
            };

            _context.Users.Add(adminUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Admin added successfully", adminId = adminUser.Id });
        }

        // 4. DELETE: api/admin/job/{id}
        // Deletes a job posting.
        [HttpDelete("job/{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
                return NotFound(new { message = "Job not found" });

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Job deleted successfully" });
        }
    }

    // DTO for adding a new admin user
    public class AddAdminDto
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; }
        [Required]
        [EmailAddress]
        [MaxLength(256)]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
