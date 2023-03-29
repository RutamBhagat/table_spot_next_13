import { useState } from "react";
import axios from "axios";
import { type Time } from "@/utils/convertToDisplayTime";

export default function useAvailabilities() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<{ time: Time; available: boolean }[] | null>(null);

  const fetchAvailabilities = async ({
    slug,
    partySize,
    time,
    day,
  }: {
    slug: string;
    partySize: string;
    time: string;
    day: string;
  }) => {
    setLoading(true);

    try {
      const response = await axios.get(`/api/restaurant/${slug}/availability`, {
        params: {
          day: day,
          time: time,
          partySize: partySize,
        },
      });
      setLoading(false);
      setData(response.data);
    } catch (error: any) {
      setLoading(false);
      setError(error.response.data.errorMessage);
    }
  };

  return { loading, error, data, fetchAvailabilities };
}

