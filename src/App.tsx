import Plum from './components/Plum'
import TypingText from './components/TypingText'
import { useState } from 'react'

const App: React.FC = () => {
  const [typing, setTyping] = useState(false)
  const [typedOnce, setTypedOnce] = useState(false)
  return (
    <>
      <Plum></Plum>
      <div className='flex flex-col justify-center items-center min-h-screen'>
        <h1 className='text-4xl slide-enter'>
          <span>
            <span
              onClick={() => {
                if (!typedOnce) {
                  setTyping(true)
                  setTypedOnce(true)
                }
              }}
              onMouseEnter={() => {
                if (!typedOnce) {
                  setTyping(true)
                  setTypedOnce(true)
                }
              }}
            >
              春风绿地树先知
            </span>
            <TypingText
              text={'，你好，我是春木Haruki'}
              trigger={typing}
              speed={80}
              highlightStart={6}
              highlightHref={'https://haruki.blog'}
              highlightClassName={'hover:underline text-[#6ee36add]'}
            />
          </span>
        </h1>
      </div>
    </>
  )
}

export default App
