# CTC
Simulador de un Control de Tráfico Centralizado

Esta aplicación simula el tablero mímico de una central de Control de Tráfico Centralizado (CTC).

El menú se abre del icono de las tres barras en el extremo izquierdo. Los sectores disponibles se muestran bajo el encabezado "Recientes" pues en su momento ese item habrá de mostrar los que el usuario ha usado más recientemente, mientras que los sectores se desplegarán de otra lista más larga.  Como sólo hay dos, entonces, no valía la pena agregar compllicaciones.

El globito de dialogo a la derecha mostrará el teletipo.  Por ahora solo lo muestra, pero no hay nada que envíe mensajes al mismo, por lo que siempre está en blanco.

Una de las opciones del menu es Login. Por el momento el único efecto es mostrar el nombre de usuario y, si la tiene, su foto, en lugar del monigote anónimo y el alias `guest` a la derecha.

Si se selecciona un sector (sugiero Constitución) mostrará el nombre en la barra azul y el mímico en el panel central.

Algunas de las celdas están activa, los cambios y también las señales.  Al hacer click en cualquiera de ellas se abre un panel a la derecha mostrando las opciones.

Si se pulsa cualquiera de los botones para cambiar la posición del cambio, se mostrará el efecto de inmediato y tras una ligera demora se propagarán los enclavamientos que tenga configurado, cambiarán las luces de los semaforos y otros cambios vinculados.

Tanto celdas como las senales dentro de las celdas se pueden poner en manual.  En ese caso, se pueden mover a mano, pero no responden al enclavamiento propagado desde otras celdas. La celda o senal tendrán un halo en rosa para indicar el estado manual.  Al salir de manual, se deberían propagar los enclavamientos pendientes.

Para volver al mímico, basta hacer click en cualquier lugar del tablero.

La opción Admin Sectores permite agregar, actualizar o borrar nuevos sectores.  Si se agrega un sector con un identificador ya existente, actualizará ese sector. Se recomienda llamar al archivo por el mismo identificador del sector.

----

La configuración de los diversos sectores está dada por archivos en formato [JSON](http://www.json.org/).

* [Descripción de un sector](#descripci%C3%B3n-de-un-sector)
	* [Celdas](#celdas)
		* [Línea](#linea)
		* [Cambio](#cambio)
		* [Paragolpe](#paragolpe)
		* [Cruce](#cruce)
		* [Triple](#triple)
	* [Señales](#se%C3%B1ales)
	* [Enclavamientos](#enclavamientos)
		* [Apareados](#apareados)
		* [Cambio a señal](#cambio-a-se%C3%B1al)


Acorde al estándar del formato JSON, todos los nombres de propiedades han de estar entrecomillados.

Los valores de las claves de este diccionario se corresponden a los nombres de archivo a los cuales ha de agregársele la extensión `.json`.  Así pues, la entrada `"constitucion"` corresponde al archivo `data/constitucion.json`. Las claves del diccionario así como los nombres de los archivos deben ser únicos dentro de la aplicación.  Ninguno de ellos se muestra al usuario y no se recomienda el uso de caracteres que pudieran causar problemas de portabilidad entre sistemas operativos, tales como vocales acentuadas o incluso espacios en blanco.

## Descripción de un sector

Cada sector está descrito en un archivo en formato JSON.

El encabezado contiene información global sobre el sector, en particular:

* `idSector`: El identificador único del sector. Este se usará internamente, el usuario no debería verlo nunca. Basta que sea único.  Usualmente es el mismo que el nombre del archivo en que está contenido, por ello, conviene que tenga caracteres válidos como nombre de archivo.
* `descrCorta`: Un texto breve que describa el sector. Se usará, por ejemplo, en el menú.
* `descr`: El nombre completo del sector.
* `alto`: El número de celdas que ocupa este sector en altura.
* `ancho`: El número de celdas que ocupa este sector a lo ancho.
* `celdas`: Un objeto que describe cada una de las celdas.

El valor de `descr` se mostrará en la solapa.  A diferencia del nombre de archivo, que el usuario no verá, este se mostrará en la solapa y debe ser legible.  Por ello, el archivo `constitucion.json` tiene como descripción en su encabezado: `"descr": "Constitución"`, con mayúscula y acento.

La imagen que representa el sector se ajustará para ocupar el máximo espacio posible dentro de la pantalla basándose en el `alto` y `ancho` declarados en el encabezado.

Por ejemplo, el archivo `constitucion.json` contendrá la siguiente descripción:

	{
	  "idSector": "constitucion",
	  "descrCorta": "Constitución",
	  "descr": "Estación Constitución, Ciudad de Buenos Aires, Argentina",
	  "ancho": 16,
	  "alto": 7,
		"celdas": [{
		...
		}]
	}

El orden de las propiedades es indistinto, pueden darse en cualquier orden. Eso se aplica a todo el archivo.

### Celdas

Cada sector esta compuesto de varias celdas.  No es necesario declarar las celdas vacías, así pues el número de celdas en esta sección es habitualmente menor que el producto de `alto` * `ancho` del encabezado pues las celdas vacías no necesitan declararse.

La configuración de las celdas está formada por la propiedad `celdas` que apunta a un *arreglo* (array) de propiedades de cada celda.  Toda celda debe tener al menos las siguiente propiedades:

* `coords`: un par de números separados por coma indicando las coordenadas `X` e `Y` de la celda, contando desde cero con la celda `"0,0"` ubicada arriba a la izquierda.
* `tipo`: indica el tipo de celda.  El resto de las propiedades de la celda depende del tipo, según se verá a continuación.

La mayoría de las celdas pueden tener otras propiedades opcionales independientemente de su tipo, a saber [senales](#senales) o [enclavamientos](#enclavamientos).

Por ejemplo, el tipo más simple de celda es el que contiene una simple línea:

	"celdas": [
		...,
		{
			"coords": "5,0"
			"tipo": "linea",
			"descr": "XVI-b",
			"desde": {
				"dir":"N",
			},
			"hacia": {
				"dir":"S"
			}
		},
		...

Dentro de la lista de `celdas` la que se encuentra en la coordenada `5,0`  contiene un tramo de vía simple que va de norte `N` a sur `S`.  La leyenda `XVI-b` se mostrará en una esquina de la celda, si no se proveyera, simplemente se mostrará la coordenada.  Cada tramo de vía se define con al menos la propiedad `dir` (direción) que señala a alguno de los puntos cardinales.  

Todas las celdas son más o menos cuadradas.  Todos los segmentos de vías que contienen irradian del centro de ese cuadrado hacia una de 8 posibles direcciones, las cuatro esquinas y los puntos intermedios de los lados.  Estos extremos se los llama por su coordenada geográfica.   Aún así, todas las líneas pasan por el centro del cuadrado.  Es obvio que una línea de norte a sur como la del ejemplo cruzará por el centro del cuadrado, pero también lo hará una que vaya de norte a este.  En lugar de hacer un simple trazo en diagonal uniendo estos lados, la celda se graficará con dos segmentos, uno desde el arriba (*norte*) hasta el centro y otro del centro a la derecha (*este*).

	NW  N  NE
	  \ | /
	W - . - E
	  / | \
	SW  S  SE

Los tipos de celdas son:

#### linea

Contiene una vía con una única entrada y una única salida, sin cambios o desvíos. Requiere las propiedades `desde` y `hacia` que contendrán la propiedad `dir` indicando los puntos geográficos que une.  Los nombres `desde` y `hacia` son arbitrarios y no señalan el sentido del tráfico en la línea.

Ej.:

	{
		"coords": "5,0"
		"tipo": "linea",
		"descr": "XVI-b",
		"desde": {
			"dir":"N",
		},
		"hacia": {
			"dir":"S"
		}
	}

#### Cambio

Contiene una vía con una entrada, la `punta` y dos `ramas`, una `normal` y otra `desviado`.  Si bien la salida `normal` suele ser la opuesta a la `punta` esto no es obligatorio.

La propiedad opcional `posicion` indica la posición del cambio y su valor debe corresponder a alguna de las ramas.  Por defecto, es `normal`.

La propiedad opcional `manual` excluye al cambio de cualquier automatismo (ver [Enclavamientos](#Enclavamientos) más adelante) y sólo responderá a comandos manuales.  Habitualmente, este valor es establecido dinámicamente desde el tablero mímico. Por defecto es `false`.  Si se indica, el valor `true` of `false` no debe ir entrecomillado, dado que es un booleano, no una cadena de caracteres (o sea: `"manual": true,`)

Ej:

	{
		"coords": "8,3",
		"tipo": "cambio",
		"posicion": "normal",
		"punta": {
			"dir": "SE"
		},
		"ramas": {
			"normal": {
				"dir": "NW"
			},
			"desviado": {
				"dir": "W"
			}
		}
	}

#### Paragolpe

Contiene un tramo de vía sin salida.  Requiere indicar la única salida mediante la propiedad `desde`.

Ej:

	{
		"tipo": "paragolpe",
		"desde": {
			"dir": "E"
		},
		"coords": "0,4"
	}

#### Cruce

Identifica un cruce de vías que no se conectan entre sí.  Pueden cruzarse a un mismo nivel o no.  Contiene las propiedades `l1` y `l2` identificando a las dos líneas que se cruzan.  Cada una de ellas lleva las propiedades `desde` y `hacia` como una celda de tipo `linea`. Opcionalmente pueden llevar la propiedad `nivel`.  Este valor es relativo, la línea con un nivel mayor cruza por encima de la de nivel menor.  Si los valores coinciden es que se cruzan a un mismo nivel.  Si falta el nivel se lo supone cero.

Ej:

	{
		"coords": "3,4",
		"tipo": "cruce",
		"l1": {
			"nivel": 1,
			"desde": {
				"dir": "SW"
			},
			"hacia": {
				"dir": "NE"
			}
		},
		"l2": {
			"desde": {
				"dir": "W"
			},
			"hacia": {
				"dir": "E"
			}
		}
	}

En este ejemplo, la linea `l1` cruza por encima de la `l2` dado que la primera tiene `nivel` en 1 y la otra no indica nivel, por lo que se lo supone cero. Los números, al igual que los valores booleanos, no van entrecomillados.

#### Triple

Identifica un cambio de 3 salidas. Al igual que el cambio corriente, al extremo común se le llama `punta` y los otros serán `izq`, `centro` y `der`.  En realidad la denominación de `izq` y `der` es arbitraria y podrían estar cruzadas.

Ej:

	{
		"coords": "2,4",
		"tipo": "triple",
		"posicion": "centro",
		"punta": {
			"dir": "W"
		},
		"ramas": {
			"centro": {
				"dir": "E"
			},
			"izq": {
				"dir": "NE"
			},
			"der": {
				"dir": "SE"
			}
		}
	},

La configuración admite la propiedad opcional `"posicion"` que debe corresponderse al nombre de algúna de las ramas, o sea, `izq`, `centro` o `der`.

Al igual que el [cambio](#cambio), también admite la propiedad `manual`.

#### Señales

Las señales son parte opcional de las celdas y se declaran dentro de cada celda individual.

Cada celda puede tener tantas señales como segmentos de vía, esto es 8. Ninguna celda tiene 8 segmentos, sólo las celdas de tipo `cruce` y `triple` tiene 4 segmentos, las demás no llegan a eso por lo que no tiene sentido que hubiera más señales que segmentos aunque nada impide poner una señal en medio del campo, donde nadie pueda verla.

Las señales siempre son *entrantes* esto es, son visibles a los trenes que circulan en sentido entrante a la celda o sea, se dirigen a su centro. Una señal *saliente* de una celda es *entrante* en la contigua por lo tanto ha de definirse en la celda a que entra.

Cada señal puede estar compuesta de hasta 3 luces, la `primaria` y dos secundarias `izq` y `der` por debajo de esta y ligeramente hacia un lado o al otro.  En el mímico, no se muestra un foco para cada color de los cuales sólo uno está encendido a un tiempo sino que se muestra un único círculo que cambia de color.  

Las señales se identifican por la orientación del segmento en que se encuentran.

Ej.:

	{
		"coords": "4,4",
		"tipo": "cambio",
		"posicion": "normal",
		"punta": {
			"dir": "W"
		},
		"ramas": {
			"normal": {
				"dir": "E"
			},
			"desviado": {
				"dir": "SE"
			}
		},
		"senales": [{
			"dir": "W",
			"primaria": {
				"estado": "alto"
			},
			"der": {
				"estado": "precaucion"
			}
		}]
	}

En este ejemplo, en la celda `4,4` que contiene un cambio, habrá una señal en la punta que permite dar paso a cualquiera de los dos ramales.  La `punta` está hacia el lado izquierdo (`"W"`) al igual que lo está la única señal.  Esta está compuesta de dos luces, la `primaria` y la `der`, la primera en rojo (`alto`) la otra en amarillo (`precaucion`).   

Podría agregarse otra luz en el segmento `invertido` (dirección `"SE"`) que regule el acceso de los trenes en el desvío a la vía principal:

	{
		"coords": "4,4",
		"tipo": "cambio",
		"posicion": "normal",
		"punta": {
			"dir": "W"
		},
		"ramas": {
			"normal": {
				"dir": "E"
			},
			"desviado": {
				"dir": "SE"
			}
		},
		"senales": [{
			"dir": "W",
			"primaria": {
				"estado": "alto"
			},
			"der": {
				"estado": "precaucion"
			}
		},
		{
			"dir": "SE",
			"primaria": {
				"estado":"alto"
			}
		}]
	}

Las señales se identifican mediante 3 valores, las dos primeras las coordenadas de la celda a la cual se le agrega la orientación.  En el ejemplo anterior tenemos las señales `"4,4:W"` y `"4,4:SE"`.  Dentro de la configuración de la celda, la primera parte (`"4,4"`) se omite por redundante dado que la definición de la señal esta contenida dentro de la definición de la celda.

El estado inicial de una señal está dado por el archivo de configuración, luego, este dependerá de los enclavamientos definidos más adelante o podrá ser puesta en manual.  Cuando una señal depende de dos o más enclavamientos, siempre mostrará el estado más restrictivo.  Por ejemplo, una señal se podrá depender de que un cambio esté en la posición normal y que ciertos segmentos de vía estén libres.  en este aso, la señal sólo se pondrá en verde si ambos enclavamientos coinciden en que deba estar en verde.

### Enclavamientos

Llamamos enclavamientos a los automatismos que relacionan las acciones de los diversos elementos del tablero, por ejemplo, cambios que actúan en consonancia o que afectan señales.  

Todos los enclavamientos tienen en común la propiedad `tipo` que indica qué clase de automatismo utiliza.

#### Apareados

Dos o más celdas con vías de `"tipo": "cambio"` están apareadas cuando se mueven en consonancia, cuando una cambia a un estado las otras cambian al estado que se indica.  Este enclavamiento sólo requiere que se enumeren las coordenadas de las celdas que contienen los cambios a aparear:

	{
		"coords": "4,4",
		"tipo": "cambio",
		...
		"enclavamientos": [{
			"tipo": "apareados",
			"celda": "constitucion:5,5",
			"normal": "normal",
			"desviado": "desviado"
		}]
	}

En este caso, el cambio que se encuentra en la celdas `4,4` está asociado a la celda en `constitucion:5,5` de tal manera que cuando la celda en `4,4` este en `normal` la otra también lo esté y viceversa.  Si la celda en `4,4` fuera de tipo `triple`, contendría descripciones para sus tres posibles estados y viceversa, una celda de tipo `cambio` podría afectar a una de tipo `triple`.  La razón de que la celda de destino se describa de una forma larga con el prefijo de `idSector`, esto es, `constitucion:5,5` es que la celda apareada puede estar en otro sector.

#### Cambio a señal

Define un enclavamiento por el cual una señal responde al estado de un cambio o triple.  El cambio puede o no estar en la misma celda que la señal.

Ej.:

	{
		"coords": "8,3",
		"tipo": "cambio",
		"posicion": "normal",
		"punta": {
			"dir": "SE"
		},
		"ramas": {
			"normal": {
				"dir": "NW"
			},
			"desviado": {
				"dir": "W"
			}
		},
		"senales": [{
			"dir": "SE",
			"primaria": {
				"estado": "libre"
			},
			"izq": {
				"estado": "alto"
			}
		}],
		"enclavamientos": [{
			"tipo": "senalCambio",
			"senal": "constitucion:8,3:SE",
			"normal": {
				"primaria": "libre",
				"izq": "alto"
			},
			"desviado": {
				"primaria": "alto",
				"izq": "precaucion"
			}
		}]
	},

Esta entrada define un enclavamiento de tipo `senalCambio` donde la señal en `"constitucion:8,3:SE"` depende del cambio en esa misma celda `"8,3"`.  Cuando el cambio está en `"normal"` la luz `primaria` de la señal deberá estar en `"libre"` (verde) y la luz secundaria `"izq"` en `"alto"` (rojo).  Cuando el cambio está en la posición `"desviado"` la luz primaria estará en rojo y la luz secundaria en amarillo.

En el caso de una celda de tipo `triple` en lugar de propiedades `normal` y `desviado` tendrá propiedades `izq`, `centro` y `der`.
