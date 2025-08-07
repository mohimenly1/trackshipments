'use client';

import { useState } from 'react';

export default function UpdateShipmentStatusPage() {
  const [shipmentId, setShipmentId] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [message, setMessage] = useState('');

  const updateStatus = async () => {
    try {
      const res = await fetch(`http://localhost:9090/api/shipments/${shipmentId}/status?status=${status}`, {
        method: 'PUT',
      });

      if (!res.ok) {
        throw new Error('فشل في تحديث الحالة');
      }

      const data = await res.json();
      setMessage(`تم تحديث حالة الشحنة بنجاح إلى ${data.shipmentStatus}`);
    } catch (error: any) {
      setMessage(error.message || 'حدث خطأ غير متوقع');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto mt-12 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center mb-4">تحديث حالة الشحنة</h2>

      <div className="space-y-2">
        <label className="block text-right">رقم الشحنة:</label>
        <input
          type="text"
          value={shipmentId}
          onChange={(e) => setShipmentId(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="أدخل رقم الشحنة"
        />

        <label className="block text-right">الحالة الجديدة:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="PENDING">قيد الانتظار</option>
          <option value="IN_TRANSIT">قيد التوصيل</option>
          <option value="DELIVERED">تم التوصيل</option>
          <option value="CANCELLED">ألغيت</option>
        </select>
      </div>

      <button
        onClick={updateStatus}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        تحديث الحالة
      </button>

      {message && (
        <div className="text-center mt-4 text-green-600 font-bold">{message}</div>
      )}
    </div>
  );
}
