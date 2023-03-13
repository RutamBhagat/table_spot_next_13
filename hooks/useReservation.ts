import { useState } from "react";
import axios from "axios";

export default function useReservation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createReservation = async ({
    slug,
    partySize,
    time,
    day,
    bookerFirstName,
    bookerLastName,
    bookerPhone,
    bookerEmail,
    bookerOccasion,
    bookerRequest,
  }: {
    slug: string;
    partySize: string;
    time: string;
    day: string;
    bookerFirstName: string;
    bookerLastName: string;
    bookerPhone: string;
    bookerEmail: string;
    bookerOccasion: string;
    bookerRequest: string;
  }) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `/api/restaurant/${slug}/reserve`,
        { bookerFirstName, bookerLastName, bookerPhone, bookerEmail, bookerOccasion, bookerRequest },
        {
          params: {
            day: day,
            time: time,
            partySize: partySize,
          },
        }
      );
      setLoading(false);
      return response.data;
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.errorMessage);
    }
  };

  return { loading, error, createReservation };
}
