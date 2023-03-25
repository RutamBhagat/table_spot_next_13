import { Dispatch, SetStateAction, useState } from "react";
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
    setDidBook,
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
    setDidBook: Dispatch<SetStateAction<boolean>>;
  }) => {
    setLoading(true);

    try {
      const response = await fetch(`/api/restaurant/${slug}/reserve?day=${day}&time=${time}&partySize=${partySize}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookerFirstName,
          bookerLastName,
          bookerPhone,
          bookerEmail,
          bookerOccasion,
          bookerRequest,
        }),
        cache: "no-store",
      });
      setLoading(false);
      setDidBook(true);
      return await response.json();
    } catch (error: any) {
      setLoading(false);
      setError(error.errorMessage);
    }
  };

  return { loading, error, createReservation };
}
