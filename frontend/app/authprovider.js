"use client";
import { Auth0Provider } from "@auth0/auth0-react";
import React from "react";

export function Auth0ProviderClient({ children }) {
  return (
    <Auth0Provider
      domain="dev-5t7vf2fdg1cniw67.us.auth0.com"
      clientId="oCZv8oI3fet1rCgpxNgZ2g5Wsa6RMQpr"
      authorizationParams={{
        redirect_uri: "http://localhost:3000/",
        audience: "https://learningmanagementsystem-api",
            scope: "openid profile email"

      }}
    >
      {children}
    </Auth0Provider>
  );
}
