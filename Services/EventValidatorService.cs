using System.Globalization;
using TempleWebsite.Models;

namespace TempleWebsite.Services
{
    public class EventValidatorService : IEventValidatorService
    {
        // Accepted date formats: dd/MM/yyyy (primary), plus common fallbacks
        private static readonly string[] DateFormats = { "dd/MM/yyyy", "d/M/yyyy", "dd-MM-yyyy", "yyyy-MM-dd" };

        private static bool TryParseDate(string? value, out DateTime result) =>
            DateTime.TryParseExact(value, DateFormats, CultureInfo.InvariantCulture, DateTimeStyles.None, out result);

        public EventValidationResult Validate(IReadOnlyList<RawEventRow> rows)
        {
            var errors = new List<ValidationError>();

            foreach (var row in rows)
            {
                if (string.IsNullOrWhiteSpace(row.Title))
                    errors.Add(new ValidationError(row.RowNumber, "Title", $"Row {row.RowNumber}: Title is required."));

                if (string.IsNullOrWhiteSpace(row.Description))
                    errors.Add(new ValidationError(row.RowNumber, "Description", $"Row {row.RowNumber}: Description is required."));

                if (string.IsNullOrWhiteSpace(row.Date))
                {
                    errors.Add(new ValidationError(row.RowNumber, "Date", $"Row {row.RowNumber}: Date is required."));
                }
                else if (!TryParseDate(row.Date, out _))
                {
                    errors.Add(new ValidationError(row.RowNumber, "Date", $"Row {row.RowNumber}: '{row.Date}' is not a valid date. Use dd/MM/yyyy format (e.g. 25/12/2026)."));
                }
            }

            if (errors.Count > 0)
                return new EventValidationResult([], errors);

            var events = rows.Select(row =>
            {
                TryParseDate(row.Date, out var eventDate);
                return new Event
                {
                    Title = row.Title!,
                    Description = row.Description!,
                    EventDate = eventDate,
                    EventTime = row.Time,
                    Day = row.Day,
                    CreatedDate = DateTime.Now
                };
            }).ToList();

            return new EventValidationResult(events, []);
        }
    }
}
