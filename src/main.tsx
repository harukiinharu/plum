import { createRoot } from 'react-dom/client'
import Plum from './components/Plum'
import '@/global.css'

const App: React.FC = () => {
  return (
    <>
      <Plum></Plum>
      <div className='flex flex-col justify-center items-center min-h-screen'>
        <h1 className='text-4xl'>
          <a href='https://harukiinharu.vercel.app'>春木Haruki</a>
        </h1>
      </div>
    </>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
