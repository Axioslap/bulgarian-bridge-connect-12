import { useQuery, UseQueryOptions } from "@tanstack/react-query";

// Custom hook with optimized defaults for better performance
export function useOptimizedQuery<T = unknown, E = Error>(
  options: UseQueryOptions<T, E>
) {
  return useQuery({
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: 'always',
    ...options,
  });
}

export default useOptimizedQuery;