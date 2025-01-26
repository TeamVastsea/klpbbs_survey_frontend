import {baseFetcher} from '@/network/base';
import User from "@/model/user";
import {useLocalStorage} from "@mantine/hooks";

export default class UserNetwork {

  public static login = (token: string) => {
    baseFetcher<string>("/api/oauth", "GET", false, undefined, new URLSearchParams({token}))()
      .then((token) => {
        const [, setToken] = useLocalStorage({
          key: 'token',
          defaultValue: '',
        });

        setToken(token);
      });
  }

  public static fetchUser = baseFetcher<User>("/api/user", "GET", true);
}
