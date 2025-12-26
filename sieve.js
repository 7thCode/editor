/**
 * エラトステネスの篩で 2 以上の整数の素数一覧を返す。
 * @param {number} limit - 素数を探索する上限値 (2 以上を想定)
 * @returns {number[]} 素数の配列 (昇順)
 */
function sieveOfEratosthenes(limit) {
  if (!Number.isInteger(limit) || limit < 2) {
    return [];
  }

  const isPrime = new Array(limit + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  for (let candidate = 2; candidate * candidate <= limit; candidate += 1) {
    if (!isPrime[candidate]) {
      continue;
    }

    for (let multiple = candidate * candidate; multiple <= limit; multiple += candidate) {
      isPrime[multiple] = false;
    }
  }

  const primes = [];
  for (let n = 2; n <= limit; n += 1) {
    if (isPrime[n]) {
      primes.push(n);
    }
  }
  return primes;
}

module.exports = { sieveOfEratosthenes };

if (require.main === module) {
  const upperBound = Number.parseInt(process.argv[2] ?? '30', 10);
  console.log(sieveOfEratosthenes(upperBound).join(', '));
}
