export const brightColors = [
  "#FCFCFC",
  "#F2CE7A",
  "#A4B0ED",
  "#E3E678",
  "#B4F0F0",
  "#B5EFBF",
  "#EFB5E1",
  "#FFFDBE",
  "#FFBEBF",
  "#EFFFBE",
  "#BEFFD1",
  "#E3BEFF",
  "#FFD7BE",
  "#FFBEDD",
  "#FFBEBE",
  "#BEF1FF",
  "#EFB5B6",
];

export function getUserColor(userId: string) {
  let sum = 0;
  for (let i = 0; i < userId.length; i++) {
    sum += userId.charCodeAt(i);
  }

  const colorIndex = sum % brightColors.length;
  return brightColors[colorIndex];
}

export function getRandomColor(index: number, page: number) {
  let itemsPerPage;
  if (page === 1){
    itemsPerPage = 8;
  }else{
    itemsPerPage = 9;
  }
  const globalIndex = index + (page - 1) * itemsPerPage;
  return brightColors[globalIndex % brightColors.length];
}

