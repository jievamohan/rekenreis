# Plan — Epic 22.2

**Branch:** feat/22.2-drag-timed-upgrades

## Goal

Upgrade TreasureDive to genuine drag/drop-first interaction with pointer events and keyboard fallback. Upgrade FishFeed to timed-but-kind with hint-continue on timeout (no punishment).

## Tasks

1. Upgrade TreasureDive: pointer-event drag, dual-zone layout, keyboard fallback
2. Upgrade FishFeed: gentle timer with hint-continue on timeout
3. Add Dutch i18n keys for new hint/timeout states
4. Unit tests for timeout and drag logic
5. E2E tests: drag/drop round + timed timeout graceful continuation
