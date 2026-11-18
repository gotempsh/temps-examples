// SPDX-FileCopyrightText: 2024-2026 Temps Contributors
// SPDX-License-Identifier: MIT OR Apache-2.0

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // A self-contained server bundle: the image needs no node_modules tree.
  output: 'standalone',
  // The workflows SDK is a Node server package (node:crypto, streams); keep
  // it out of the bundle and trace it into the standalone output instead.
  serverExternalPackages: ['@temps-sdk/workflows'],
};

export default nextConfig;
