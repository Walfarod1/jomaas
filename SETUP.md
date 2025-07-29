# Configuración del Documento de Google Sheets para la App de Control de EPP

Para que esta aplicación funcione correctamente, es crucial que el documento de Google Sheets asociado esté estructurado de una manera específica. Siga las instrucciones a continuación para configurar su spreadsheet.

## 1. Crear el Documento de Google Sheets

1.  Vaya a [sheets.google.com](https://sheets.google.com) y cree un nuevo spreadsheet en blanco.
2.  Puede darle el nombre que desee. El script de la aplicación se asociará con este documento y lo usará como la base de datos.

## 2. Crear las Hojas Requeridas

Dentro de su spreadsheet, debe crear **cuatro hojas** con los siguientes nombres exactos (respetando mayúsculas y minúsculas):

1.  `Inventario`
2.  `Aprobadores`
3.  `Catálogo EPP`
4.  `Entregas`

## 3. Estructura de Columnas para cada Hoja

Asegúrese de que la **primera fila** de cada hoja contenga los encabezados de columna exactamente como se describe a continuación.

### Hoja: `Inventario`

Esta hoja lleva el control de la cantidad de Equipos de Protección Personal (EPP) disponibles.

| Columna A | Columna B   | Columna C |
| :-------- | :---------- | :-------- |
| **ID**    | **Descripción** | **Cantidad**|
| CAS-001   | Casco de Seguridad Blanco | 50        |
| LEN-002   | Lentes de Seguridad Claros| 120       |
| GUA-003   | Guantes de Nitrilo        | 300       |
| ...       | ...                       | ...       |

-   **ID**: Un código único para cada tipo de EPP.
-   **Descripción**: El nombre completo del EPP.
-   **Cantidad**: El número de unidades disponibles en stock.

### Hoja: `Aprobadores`

Esta hoja contiene la lista de personas autorizadas para aprobar y registrar las entregas de EPP. La columna `ID` se usa como "contraseña" en la aplicación.

| Columna A | Columna B                |
| :-------- | :----------------------- |
| **ID**    | **Nombre**               |
| 5658      | William Alfaro Delgado   |
| 9876      | Ana Solís                |
| ...       | ...                      |

-   **ID**: El identificador único del aprobador (puede ser su número de empleado).
-   **Nombre**: El nombre completo del aprobador.

### Hoja: `Catálogo EPP`

Esta hoja define la lista completa de EPP que se pueden solicitar. La aplicación utiliza esto para poblar las opciones en los formularios de solicitud.

| Columna A           |
| :------------------ |
| **Descripción**     |
| Casco de Seguridad Blanco |
| Lentes de Seguridad Claros|
| Guantes de Nitrilo  |
| ...                 |

-   **Descripción**: Debe coincidir con las descripciones en la hoja `Inventario`.

### Hoja: `Entregas`

Esta hoja funciona como un registro histórico de todas las entregas de EPP realizadas. La aplicación escribirá una nueva fila aquí cada vez que se procese una entrega. No necesita llenarla inicialmente.

| Columna A   | Columna B     | Columna C         | Columna D     | Columna E         | Columna F | Columna G       | Columna H |
| :---------- | :------------ | :---------------- | :------------ | :---------------- | :-------- | :-------------- | :-------- |
| **Timestamp** | **ID Empleado** | **Nombre Empleado** | **ID Aprobador**| **Nombre Aprobador**| **ID EPP**  | **Descripción EPP** | **Motivo**|
| (auto)      | (auto)        | (auto)            | (auto)        | (auto)            | (auto)    | (auto)          | (auto)    |

-   **Timestamp**: La fecha y hora de la entrega (registrada automáticamente).
-   **ID Empleado**: ID del empleado que recibe el EPP.
-   **Nombre Empleado**: Nombre del empleado que recibe el EPP.
-   **ID Aprobador**: ID de la persona que aprobó la entrega.
-   **Nombre Aprobador**: Nombre de la persona que aprobó la entrega.
-   **ID EPP**: El ID del EPP entregado.
-   **Descripción EPP**: La descripción del EPP entregado.
-   **Motivo**: La razón de la solicitud (e.g., "Reposición", "Nuevo").

## 4. Implementar el Script en Google Apps Script

1.  Con su Google Sheet abierto, vaya a `Extensiones` > `Apps Script`.
2.  Se abrirá el editor de scripts. Borre cualquier código que aparezca por defecto.
3.  Copie todo el contenido del archivo `Code.gs` de este proyecto y péguelo en el editor de scripts.
4.  Guarde el proyecto de script (ícono de disquete).

Una vez completados estos pasos, su aplicación estará conectada a esta base de datos de Google Sheets y lista para ser desplegada y utilizada.
