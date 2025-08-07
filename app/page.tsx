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
  switch(status) {
    case 'PENDING': return 'text-yellow-600';
    case 'DELIVERED': return 'text-green-600';
    case 'CANCELLED': return 'text-red-600';
    default: return 'text-gray-600';
  }
};


export default function HomePage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);

  useEffect(() => {
    fetch('http://localhost:9090/api/shipments')
      .then(res => res.json())
      .then(data => setShipments(data))
      .catch(err => console.error('Error fetching shipments:', err));
  }, []);

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
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
