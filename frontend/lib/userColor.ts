export const brightColors = [
  "#FCFCFC",
  "#F2CE7A",
  "#A4B0ED",
  "#E3E678",
  "#B4F0F0",
  "#EFB5E1",
  "#EFB5B6",
  "#B5EFBF",
  "#FFBEBE",
  "#FFD7BE",
  "#FFFDBE",
  "#EFFFBE",
  "#BEFFD1",
  "#FFBEBF",
  "#E3BEFF",
  "#FFBEDD",
  "#BEF1FF",
];

export function getUserColor(userId: string) {
  let sum = 0;
  for (let i = 0; i < userId.length; i++) {
    sum += userId.charCodeAt(i);
  }

  const colorIndex = sum % brightColors.length;
  return brightColors[colorIndex];
}

export function getRandomColor(index: number) {
  return brightColors[index]
}
