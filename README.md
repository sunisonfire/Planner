# 🎓 UniPlanner

> **Tu espacio personal para organizar la universidad, tus tareas, metas y notas.**

UniPlanner es una aplicación web diseñada para ayudar a estudiantes universitarios a organizar su vida académica de una manera **simple, bonita, intuitiva y personalizada**.

La aplicación funciona completamente en el navegador y utiliza **LocalStorage**, por lo que cada persona puede tener su propio espacio con sus propios datos sin necesidad de crear una cuenta.

---

# ✨ ¿Qué incluye UniPlanner?

UniPlanner reúne diferentes herramientas académicas en un solo lugar:

* 🏠 Dashboard
* 📝 Planificador de tareas
* 📅 Calendario
* 🔔 Sistema de notificaciones
* 🎯 Metas académicas
* 🧮 Calculadora de notas
* 📚 Gestión de materias
* 👤 Perfil personal
* 🌙 Dark Mode
* 📦 Exportación e importación de datos
* 💾 Almacenamiento local

---

# 🚀 Primer inicio

Cuando abres UniPlanner por primera vez, aparece un pequeño **Onboarding** para personalizar la aplicación.

La aplicación te pregunta:

### 👤 Nombre

Escribe tu nombre para personalizar los saludos y tu perfil.

### 🎓 Universidad

Indica la universidad en la que estudias.

### 📚 Carrera

Introduce tu carrera universitaria.

### 📖 Materias

Agrega las materias que estás cursando.

Cada materia puede tener:

* Nombre
* Código
* Color

Al terminar, UniPlanner muestra un resumen de la información introducida y puedes comenzar a utilizar la aplicación.

Toda esta información se guarda automáticamente en el navegador.

---

# 🏠 Dashboard

El Dashboard es la pantalla principal de UniPlanner.

Aquí puedes ver rápidamente la información más importante de tu día.

Incluye:

* Saludo personalizado
* Cantidad de materias
* Tareas pendientes
* Metas activas
* Próximos eventos
* Próximas tareas
* Alertas importantes

El saludo cambia dependiendo de la hora:

> ☀️ Buenos días

> 🌤️ Buenas tardes

> 🌙 Buenas noches

La idea es que puedas entrar a UniPlanner y saber inmediatamente **qué tienes pendiente y qué viene próximamente**.

---

# 📝 Mis tareas

La sección **Mis tareas** permite organizar todas tus actividades académicas.

Puedes crear una tarea indicando:

* Título
* Materia
* Descripción
* Fecha de entrega
* Prioridad

Las prioridades disponibles son:

* 🟢 Baja
* 🟡 Media
* 🔴 Alta

También puedes marcar una tarea como **completada**.

Las tareas se organizan según su fecha de entrega para que sea más fácil identificar qué debes hacer primero.

### Ejemplo

```text
📝 Proyecto de Bases de Datos

Bases de Datos

Entrega:
18 de agosto

🔴 Alta
```

---

# 🔔 Notificaciones y alertas

UniPlanner puede detectar automáticamente cuando una tarea está próxima a vencer.

Se generan alertas cuando faltan:

* 3 días
* 2 días
* 1 día
* El mismo día

Por ejemplo:

> ⚠️ Te quedan 3 días para entregar "Proyecto de Bases de Datos".

O:

> 🔥 ¡Tu tarea "Proyecto de Bases de Datos" vence mañana!

Y si la tarea vence ese mismo día:

> 🚨 ¡"Proyecto de Bases de Datos" vence hoy!

Las alertas aparecen tanto en el Dashboard como en el sistema interno de notificaciones.

---

# 🔔 Panel de notificaciones

En el Header encontrarás una campana 🔔.

Esta muestra la cantidad de notificaciones pendientes.

Al abrirla puedes consultar diferentes avisos, por ejemplo:

```text
🔔 Notificaciones

⚠️ Proyecto de Bases de Datos
Faltan 3 días

🔥 Parcial de Matemáticas
Falta 1 día

🎯 Meta completada
¡Has terminado tu meta!
```

Las notificaciones se generan automáticamente a partir de la información de la aplicación.

No es necesario utilizar notificaciones push del navegador.

---

# 📅 Calendario

UniPlanner incluye un calendario mensual para visualizar tus actividades.

Puedes navegar entre los diferentes meses y consultar los eventos registrados.

Los días pueden mostrar indicadores de diferentes actividades:

```text
18

🔵 Parcial
🟣 Tarea
```

También puedes crear nuevos eventos.

Cada evento puede incluir:

* Título
* Fecha
* Hora
* Tipo
* Descripción

Los tipos disponibles son:

* 📝 Tarea
* 📚 Parcial
* 📅 Evento
* 🔔 Recordatorio

---

# 🎯 Mis metas

La sección de metas permite establecer objetivos académicos y realizar seguimiento de tu progreso.

Por ejemplo:

```text
🎯 Sacar más de 4.0 en Bases de Datos

████████░░ 80%

Progreso:
4 / 5 tareas completadas
```

Cada meta puede tener:

* Título
* Descripción
* Fecha límite
* Porcentaje de progreso

Las metas pueden:

* Crear
* Editar
* Eliminar
* Actualizar su progreso
* Marcar como completadas

Cuando una meta llega al 100%, UniPlanner muestra una pequeña celebración:

> 🎉 ¡Meta completada!

---

# 🧮 Calculadora de notas

Una de las herramientas principales de UniPlanner es la **Calculadora de Notas**.

Permite calcular cuánto necesitas obtener en una evaluación para alcanzar una nota determinada.

Primero introduces la nota mínima para aprobar.

Por ejemplo:

```text
Nota mínima:
3.0
```

Después agregas las evaluaciones:

```text
Parcial 1
Nota: 4.0
Porcentaje: 30%

Parcial 2
Nota: 3.5
Porcentaje: 30%

Trabajo final
Nota: ?
Porcentaje: 40%
```

UniPlanner calcula:

### Nota acumulada

```text
3.45
```

### Porcentaje completado

```text
60%
```

### Porcentaje restante

```text
40%
```

Y finalmente:

```text
¿Qué necesitas sacar?

Para aprobar con 3.0 necesitas sacar:

2.33

en el trabajo final.
```

---

# 📊 Cálculo ponderado

La calculadora utiliza un promedio ponderado.

La lógica es:

```text
nota × porcentaje
+
nota × porcentaje
+
...
```

Para calcular la nota necesaria en lo que falta:

```text
nota_necesaria =
(nota_minima - nota_actual) / porcentaje_restante
```

También contempla situaciones especiales.

Si ya tienes suficiente para aprobar:

> 🎉 ¡Ya tienes suficiente para aprobar!

Si necesitarías una nota superior a 5.0:

> 😭 Necesitarías más de 5.0 para aprobar con las notas actuales.

---

# 📚 Materias

La sección **Mis materias** permite administrar las materias que estás cursando.

Ejemplo:

```text
📘 Bases de Datos
🧮 Matemáticas
💻 Programación
🇬🇧 Inglés
```

Cada materia puede mostrar información relacionada como:

* Cantidad de tareas
* Próximas tareas
* Progreso
* Calculadora de notas

Las materias también pueden tener diferentes colores para identificarlas fácilmente.

---

# 👤 Mi perfil

En **Mi perfil** puedes consultar y modificar tu información personal dentro de UniPlanner.

Se muestra:

```text
Danna

Universidad Industrial de Santander

Ingeniería de Sistemas
```

Puedes editar:

* Nombre
* Universidad
* Carrera
* Materias

Los cambios se guardan automáticamente.

---

# 🌙 Dark Mode

UniPlanner incluye modo oscuro.

Puedes cambiar entre:

```text
☀️ Modo claro
🌙 Modo oscuro
```

La preferencia se guarda en el navegador, por lo que no tienes que volver a seleccionarla cada vez que abras la aplicación.

---

# 💾 Almacenamiento local

Una característica fundamental de UniPlanner es que **no utiliza una base de datos externa**.

La información se guarda utilizando `localStorage`.

Se utilizan diferentes espacios para organizar los datos, por ejemplo:

```text
uniplanner_profile
uniplanner_subjects
uniplanner_tasks
uniplanner_events
uniplanner_goals
uniplanner_grades
uniplanner_settings
uniplanner_onboarding
```

Esto permite que cada navegador tenga su propio espacio independiente.

> **Una misma aplicación para todos, pero cada estudiante tiene sus propios datos.**

---

# 📦 Exportar datos

Como toda la información está almacenada localmente, UniPlanner permite crear una copia de seguridad.

La opción:

> 📦 Exportar mis datos

genera un archivo `.json` con la información almacenada.

Puedes guardar ese archivo en:

* Google Drive
* Tu computadora
* Tu teléfono
* Correo electrónico

Esto permite conservar una copia de tus datos.

---

# 📥 Importar datos

También puedes restaurar una copia anteriormente creada mediante:

> 📥 Importar mis datos

Seleccionas el archivo `.json` y UniPlanner valida su estructura antes de restaurar la información.

Esto resulta especialmente útil cuando:

* Cambias de computador.
* Cambias de navegador.
* Necesitas recuperar tus datos.
* Quieres mantener una copia de seguridad.

---

# 🗑️ Restablecer aplicación

Dentro de la configuración del perfil existe la opción:

> ⚠️ Restablecer aplicación

Antes de eliminar los datos se muestra una confirmación.

Al aceptar, se eliminan los datos almacenados y la aplicación vuelve al **Onboarding inicial**.

Esto permite comenzar nuevamente desde cero.

---

# 📱 Diseño responsive

UniPlanner está diseñado para funcionar en:

* 💻 Computador
* 📱 Celular
* 📲 Tablet

En escritorio utiliza un **Sidebar** para navegar entre las diferentes secciones.

En dispositivos móviles utiliza una **Bottom Navigation**.

```text
Inicio | Tareas | Calendario | Metas | Más
```

Los componentes y modales también se adaptan al tamaño de la pantalla.

---

# 🎨 Diseño visual

La interfaz busca combinar:

* Minimalismo
* Estética universitaria
* Productividad
* Colores suaves
* Tarjetas redondeadas
* Sombras ligeras
* Iconos consistentes
* Microanimaciones
* Transiciones suaves

La inspiración conceptual mezcla características de aplicaciones de productividad y organización, pero sin copiar literalmente ningún diseño.

---

# ✨ Estados vacíos

UniPlanner evita mostrar pantallas completamente vacías.

Por ejemplo, si todavía no tienes tareas:

```text
✨ Todo limpio

No tienes tareas pendientes.

¡Disfruta tu tiempo libre!
```

Si no tienes metas:

```text
🎯 Todavía no tienes metas

Crea una y empieza a avanzar.
```

Y si no tienes eventos:

```text
📅 Tu calendario está vacío
```

Esto hace que la aplicación se sienta más amigable incluso cuando todavía no has agregado información.

---

# 🧩 Arquitectura

El proyecto está organizado utilizando componentes reutilizables.

Una estructura aproximada es:

```text
src/
│
├── components/
│   ├── Layout.jsx
│   ├── Sidebar.jsx
│   ├── BottomNav.jsx
│   ├── Header.jsx
│   ├── NotificationPanel.jsx
│   ├── Modal.jsx
│   ├── TaskCard.jsx
│   ├── GoalCard.jsx
│   └── SubjectCard.jsx
│
├── pages/
│   ├── Onboarding.jsx
│   ├── Dashboard.jsx
│   ├── Tasks.jsx
│   ├── Calendar.jsx
│   ├── Goals.jsx
│   ├── Grades.jsx
│   ├── Subjects.jsx
│   └── Profile.jsx
│
├── hooks/
│   └── useLocalStorage.js
│
├── utils/
│   ├── storage.js
│   ├── notifications.js
│   ├── grades.js
│   └── dates.js
│
├── App.jsx
├── main.jsx
└── index.css
```

La aplicación utiliza:

* **React**
* **Vite**
* **JavaScript**
* **Tailwind CSS**
* **LocalStorage**
* **Lucide React**

No requiere backend, autenticación ni base de datos externa.

---

# 🛠️ ¿Cómo empezar a utilizar UniPlanner?

## 1. Abre la aplicación

Al iniciar por primera vez aparecerá el Onboarding.

## 2. Completa tu información

Introduce:

```text
Nombre
Universidad
Carrera
Materias
```

## 3. Configura tus materias

Agrega las materias que estás viendo y personalízalas con colores.

## 4. Organiza tus tareas

Crea tus tareas y asigna:

* Materia
* Fecha
* Prioridad
* Descripción

## 5. Organiza tu calendario

Agrega parciales, eventos, recordatorios y otras fechas importantes.

## 6. Crea tus metas

Define objetivos académicos y actualiza su progreso.

## 7. Utiliza la calculadora de notas

Registra tus evaluaciones y descubre cuánto necesitas sacar para aprobar.

## 8. Revisa el Dashboard

Aquí tendrás una vista rápida de todo lo importante.

## 9. Revisa las notificaciones 🔔

Las alertas te ayudarán a recordar las tareas que están próximas a vencer.

## 10. Mantén tus datos seguros

Utiliza **Exportar datos** para crear periódicamente una copia de seguridad.

---

# 🎓 En resumen

UniPlanner busca convertirse en un **espacio académico personal** donde puedas centralizar todo lo relacionado con tu universidad.

```text
                    🎓 UniPlanner
                         │
        ┌────────────────┼────────────────┐
        │                │                │
      📝 Tareas       📅 Calendario     🎯 Metas
        │                │                │
        └────────────────┼────────────────┘
                         │
                 ┌───────┴───────┐
                 │               │
             🧮 Notas        📚 Materias
                 │               │
                 └───────┬───────┘
                         │
                    👤 Perfil
                         │
                    💾 LocalStorage
```

La idea principal es sencilla:

> **Una sola aplicación para organizar tu universidad, con toda tu información en un solo lugar y disponible directamente desde tu navegador.** ✨
