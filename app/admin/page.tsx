'use client'
import Dashboard from "./dashboard";
const getBookings = async () => {
  const res = await fetch(window.location.protocol + '//' + window.location.host + '/api/bookings', {
    method: 'GET',
    cache: 'no-store'
  });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}
export default async function Page() {
    const bookings = await getBookings();
    console.log(bookings);
    return (
    <Dashboard mockBookings={bookings.reservations}/>
  )
}

