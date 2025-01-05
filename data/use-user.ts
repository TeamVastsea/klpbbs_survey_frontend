'use client';
import useSWR from "swr";
import {baseFetcher} from "@/network/base";
import User from "@/model/user";

export default function useUser() {
  const {data, mutate, error} = useSWR('api_user', baseFetcher<User>("/api/user", "GET", true));

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}
