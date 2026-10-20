# AWS Cloud Architecture Study Hub — Digital Café Luna

Plataforma técnica interactiva y preparador avanzado para los laboratorios de Arquitectura de Sistemas Cloud en Amazon Web Services (AWS).

> 🌐 **Sitio Web en Vivo (GitHub Pages):** [https://ioavm.github.io/aws-cloud-study-hub/](https://ioavm.github.io/aws-cloud-study-hub/)

Desarrollado bajo estándares formales de ingeniería, separando responsabilidades con **Vanilla CSS puro** y **JavaScript moderno no intrusivo**, renderizado con **HTML5 semántico estático** accesible y de carga instantánea.

---

## 🛠️ Laboratorios Cubiertos

| Laboratorio | Dimensión Arquitectónica | Conceptos Clave Evaluados |
| :--- | :--- | :--- |
| **S05: Seguridad y Gobernanza** | Identity & Access Management (IAM), S3 Security, Auditing | Reachability vs Authorization, Instance Profile, SSE-S3, CloudTrail Management Events, Least Privilege. |
| **S06: Operación y Automatización con IaC** | Infrastructure as Code (CloudFormation), Monitoring | YAML Templates, Logical vs Physical IDs, Drift Detection, In-Place Updates, Basic Monitoring (5 min), Causal Chain of Alarms. |
| **S07: Modernización de Arquitectura** | Serverless Computing, Event-Driven Architecture | S3 Event Notifications (Prefix/Suffix), AWS Lambda execution runtime, Execution Role vs Resource-based Policy, Pre-created CloudWatch Log Groups. |

---

## 🚀 Módulos del Sistema

1. **📚 1. Glosario Técnico y Fundamentos (37 Conceptos)**:
   - Organizado en 2 niveles didácticos:
     - **🔰 Nivel 1 (Fundamentos Atómicos)**: Conceptos base esenciales (¿Qué es un IAM Role?, ¿Qué es una IAM Policy?, IAM User vs Role, ARN, S3 Bucket, Objeto en S3, CloudTrail, IaC, CloudFormation, Template, Stack, CloudWatch, Métricas, Alarmas, EC2, Serverless, Lambda, Handler, Trigger, Log Groups).
     - **⚙️ Nivel 2 (Mecanismos y Comportamientos de Lab)**: Reachability vs Authorization, Instance Profile, Action vs Resource, SSE-S3, DatapointsToAlarm, Update in-place, EDA, Execution Role vs Resource-based policy, etc.
   - Cada concepto incluye definición formal rigurosa, analogía intuitiva y aplicación exacta en el laboratorio.
   - Búsqueda reactiva en vivo y filtrado instantáneo por laboratorio (S05: 15, S06: 13, S07: 9).

2. **🛠️ 2. Guía Oficial Paso a Paso (S05 · S06 · S07)**:
   - **Glosario específico incrustado** dentro de cada laboratorio organizado en los dos niveles (Fundamentos Básicos + Mecanismos de Lab).
   - Diagrama de flujo de componentes de arquitectura.
   - **21 pasos desglosados** sin omitir un solo sub-ítem: qué hacemos, por qué, procedimiento exacto, comandos AWS CLI listos para copiar, validaciones oficiales, evidencia requerida y trampas de examen.
   - **Inspector interactivo de código sticky**: explicación detallada línea por línea de políticas IAM, plantillas CloudFormation YAML y funciones Lambda en Python.

3. **⚡ 3. Simulador de Diagnóstico e Incidentes ("¿Qué pasa si...?")**:
   - 8 escenarios de fallo reales con capturas de salida de terminal, causa raíz técnica y lista de chequeo de remediación inmediata.

4. **📝 4. Entrenador de Examen Oficial**:
   - 12 preguntas de opción múltiple estructuradas en el formato de certificación AWS, con retroalimentación correctiva y calificación en tiempo real.

5. **🎯 5. Sustentación & Cheat Sheet**:
   - **Tarjetas de sustentación 3D** con giro interactivo para memorizar y formular respuestas orales.
   - Tablas comparativas:
     - *Lectura comparada de autorización (Lab 05)*.
     - *Reconstrucción de la cadena causal de la alarma (Lab 06)*.
     - *Frontera operacional EC2 vs Lambda (Lab 07)*.
   - Matriz de criterios de aceptación y reglas cardinales de sustentación.

---

## 📂 Estructura del Repositorio

```text
├── index.html                   # Punto de entrada principal estático (243 KB)
├── gemini-code-1792527632584.html # Versión de respaldo estática
├── styles.css                   # Hoja de estilos Vanilla CSS desacoplada (Dark Mode & Glassmorphism)
├── app.js                       # Lógica de interacción progresiva (Filtros, Tabs, Quiz, Inspector)
├── .gitignore                   # Exclusiones de control de versiones
└── README.md                    # Documentación técnica del proyecto
```

---

## 💻 Ejecución Local

Para visualizar la aplicación en un entorno local:

```bash
# Servidor HTTP rápido con Python
python -m http.server 8080

# Abrir en el navegador:
# http://localhost:8080/
```

O simplemente abrir `index.html` directamente en cualquier navegador moderno.
