# Assets — Epic 30: Avatars & Expressions

## Illustrator / Asset Pipeline Output

### Source Inventory (temp_assets/maatjes)
| Character | Expressions | Files |
|-----------|-------------|-------|
| wolkje | Blij, Neutraal, Verdrietig, Nadenken | 4 PNG |
| een-oog eerlijk | Blij, Feest, Neutraal, Verrast, Verdrietig, Nadenken | 6 PNG |
| slimme rekenaar | Blij, Feest, Verdrietig, Nadenken | 4 PNG |

**Total:** 14 PNG files

### Target Structure
```
apps/web/assets/graphics/characters/maatjes/
  wolkje/
    blij.png
    neutraal.png
    verdrietig.png
    nadenken.png
  een-oog-eerlijk/
    blij.png
    feest.png
    neutraal.png
    verrast.png
    verdrietig.png
    nadenken.png
  slimme-rekenaar/
    blij.png
    feest.png
    verdrietig.png
    nadenken.png
```

### Naming Convention
- Folder: kebab-case, lowercase (een-oog-eerlijk, slimme-rekenaar)
- File: lowercase (blij.png, neutraal.png)

### Matrix (Expression Coverage)
| Expression | wolkje | een-oog-eerlijk | slimme-rekenaar |
|------------|--------|-----------------|-----------------|
| blij | ✓ | ✓ | ✓ |
| neutraal | ✓ | ✓ | — |
| verdrietig | ✓ | ✓ | ✓ |
| nadenken | ✓ | ✓ | ✓ |
| feest | — | ✓ | ✓ |
| verrast | — | ✓ | — |

### Bundle Impact
- PNG total ~14 files; estimate 5–15KB each → ~70–210KB
- Lazy per route; not all loaded at once
- Gate F: verify bundle budget
