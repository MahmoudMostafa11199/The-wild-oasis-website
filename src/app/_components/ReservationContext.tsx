'use client';

import {
  useState,
  createContext,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';
import { DateRange } from 'react-day-picker';

//
type ReservationContextType = {
  range: DateRange;
  setRange: Dispatch<SetStateAction<DateRange>>;
  resetRange: () => void;
};

//
const ReservationContext = createContext<ReservationContextType | undefined>(
  undefined
);

//
const initialState: DateRange = { from: undefined, to: undefined };

//
function ReservationProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState(initialState);

  const resetRange = () => setRange({ from: undefined, to: undefined });

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

//
function useReservation() {
  const context = useContext(ReservationContext);

  if (!context) throw new Error('Context was used outside provider');

  return context;
}

//
export { ReservationProvider, useReservation };
