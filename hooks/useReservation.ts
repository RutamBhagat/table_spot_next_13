import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";

export default function useReservation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  type Props = {
    slug: string;
    partySize: string;
    time: string;
    day: string;
    bookerName: string;
    bookerPhone: string;
    bookerEmail: string;
    bookerOccasion: string;
    bookerRequest: string;
    setDidBook: Dispatch<SetStateAction<boolean>>;
  };

  const createReservation = async ({
    slug,
    partySize,
    time,
    day,
    bookerName,
    bookerPhone,
    bookerEmail,
    bookerOccasion,
    bookerRequest,
    setDidBook,
  }: Props) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `/api/restaurant/${slug}/reserve`,
        { bookerName, bookerPhone, bookerEmail, bookerOccasion, bookerRequest },
        {
          params: {
            day: day,
            time: time,
            partySize: partySize,
          },
        }
      );
      setLoading(false);
      setDidBook(true);
      return response.data;
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.errorMessage);
    }
  };

  return { loading, error, createReservation };
}
