export const padNumberWithZeros = (number: number) => {
  // 숫자를 문자열로 변환
  let numberString = number.toString();

  // 문자열의 길이가 5가 될 때까지 앞에 0을 추가
  while (numberString.length < 5) {
    numberString = '0' + numberString;
  }

  return numberString;
};
