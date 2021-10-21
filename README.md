# Bank

Aplicacion de simulacion de un banco. Al registrarse se crean 2 cuentas, una en pesos y otra en dolares. Desde la cuenta en pesos se puede transferir plata a otras personas, crear un plazo fijo y comprar dolares. Tambien se pueden consultar los movimientos de la cuenta y el balance de los ultimos 5 dias.
La aplicacion esta hecha en Nodejs con Typescript y MongoDB para la base de datos.

## Levantar el proyecto

Primero hay que completar los datos sensibles en la carpeta config como el nombre de la DB, la conexion con la misma, el puerto y la key para JSON Web Token y luego renombrar ambos archivos sacando el .example.

Y luego por terminal en la carpeta raiz correr estos comandos

```bash
yarn install

yarn tsc

yarn start
```

## Endpoints

-   [GET] /profile: muestra la informacion basica del usuario con el balance de los ultimos 5 dias
-   [POST] /register: Crea un usuario. Requiere firstname, lastname, password, email y pin
-   [POST] /login: loguea a un usuario y devuelve el jwt. Requiere email y password

-   [GET] /account/movements: devuelve los ultimos 5 movimientos de la cuenta. Se pagina enviando page
-   [PUT] /account/deposit: deposita dinero en una cuenta, esta hecho con fines de prueba y no tiene validaciones. Requiere el cbu y amount
-   [PUT] /account/transfer: transfiere dinero a otra cuenta. Requiere from, to, amount y pin si la transferencia es mayor a 10000
-   [PUT] /account/exchange: permite comprar dolares y los deposita en la cuenta correspondiente. Requiere amount
-   [POST] /account/fixed-term: crea un plazo fijo. Requiere amount y period en dias
-   [DELETE] /account/fixed-term: cancela un plazo fijo y cobra una multa del 20%. Requiere amount, startDate y endDate
