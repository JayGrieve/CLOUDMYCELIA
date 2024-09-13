// 1. import `extendTheme` function
import { extendTheme } from '@chakra-ui/react'

// 2. Add your color mode config
const config = {
  initialColorMode: 'dark', // 'dark' should be lowercase
  useSystemColorMode: false,
}

// 3. extend the theme
const theme = extendTheme({ config })

export default theme
