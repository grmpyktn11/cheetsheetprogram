import './App.css'
import FileUpload from './FileUpload'
import Timer from './Timer'
import ThemeToggle from './ThemeToggle'

function App() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <header className="navbar bg-base-200 px-4">
        <div className="flex-1">
          <span className="text-xl font-[1000]">CheetSheet</span>
        </div>
        <div className="flex-none">
          <ThemeToggle />
        </div>
      </header>

      <FileUpload />

      {/* The pomodoro sits under the upload rather than beside it: the summary
          takes a while to come back, and that wait is what the timer is for. */}
      <div className="flex justify-center py-10">
        <Timer />
      </div>
    </div>
  )
}

export default App
