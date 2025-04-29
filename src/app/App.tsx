import { RouteProvider } from "./providers/RouteProvider"
import { QueryProvider } from "./providers/QueryProvider"
import { Header, Footer } from "../widgets"
import PostsManagerPage from "../pages/PostsManagerPage.tsx"

function App() {
  return (
    <RouteProvider>
      <QueryProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <PostsManagerPage />
          </main>
          <Footer />
        </div>
      </QueryProvider>
    </RouteProvider>
  )
}

export default App
