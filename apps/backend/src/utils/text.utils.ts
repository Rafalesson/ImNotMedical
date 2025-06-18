export function numberToWords(num: number): string {
  const numbers = [
    'zero', 'um', 'dois', 'três', 'quatro', 'cinco',
    'seis', 'sete', 'oito', 'nove', 'dez',
  ];
  return numbers[num] || num.toString();
}