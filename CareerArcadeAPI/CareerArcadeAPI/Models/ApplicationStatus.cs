namespace CareerArcadeAPI.Models
{
    public enum ApplicationStatus
    {
        Pending,    // Default when an application is created.
        Reviewed,   // When the employer has reviewed the application.
        Accepted,   // When the candidate is selected.
        Rejected    // When the candidate is not selected.
    }
}
