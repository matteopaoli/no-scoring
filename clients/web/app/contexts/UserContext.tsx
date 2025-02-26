'use client'

import { Session } from "next-auth";
import { createContext } from "react";

export const UserContext = createContext<Session | null>(null);

export const UserContextProvider = (props) => (<UserContext.Provider {...props} />)
