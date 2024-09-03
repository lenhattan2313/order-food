import { AccessToken } from "@/interface/IAuth";

class Token {
  private accessToken: string;
  private refreshToken: string;
  constructor({ accessToken, refreshToken }: AccessToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
  set(value: AccessToken) {
    this.accessToken = value.accessToken;
    this.refreshToken = value.refreshToken;
  }
  get(): AccessToken {
    return { accessToken: this.accessToken, refreshToken: this.refreshToken };
  }
}
export const sessionClient = new Token({ accessToken: "", refreshToken: "" });
