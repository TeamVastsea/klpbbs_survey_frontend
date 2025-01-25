'use client';
import useSWR from "swr";
import UserNetwork from "@/network/user";

export default function useUser() {
  const {data, mutate, error} = useSWR('api_user', UserNetwork.fetchUser,  {
    onErrorRetry: () => {
      return;
    }
  });

  return {
    user: data,
    isLoading: !error && !data,
    isLoggedIn: !error && data !== undefined,
    mutate
  }
}
