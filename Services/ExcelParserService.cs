using OfficeOpenXml;
using TempleWebsite.Models;

namespace TempleWebsite.Services
{
    public class ExcelParserService : IExcelParserService
    {
        public IReadOnlyList<RawEventRow> Parse(Stream fileStream)
        {
            try
            {
                ExcelPackage.License.SetNonCommercialPersonal("TempleWebsite");

                using var package = new ExcelPackage(fileStream);
                var worksheet = package.Workbook.Worksheets.FirstOrDefault();

                if (worksheet == null || worksheet.Dimension == null)
                    return Array.Empty<RawEventRow>();

                var totalRows = worksheet.Dimension.End.Row;
                var totalCols = worksheet.Dimension.End.Column;

                if (totalRows < 2)
                    return Array.Empty<RawEventRow>();

                // Build header-name → column-index map from row 1
                var headerMap = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
                for (int col = 1; col <= totalCols; col++)
                {
                    var header = worksheet.Cells[1, col].Text?.Trim();
                    if (!string.IsNullOrEmpty(header))
                        headerMap[header] = col;
                }

                // Resolve column indices by header name, fall back to positional
                int colTitle       = ResolveColumn(headerMap, new[] { "Name" },        1);
                int colDate        = ResolveColumn(headerMap, new[] { "Date" },        2);
                int colTime        = ResolveColumn(headerMap, new[] { "Time" },        3);
                int colDay         = ResolveColumn(headerMap, new[] { "Day" },         4);
                int colDescription = ResolveColumn(headerMap, new[] { "Description" }, 5);

                bool hasDayColumn = headerMap.ContainsKey("Day") || totalCols >= 4;

                var rows = new List<RawEventRow>();

                for (int row = 2; row <= totalRows; row++)
                {
                    // Stop when all cells in the row are empty
                    bool allEmpty = true;
                    for (int col = 1; col <= totalCols; col++)
                    {
                        if (!string.IsNullOrWhiteSpace(worksheet.Cells[row, col].Text))
                        {
                            allEmpty = false;
                            break;
                        }
                    }
                    if (allEmpty) break;

                    string? title       = NullIfEmpty(worksheet.Cells[row, colTitle].Text);
                    string? date        = NullIfEmpty(worksheet.Cells[row, colDate].Text);
                    string? time        = NullIfEmpty(worksheet.Cells[row, colTime].Text);
                    string? description = NullIfEmpty(worksheet.Cells[row, colDescription].Text);

                    // Day is null when column is absent or cell is empty
                    string? day = null;
                    if (colDay > 0 && colDay <= totalCols)
                        day = NullIfEmpty(worksheet.Cells[row, colDay].Text);

                    rows.Add(new RawEventRow(row, title, date, time, day, description));
                }

                return rows;
            }
            catch (ExcelParseException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new ExcelParseException("Failed to parse the Excel file.", ex);
            }
        }

        private static int ResolveColumn(Dictionary<string, int> headerMap, string[] names, int positionalFallback)
        {
            foreach (var name in names)
            {
                if (headerMap.TryGetValue(name, out int col))
                    return col;
            }
            return positionalFallback;
        }

        private static string? NullIfEmpty(string? value) =>
            string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
