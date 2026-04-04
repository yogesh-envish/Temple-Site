using TempleWebsite.Models;

namespace TempleWebsite.Services
{
    public interface IEventValidatorService
    {
        EventValidationResult Validate(IReadOnlyList<RawEventRow> rows);
    }
}
