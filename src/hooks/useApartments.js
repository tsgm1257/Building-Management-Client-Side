import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export const useApartments = ({ page, minRent, maxRent }) => {
  return useQuery({
    queryKey: ["apartments", page, minRent, maxRent],
    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        limit: 6,
        ...(minRent && { minRent }),
        ...(maxRent && { maxRent }),
      });

      if (!API_URL) {
        throw new Error("VITE_API_URL is not defined");
      }

      const res = await fetch(`${API_URL}/api/apartments?${params}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch apartments: ${res.status}`);
      }

      return res.json();
    },
    keepPreviousData: true,
  });
};
