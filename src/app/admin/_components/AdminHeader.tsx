import type { ReactNode } from 'react'
import { AdminBackLink } from './AdminBackLink'
import { AdminSiteLink } from './AdminSiteLink'

export function AdminHeader({children,backHref='/admin',home=false,actions}:{children:ReactNode;backHref?:string;home?:boolean;actions?:ReactNode}) {
  return <header className="glass border-b border-white/50 sticky top-0 z-10">
    <div className="admin-navigation">
      <AdminBackLink href={home?'/':backHref} toSite={home}/>
      <nav className="admin-breadcrumbs" aria-label="Percorso">{children}</nav>
      <div className="admin-navigation-actions">{!home&&<AdminSiteLink/>}{actions}</div>
    </div>
  </header>
}
