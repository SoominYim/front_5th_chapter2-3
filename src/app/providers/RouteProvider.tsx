import { BrowserRouter as Router } from "react-router-dom"

export const RouteProvider = ({ children }: { children: React.ReactNode }) => {
  return <Router>{children}</Router>
}
