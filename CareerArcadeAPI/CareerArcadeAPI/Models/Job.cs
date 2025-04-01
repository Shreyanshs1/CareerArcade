using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CareerArcadeAPI.Models
{
    public class Job
    {
        [Key]
        public int Id { get; set; }

        //Title of the Job
        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        //Description of the job
        [Required]
        [MaxLength(4000)]
        public string Description { get; set; }

        //Name of the company
        [Required]
        [MaxLength(200)]
        public string Company { get; set; }

        //Location of the job
        [Required]
        [MaxLength(200)]
        public string Location { get; set; }

        //Date and time when job is posted
        public DateTime PostedOn { get; set; } = DateTime.Now;

        //Description of company
        [Required]
        [MaxLength(2000)] // Ensures reasonable length for descriptions
        public string CompanyDescription { get; set; }

        // Foreign Key: Employer who posted this job
        [ForeignKey("Employer")]
        [Required]
        public int EmployerId { get; set; }

        public User? Employer { get; set; } // Nullable to avoid issues

        // Navigation Property: A job can have many applications
        public ICollection<Application>? Applications { get; set; } = new HashSet<Application>();
    }
}
