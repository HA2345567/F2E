"use client"
import { ReactNode, useRef } from "react"
import { makeStore, RootState } from "./store"
import { Provider } from "react-redux"

interface ReduxProviderProps {
  children: ReactNode
  preloadedState?: Partial<RootState>
}

const ReduxProvider = ({ children, preloadedState }: ReduxProviderProps) => {
  const storeRef = useRef(makeStore(preloadedState))
  return <Provider store={storeRef.current}>{children}</Provider>
}

export default ReduxProvider
