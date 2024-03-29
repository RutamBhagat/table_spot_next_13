import { useState } from "react";
import axios from "axios";

export default function useAvailabilities() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<{ time: string; available: boolean }[] | null>(null);

  type Props = {
    slug: string;
    partySize: string;
    time: string;
    day: string;
  };

  const fetchAvailabilities = async ({ slug, partySize, time, day }: Props) => {
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
