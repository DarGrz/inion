import { cookies } from 'next/headers'

export async function checkAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('admin-session')
    
    console.log('checkAdminAuth - sessionToken:', sessionToken?.value)
    
    // Sprawdź czy token istnieje i ma poprawny format
    if (!sessionToken || !sessionToken.value || !sessionToken.value.startsWith('admin_')) {
      console.log('checkAdminAuth - validation failed:', { 
        hasToken: !!sessionToken, 
        hasValue: !!sessionToken?.value, 
        startsWithAdmin: sessionToken?.value?.startsWith('admin_')
      })
      return false
    }

    console.log('checkAdminAuth - validation passed')
    // W produkcji można dodać bardziej zaawansowaną walidację tokenu
    return true
  } catch (error) {
    console.error('Auth check error:', error)
    return false
  }
}

export async function requireAdminAuth() {
  const isAuthenticated = await checkAdminAuth()
  
  if (!isAuthenticated) {
    throw new Error('Unauthorized')
  }
  
  return true
}
