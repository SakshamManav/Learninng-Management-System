"use client"
import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from 'react'

const LoginButton = () => {
  const { user, loginWithRedirect } = useAuth0();
    useEffect(() => {
        console.log(user)
    }, []);
  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

export default LoginButton;