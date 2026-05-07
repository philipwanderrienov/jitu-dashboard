using System;
using jitu_dashboard.Server.Models;

namespace jitu_dashboard.Server.Repository.Payment;

public class PaymentRepository : IPaymentRepository
{
    public async Task<IEnumerable<PaymentModel>> retrieve()
    {
        // Simulate data retrieval with a delay
        await Task.Delay(500); // Simulate async operation

        // Return a list of dummy payment data
        // return Enumerable.Range(1, 5).Select(index => new PaymentModel
        // {
        //     Id = index,
        //     Amount = Random.Shared.Next(100, 1000),
        //     Date = DateTime.Now.AddDays(-index)
        // })
        // .ToArray();
        return null;
    }
}
