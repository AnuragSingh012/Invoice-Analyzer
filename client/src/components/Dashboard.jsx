import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('invoiceAnalysis');
    if (stored) {
      setInvoices(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 px-6 py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Invoice Dashboard</h2>

      {invoices.length === 0 ? (
        <p className="text-gray-600">No invoice data found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-3xl shadow-xl border border-gray-100">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 text-left text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Merchant</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date of Spend</th>
                <th className="px-6 py-4">Authenticity</th>
                <th className="px-6 py-4">Reason</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, index) => (
                <tr
                  key={index}
                  className="hover:bg-blue-50 border-b border-gray-100 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{index + 1}</td>
                  <td className="px-6 py-4">{inv.merchantName}</td>
                  <td className="px-6 py-4">{inv.totalAmount}</td>
                  <td className="px-6 py-4">{inv.dateOfSpend}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        inv.isAuthentic ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {inv.isAuthentic ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Authentic
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Fake
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-pre-wrap max-w-xs text-gray-700">
                    {inv.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
