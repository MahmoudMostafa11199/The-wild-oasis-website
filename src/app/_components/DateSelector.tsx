'use client';

import { SettingType } from '@/_types/setting';
import { CabinType } from '@/cabins/types';
import {
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from 'date-fns';
import { type DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useReservation } from './ReservationContext';

//
function isAlreadyBooked(range: DateRange, datesArr: Date[]): boolean {
  const { from, to } = range;

  if (!from || !to) {
    return false;
  }

  return datesArr.some((date) =>
    isWithinInterval(date, { start: from, end: to })
  );
}

//
type DateSelectorProps = {
  cabin: CabinType;
  settings: SettingType;
  bockedDates: Date[];
};

function DateSelector({ cabin, settings, bockedDates }: DateSelectorProps) {
  const { range, setRange, resetRange } = useReservation();

  const { regularPrice, discount } = cabin;

  const isBooked = isAlreadyBooked(range, bockedDates);

  const displayRange = isBooked ? { from: undefined, to: undefined } : range;

  const numNights = differenceInDays(displayRange.to!, displayRange.from!);
  const cabinPrice = numNights * (regularPrice - discount);

  // SETTINGS
  const { minBookingLength, maxBookingLength } = settings;

  //
  const handleSelect = (newRange: DateRange | undefined) => {
    setRange(newRange || { from: undefined, to: undefined });
  };

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="pt-12 place-self-center"
        classNames={{
          today: `text-accent-500`,
          selected: `bg-accent-500`,
          chevron: `fill-accent-500`,
          range_start: 'bg-accent-500 rounded-s-full',
          range_middle: 'bg-accent-500',
          range_end: 'bg-accent-500 rounded-e-full',
          years_dropdown: 'bg-primary-800',
          months_dropdown: 'bg-primary-800',
        }}
        mode="range"
        min={minBookingLength + 1}
        max={maxBookingLength}
        disabled={(curDate) =>
          isPast(curDate) ||
          bockedDates.some((date) => isSameDay(date, curDate))
        }
        fromMonth={new Date()}
        toYear={new Date().getFullYear() + 5}
        selected={displayRange}
        onSelect={handleSelect}
        captionLayout="dropdown"
        numberOfMonths={2}
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{' '}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range.from || range.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
