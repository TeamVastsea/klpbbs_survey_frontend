import { Paged } from '@/model/paged';
import { ManagedUser, User } from '@/model/user';
import { baseFetcher } from '@/network/base';

export default class UserNetwork {
  public static login = async (token: string) => {
    const vastseaToken = await baseFetcher<string>(
      '/api/oauth',
      'GET',
      false,
      undefined,
      new URLSearchParams({ token }),
      false
    )();
    localStorage.setItem('token', vastseaToken);
  };

  public static fetchUser = baseFetcher<User>('/api/user', 'GET', true);

  public static fetchUserById = (uid: string) =>
    baseFetcher<User>(`/api/user/${encodeURIComponent(uid)}`, 'GET', true);

  public static invalidateToken = () =>
    baseFetcher<string>('/api/user', 'DELETE', true, undefined, undefined, false)();

  public static fetchManagedUsers = (page: number, size: number, search?: string) =>
    baseFetcher<Paged<ManagedUser[]>>(
      '/api/user/manage',
      'GET',
      true,
      undefined,
      new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(search?.trim() ? { search: search.trim() } : {}),
      })
    );

  public static updateManagedUser = (
    uid: string,
    update: { admin?: boolean; disabled?: boolean }
  ) =>
    baseFetcher<ManagedUser>(
      `/api/user/${encodeURIComponent(uid)}`,
      'PATCH',
      true,
      JSON.stringify(update),
      undefined,
      true,
      'application/json'
    )();

  public static invalidateUserSessions = (uid: string) =>
    baseFetcher<string>(
      `/api/user/${encodeURIComponent(uid)}/sessions`,
      'DELETE',
      true,
      undefined,
      undefined,
      false
    )();
}
