'use client';

import React, { useOptimistic } from 'react';
import ReservationCard from './ReservationCard';
import { BookingType } from '@/account/reservations/types';
import { deleteBooking } from '@/_lib/actions';

//
type ReservationListProps = {
  bookings: BookingType[];
};

//
function ReservationList({ bookings }: ReservationListProps) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (bookings, bookingId) => {
      return bookings.filter((booking) => booking.id != bookingId);
    }
  );

  async function handleDelete(bookingId: number) {
    optimisticDelete(bookingId);
    await deleteBooking(bookingId);
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          onDelete={handleDelete}
          key={booking.id}
        />
      ))}
    </ul>
  );
}

export default ReservationList;
