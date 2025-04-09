import Dashboard from "./dashboard";

const getBookings = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings`, {
      method: 'GET',
      cache: 'no-store'
    });
    if (!res.ok) {
      throw new Error(`Fetch failed with status ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw new Error("Failed to fetch data");
  }
};

export default async function Page() {
  const bookings = await getBookings();
  console.log(bookings);
  return (
    <Dashboard mockBookings={bookings.reservations} />
  );
}
