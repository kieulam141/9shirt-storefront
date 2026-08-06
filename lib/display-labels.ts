const nicheLabels: Record<string, string> = {
  Sports: 'Thể thao',
  Animal: 'Động vật',
  'Art & Music': 'Nghệ thuật & âm nhạc',
  Vintage: 'Vintage',
  Lifestyle: 'Phong cách sống',
  Fantasy: 'Huyền thoại',
}

const subNicheLabels: Record<string, string> = {
  Football: 'Bóng đá',
  Cat: 'Mèo',
  Dog: 'Chó',
  'Rabbit Playboy': 'Thỏ Playboy',
  Lion: 'Sư tử',
  Tiger: 'Hổ',
  'Animal Graphic': 'Họa tiết động vật',
  Piano: 'Piano',
  Photography: 'Nhiếp ảnh',
  Train: 'Tàu cổ điển',
  'Statement / Novelty': 'Statement nổi bật',
  'Mythology Romance': 'Thần thoại lãng mạn',
}

const productTypeLabels: Record<string, string> = {
  'Hawaiian Shirt': 'Áo Hawaii',
  'Polo Shirt': 'Áo polo',
  'T-Shirt': 'Áo thun',
  'Baseball Cap': 'Mũ lưỡi trai',
  Shorts: 'Quần short',
}

export function displayNiche(value: string): string {
  return nicheLabels[value] ?? value
}

export function displaySubNiche(value: string): string {
  return subNicheLabels[value] ?? value
}

export function displayProductType(value: string): string {
  return productTypeLabels[value] ?? value
}
