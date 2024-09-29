declare module 'jwt-decode' {
    function jwt_decode<T>(token: string): T;
    export = jwt_decode;
  }
  