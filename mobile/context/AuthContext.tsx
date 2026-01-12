import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { authApi } from "../api/auth.api"
import { LoginDTO, RegisterDTO } from "../api/types"
import { saveToken, saveUserData, clearAuthData, markOnboardingComplete, getToken, hasSeenOnboarding } from "../utils/storage"

type AuthContextType = {
  isAuthenticated: boolean
  isOnboarded: boolean
  signIn: (credentials: LoginDTO) => Promise<void>
  signUp: (userData: RegisterDTO) => Promise<void>
  signOut: () => Promise<void>
  completeOnboarding: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isOnboarded, setIsOnboarded] = useState(false)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const token = await getToken()
      const onboardingComplete = await hasSeenOnboarding()
      
      setIsAuthenticated(!!token)
      setIsOnboarded(onboardingComplete)
    } catch (error) {
      console.error('Auth initialization error:', error)
    }
  }

  const signIn = async (credentials: LoginDTO) => {
    const authData = await authApi.login(credentials)
    await saveToken(authData.token)
    await saveUserData(authData.user)
    setIsAuthenticated(true)
    setIsOnboarded(false)
  }

  const signUp = async (userData: RegisterDTO) => {
    const authData = await authApi.register(userData)
    await saveToken(authData.token)
    await saveUserData(authData.user)
    setIsAuthenticated(true)
    setIsOnboarded(false)
  }

  const signOut = async () => {
    await clearAuthData()
    setIsAuthenticated(false)
    setIsOnboarded(false)
  }

  const completeOnboarding = async () => {
    await markOnboardingComplete()
    setIsOnboarded(true)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isOnboarded,
        signIn,
        signUp,
        signOut,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}