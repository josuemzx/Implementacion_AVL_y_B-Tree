### Universidad Nacional de San Agustín <br/> Maestría en Ciencia de la Computación <br/>  Algoritmos y Estructura de Datos
<hr/>

# Practica 02

| DOCENTE | CARRERA | CURSO |
| :-: | :-: | :-: |
| Vicente Machaca Arceda | Maestría en Ciencia de la Computación | Algoritmos y Estructura de Datos |
<br/>

| PRÁCTICA | TEMA | DURACIÓN |
| :-: | :-: | :-: |
| 02 | Algoritmos de búsqueda | 3 horas

## 1. Datos de los estudiantes
 - Esai Josue Huaman Meza
 - Alan Jerry Reyes Robles
 - Jorge Luis Zegarra Guardamino
 - Nestor Giraldo Calcinas Huaranga

## 2. Ejercicios

### 2.1. Árbol - ALV

Los árboles AVL están siempre equilibrados de tal modo que para todos los nodos, la altura de la rama izquierda no difiere en más de una unidad de la altura de la rama derecha o viceversa.
Gracias al equilibrio (o balanceo), la complejidad de una búsqueda en uno de estos árboles se mantiene siempre en orden de complejidad O(log n).
El factor de equilibrio puede ser almacenado directamente en cada nodo o ser computado a partir de las alturas de los subárboles.
Para conseguir esta propiedad de equilibrio, la inserción y el borrado de los nodos se ha de realizar de una forma especial.
Si al realizar una operación de inserción o borrado se rompe la condición de equilibrio, hay que realizar una serie de rotaciones de los nodos.
Los árboles AVL más profundos son los árboles de Fibonacci.

### 2.2. Árbol B-Tree

Cada elemento de un nodo interno actúa como un valor separador, que lo divide en subárboles. Si un nodo interno tiene tres nodos hijo, debe tener dos valores separadores o elementos a1 y a2. Todos los valores del subárbol izquierdo deben ser menores a a1, todos los valores del subárbol del centro deben estar entre a1 y a2, y todos los valores del subárbol derecho deben ser mayores a a2.
Los nodos internos del B-Tree, es decir los nodos que no son hoja, usualmente se representan como un conjunto ordenado de elementos y punteros a los hijos.
Los nodos hoja tienen la misma restricción sobre el número de elementos, pero no tienen hijos, y por tanto carecen de punteros.
El nodo raíz tiene límite superior de número de hijos, pero no tiene límite inferior.
Los Los árboles B-Tree guardan valores en cada nodo, y pueden utilizar la misma estructura para todos los nodos.

