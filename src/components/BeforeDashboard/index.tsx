import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { SeedButton } from './SeedButton'
import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  const seed = false
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>📌 Welcome to the re-Read Admin Dashboard. </h4>
      </Banner>
      <p>
        This platform provides a centralized space to manage all key operations, including book
        listings, user accounts, orders, and payments. Designed for efficiency and oversight, the
        dashboard ensures smooth marketplace operations, real-time monitoring, and streamlined
        content management. Use the navigation tools to access different modules and keep the
        platform organized, transparent, and reliable.
      </p>

      {seed && <SeedButton />}
    </div>
  )
}

export default BeforeDashboard
