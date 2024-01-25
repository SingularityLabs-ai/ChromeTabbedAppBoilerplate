export enum BackgroundimageMode {
  Topography = 'topography',
  SlantedStars = 'slantedStars',
  Cutout = 'cutout',
  Diagonalstripes = 'diagonalstripes',
  Fallingtriangles = 'fallingtriangles',
  Floatingcogs = 'floatingcogs',
  Formalinvitation = 'formalinvitation',
  Hexagons = 'hexagons',
  Hideout = 'hideout',
  Jigsaw = 'jigsaw',
  Jupiter = 'jupiter',
  Lisbon = 'lisbon',
  Overcast = 'overcast',
  Pianoman = 'pianoman',
  Piefactory = 'piefactory',
  Squares = 'squares',
  Tinycheckers = 'tinycheckers',
  Wallpaper = 'wallpaper',
  Yyy = 'yyy',
  None = 'none',
}

function getUserBackgroundimageMode(): BackgroundimageMode {
  return (localStorage.getItem('backgroundimageMode') as BackgroundimageMode) || BackgroundimageMode.Topography
}

function setUserBackgroundimageMode(backgroundimageMode: BackgroundimageMode) {
  localStorage.setItem('backgroundimageMode', backgroundimageMode)
}

export { getUserBackgroundimageMode, setUserBackgroundimageMode }
