using System.ComponentModel.DataAnnotations;

namespace CareerArcadeAPI.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(256)]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; } // Store hashed password

        [Required]
        public UserRole Role { get; set; } // Enum for user roles

        // Navigation Property: Employer can post multiple jobs
        public ICollection<Job> Jobs { get; set; } = new HashSet<Job>();

        // Navigation Property: Job Seeker can apply for multiple jobs
        public ICollection<Application>? Applications { get; set; } = new HashSet<Application>();

        public enum UserRole
        {
            Employer,
            JobSeeker,
            Admin // Fixed typo
        }
    }
}
