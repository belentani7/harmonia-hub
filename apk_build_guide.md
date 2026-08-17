# Guía de Compilación de APK Android — BELENTANI

## 1. Arquitectura de Conexión
La aplicación móvil Android se conecta directamente al backend independiente desplegado (tRPC + Express). 

## 2. Pasos para Generar el APK localmente con EAS Build
1. Instalar las dependencias de EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Iniciar sesión en Expo:
   ```bash
   eas login
   ```
3. Configurar el proyecto para Android:
   ```bash
   eas build:configure
   ```
4. Lanzar la compilación del APK de desarrollo o producción:
   ```bash
   eas build --platform android --profile preview
   ```
5. Descargar el archivo `.apk` resultante e instalarlo directamente en cualquier dispositivo Android.
