# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- i18n infrastructure (vue-i18n), with the locale as the first URL segment
  and all UI text moved into `src/i18n/locales/`
- English translation (`en`), alongside the existing German (`de`)
- "Something went wrong" error page, shown when legislatur or vote data
  fails to fetch

### Fixed

- Category overview showed "Infinity%" (or a wrong percentage) for
  Switzerland's agreement when a category had no user votes, or votes on
  only some of its subjects
- Login form did nothing when pressing Enter; now submits like clicking
  the login button

### Changed

- Legislatur selector now shows the start/end year (e.g. "2019 - 2023")
  instead of the raw legislatur id
- Category names on votes (e.g. "Aussenpolitik") are now read directly
  from swissvotes-api's `categories` field instead of being derived from
  the raw `d1e1`.."d3e3" codes client-side
- Restructured the vote detail page into clearly labelled sections (Vote
  title, My Vote, Results, Resources, Raw data), using real `h2`/`h3`
  headings throughout instead of a mix of oversized/bold text, thin
  divider lines instead of boxes, and the same plain accordion pattern
  already used on the Kategorien page instead of native `<details>`
  triangles
- "Gewichtung" on the vote detail page now shows the same weight icon
  (`0x`/`1x`/`2x`/`4x` svg) used when editing a vote, instead of plain text
- The Results section on the vote detail page now shows the overall
  national result (outcome + Ja-Anteil) above the cantons/parties
  breakdown

### Removed

