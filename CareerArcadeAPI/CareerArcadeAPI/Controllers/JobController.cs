using CareerArcadeAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace CareerArcadeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public JobController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Get all jobs (Open to everyone)
        [HttpGet]
        public async Task<IActionResult> GetAllJobs()
        {
            var jobs = await _context.Jobs
                    .Include(j => j.Employer) // Join with Users table
                    .Select(j => new
                    {
                        j.Id,
                        j.Title,
                        j.Description,
                        j.Company,
                        j.Location,
                        j.CompanyDescription,
                        j.PostedOn,
                        j.EmployerId, // Employer's ID from Jobs table
                        Employer = j.Employer != null ? new
                        {
                            j.Employer.Id,
                            j.Employer.Name,
                            j.Employer.Email
                        } : null
                    })
            .ToListAsync();
            return Ok(jobs);
        }

        // 2. Get job by ID (Open to everyone)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetJobById(int id)
        {
            var job = await _context.Jobs
                .Include(j => j.Employer) // Join with Users table
                .Where(j => j.Id == id)
                .Select(j => new
                {
                    j.Id,
                    j.Title,
                    j.Description,
                    j.Company,
                    j.CompanyDescription,
                    j.Location,
                    j.PostedOn,
                    j.EmployerId, // Employer's ID from Jobs table
                    Employer = j.Employer != null ? new
                    {
                        j.Employer.Id,
                        j.Employer.Name,
                        j.Employer.Email
                    } : null
                })
                .FirstOrDefaultAsync();

            if (job == null)
                return NotFound(new { message = "Job not found" });

            return Ok(job);
        }


        // 3. Create a Job (Only Employers)
        [Authorize(Roles = "Employer")]
        [HttpPost]
        public async Task<IActionResult> CreateJob([FromBody] Job job)
        {
            // Extract Employer ID from JWT token
            var employerId = GetUserIdFromToken();
            if (employerId == null)
                return Unauthorized(new { message = "Invalid token" });

            job.EmployerId = employerId.Value;
            job.PostedOn = DateTime.UtcNow;

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Job posted successfully", job });
        }

        // 4. Update a Job (Only Employer who created it)
        [Authorize(Roles = "Employer")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(int id, [FromBody] Job updatedJob)
        {
            var employerId = GetUserIdFromToken();
            if (employerId == null)
                return Unauthorized(new { message = "Invalid token" });

            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
                return NotFound(new { message = "Job not found" });

            if (job.EmployerId != employerId.Value)
                return Forbid();

            job.Title = updatedJob.Title;
            job.Description = updatedJob.Description;
            job.Company = updatedJob.Company;
            job.Location = updatedJob.Location;
            job.CompanyDescription = updatedJob.CompanyDescription;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Job updated successfully", job });
        }

        // 5. Delete a Job (Only Employer who created it)
        [Authorize(Roles = "Employer")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var employerId = GetUserIdFromToken();
            if (employerId == null)
                return Unauthorized(new { message = "Invalid token" });

            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
                return NotFound(new { message = "Job not found" });

            if (job.EmployerId != employerId.Value)
                return Forbid();

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Job deleted successfully" });
        }

        //6. Search Jobs based on different queries

        [HttpGet("search")]
        public async Task<IActionResult> SearchJobs(
    [FromQuery] string? title,
    [FromQuery] string? location,
    [FromQuery] string? company,
    [FromQuery] string? employerName)
        {
            var query = _context.Jobs.Include(j => j.Employer).AsQueryable();

            if (!string.IsNullOrEmpty(title))
                query = query.Where(j => j.Title.Contains(title));

            if (!string.IsNullOrEmpty(location))
                query = query.Where(j => j.Location.Contains(location));

            if (!string.IsNullOrEmpty(company))
                query = query.Where(j => j.Company.Contains(company));

            if (!string.IsNullOrEmpty(employerName))
                query = query.Where(j => j.Employer.Name.Contains(employerName));

            var jobs = await query.ToListAsync();
            return Ok(jobs);
        }

        //7. GET: api/application/my-jobs
        [HttpGet("my-jobs")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> GetJobsByEmployer()
        {
            var employerId = GetUserIdFromToken();

            var jobs = await _context.Jobs
                .Where(j => j.EmployerId == employerId)
                .Select(j => new
                {
                    j.Id,
                    j.Title,
                    j.Description,
                    j.Company,
                    j.Location,
                    j.PostedOn
                })
                .ToListAsync();

            return Ok(jobs);
        }


        // Helper function to extract user ID from token
        private int? GetUserIdFromToken()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null)
                return null;

            var claim = identity.FindFirst(ClaimTypes.NameIdentifier);
            return claim != null ? int.Parse(claim.Value) : (int?)null;
        }
    }
}
