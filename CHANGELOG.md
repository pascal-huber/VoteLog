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

### Removed

