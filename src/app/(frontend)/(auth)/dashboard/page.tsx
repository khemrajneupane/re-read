import { redirect } from 'next/navigation'
import { getUser } from '../actions/getUser'
import UpdateForm from './components/updateForm'
import ToggleProfile from './components/toggleProfile'
import { HamburgerMenu } from './components/hamburgerMenu'
import { Customers } from '@/collections/Customers/config'
import type { Customer, TierProps } from '@/payload-types'
import { getAllCategories } from './actions/getCategories'

export default async function Page() {
  const user = (await getUser()) as Customer | null

  if (!user) {
    redirect('/login')
  }

  const tiers =
    Customers.fields
      .filter((field) => field.type === 'radio')
      .filter((field) => field.name === 'tier')[0]?.options || []
  const categories = await getAllCategories()
  return (
    <div className="flex mt-24 ">
      <main className=" max-w-md mx-auto">
        <div className=" bg-white dark:bg-black rounded-lg shadow-sm p-6 space-y-6">
          {/* Profile Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Hello, {user?.firstName || user?.email}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              You are currently on the{' '}
              <span className="font-medium capitalize text-indigo-600 dark:text-indigo-400">
                {user.tier?.toLowerCase() || 'free'}
              </span>{' '}
              tier.
            </p>
          </div>

          {/* Update Form */}
          <div className="space-y-4">
            <UpdateForm user={user} tiers={tiers as TierProps[]} />
          </div>
          {/* Toggle Profile */}
          <div className="">
            <ToggleProfile {...user} {...tiers} />
          </div>
        </div>
      </main>
      {/* Hamburger Menu and Drawer */}
      <HamburgerMenu user={user} categories={categories} />
    </div>
  )
}
