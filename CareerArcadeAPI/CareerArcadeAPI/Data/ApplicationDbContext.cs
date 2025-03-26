using Microsoft.EntityFrameworkCore;

namespace CareerArcadeAPI.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<Application> Applications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Define relationships explicitly (optional, EF Core will infer these)
            modelBuilder.Entity<User>()
                .HasMany(u => u.Jobs)
                .WithOne(j => j.Employer)
                .HasForeignKey(j => j.EmployerId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascading delete

            modelBuilder.Entity<User>()
                .HasMany(u => u.Applications)
                .WithOne(a => a.JobSeeker)
                .HasForeignKey(a => a.JobSeekerId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascading delete

            modelBuilder.Entity<Job>()
                .HasMany(j => j.Applications)
                .WithOne(a => a.Job)
                .HasForeignKey(a => a.JobId)
                .OnDelete(DeleteBehavior.Cascade); // Deleting a job deletes applications
        }
    }
}
