using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CareerArcadeAPI.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        //Name of user
        [Required]
        [MaxLength(200)]
        public string Name { get; set; }

        //Email of user
        [Required]
        [EmailAddress]
        [MaxLength(256)]
        public string Email { get; set; }
        
        //Password
        [Required]
        public string PasswordHash { get; set; } // Store hashed password

        [Required]
        public UserRole Role { get; set; } // Enum for user roles

        // Navigation Property: Employer can post multiple jobs
        [JsonIgnore]
        public ICollection<Job> Jobs { get; set; } = new HashSet<Job>();

        // Navigation Property: Job Seeker can apply for multiple jobs
        public ICollection<Application>? Applications { get; set; } = new HashSet<Application>();

        //Allowed values for Role property
        public enum UserRole
        {
            Employer,
            JobSeeker,
            Admin
        }
    }
}
