namespace TempleWebsite.Services
{
    public class ExcelParseException : Exception
    {
        public ExcelParseException(string message, Exception? inner = null)
            : base(message, inner) { }
    }
}
