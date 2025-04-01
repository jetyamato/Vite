import { useState, useEffect } from 'react';

export const Indexlogin = () => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [barcode, setBarcode] = useState('');
  const [userFound, setUserFound] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to get the current time in 12-hour format with AM/PM
  const getCurrentTime = () => {
    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'

    return `${hours}:${minutes}:${seconds} ${ampm}`;
  };

  // Function to get the current date
  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return now.toLocaleDateString(undefined, options);
  };

  // Function to check if the barcode exists in the database
  const checkUserInDatabase = async (barcode: string) => {
    setIsLoading(true);  // Start loading

    try {
      const response = await fetch('http://localhost:5000/api/check-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ barcode }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);  // Log the response to debug

      if (data.found) {
        setUserFound(`${data.fullName} Successfully recorded time`);  // Set success message
        setBarcode('');  // Clear the barcode input field if user is found
      } else {
        setUserFound('Error: User not found');  // Set failure message
      }
    } catch (error) {
      console.error('Error:', error);  // Log error details
      setUserFound('Error occurred while checking user');
    } finally {
      setIsLoading(false);  // Stop loading
    }
  };

  // Update time and date every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTime());
      setDate(getCurrentDate());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle keypress event for checking user when Enter is pressed
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkUserInDatabase(barcode);  // Trigger the user check when Enter key is pressed
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-150 text-center">
        <input
          type="text"
          className="w-full p-4 mb-4 border-2 border-gray-300 rounded-lg"
          placeholder="Barcode here.."
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyPress={handleKeyPress} // Capture Enter key press
        />
        {isLoading && <p className="text-gray-500">Checking...</p>}
        
        {userFound && (
          <p 
            className={`mt-4 text-2xl font-bold ${userFound.includes('Success') ? 'text-green-500' : 'text-red-500'}`}
          >
            {userFound}
          </p>
        )}

        <div className="mt-4 text-sm text-gray-500">
          <h1>{date}</h1> {/* Display current date */}
          <h2>{time}</h2> {/* Display current time */}
        </div>
      </div>
    </div>
  );
};

export default Indexlogin;
