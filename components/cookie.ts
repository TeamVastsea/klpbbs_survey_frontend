'use client';

export class Cookie {
    static getCookie(cname: string): string {
        const name = `${cname}=`;
        const ca = document.cookie.split(';');
        for (let c of ca) {
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(name) !== -1) return c.substring(name.length, c.length);
        }
        return '';
    }

    static setCookie(name: string, value: string, days: number): void {
        const exp = new Date();
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${exp.toUTCString()};path=/`;
    }

    static clearCookie(name: string): void {
        const exp = new Date();
        exp.setTime(exp.getTime() + -1);
        document.cookie = `${name}=${encodeURIComponent('')};expires=${exp.toUTCString()}`;
    }
}
