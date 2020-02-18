# framework-lettuce

_Este framework, esta basado en Webdriverio. Es posible automatizar cualquier proyecto Web o Movil, a través de estos Keyword y funciones.La librería esta repartida en Keywords, BrowserManager y una serie de utilidades: dates, email y tableUtils._

## Instalación del proyecto 🚀_

_Para poder usar la libreria del framework, es necesario instalarla en el proyecto. Para instalarla, se puede conseguir lanzando el siguiente comando:_
```
npm install node-tap --save-dev
```

## Versions

**1.1.6** Se elimina el reporte cucumber de la libreria. Para realizar una captura sobre los comandos es necesario hacerlo a través del fichero configuración de Webdriverio. pudiendo configurar si queremos captura en todas las acciones o especificamente en alguna:
```
lettuce: {
	errorCommand: function(command, error){
		if(command==="click"){ //En caso de no seleccionarse una acción realizará en todas las acciones por defecto.
			cucumberJson.attach(browser.takeScreenshot(), 'image/png');
		}
	}
},
```

## Framework ⌨️_

### Keywords

Dentro de esta libreria se pueden encontrar todos los métodos, que se usarán para interactuar con los elementos de la pantalla.

**getData y setData:**

_Se usan para realizar el guardado y la obtención de datos obtenidos en tiempo de ejecución. Por ejemplo. Se obtiene el texto de un elemento en pantalla y se almacena para poder comprobarlo en una pantalla posterior._
```
Keywords.setData("clave", "valor");

console.log(Keywords.getData("clave")) //Se imprimirá por pantalla: valor
```

**pushOn:** 

_Realiza la acción de hacer click sobre un elemento en pantalla. No es necesario que este visible en pantalla, pero si tiene que estar cargado en el DOM. Por ejemplo:_
```
Keywords.pushOn(selector); //selector puede ser un xpath o un selector CSS
```

**writeInto:**

_Realiza la acción de hacer escribir un valor sobre un elemento en pantalla. No es necesario que este visible en pantalla, pero si tiene que estar cargado en el DOM. Por ejemplo:_
```
Keywords.writeInto(selector, texto) // Se escribirá el texto en el elemento pasado por parametro
```

**getText y getPropety:**

_Estos dos métodos obtienen la propiedad que se pase por parametro y en el caso de getText, obtiene el texto del elemento. Por ejemplo:_
```
let propertyElem = Keywords.getProperty("//button", "id") //Se obtiene la propiedad 'id' del selector '//button', que contiene el id 'login_id'
let textElem = Keywords.getProperty("//button", "id") //Se obtiene el texto del botón 'Login'
console.log(propertyElem); // Imprime por consola: login_id
console.log(textElem); // Imprime por consola: Login
```

**verifyText y containsText:** 

_Realiza la comparación de un texto visible en pantalla con un texto pasado por parametro. En caso de no ser iguales, lanza una excepción. Es posible pasar un parametro para poder comprobar que un texto no esta en pantalla. En este caso, si existe el texto lanza una excepción. Cuando se usa EL Keyword containsText, solo es necesario que se compruebe que parte o todo el texto del elemento es igual. Por ejemplo:_
```
Keywords.verifyText("//button", "Login"); // El elemento contiene el texto concreto Login. En este caso, no fallará.
Keywords.containsText("//button", "ogin"); // El elemento contiene el texto ogin. En este caso, no fallará.
Keywords.verifyText("//button", "ogin"); // El elemento no contiene el texto concreto Login. En este caso, fallará.
Keywords.containsText("//button", "LoginFalso"); // El elemento no contiene el texto LoginFalso. En este caso, fallará.
```

**element y elements:** 

_Obtiene el id o los ids de los elementos, para poder usarlos en otro keyword. Por ejemplo:_
```
let elementArray = Keywords.elements("button"); // Obtiene todos los ids de los elementos con el selector CSS button
for (i; i < elementArray.length; i++) {
	Keywords.pushOn(elementArray[i]); 	// Realizará un click sobre todos lo botones existentes en pantalla
}
```

**selectOption:**

_Seleciona una opción de un elemento tipo Selector. La opción será el texto visible en la pantalla. Por ejemplo:_
```
Keywords.selectOption("//selector", "Option1"); // La opción 'Option1' será seleccionada en el selector '//selector'
```

**wait, waitToBePresent, waitToVanish y waitForExist:**

_Realiza una espera explicita(Pasando un tiempo en segundos concreto) o implicita(Esperará a que aparezca o desaparezca un elemento en un tiempo determinado). En caso de implicitas, cuando la condición no se cumpla en el tiempo pasado, se lanza una excepción. Por ejemplo:_ 
```
Keywords.wait(5); // Esperará 5 segundos.
Keywords.waitToBePresent("//button", 10); // Esperará hasta 10 segundos a que el selector //button este presente en pantalla. 
Keywords.waitForExist("//button", 15); // Esperará hasta 15 segundos a que el selector //button exista en el DOM. 
Keywords.waitToVanish("//button", 20); // Esperará hasta 20 segundos a que el selector //button desaparezca de pantalla. 
```

**isPresent, isNotPresent y isDisplayed:**

_Realiza una verificación de que un elemento esta presente en pantalla. En caso de no estar presente o mostrandose en pantalla, lanza una excepción. Por ejemplo:_ 
```
Keywords.isPresent("//button", 10); // Comprueba que un elemento esta presente en el DOM.
Keywords.isNotPresent("//button", 15); // Comprueba que un elemento no esta presente en el DOM.
Keywords.isDisplayed("//button", 20); // Comprueba que un elemento esta mostrandose en pantalla.
```

**exists y notExists:**

_Comprueba si un elemento esta o no esta en pantalla. En este caso, no lanza una excepción sino que devuelve un booleano true o false. Por ejemplo: Un button con el texto "Login" se muestra en pantalla_ 
```
Keywords.exists("//button[text()='Login']", 10); // Devuelve un true
Keywords.exists("//button[text()='LogOut']", 10); // Devuelve un false
Keywords.notExists("//button[text()='Login']", 10); // Devuelve un false
Keywords.notExists("//button[text()='LogOut']", 10); // Devuelve un true
```

**equalValues, assertValues y assertValuesArray:**

_Son métodos, que validan si dos textos o arrays son iguales. En el caso de equalsValues, devuelve un booleano en caso de ser iguales true y false en caso de no serlo. assertValues y assertValuesArray lanzan una excepción en caso de que sean distintos. Por ejemplo:_
```
let value1 = "hello1";
let value2 = "hello2";
let array1 = {"hello1", "hello2"};
Keywords.equalValues(value1, value1); // Devuelve un true
Keywords.assertValues(value1, value1); // No lanza una execpción
Keywords.assertValuesArray(array1, array1); // No lanza una execpción

Keywords.equalValues(value1, value2); // Devuelve un false
Keywords.assertValues(value1, value2); // Lanza una execpción
Keywords.assertValuesArray(array1, array2); // Lanza una execpción
```

**executeScript:**

_Es posible ejecutar un script sobre linea de comandos del navegador, para realizar una acción javascript. Por ejemplo: Es posible hacer click a través de un script_
```
Keywords.executeScript("document.querySelector(\"" + element + "\").click();"); // realiza click sobre el elemento a través de un comando javascript
```

**dragToFind y scrollIntoView:**

_Con estos dos Keywords, es posible hacer scroll sobre la pantalla para encontrar un elemento. En el caso de scrollIntoView, hace scroll hasta traer el elemnto a pantalla(Superior o inferior a través del parametro 'top'). Por ejemplo:_
```
Keywords.dragToFind("button"); // Mueve el ratón hasta el elemento 'button'
Keywords.scrollIntoView("button", true); // Mueve el elemento hasta la parte superior de la pantalla
Keywords.scrollIntoView("button", false); // Mueve el elemento hasta la parte inferior de la pantalla
```

## BrowserManager

Dentro de esta libreria se pueden encontrar todos los métodos, que se usarán para interactuar con el navegador.

**debug:**

_En el punto en el que se ponga este método, se realizará un punto de interrupción, hasta que se pulse dos veces Ctrl+c. Por ejemplo:_

```
Keywords.dragToFind("button");
browserManager.debug();			//La ejecución se detendrá en este punto.
Keywords.scrollIntoView("button", false);
```

**getUrl y getTitle:**

_Obtiene la url y el título de la página en la que se esta navegando en ese momento. Por ejemplo: Se esta automatizando la web www.github.com_

```
console.log(browserManager.getUrl()); //Imprimirá: www.github.com
console.log(browserManager.getTitle()); //Imprimirá: GitHub
```

**navigateTo:**

_Realiza la acción de navegar a una url pasada por parametro. Por ejemplo: Se quiere navegar a www.github.com_

```
browserManager.navigateTo("www.github.com"); 
```

**refresh:**

_Realiza la acción de refrescar la página actual. Por ejemplo:_

```
browserManager.refresh(); 
```

**forwardButton y backButton:**

_Realiza la acción de pulsar el botón de retroceder y avanzar a las web anterior y posteriormente navegadas. Por ejemplo:_

```
browserManager.forwardButton();  //Navega a la pantalla siguiente
browserManager.backButton();  //Navega a la pantalla anterior
```

**deleteCookies:**

_Realiza la acción de borrar las cookies almacenadas. Es posible seleccionar las cookies que se quieren eliminar. Por ejemplo:_

```
browserManager.deleteCookies();  //Eliminará todas las cookies
```

**maximize y fullScreen:**

_Es posible maximizar la pantalla o poner el navegador a pantalla completa. Por ejemplo:_

```
browserManager.maximize();  //Maximiza la pantalla al zoom 100%
browserManager.fullScreen();  //El navegador se ejecutará en pantalla completa
```

**getSize:**

_Obtiene el tamaño de la pantalla en el que se esta ejecutando. Por ejemplo:_

```
browserManager.getSize();  //Devuelve el tamaño de la pantalla en pixeles
```

**switchWindow:**

_Realiza el cambio de ventana en caso de haber más de una. Cambia a una pestaña diferente a la actual. Por ejemplo:_

```
browserManager.switchWindow();  //Cambia a una pestaña que haya saltado en la ejecución de la prueba.
```

**closeWindows:**

_Realiza el cierre de las pestañas, hasta que solo exista una. Por ejemplo:_
```
browserManager.closeWindows();  //Cierra todas las pestañas menos una.
```

**switchToFrame:**

_Realiza el cambio de frame, dentro de la misma ventana. Es necesario pasar el selector del frame. Cuando no se pase el selector, se accederá a la raiz del DOM. Esperará 10 segundos por defecto, pero es posible pasarle por parametro un tiempo de espera custom. Por ejemplo:_

```
browserManager.switchToFrame("frame", 10);  //Cambia al frame con selector "frame", esperará 10s como maximo
```

**alertAccept y alertCancel:**

_Estos métodos aceptan o cancelan las alertas emergentes. Por ejemplo:_
```
browserManager.alertAccept();  //Acepta la alerta emergente
browserManager.alertCancel();  //Cancela la alerta emergente
```

## Sfdx

Dentro de esta librería podremos encontrar métodos para realizar acciones sobre la base de datos de salesforce a través de Sfdx. Por ejemplo será posible consultar, crear, borrar o actualizar campos. 

**bulkUpsert:**

_Es posible realizar una actualización de datos. En caso de que el registro no exista se creará. Para usar este método, es necesario pasar por parametro el objeto de Salesforce que se tiene que modificar, el fichero csv que vamos a cargar con los datos y el externalId, que es el valor clave por el que se realizará la inserción. Por ejemplo, si se quiere cargar el siguiente csv en el objeto 'Account' con el externalId 'Name':_

Name         ,MM_GBL_Identificador_unico_cliente__c ,RecordType.Name			,conf__CUSTOMER_IS_SUPPLIER_TYPE__c
Cliente100	 ,Cliente100     						,CONF_Confirming			,Cliente
Cliente101	 ,Cliente101     						,CONF_Confirming			,Cliente

```
sfdx.bulkUpsert("Account", "rutaCsv, "Name"); // Es necesario poner la ruta relativa o absoluta del fichero csv
```

**bulkDelete:**

_Es posible realizar un borrado masivo de datos. Para usar este método, es necesario pasar por parametro el objeto de Salesforce que se tiene que modificar y el fichero csv con los datos que se quierer borrar. Por ejemplo, si se quiere borrar el siguiente csv en el objeto 'Account' con el externalId 'Name':_

Name         ,MM_GBL_Identificador_unico_cliente__c ,RecordType.Name			,conf__CUSTOMER_IS_SUPPLIER_TYPE__c
Cliente100	 ,Cliente100     						,CONF_Confirming			,Cliente
Cliente101	 ,Cliente101     						,CONF_Confirming			,Cliente

```	
sfdx.bulkDelete("Account", "rutaCsv); // Es necesario poner la ruta relativa o absoluta del fichero csv
```

**recordDelete:**

_Es posible realizar un borrado de un registro concreto. Para usar este método, es necesario pasar por parametro el objeto de Salesforce que se tiene que modificar y el fichero csv con el registro que se quierer borrar. Por ejemplo, si se quiere borrar el siguiente csv en el objeto 'Account' con el externalId 'Name':_

Name         ,MM_GBL_Identificador_unico_cliente__c ,RecordType.Name			,conf__CUSTOMER_IS_SUPPLIER_TYPE__c
Cliente100	 ,Cliente100     						,CONF_Confirming			,Cliente

```	
sfdx.bulkDelete("Account", "rutaCsv); // Es necesario poner la ruta relativa o absoluta del fichero csv
```

**soqlQuery:**

_Con este método es posible realizar una query para extraer los datos que se necesiten para las pruebas. Es necesario pasarle por parametro la query que extraería los datos y el tipo de formato que queremos(csv). Por ejemplo, si se quiere obtener el Cliente100:_

´´´
soqlQuery("SELECT Id FROM Account WHERE Name='Cliente100', "csv");
´´´