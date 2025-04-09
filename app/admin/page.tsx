import Dashboard from "./dashboard";
import { headers } from 'next/headers';

const getBookings = async () => {
  const headersList = headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/bookings`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};

export default async function Page() {
    const bookings = await getBookings();
    console.log(bookings);
    return (
    <Dashboard mockBookings={bookings.reservations}/>
  )
}

