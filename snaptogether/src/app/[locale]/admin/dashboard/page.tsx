'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAllEvents, approveEventPayment } from '@/api/admin';
import { useLocale } from 'next-intl';

type AdminEvent = {
    _id: string;
    hostFullName: string;
    hostEmail: string;
    plan: 'free' | 'starter' | 'pro';
    isPaymentConfirmed: boolean;
    createdAt: string;
    eventCode: string;
  };

export default function AdminDashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEvents: 0,
    limit: 10,
  });

  const locale = useLocale(); // ✅ clean and reliable


  const loadEvents = async (pageToLoad = 1) => {
    try {
      const data = await fetchAllEvents(pageToLoad);
      setEvents(data.events);
      setPagination(data.pagination);
    } catch (err) {
        console.error('Failed to load events:', err);
        setError('Unauthorized or failed to fetch events.');
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
      }      
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      loadEvents(page);
    }
  }, [router, page]);

  const handleApprove = async (eventCode: string) => {
    await approveEventPayment(eventCode, locale);
    loadEvents(page);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3 border-b">User Name</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Plan</th>
              <th className="p-3 border-b">Date Created</th>
              <th className="p-3 border-b">Payment Confirmed</th>
              <th className="p-3 border-b">Approve Payment</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id} className="border-t">
                <td className="p-3">{event.hostFullName}</td>
                <td className="p-3">{event.hostEmail}</td>
                <td className="p-3 capitalize">{event.plan}</td>
                <td className="p-3">
                  {new Date(event.createdAt).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="p-3">{event.isPaymentConfirmed ? '✅' : '❌'}</td>
                <td className="p-3">
                  {event.isPaymentConfirmed ? (
                    '✅'
                  ) : event.plan !== 'free' ? (
                    <button
                      onClick={() => handleApprove(event.eventCode)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                    >
                      Approve
                    </button>
                  ) : (
                    ''
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-slate-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
            disabled={page === pagination.totalPages}
            className="bg-slate-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
