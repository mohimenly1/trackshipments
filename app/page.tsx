'use client';

import { useEffect, useState } from 'react';

type Shipment = {
  id: number;
  code: string | null;
  description: string | null;
  shipmentStatus: string | null;
  deliveryPrice: number | null;
  cityName: string | null;
  customerName: string | null;
  paymentAmount: number | null;
  paymentStatus: string | null;
};

const getStatusColor = (status: string | null) => {
  switch (status) {
    case 'PENDING':
      return 'text-yellow-600';
    case 'DELIVERED':
      return 'text-green-600';
    case 'CANCELLED':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

export default function HomePage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [newStatus, setNewStatus] = useState<string>('PENDING');
  const [showModal, setShowModal] = useState(false);

  const fetchShipments = () => {
    fetch('http://localhost:9090/api/shipments')
      .then((res) => res.json())
      .then((data) => setShipments(data))
      .catch((err) => console.error('Error fetching shipments:', err));
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleChangeStatus = async () => {
    if (!selectedShipment) return;

    try {
      const res = await fetch(
        `http://localhost:9090/api/shipments/${selectedShipment.id}/status?status=${newStatus}`,
        {
          method: 'PUT',
        }
      );

      if (!res.ok) throw new Error('فشل التحديث');

      setShowModal(false);
      fetchShipments(); // إعادة تحميل البيانات بعد التحديث
    } catch (err) {
      alert('حدث خطأ أثناء تحديث الحالة');
    }
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">قائمة الشحنات</h1>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">رقم التتبع</th>
            <th className="border p-2">الوصف</th>
            <th className="border p-2">الحالة</th>
            <th className="border p-2">سعر التوصيل (د.ل)</th>
            <th className="border p-2">المدينة</th>
            <th className="border p-2">الزبون</th>
            <th className="border p-2">المبلغ المدفوع (د.ل)</th>
            <th className="border p-2">حالة الدفع</th>
            <th className="border p-2">إجراء</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((shipment) => (
            <tr key={shipment.id} className="text-center even:bg-gray-50">
              <td className="border p-2">{shipment.code ?? 'غير متوفر'}</td>
              <td className="border p-2">{shipment.description ?? 'لا يوجد وصف'}</td>
              <td className={`border p-2 ${getStatusColor(shipment.shipmentStatus)}`}>
                {shipment.shipmentStatus ?? 'غير معروف'}
              </td>
              <td className="border p-2">{shipment.deliveryPrice ?? '-'}</td>
              <td className="border p-2">{shipment.cityName ?? '-'}</td>
              <td className="border p-2">{shipment.customerName ?? '-'}</td>
              <td className="border p-2">{shipment.paymentAmount ?? '0'}</td>
              <td className="border p-2">{shipment.paymentStatus ?? 'لم يتم الدفع'}</td>
              <td className="border p-2">
                <button
                  onClick={() => {
                    setSelectedShipment(shipment);
                    setNewStatus(shipment.shipmentStatus || 'PENDING');
                    setShowModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  تغيير الحالة
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && selectedShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">تغيير حالة الشحنة: {selectedShipment.code}</h2>

            <label className="block mb-2">اختر الحالة الجديدة:</label>
            <select
              className="w-full border p-2 rounded mb-4"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="PENDING">قيد الانتظار</option>
              <option value="IN_TRANSIT">قيد التوصيل</option>
              <option value="DELIVERED">تم التوصيل</option>
              <option value="CANCELLED">ألغيت</option>
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                إلغاء
              </button>
              <button
                onClick={handleChangeStatus}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
