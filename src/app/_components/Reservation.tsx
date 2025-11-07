import { getBookedDatesByCabinId, getSettings } from '@/_lib/data-service';
import DateSelector from './DateSelector';
import ReservationForm from './ReservationForm';
import { CabinType } from '@/cabins/types';
import { auth } from '@/_lib/auth';
import LoginMessage from './LoginMessage';

//
type ReservationProps = {
  cabin: CabinType;
};

export default async function Reservation({ cabin }: ReservationProps) {
  const [settings, bockedDates, session] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
    auth(),
  ]);

  return (
    /*<div className="border border-primary-800 min-h-[400px]">*/
    <div className="grid grid-cols-[1.5fr_31rem] border border-primary-800 min-h-[400px] ps-1">
      <DateSelector
        cabin={cabin}
        settings={settings}
        bockedDates={bockedDates}
      />

      {session?.user ? (
        <ReservationForm cabin={cabin} user={session.user} />
      ) : (
        <LoginMessage />
      )}
    </div>
  );
}
