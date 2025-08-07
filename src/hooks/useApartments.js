import { useQuery } from "@tanstack/react-query";

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
      const res = await fetch(`https://building-management-server-woad-two.vercel.app/api/apartments?${params}`);
      return res.json();
    },
    keepPreviousData: true,
  });
};
