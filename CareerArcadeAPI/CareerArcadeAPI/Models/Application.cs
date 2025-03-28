﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CareerArcadeAPI.Models
{
    public class Application
    {
        [Key]
        public int Id { get; set; }

        // Foreign Key: Job that is applied for
        [ForeignKey("Job")]
        [Required]
        public int JobId { get; set; }

        public Job? Job { get; set; } // Nullable to prevent conflicts

        // Foreign Key: Job Seeker who applied
        [ForeignKey("JobSeeker")]
        [Required]
        public int JobSeekerId { get; set; } // More consistent naming

        public User? JobSeeker { get; set; } // Nullable to avoid issues

        [Required]
        [Url]
        [MaxLength(2048)]
        public string ResumeUrl { get; set; }

        public DateTime AppliedOn { get; set; } = DateTime.Now;

        public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;


    }
}
