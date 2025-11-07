'use server';

import { revalidatePath } from 'next/cache';
import { auth, signIn, signOut } from './auth';
import { getBookings } from './data-service';
import { supabase } from './supabase';
import { redirect } from 'next/navigation';

// Sign in (Google)
export const signInAction = async () => {
  await signIn('google', {
    redirectTo: '/account',
  });
};

// Sign out (Google)
export const signOutAction = async () => {
  await signOut({ redirectTo: '/' });
};

// Update guest profile
export const updateGuestProfile = async (formData: FormData) => {
  const session = await auth();

  if (!session) throw new Error('You must be logged in');

  const nationalID = formData.get('nationalID');

  const nationalityValue = formData.get('nationality');

  const [nationality, countryFlag] = (nationalityValue as string).split('%');

  if (!/^[a-zA-Z0-9]{6,14}$/.test(nationalID as string))
    throw new Error('Please provide a valid national ID');

  const updatedData = { nationalID, nationality, countryFlag };

  const { error } = await supabase
    .from('guests')
    .update(updatedData)
    .eq('id', session.user.guestId);

  if (error) {
    throw new Error('Guest could not be updated');
  }

  revalidatePath('/account/profile');
};

// Create booking
type NewBookingData = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  numNights: number;
  cabinPrice: number;
  cabinId: number;
};
//
export const createBooking = async (
  bookingData: NewBookingData,
  formData: FormData
) => {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  const newBooking = {
    ...bookingData,
    numGuests: Number(formData.get('numGuests')),
    observations: formData.get('observations')?.slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    guestId: session.user.guestId,
    hasBreakfast: false,
    isPaid: false,
    status: 'unconfirmed',
  };

  const { error } = await supabase.from('bookings').insert([newBooking]);

  if (error) {
    throw new Error('Booking could not be created');
  }

  revalidatePath(`cabins/${bookingData.cabinId}`);

  redirect('/cabins/thank-you');
};

// Delete reservation
export const deleteBooking = async (bookingId: number) => {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error('You are not allowed to delete this booking');

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) {
    throw new Error('Booking could not be deleted');
  }

  revalidatePath('/account/reservations');
};

// Update reservation
export const updateBooking = async (editFormData: FormData) => {
  // 1) Authonication
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  // 2) Authorization
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  const bookingId = Number(editFormData.get('bookingId'));

  if (!guestBookingIds.includes(bookingId))
    throw new Error('You are not allowed to update this booking');

  // Update reservation data
  const numGuests = Number(editFormData.get('numGuests'));
  const observations = editFormData.get('observations')?.slice(0, 1000);
  const updateData = { numGuests, observations };

  // 4) Mutation
  const { error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', bookingId)
    .select()
    .single();

  // 5) Handle error
  if (error) throw new Error('Booking could not be updated');

  // 6) Revalidation
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath('/account/reservations');

  // 7) Redirect
  redirect('/account/reservations');
};
