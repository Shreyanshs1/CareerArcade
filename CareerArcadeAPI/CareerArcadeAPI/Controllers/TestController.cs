using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareerArcadeAPI.Controllers
{
    [Route("api/test")]
    [ApiController]
    public class TestController : ControllerBase
    {
        // Accessible only to Employers
        [HttpGet("employer")]
        [Authorize(Roles = "Employer")]
        public IActionResult EmployerOnly()
        {
            return Ok("Hello Employer! Your role-based authentication is working.");
        }

        // Accessible only to JobSeekers
        [HttpGet("jobseeker")]
        [Authorize(Roles = "JobSeeker")]
        public IActionResult JobSeekerOnly()
        {
            return Ok("Hello JobSeeker! Your role-based authentication is working.");
        }

        // Accessible only to Admins
        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public IActionResult AdminOnly()
        {
            return Ok("Hello Admin! Your role-based authentication is working.");
        }

        // Accessible to any authenticated user (regardless of role)
        [HttpGet("all")]
        [Authorize]
        public IActionResult AnyUser()
        {
            return Ok("Hello Authenticated User! This endpoint is accessible to any logged-in user.");
        }
    }
}
