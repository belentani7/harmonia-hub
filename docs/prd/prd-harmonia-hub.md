# PRD -- harmonia-hub
Fecha: 2026-09-25 | Estado: Draft (auditoria automatica, requiere revision humana) | Autor: auditoria belentani7 (NOIACORE)

## 1. Problema

React Native mobile app with **Expo SDK 54**, **TypeScript**, and **React 19**.

## 2. Usuarios objetivo

- **Primario**: usuario final que necesita resolver el caso de uso de harmonia-hub.
- **Secundario**: equipo/persona que mantiene y despliega el proyecto.
- **Terciario**: agentes CLI que operan sobre el repositorio.

## 3. Features (MoSCoW)

| ID | Feature | MoSCoW |
|---|---|---|
| F1 | If content may overflow, wrap the whole page in a ScrollView; short lists inside can use .map(). | Must |
| F2 | When multiple texts/icons must be inline, set parent flex-row (Pressable/TouchableOpacity default to column). | Must |
| F3 | Pressable className is globally disabled; pass interaction styles via style. | Must |
| F4 | For text inputs that submit on keyboard, set returnKeyType="done" (and handle submit) to avoid “Enter does nothing” issues on mobile. | Must |
| F5 | Default: React Context + useReducer/useState (simpler, fewer pitfalls). Persist with AsyncStorage/MMKV if needed. | Must |
| F6 | If you choose Zustand: | Must |
| F7 | Selectors must return stable references (no new objects/arrays inside selectors). | Must |
| F8 | Subscribe to data, not functions: useStore((s) => s.state.entries); derive with useMemo. | Must |
| F90 | Checklist de produccion (build, tests, deploy, seguridad) | Should |
| F91 | Documentacion viva (esta cadena) | Must |

## 4. Criterios de aceptacion (GWT)

### F1 -- If content may overflow, wrap the whole page in a ScrollView
- Given el usuario en el contexto de harmonia-hub / When usa If content may overflow, wrap the whole page in a  / Then obtiene el resultado esperado sin error.
- Given entrada invalida / When la envia / Then recibe un error generico y el detalle queda en logs.

### F2 -- When multiple texts/icons must be inline, set parent flex-ro
- Given el usuario en el contexto de harmonia-hub / When usa When multiple texts/icons must be inline, set pare / Then obtiene el resultado esperado sin error.
- Given entrada invalida / When la envia / Then recibe un error generico y el detalle queda en logs.

### F3 -- Pressable className is globally disabled; pass interaction s
- Given el usuario en el contexto de harmonia-hub / When usa Pressable className is globally disabled; pass int / Then obtiene el resultado esperado sin error.
- Given entrada invalida / When la envia / Then recibe un error generico y el detalle queda en logs.

### F4 -- For text inputs that submit on keyboard, set returnKeyType="
- Given el usuario en el contexto de harmonia-hub / When usa For text inputs that submit on keyboard, set retur / Then obtiene el resultado esperado sin error.
- Given entrada invalida / When la envia / Then recibe un error generico y el detalle queda en logs.


## 5. Metricas de exito

- Build reproducible en un comando.
- CI verde en cada PR.
- Cero secretos en el repositorio.
- Documentacion actualizada en el mismo PR que el codigo.

## 6. Out of scope

- Funcionalidad no descrita en el README vigente.
- Cambios que rompan compatibilidad sin ADR que lo justifique.
