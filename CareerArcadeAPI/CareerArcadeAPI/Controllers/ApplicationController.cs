using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using CareerArcadeAPI.Models;
using System.ComponentModel.DataAnnotations;

namespace CareerArcadeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ApplicationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Jobseeker applies for a job
        // POST: api/application/apply
        [HttpPost("apply")]
        [Authorize(Roles = "JobSeeker")]
        public async Task<IActionResult> ApplyForJob([FromBody] ApplyForJobDto dto)
        {
            // Extract the JobSeekerId from the token
            int jobSeekerId = GetUserIdFromToken();

            // Check if the job exists
            var job = await _context.Jobs.FindAsync(dto.JobId);
            if (job == null)
                return NotFound(new { message = "Job not found" });

            var application = new Application
            {
                JobId = dto.JobId,
                JobSeekerId = jobSeekerId,
                ResumeUrl = dto.ResumeUrl,
                Status = ApplicationStatus.Pending
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Application submitted successfully", applicationId = application.Id });
        }

        // Employer views applications for jobs they posted
        // GET: api/application/employer
        [HttpGet("employer")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> GetApplicationsForEmployer()
        {
            int employerId = GetUserIdFromToken();

            // Fetch applications for jobs posted by the employer
            var applications = await _context.Applications
                .Include(a => a.Job)
                .Include(a => a.JobSeeker)
                .Where(a => a.Job.EmployerId == employerId)
                .Select(a => new
                {
                    a.Id,
                    a.JobId,
                    JobTitle = a.Job.Title,
                    a.ResumeUrl,
                    a.AppliedOn,
                    a.Status,
                    JobSeeker = new
                    {
                        a.JobSeeker.Id,
                        a.JobSeeker.Name,
                        a.JobSeeker.Email
                    }
                })
                .ToListAsync();

            return Ok(applications);
        }

        // Employer updates the status of an application
        // PUT: api/application/update-status/{applicationId}
        [HttpPut("update-status/{applicationId}")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> UpdateApplicationStatus(int applicationId, [FromBody] UpdateApplicationStatusDto dto)
        {
            int employerId = GetUserIdFromToken();

            // Retrieve the application
            var application = await _context.Applications
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.Id == applicationId);

            if (application == null)
                return NotFound(new { message = "Application not found" });

            // Verify the employer owns the job related to this application
            if (application.Job.EmployerId != employerId)
                return Forbid("You can only update applications for your own job postings.");

            application.Status = dto.Status;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Application status updated successfully", applicationId, newStatus = application.Status });
        }

        // Jobseeker checks the status of their application
        // GET: api/application/my-applications
        [HttpGet("my-applications")]
        [Authorize(Roles = "JobSeeker")]
        public async Task<IActionResult> GetMyApplications()
        {
            int jobSeekerId = GetUserIdFromToken();

            var applications = await _context.Applications
                .Include(a => a.Job)
                .Where(a => a.JobSeekerId == jobSeekerId)
                .Select(a => new
                {
                    a.Id,
                    a.JobId,
                    JobTitle = a.Job.Title,
                    a.ResumeUrl,
                    a.AppliedOn,
                    a.Status
                })
                .ToListAsync();

            return Ok(applications);
        }


        // GET: api/application/job/{jobId}
        [HttpGet("job/{jobId}")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> GetJobWithApplications(int jobId)
        {
            int employerId = GetUserIdFromToken();

            var job = await _context.Jobs
                .Include(j => j.Applications)
                    .ThenInclude(a => a.JobSeeker)
                .FirstOrDefaultAsync(j => j.Id == jobId && j.EmployerId == employerId);

            if (job == null)
                return NotFound(new { message = "Job not found or access denied" });

            var result = new
            {
                job.Id,
                job.Title,
                job.Description,
                job.Company,
                job.Location,
                Applications = job.Applications.Select(a => new
                {
                    a.Id,
                    a.ResumeUrl,
                    a.AppliedOn,
                    a.Status,
                    JobSeeker = new
                    {
                        a.JobSeeker.Id,
                        a.JobSeeker.Name,
                        a.JobSeeker.Email
                    }
                })
            };

            return Ok(result);
        }



        // Helper method: Extracts user id from JWT token
        private int GetUserIdFromToken()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var claim = identity?.FindFirst(ClaimTypes.NameIdentifier);
            return claim != null ? int.Parse(claim.Value) : 0;
        }
    }

    // DTO for applying for a job
    public class ApplyForJobDto
    {
        public int JobId { get; set; }
        [Required]
        [Url]
        public string ResumeUrl { get; set; }
    }

    // DTO for updating application status
    public class UpdateApplicationStatusDto
    {
        [Required]
        public ApplicationStatus Status { get; set; }
    }
}
