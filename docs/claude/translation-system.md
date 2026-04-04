# Translation System

EcoVibeFloors uses Mistral AI for Bulgarian translations. Translate INTENT, not WORDS — create content that achieves the same emotional impact as the English source, adapted for Bulgarian market expectations.

## Key Principles
1. **Market-Aware**: Use terms Bulgarians actually search for (масивен паркет, трислоен паркет, водоустойчив)
2. **Trust Builders**: Include concrete quality signals (25-годишна гаранция, германско качество, 3 мм горен слой)
3. **Natural Language**: Sound like a native Bulgarian speaker wrote it
4. **Brand Voice**: Professional luxury tone with warmth
5. **SEO-Optimized**: Incorporate Bulgarian flooring industry search terms

## Required Context Files (read before any translation work)
- `docs/translation-context/bg-market-context.md` — Bulgarian market research and terminology
- `docs/translation-context/en-source-context.md` — Floer/Ter Hürne brand positioning
- `docs/translation-context/terminology-map.json` — Translation rules and terminology standards
- `docs/translation-context/examples/translation-examples.json` — Good/bad translation patterns

## Translation Rules

### Never Translate
- Brand names: Ter Hürne, Dutch Interior Group (DIG)
- Proprietary terms: vGroove, MEGAMAT, CLICKitEASY, SmartConnect
- Product names in titles: "Колекция Hybrid Wood" (keep English)

### Always Use Bulgarian Equivalents
- click system → **клик система**
- engineered wood → **многослоен паркет** or **трислоен паркет**
- solid wood → **масивен паркет**
- waterproof → **водоустойчив**
- wear layer → **горен слой**
- usage class → **клас на износване**
- underfloor heating → **подово отопление**
- herringbone → **щурц** or **рибена кост**

### Contextual
- "Hybrid Wood" in titles: keep English → "Колекция Hybrid Wood"
- "Hybrid Wood" in body: explain → "хибридни дървени подове с истински дъбов слой"

## Bulgarian Market Preferences
- **Origin**: Always mention "германско/холандско качество" — it signals trust
- **Warranty**: Always include years — "25-годишна гаранция" is a critical trust signal
- **Specs**: Concrete numbers build credibility (thickness, class, layer measurements)
- **Innovation**: Use "иновативен" + explanation rather than "революционен" (sounds risky)

## Common Mistakes

```
❌ "Висококачествен паркет"
✅ "Висококачествен холандски паркет с удължена 25-годишна гаранция"

❌ "Революционна хибридна технология"
✅ "Иновативна технология - истински дъб върху водоустойчива основа"

❌ "Трансформирайте пространството с перфектни подови настилки"
✅ "Преобразете вашето пространство с идеални подови настилки"

❌ "Дебелина: 10мм / Слой на износване: 3мм"
✅ "Обща дебелина: 10 мм / Горен слой: 3 мм"

❌ "Флоер Хибридно дърво"
✅ "Floer Hybrid Wood" or "Хибридни подове Floer"
```

## Automated Tools

### Namespace translations (`messages/bg.json`)
```bash
node utils/polish-translations.js --namespace=navigation --dry-run  # preview
node utils/polish-translations.js --namespace=hybridWood             # apply
node utils/polish-translations.js --all --dry-run                    # preview all
```
Requires: `MISTRAL_API_KEY` in `.env`

### Product translations (`collections/*.json`)
```bash
node utils/polish-collection-translations.js --collection=hybrid-wood --dry-run  # preview
node utils/polish-collection-translations.js --collection=hybrid-wood             # apply
```

### Production-grade with validation (`npx tsx`)
```bash
npx tsx utils/refine-and-translate-json.ts --collection=hybrid-wood --dry-run
```
Requires: `AZURE_API_KEY` and `TARGET_URL` in `.env`

Always use `--dry-run` first. Backups are created automatically (`.backup` files).

## Manual Translation with Claude Agents
- **polish-text agent**: Refine existing Bulgarian text
- **translate-text agent**: Translate new English content to Bulgarian

## Workflow

**New feature translations:**
1. Add English to `messages/en.json`
2. Add rough Bulgarian to `messages/bg.json`
3. `node utils/polish-translations.js --namespace=newFeature --dry-run`
4. Review and apply

**Product updates:**
1. Update `collections/[collection].json`
2. `node utils/polish-collection-translations.js --collection=[name] --dry-run`
3. Review and apply

## Quality Checklist
- [ ] Sounds natural to native Bulgarian speaker
- [ ] Uses Bulgarian flooring industry search terms
- [ ] Includes concrete quality signals when relevant
- [ ] Brand names and proprietary terms not translated
- [ ] Professional luxury tone maintained
- [ ] Correct spacing: "3 мм" not "3мм"
- [ ] Technical terms use Bulgarian standards
- [ ] Achieves same emotional impact as English source
