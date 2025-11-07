'use client';

import { createBooking } from '@/_lib/actions';
import { CabinType } from '@/cabins/types';
import { differenceInDays } from 'date-fns';
import Image from 'next/image';
import { useReservation } from './ReservationContext';
import UserAvatar from './UserAvatar';
import SubmitForm from './SubmitForm';

//
type ReservationFormProps = {
  cabin: CabinType;
  user: {
    name?: string | null;
    image?: string | null;
    email?: string | null;
    id?: string;
  };
};

function ReservationForm({ cabin, user }: ReservationFormProps) {
  const { range, resetRange } = useReservation();
  const { id, maxCapacity, regularPrice, discount } = cabin;

  const startDate = range.from;
  const endDate = range.to;

  const numNights = differenceInDays(endDate!, startDate!);

  const cabinPrice = numNights * (regularPrice - discount);

  const bookingData = {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    cabinId: id,
  };

  const createBookingWithData = createBooking.bind(null, bookingData);

  return (
    <div className="scale-[1.01] flex flex-col">
      <div className="bg-primary-800 text-primary-300 px-6 py-2 flex justify-between items-center">
        <p>Logged in as</p>

        <div className="flex items-center gap-2">
          {user.image ? (
            <Image
              // Important to display google profile images
              referrerPolicy="no-referrer"
              className="object-cover rounded-full"
              src={user.image}
              alt={user.name || ''}
              width={32}
              height={32}
            />
          ) : (
            <UserAvatar name={user.name} />
          )}
          <p>{user.name}</p>
        </div>
      </div>

      <form
        action={async (formData) => {
          await createBookingWithData(formData);
          resetRange();
        }}
        className="flex-1 bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          {!(startDate && endDate) ? (
            <p className="text-primary-300 text-base">
              Start by selecting dates
            </p>
          ) : (
            <SubmitForm pendingLabel="Reserving...">Reserve now</SubmitForm>
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
