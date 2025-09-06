# Changelog

## [3.0.0](https://github.com/ashleytowner/shadowdark-parser/compare/v2.1.0...v3.0.0) (2025-09-06)


### ⚠ BREAKING CHANGES

* switch to cjs

### Features

* **templates:** Move template code from CLI to library ([1779374](https://github.com/ashleytowner/shadowdark-parser/commit/1779374f66c8059660360d6061f2020f4ad7ebc5))


### Bug Fixes

* Export more functions & types ([8f0c686](https://github.com/ashleytowner/shadowdark-parser/commit/8f0c686e023786644276b7243b8ab3bf7d18e39e))
* Remove unused file ([f88639e](https://github.com/ashleytowner/shadowdark-parser/commit/f88639ecc162a3164ae0aceb0a194e21ad77e302))
* Update package-lock ([267a373](https://github.com/ashleytowner/shadowdark-parser/commit/267a373a89c8a74b351ceac477665412108ba1a2))


### Code Refactoring

* switch to cjs ([fd1c68d](https://github.com/ashleytowner/shadowdark-parser/commit/fd1c68d6dc17e80c3409f2921439264a65bee218))

## [2.1.0](https://github.com/ashleytowner/shadowdark-parser/compare/v2.0.3...v2.1.0) (2025-09-06)


### Features

* Add types to entity output, to make templates easier ([51cd40c](https://github.com/ashleytowner/shadowdark-parser/commit/51cd40c482398575c8d968e054af519a2e4572ce))
* **bulk-parsing:** Add bulk parsing to core library ([d7204a4](https://github.com/ashleytowner/shadowdark-parser/commit/d7204a49115359f966e46fadb9e9f1904fb54227))
* **bulk-parsing:** Add bulk parsing to the CLI ([d60342d](https://github.com/ashleytowner/shadowdark-parser/commit/d60342df366b993c361310e2f5ef3c7bf60f6d87))
* **templates:** Add a way to check equality ([807b233](https://github.com/ashleytowner/shadowdark-parser/commit/807b233d43a26c924f9c03cb10cc8d090ed8e78f))

## [2.0.3](https://github.com/ashleytowner/shadowdark-parser/compare/v2.0.2...v2.0.3) (2025-08-24)


### Bug Fixes

* Now identifies spells with statblocks as spells instead of monsters ([89ac467](https://github.com/ashleytowner/shadowdark-parser/commit/89ac467128c2298ee8e5cd0360ca1a0327c2e85d))

## [2.0.2](https://github.com/ashleytowner/shadowdark-parser/compare/v2.0.1...v2.0.2) (2025-08-24)


### Bug Fixes

* Remove brackets from AC when armor type is specified ([2fd92a8](https://github.com/ashleytowner/shadowdark-parser/commit/2fd92a8db81b883e4a57877343a25002b5771e92))

## [2.0.1](https://github.com/ashleytowner/shadowdark-parser/compare/v2.0.0...v2.0.1) (2025-08-22)


### Bug Fixes

* Handle unsigned stats ([ca32b8f](https://github.com/ashleytowner/shadowdark-parser/commit/ca32b8fc2674df90540d1b8e7453d96ab5ceebf6))

## [2.0.0](https://github.com/ashleytowner/shadowdark-parser/compare/v1.11.4...v2.0.0) (2025-08-22)


### ⚠ BREAKING CHANGES

* Changed imports

### Bug Fixes

* Fix handlebar imports in executable ([b12f48d](https://github.com/ashleytowner/shadowdark-parser/commit/b12f48d5f1f0ab86588245e227aa43dd4d4d8c1f))
* Fix parsing issues with special characters in names ([d06f49b](https://github.com/ashleytowner/shadowdark-parser/commit/d06f49b8a758256dd82f4a2466260e7d74e7e6fa))
* Removed unnecessary errors ([9db6140](https://github.com/ashleytowner/shadowdark-parser/commit/9db6140b5674e9dc31b247a0520459e1d7bd3c85))
* Set correct types for monster parser ([e7d34a8](https://github.com/ashleytowner/shadowdark-parser/commit/e7d34a819f36ad3e8eb3ab1a153c09352d3c0dc7))


### Code Refactoring

* Changed imports ([4fc7684](https://github.com/ashleytowner/shadowdark-parser/commit/4fc76842b2e5a59310ed663c79914cccc724f976))

## [1.11.4](https://github.com/ashleytowner/shadowdark-parser/compare/v1.11.3...v1.11.4) (2025-08-21)


### Bug Fixes

* Handle variable alignment ([5ccb736](https://github.com/ashleytowner/shadowdark-parser/commit/5ccb7369d18770ed8b1911c413f5b6cf57720106))

## [1.11.3](https://github.com/ashleytowner/shadowdark-parser/compare/v1.11.2...v1.11.3) (2025-08-21)


### Bug Fixes

* Fix split charisma breaking ([d399f8a](https://github.com/ashleytowner/shadowdark-parser/commit/d399f8af8699ef4b547417b854fff35ace5346d1))

## [1.11.2](https://github.com/ashleytowner/shadowdark-parser/compare/v1.11.1...v1.11.2) (2025-08-21)


### Bug Fixes

* Correctly parse stats where the number & sign have been split ([38f933f](https://github.com/ashleytowner/shadowdark-parser/commit/38f933fe86232849e4ce3d2f91846338b23193f1))

## [1.11.1](https://github.com/ashleytowner/shadowdark-parser/compare/v1.11.0...v1.11.1) (2025-08-21)


### Bug Fixes

* Parse attacks with no quantity ([faa0e65](https://github.com/ashleytowner/shadowdark-parser/commit/faa0e650419403c0cfdd22e7a39907a65014732b))

## [1.11.0](https://github.com/ashleytowner/shadowdark-parser/compare/v1.10.1...v1.11.0) (2025-08-21)


### Features

* Handle wacky alternatives to Ch like X and Z ([ac7c31a](https://github.com/ashleytowner/shadowdark-parser/commit/ac7c31a4cdb26c26aad03ffd5a6e2cc1ae060326))


### Bug Fixes

* Spell bonus now gets separated from the name ([35ec612](https://github.com/ashleytowner/shadowdark-parser/commit/35ec6128edddb53e0072d822cb367afc21864660))

## [1.10.1](https://github.com/ashleytowner/shadowdark-parser/compare/v1.10.0...v1.10.1) (2025-08-21)


### Bug Fixes

* Infinite loops & erroneous outputs ([741df0e](https://github.com/ashleytowner/shadowdark-parser/commit/741df0eca4785337ddf490e6f304d9012ad9bcb1))

## [1.10.0](https://github.com/ashleytowner/shadowdark-parser/compare/v1.9.0...v1.10.0) (2025-08-21)


### Features

* Add magic item parsing & update readme ([078690f](https://github.com/ashleytowner/shadowdark-parser/commit/078690f0133f2d1fba6a20f76bb2cfa6a7483f85))
* Parse multi-line entity names (when in all caps) ([eec0c79](https://github.com/ashleytowner/shadowdark-parser/commit/eec0c79b1b77b28a11571bfb3c1c69dc71a5e97a))

## [1.9.0](https://github.com/ashleytowner/shadowdark-parser/compare/v1.8.4...v1.9.0) (2025-08-21)


### Features

* Add option to get entity name from file name ([95d7d41](https://github.com/ashleytowner/shadowdark-parser/commit/95d7d41621100f24742a34624a07f45bf80a3129))

## [1.8.4](https://github.com/ashleytowner/shadowdark-parser/compare/v1.8.3...v1.8.4) (2025-08-21)


### Continuous Integration

* Use PAT for release-please ([1d42b91](https://github.com/ashleytowner/shadowdark-parser/commit/1d42b91bcc3b441e24371dc8f9e741297fd0367a))

## [1.8.3](https://github.com/ashleytowner/shadowdark-parser/compare/v1.1.1...v1.8.3) (2025-08-21)


### Features

* Add a generic "parse" function ([7b2a2fc](https://github.com/ashleytowner/shadowdark-parser/commit/7b2a2fc6e167f4ec4d38026e124d0d903fcd0447))
* Add an npx script to parse files/stdin ([b8b21a7](https://github.com/ashleytowner/shadowdark-parser/commit/b8b21a75355327b0d4f43570161d558dbf7dba24))
* Add custom handlebars helpers & docs about handlebars ([e027b28](https://github.com/ashleytowner/shadowdark-parser/commit/e027b28fdccf8cddf17116428aa428b149e1090e))
* Add handlebar template file processing ([8c6f497](https://github.com/ashleytowner/shadowdark-parser/commit/8c6f497d3fddccde0bed69340f42c28027d54a1b))
* Add rolltable parser ([63baea1](https://github.com/ashleytowner/shadowdark-parser/commit/63baea181e69483e4a142165e56731e3a6ea2d46))
* Add spell parsing ([9e45f88](https://github.com/ashleytowner/shadowdark-parser/commit/9e45f8824a53e55732fb7e6d9500e9ebaa616542))


### Bug Fixes

* Can parse tables with multiline rows ([579cbc0](https://github.com/ashleytowner/shadowdark-parser/commit/579cbc0e1cce8e555acd18ac651c20dd19b05721))
* Correctly detects multi-word movements ([7122f4f](https://github.com/ashleytowner/shadowdark-parser/commit/7122f4fc667b7a0fa3377353f8e6b20df64baae6))
* Fix issue with trailing spaces ([6241d66](https://github.com/ashleytowner/shadowdark-parser/commit/6241d66eaeff2cd84f6388104c050b50d90c5b29))
* Remove debugging log ([6dbc674](https://github.com/ashleytowner/shadowdark-parser/commit/6dbc674635c9fef8a73cf48122c802cb47bea03b))
* **statblock:** Parse spell traits correctly ([ea04517](https://github.com/ashleytowner/shadowdark-parser/commit/ea045172999a456e43d26dfeddaea7dee733b94c))


### Continuous Integration

* Add release-please ([18d3d50](https://github.com/ashleytowner/shadowdark-parser/commit/18d3d5074841d8e1955957cfbb6034449f33cbb7))
