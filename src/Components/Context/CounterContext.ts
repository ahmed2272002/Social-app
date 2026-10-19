import { createContext, type Dispatch, type SetStateAction } from "react"


type TokenContextType = {
  token : string | null ,
  setToken : Dispatch<SetStateAction<string | null>>,
}
export const CounterContext = createContext<TokenContextType | null>(null)