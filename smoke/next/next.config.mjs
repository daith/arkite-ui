/** @type {import('next').NextConfig} */
export default {
  // The package is a local file: link — make sure Next compiles it rather
  // than expecting a prebuilt node_modules artifact with its own setup.
  transpilePackages: ['@arkite-ui/core'],
}
