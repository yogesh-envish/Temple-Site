namespace TempleWebsite.Models
{
    public record ValidationError(int RowNumber, string FieldName, string Message);

    public record EventValidationResult(
        IReadOnlyList<Event> ValidEvents,
        IReadOnlyList<ValidationError> Errors)
    {
        public bool IsSuccess => Errors.Count == 0;
    }
}
