import Dashboard from "./dashboard";
const getBookings = async () => {
  const res = await fetch('http://localhost:3000/api/bookings', {
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
    <Dashboard nBookings={bookings.reservations}/>
  )
}

