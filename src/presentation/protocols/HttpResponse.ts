export default interface HttpResponse {
  statusCode: number;
  body: any;
  cookie?: (key: string, value: string, options: CookieOptions) => void;
  clearCookie?: (key: string) => void;
}

interface CookieOptions {
  name?: string;
  secret?: string;
  maxAge?: number;
  signed?: boolean;
  httpOnly?: boolean;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
}
