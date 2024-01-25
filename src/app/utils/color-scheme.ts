import { ThemeMode } from '~services/theme'
import topographyBg from '~/assets/topography.svg'
import slantedStarsBg from '~/assets/slanted-stars.svg'
import cutoutBg from '~/assets/cutout.svg'
import diagonalstripesBg from '~/assets/diagonal-stripes.svg'
import fallingtrianglesBg from '~/assets/falling-triangles.svg'
import floatingcogsBg from '~/assets/floating-cogs.svg'
import formalinvitationBg from '~/assets/formal-invitation.svg'
import hexagonsBg from '~/assets/hexagons.svg'
import hideoutBg from '~/assets/hideout.svg'
import jigsawBg from '~/assets/jigsaw.svg'
import jupiterBg from '~/assets/jupiter.svg'
import lisbonBg from '~/assets/lisbon.svg'
import overcastBg from '~/assets/overcast.svg'
import pianomanBg from '~/assets/piano-man.svg'
import piefactoryBg from '~/assets/pie-factory.svg'
import squaresBg from '~/assets/squares.svg'
import tinycheckersBg from '~/assets/tiny-checkers.svg'
import wallpaperBg from '~/assets/wallpaper.svg'
import yyyBg from '~/assets/yyy.svg'
import { BackgroundimageMode } from '~services/backgroundimage'

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)'

function light() {
  document.documentElement.classList.remove('dark')
  document.documentElement.classList.add('light')
}

function dark() {
  document.documentElement.classList.remove('light')
  document.documentElement.classList.add('dark')
}

function isSystemDarkMode() {
  return !!window.matchMedia(COLOR_SCHEME_QUERY).matches
}

function colorSchemeListener(e: MediaQueryListEvent) {
  const colorScheme = e.matches ? 'dark' : 'light'
  if (colorScheme === 'dark') {
    dark()
  } else {
    light()
  }
}

function applyThemeMode(mode: ThemeMode) {
  if (mode === ThemeMode.Light) {
    light()
    window.matchMedia(COLOR_SCHEME_QUERY).removeEventListener('change', colorSchemeListener)
    return
  }

  if (mode === ThemeMode.Dark) {
    dark()
    window.matchMedia(COLOR_SCHEME_QUERY).removeEventListener('change', colorSchemeListener)
    return
  }

  if (isSystemDarkMode()) {
    dark()
  } else {
    light()
  }

  window.matchMedia(COLOR_SCHEME_QUERY).addEventListener('change', colorSchemeListener)
}

function getDefaultThemeColor() {
  return isSystemDarkMode() ? '#00D084' : '#7BDCB5'
}

function getBgImageAndColorFromBgmode(mode: BackgroundimageMode): {bgImage:any, bgColor:string} {
  let bgImage = topographyBg;
  let bgColor = '#FFFFFF';
  switch (mode) {
    case BackgroundimageMode.Topography:
      bgImage = topographyBg
      bgColor = 'ghostwhite'
      break
    case BackgroundimageMode.SlantedStars:
      bgImage = slantedStarsBg
      bgColor = 'snow'
      break
    case BackgroundimageMode.Cutout:
      bgImage = cutoutBg
      bgColor = 'ghostwhite'
      break
    case BackgroundimageMode.Diagonalstripes:
      bgImage = diagonalstripesBg
      bgColor = 'ghostwhite'
      break
    case BackgroundimageMode.Fallingtriangles:
      bgImage = fallingtrianglesBg
      bgColor = 'ghostwhite'
      break
    case BackgroundimageMode.Floatingcogs:
      bgImage = floatingcogsBg
      bgColor = 'ghostwhite'
      break
    case BackgroundimageMode.Formalinvitation:
      bgImage = formalinvitationBg
      bgColor = 'ghostwhite'
      break
    case BackgroundimageMode.Hexagons:
      bgImage = hexagonsBg
      bgColor = 'ghostwhite'
      break
    case BackgroundimageMode.Hideout:
      bgImage = hideoutBg
      bgColor = 'ghostwhite'
      break
    case BackgroundimageMode.Jigsaw:
      bgImage = jigsawBg
      bgColor = 'ghostwhite'
      break
    case BackgroundimageMode.Jupiter:
      bgImage = jupiterBg
      bgColor = 'ghostwhite'
      break
    case BackgroundimageMode.Lisbon:
      bgImage = lisbonBg
      bgColor = 'ghostwhite'
      break
    case BackgroundimageMode.Overcast:
      bgImage = overcastBg
      bgColor = 'ghostwhite'
      break
    case BackgroundimageMode.Pianoman:
      bgImage = pianomanBg
      bgColor = 'ghostwhite'
      break
    case BackgroundimageMode.Piefactory:
      bgImage = piefactoryBg
      bgColor = 'ghostwhite'
      break
    case BackgroundimageMode.Squares:
      bgImage = squaresBg
      bgColor = 'ghostwhite'
      break
    case BackgroundimageMode.Tinycheckers:
      bgImage = tinycheckersBg
      bgColor = 'ghostwhite'
      break
    case BackgroundimageMode.Wallpaper:
      bgImage = wallpaperBg
      bgColor = 'ghostwhite'
      break
    case BackgroundimageMode.Yyy:
      bgImage = yyyBg
      bgColor = 'ghostwhite'
      break
    case BackgroundimageMode.None:
      bgImage = ''
      bgColor = '#FFFFFF'
  }
  return { bgImage, bgColor }
}

function applyBackgroundimageMode(mode: BackgroundimageMode) {
  let { bgImage, bgColor } = getBgImageAndColorFromBgmode(mode);
  let visibleChatListElems = document.querySelectorAll('[class^="react-scroll-to-bottom-"]')
  visibleChatListElems.forEach((chatList:any) => {
    chatList.style.backgroundImage = `url(${bgImage})`;
    chatList.style.backgroundColor = bgColor;
    chatList.style.backgroundBlendMode = 'soft-light';
    chatList.style.backgroundBepeat = 'repeat';
  });
}

export { applyThemeMode, getDefaultThemeColor, getBgImageAndColorFromBgmode, applyBackgroundimageMode }
