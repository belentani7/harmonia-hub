# SRS -- harmonia-hub
Fecha: 2026-09-25 | Estado: Draft | Traza a: PRD prd-harmonia-hub.md

## Requisitos funcionales

| ID | Requisito | Traza PRD | Prioridad |
|---|---|---|---|
| FR-001 | El sistema implementa: If content may overflow, wrap the whole page in a ScrollView; short lists inside can use . | F1 | Must |
| FR-002 | El sistema implementa: When multiple texts/icons must be inline, set parent flex-row (Pressable/TouchableOpacity  | F2 | Must |
| FR-003 | El sistema implementa: Pressable className is globally disabled; pass interaction styles via style. | F3 | Must |
| FR-004 | El sistema implementa: For text inputs that submit on keyboard, set returnKeyType="done" (and handle submit) to a | F4 | Must |
| FR-005 | El sistema implementa: Default: React Context + useReducer/useState (simpler, fewer pitfalls). Persist with Async | F5 | Must |
| FR-006 | El sistema implementa: If you choose Zustand: | F6 | Must |
| FR-007 | El sistema implementa: Selectors must return stable references (no new objects/arrays inside selectors). | F7 | Must |
| FR-008 | El sistema implementa: Subscribe to data, not functions: useStore((s) => s.state.entries); derive with useMemo. | F8 | Must |

## Requisitos no funcionales

| ID | Requisito | Metrica | Traza |
|---|---|---|---|
| NFR-001 | Build reproducible | `build` pasa en CI | todos |
| NFR-002 | Calidad estatica | lint + typecheck sin errores | todos |
| NFR-003 | Seguridad | 0 secretos; validacion de entrada | FR-001 |
| NFR-004 | Observabilidad | logs estructurados y errores claros | todos |
| NFR-005 | Accesibilidad (si hay UI) | WCAG 2.1 AA | FR-001 |
| NFR-006 | CI verde | workflow en cada PR | todos |

## Trazabilidad

`PRD -> FR/NFR -> tests -> verificacion`. Todo cambio actualiza la documentacion
en el mismo PR y debe pasar la suite antes de fusionar.
