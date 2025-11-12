import { redirect } from 'next/navigation'
import { getUser } from '../../actions/getUser'
import LoginPage from './components/LoginPageComponent'

export default async function Page() {
  const user = await getUser()

  if (user) {
    // Redirect logged-in users away from login page
    redirect('/dashboard')
  }

  // Render the client login page for non-logged-in users
  return (
    <div className="flex flex-col items-center justify-center h-auto pt-20">
      <LoginPage />
    </div>
  )
}
