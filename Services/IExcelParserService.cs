using TempleWebsite.Models;

namespace TempleWebsite.Services
{
    public interface IExcelParserService
    {
        /// <summary>
        /// Parses an Excel file stream and returns raw event rows.
        /// Throws ExcelParseException if the file cannot be read.
        /// </summary>
        IReadOnlyList<RawEventRow> Parse(Stream fileStream);
    }
}
