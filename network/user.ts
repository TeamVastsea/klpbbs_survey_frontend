import {baseFetcher} from '@/network/base';
import User from "@/model/user";

export default class UserNetwork {

  public static login = async (token: string) => {
    const vastseaToken = await baseFetcher<string>("/api/oauth", "GET", false, undefined, new URLSearchParams({token}), false)()
    localStorage.setItem("token", vastseaToken);
  }

  public static fetchUser = baseFetcher<User>("/api/user", "GET", true);
}
