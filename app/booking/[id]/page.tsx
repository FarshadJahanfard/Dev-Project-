import mysql from 'mysql2/promise';
import Image from 'next/image';

const COMPANY_EMAIL = 'contactzenflow.com@gmail.com'

const CONNECTION_PARAMS = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'ZenFlow'
}

export default async function Booking({params}: {params: {id: string}}) {
    const booking_id = params.id;
    console.log('Booking ID:', booking_id);
    const connection = await mysql.createConnection(CONNECTION_PARAMS); // Create a connection to the database
            
    const [bookings] = await connection.query<any>('SELECT booking_date, booking_time, guests, CUSTOMERS.name FROM BOOKINGS INNER JOIN CUSTOMERS ON BOOKINGS.customer_id=CUSTOMERS.customer_id AND BOOKINGS.booking_id=?', [params.id]);
    console.log('Booking:', bookings[0]);
    connection.end();
    const booking = bookings[0];


    return (
        <div
        style={{
          fontFamily: 'Arial, sans-serif',
          maxWidth: '600px',
          margin: '0 auto',
          padding: '20px',
          backgroundColor: '#ffffff',
          color: '#333333'
        }}
      >
        <a href="/" style={{ textDecoration: 'none', color: '#3182ce' }}>Go Back</a>
          <Image
            src={"/zenflow.png"}
            alt="ZenFlow Logo"
            width="150"
            height="150"
            style={{ marginInline: 'auto', marginBottom: '30px'}}
          />
  
        <div
          style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '5px',
            marginBottom: '20px',
            textAlign: 'center'
          }}
        >
          <h1
            style={{
              color: '#4a5568',
              fontSize: '24px',
              margin: '0 0 10px 0'
            }}
          >
            Booking Confirmation
          </h1>
          <p style={{ fontSize: '16px', margin: 0 }}>
            Thank you for your booking!
          </p>
        </div>
  
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '16px', lineHeight: 1.5 }}>
            Hello {booking.name.trim()},
          </p>
          <p style={{ fontSize: '16px', lineHeight: 1.5 }}>
            Your booking has been confirmed. Here are the details:
          </p>
        </div>
  
        <div
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: '5px',
            padding: '20px',
            marginBottom: '30px'
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: '10px 0',
                    borderBottom: '1px solid #e2e8f0',
                    fontWeight: 'bold',
                    color: '#4a5568'
                  }}
                >
                  Date:
                </td>
                <td
                  style={{
                    padding: '10px 0',
                    borderBottom: '1px solid #e2e8f0'
                  }}
                >
                  {new Date(booking.booking_date).toLocaleDateString()}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: '10px 0',
                    borderBottom: '1px solid #e2e8f0',
                    fontWeight: 'bold',
                    color: '#4a5568'
                  }}
                >
                  Time:
                </td>
                <td
                  style={{
                    padding: '10px 0',
                    borderBottom: '1px solid #e2e8f0'
                  }}
                >
                  {booking.booking_time}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: '10px 0',
                    borderBottom: '1px solid #e2e8f0',
                    fontWeight: 'bold',
                    color: '#4a5568'
                  }}
                >
                  Number of Guests:
                </td>
                <td
                  style={{
                    padding: '10px 0',
                    borderBottom: '1px solid #e2e8f0'
                  }}
                >
                  {booking.guests}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: '10px 0',
                    fontWeight: 'bold',
                    color: '#4a5568'
                  }}
                >
                  Reference:
                </td>
                <td style={{ padding: '10px 0' }}>
                  {booking_id}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div style={{ marginBottom: '30px' }}>
          <h2
            style={{
              fontSize: '18px',
              color: '#4a5568',
              marginBottom: '10px'
            }}
          >
            What’s Next?
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.5 }}>
            If you need to reschedule or cancel your booking, please contact us at least 24 hours in advance.
          </p>
        </div>
  
        <div
          style={{
            borderTop: '1px solid #e2e8f0',
            paddingTop: '20px',
            textAlign: 'center',
            color: '#718096',
            fontSize: '14px'
          }}
        >
          <p>
            If you have any questions, please contact us via{' '}
            <a
              href={`mailto:${COMPANY_EMAIL}`}
              style={{ color: '#3182ce', textDecoration: 'none' }}
            >
              email
            </a>
          </p>
          <p style={{ marginTop: '10px' }}>
            &copy; {new Date().getFullYear()} ZenFlow. All rights reserved.
          </p>
        </div>
      </div>
    );
}