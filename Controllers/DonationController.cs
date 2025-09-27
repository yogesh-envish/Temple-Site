using Microsoft.AspNetCore.Mvc;
using TempleWebsite.Models;

namespace TempleWebsite.Controllers
{
    public class DonationController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Donate(Donation donation)
        {
            if (ModelState.IsValid)
            {
                donation.TransactionId = $"TXN{DateTime.Now:yyyyMMddHHmmss}{new Random().Next(1000, 9999)}";
                TempData["Success"] = $"Thank you for your generous donation of ₹{donation.Amount}. Transaction ID: {donation.TransactionId}";
                return RedirectToAction(nameof(Index));
            }
            return View("Index", donation);
        }
    }
}