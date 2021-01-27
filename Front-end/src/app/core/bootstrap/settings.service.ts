import { Injectable } from '@angular/core';
import { LocalStorageService } from '@shared/services/storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppSettings, defaults } from '../settings';

export const USER_KEY = 'usr';
export const Receipt_KEY = 'rec';
export const URL_KEY = 'url';
export const PARAM_KEY = 'param';
export const Show_KEY = 'show';
export const REC_KEY = 'rec';

export interface User {
  id?: string;
  name?: string;
  asset?: number;
}

export interface Receipt {
  id?: number;
  debtee?: string;
  debtor?: string;
  amount?: number;
}

export interface URL {
  url?: string;
}

// export interface PARAM{
//   needsRefresh?: Boolean;
// }


@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private store: LocalStorageService) {}

  private options = defaults;

  get notify(): Observable<any> {
    return this.notify$.asObservable();
  }
  private notify$ = new BehaviorSubject<any>({});

  setLayout(options?: AppSettings): AppSettings {
    this.options = Object.assign(defaults, options);
    return this.options;
  }

  setNavState(type: string, value: boolean) {
    this.notify$.next({ type, value } as any);
  }

  getOptions(): AppSettings {
    return this.options;
  }

  get URL() {
    return "http://172.26.108.157";
  }

  /** User information */

  get user() {
    return this.store.get(USER_KEY);
  }

  setUser(value: User) {
    this.store.set(USER_KEY, value);
  }

  removeUser() {
    this.store.remove(USER_KEY);
  }

  /** Receipt */
  get usereceiptr() {
    return this.store.get(REC_KEY);
  }

  setReceipt(value: Receipt) {
    this.store.set(REC_KEY, value);
  }

  /** System language */

  get language() {
    return this.options.language;
  }

  setLanguage(lang: string) {
    this.options.language = lang;
    this.notify$.next({ lang });
  }
}


