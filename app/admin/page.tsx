import Dashboard from "./dashboard";

const getBookings = async () => {
  const res = await fetch(`http://127.0.0.1/api/bookings`, {
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

