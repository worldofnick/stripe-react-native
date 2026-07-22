const { readdirSync, readFileSync } = require('fs');
const { extname, join, resolve } = require('path');

const repositoryRoot = resolve(__dirname, '..');

function sourceFiles(directory, extensions) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return sourceFiles(path, extensions);
    }
    return extensions.has(extname(entry.name)) ? [path] : [];
  });
}

function matchingSources(directory, extensions, patterns) {
  return sourceFiles(directory, extensions).flatMap((file) => {
    const source = readFileSync(file, 'utf8');
    return patterns
      .filter((pattern) => pattern.test(source))
      .map((pattern) => `${file.replace(`${repositoryRoot}/`, '')}: ${pattern}`);
  });
}

describe('native Checkout decoupling', () => {
  it('does not reference Stripe Android Checkout APIs', () => {
    const matches = matchingSources(
      join(repositoryRoot, 'android', 'src', 'main'),
      new Set(['.java', '.kt']),
      [
        /com\.stripe\.android\.checkout/,
        /CheckoutSessionPreview/,
        /configureWithCheckout/,
        /checkoutInstances/,
      ]
    );

    expect(matches).toEqual([]);
  });

  it('does not reference Stripe iOS Checkout APIs', () => {
    const matches = matchingSources(
      join(repositoryRoot, 'ios'),
      new Set(['.h', '.m', '.mm', '.swift']),
      [
        /(?:^|[^+])\bCheckout\./m,
        /:\s*Checkout\b/,
        /\bCheckoutError\b/,
        /checkoutInstances/,
      ]
    );

    expect(matches).toEqual([]);
  });
});
