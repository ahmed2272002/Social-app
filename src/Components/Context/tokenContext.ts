import { createContext, useContext, type Dispatch, type SetStateAction } from "react"

type TokenContextType = {
    token : string | null,
    setToken : Dispatch<SetStateAction<string | null>>
}

export const TokenContext = createContext<TokenContextType | null>(null)



export function useAuth(){
    const context = useContext(TokenContext)

    if(!context){
        throw new Error("useAuth must be used inside AuthContextProvider")
    }

    return context;
}