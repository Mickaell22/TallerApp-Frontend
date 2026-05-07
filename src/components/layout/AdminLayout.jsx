import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AdminLayout({ children, active, title, subtitle }) {
  return (
    <div className="app-root">
      <Sidebar active={active} />
      <div className="main">
        <Topbar title={title} subtitle={subtitle} />
        <div className="page">
          {children}
        </div>
      </div>
    </div>
  )
}
