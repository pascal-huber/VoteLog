# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- i18n infrastructure for German and English, with the locale
  as the first URL segment
- "Something went wrong" error page for failed data fetches
- Interactive, zoomable canton map on the vote detail page, replacing the
  canton list, with a tooltip showing each canton's result

### Fixed

- Category overview showed "Infinity%" or a wrong percentage for
  categories with no or incomplete user votes

### Changed

- Login form now submits on Enter, not just on clicking the button
- Legislatur selector now shows the start/end year instead of the raw id
- Redesigned the vote detail page

### Removed

