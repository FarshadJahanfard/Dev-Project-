import Dashboard from "./dashboard";
const getBookings = async () => {
  const apiEndpoint = process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000';
  const res = await fetch(`${apiEndpoint}/api/bookings`, {
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

