let tree;
let deleteInput;
let deleteButton;
let insertInput;
let insertButton;
let delayInput;
let setDelayButton;
let currentNode = null;
let delay = 1000 ;
let running = false;

function setup() {
  tree = new BTree(2);// (grado *2) -1

  createCanvas(windowWidth, windowHeight);
  background(0);
  textAlign(CENTER, CENTER);
  insertInput = createInput();
  insertInput.position(20, 70);
  insertInput.size(80);
  insertButton = createButton('Añadir');
  insertButton.position(120, 70);
  insertButton.size(80);
  insertButton.mousePressed(insertButtonPressed);
  createDeleteInput();
  createDeleteButton();
  createdMinButton();
  createdMaxButton();
  createSearchInput();
  createSearchButton();

}


function setDelayButtonPressed() {
  const value = parseInt(delayInput.value());
  if (!Number.isNaN(value)) {
    delay = value;
  }
}

function createDeleteInput() {
  deleteInput = createInput();
  deleteInput.position(220, 70);
  deleteInput.size(80);
}

function createDeleteButton() {
  deleteButton = createButton('Borrar');
  deleteButton.size(70);
  deleteButton.position(320, 70);
  deleteButton.mousePressed(deleteButtonPressed);
}

function deleteButtonPressed() {
  if(running) return;
  const value = parseInt(deleteInput.value());
  if (!Number.isNaN(value)) {
    tree.delete(value);
  }
}


function createdMinButton() {
  minButton = createButton('Minimo');
  minButton.size(70);
  minButton.position(410, 70);
  minButton.mousePressed(minButtonPressed);
}

function minButtonPressed() {
  if(running) return;
  tree.busqueda(parseInt(tree.getMin()));
  console.log("El menor es: ",parseInt(tree.getMin()))
}

function createdMaxButton() {
  maxButton = createButton('Maximo');
  maxButton.size(70);
  maxButton.position(500, 70);
  maxButton.mousePressed(maxButtonPressed);
}

function maxButtonPressed() {
  if(running) return;
    tree.busqueda(parseInt(tree.getMax()));
    //tree.delete(value);
  console.log("El mayor es",parseInt(tree.getMax()))
}

function createSearchInput() {
  searchInput = createInput();
  searchInput.position(590, 70);
  searchInput.size(70);
}

function createSearchButton() {
  searchButton = createButton('Busqueda');
  searchButton.size(90);
  searchButton.position(680, 70);
  searchButton.mousePressed(createSearchPressed);
}

function createSearchPressed() {
  if(running) return;
  const value = parseInt(searchInput.value());
  if (!Number.isNaN(value)) {
    tree.busqueda(value);
  }
}



// eslint-disable-next-line no-unused-vars
function draw() {
  background(255);
  stroke(255);
  textSize(20);
  text('Visualizador B-Tree', Math.floor(windowWidth / 2), 30);
  tree.draw(Math.floor(windowWidth / 2)-200, 200, 30);
}

const insertButtonPressed = () => {
  if(running) return;
  const value = parseInt(insertInput.value());

  if (!Number.isNaN(value)) {
    running = true;

    tree.insert(value);
    tree.verify();
  }

};

class BTree {
  constructor(degree, parent) {
    this.degree = degree;
    this.parent = parent;
    this.keys = [];
    this.childs = [];
  }

  log() {
    // console.log(
    //   JSON.stringify(
    //     this,
    //     function(key, val) {
    //       if (key !== 'parent') return val;
    //     },
    //     2,
    //   ),
    // );
    console.log(this.renderString().join('\n'))

    console.log('------------------');
  }

  renderString() {
    const lines = []
    let keys = this.keys.toString();
    lines.push(keys)
    if(this.childs.length === 0) {
      return lines
    }

    let links = ''
    this.childs.map((child) => {
      const childLines = child.renderString()
      links += "|" +' '.repeat(childLines[0].length + 2)
      childLines.map((line,index) => {
        if(lines[index+4])
        lines[index + 4] += "   " + line
        else lines[index+4] = line
      })
    })

    lines[1] = ''
    lines[2] = links;
    lines[3] = ''

    const maxLength = Math.max(...lines.map( l => l.length))
    for(let i = 0; i< lines.length; i++) {
      lines[i]+= ' '.repeat(maxLength - lines[i].length)
    }

    return lines
  }

  split() {
    if (this.keys.length !== this.degree * 2 - 1) {
      return;
    }
    console.log('********* splitting current node ***********')
    const medianIndex = this.degree - 1;
    const leftChild = new BTree(this.degree, this);
    const rightChild = new BTree(this.degree, this);
    this.childs.forEach((child, index) => {
      if (index <= medianIndex) {
        child.parent = leftChild;
        leftChild.childs.push(child);
      } else {
        child.parent = rightChild;
        rightChild.childs.push(child);
      }
    });

    this.keys.forEach((key, index) => {
      if (index < medianIndex) {
        leftChild.keys.push(key);
      } else if (index > medianIndex) {
        rightChild.keys.push(key);
      }
    });

    const medianKey = this.keys[medianIndex];
    const parent = this.parent;
    if (!parent) {
      console.log('this node is root, make the new median root')
      this.keys = [medianKey];
      this.childs = [leftChild, rightChild];
    } else {
      console.log('plug in the new child to the parent of current node')
      rightChild.parent = parent;
      leftChild.parent = parent;
      const childIndex = parent.childs.findIndex((c) => c == this);
      this.parent.childs[childIndex] = leftChild;
      this.parent.childs.splice(childIndex + 1, 0, rightChild);
      let i;
      for (i = 0; i < parent.keys.length; i++) {
        if (parent.keys[i] >= medianKey) {
          break;
        }
      }
      this.parent.keys.splice(i, 0, medianKey);
    }
    console.log(`median key : ${medianKey}`)
    console.log('left child')
    leftChild.log();
    console.log('right child')
    rightChild.log();
    console.log('********** done spliting ***************')
    return { medianKey, leftChild, rightChild };
  }

  insert(value) {
    currentNode = this;

    console.log(`***** insert key : ${this.keys} in current node *******`)
    this.log();

    if (this.keys.length === this.degree * 2 - 1) {
      console.log('current node is already full')

      const { medianKey, rightChild, leftChild } = this.split();
      if (value > medianKey) {
        console.log('insert key in the right child')
        setTimeout(() => rightChild.insert(value), delay);
      } else {
        console.log('insert key in the left child')
        setTimeout(() => leftChild.insert(value), delay);
      }
    } else {
      let i = 0;
      while (value > this.keys[i] && i < this.keys.length) {
        i += 1;
      }
      if (this.childs[i]) {
        console.log('this node is not leaf, insert in to appropriate child')
        setTimeout(() => this.childs[i].insert(value), delay);
      } else {
        console.log('this node is leaf , insert key to current node ')

        if (!this.keys.includes(value)) {
          console.log("No esta repetido")
          this.keys.push(value);
          this.keys.sort(function (a, b) {
            return a - b;
          });
        }

        running = false;
        console.log('****** done *********')

      }
    }
  }

  verify(min, max) {
    console.log('Verificando');
    //this.log();
    if (this.keys.length < this.degree - 1 || this.keys.length > this.degree * 2 - 1) {
      console.error('degree - 1 <= keys count < degree*2 - 1');
      return false;
    }

    if (
      (this.childs.length > 1 && this.childs.length < this.keys.length) ||
      this.childs.length - this.keys.length > 1
    ) {
      console.error('childs length are not valid');
      return false;
    }

    if (min && this.keys[0] < min) {
      console.error('key is smaller than min');
      return false;
    }

    if (max && this.keys[this.keys.length - 1] > max) {
      console.error('key is bigger than max');
      return false;
    }
    let current = this.keys[0];
    for (let i = 0; i < this.keys.length; i++) {
      if (this.keys[i] < current) {
        console.error('keys is not sorted');
        return false;
      }
      current = this.keys[i];
    }

    for (let i = 0; i < this.childs.length; i++) {
      if (!this.childs[i].verify(this.keys[i - 1] || min, this.keys[i] || max)) {
        return false;
      }
    }
    return true;
  }
  
  // get max predecessor of a key at index
  getMax() {
    if(this.childs.length !== 0) {
      return this.childs[this.childs.length - 1].getMax()
    }
    return this.keys[this.keys.length - 1]
  }

  // get min
  getMin() {
    if(this.childs.length !== 0) {
      return this.childs[0].getMin()
    }
    return this.keys[0]
  }

  // make sure that every node that we want to call delete upon have atleast degree keys
  // so after delete a key the number of keys is not smaller than degree - 1
  delete(value) {
    running = true;
    if (!this.verify()) {
      console.error('error al borrar');
      running = false;
      return;
    }
    currentNode = this;
    console.log('Delete: Nodo Actual');
    console.log(`Valor ${value}`);
    this.log();
    if (this.keys.includes(value)) {
      console.log('Delete: Nodo Actual contiene valor');
      const index = this.keys.findIndex((v) => v === value);
      if (this.childs.length === 0) {
        console.log('Delete : el nodo actual es hoja , delete key');
        setTimeout(() => this.keys.splice(index, 1), delay);
        running = false;
        return;
      } else {
        console.log('Delte :el nodo actual no se va.');
        const leftChild = this.childs[index];
        console.log('Delete: hijo izquierdo');
        leftChild.log();
        const rightChild = this.childs[index + 1];
        console.log('Delte : hijo derecho');
        rightChild.log();
        if (leftChild && leftChild.keys.length >= this.degree) {
          console.log('Delete swap value to left child');
          const toSwap = leftChild.getMax()
          this.keys[index] = toSwap;
          setTimeout(() => leftChild.delete(toSwap), delay);
        } else if (rightChild.keys.length >= this.degree) {
          console.log('Delete swap value to right child');
          const toSwap = rightChild.getMin()
          this.keys[index] = toSwap;
          setTimeout(() => rightChild.delete(toSwap), delay);
        } else {
          console.log('Delete merge right child in to left child');
          leftChild.keys.push(value);
          rightChild.keys.forEach((key) => {
            leftChild.keys.push(key);
          });
          rightChild.childs.forEach((child) => {
            child.parent = leftChild;
            leftChild.childs.push(child);
          });
          this.keys.splice(index, 1);
          this.childs.splice(index + 1, 1);
          if (this.keys.length === 0) {
            this.childs = leftChild.childs;
            this.keys = leftChild.keys;
          }
          setTimeout(() => leftChild.delete(value), delay);
        }
      }
    } else {
      console.log('Delete: Nodo Actual no contiene valor');
      let i = 0;
      if (this.childs.length === 0) {
        console.log('Delete: Valor no encontrado en el b-tree');
        running = false;
        return;
      }
      while (this.keys[i] < value) i += 1;
      const selectedChild = this.childs[i];
      console.log('Delete: Hijo elegido');
      selectedChild.log();
      if (selectedChild.keys.length === this.degree - 1) {
        console.log('selected child does not have enough keys');
        // index of selected child
        const thisIndex = i;

        // the left sibling
        console.log('Delete: hermano izquierdo');
        const leftSibling = this.childs[thisIndex - 1];
        leftSibling && leftSibling.log();

        // the right sibling
        console.log('Delete: hermano derecho');
        const rightSibling = this.childs[thisIndex + 1];
        rightSibling && rightSibling.log();

        if (leftSibling && leftSibling.keys.length >= this.degree) {
          console.log('move key from left sibling');
          selectedChild.keys.unshift(this.keys[thisIndex - 1]);
          this.keys[thisIndex - 1] = leftSibling.keys[leftSibling.keys.length - 1];
          leftSibling.keys.splice(leftSibling.keys.length - 1, 1);
          if (leftSibling.childs.length > 0) {
            const childToMove = leftSibling.childs[leftSibling.childs.length - 1];
            childToMove.parent = selectedChild;
            selectedChild.childs.unshift(childToMove);
            leftSibling.childs.splice(leftSibling.childs.length - 1, 1);
          }
        } else if (rightSibling && rightSibling.keys.length >= this.degree) {
          console.log('move key from right sibling');
          selectedChild.keys.push(this.keys[thisIndex]);
          this.keys[thisIndex] = rightSibling.keys[0];
          rightSibling.keys.splice(0, 1);
          if (rightSibling.childs.length > 0) {
            const childToMove = rightSibling.childs[0];
            childToMove.parent = selectedChild;
            selectedChild.childs.push(childToMove);
            rightSibling.childs.splice(0, 1);
          }
        } else {
          console.log('both left and right sibling does not have enough key');
          // move a key to child to become median
          //    2. 4
          //  / |  \
          // 1  3   5
          if (rightSibling) {
          //    2.
          //  /   |
          // 1  |3 4 5|
            selectedChild.keys.push(this.keys[thisIndex]);
            this.keys.splice(thisIndex, 1);
            console.log('merge right sibling');
            rightSibling.keys.forEach((key) => {
              selectedChild.keys.push(key);
            });
            this.childs.splice(thisIndex + 1, 1);
            rightSibling.childs.forEach((child) => {
              child.parent = selectedChild;
              selectedChild.childs.push(child);
            });
          } else if (leftSibling) {
          //      4
          //   /     \
          // |1 2 3|  5
            selectedChild.keys.unshift(this.keys[thisIndex - 1]);
            this.keys.splice(thisIndex - 1, 1);
            console.log('merge left sibling');
            for (let i = leftSibling.keys.length - 1; i > -1; i--) {
              selectedChild.keys.unshift(leftSibling.keys[i]);
            }

            this.childs.splice(thisIndex - 1, 1);
            for (let i = leftSibling.childs.length - 1; i > -1; i--) {
              leftSibling.childs[i].parent = selectedChild;
              selectedChild.childs.unshift(leftSibling.childs[i]);
            }
          }
          else {
            throw 'delete : Error'
          }

          if (this.keys.length === 0) {
            console.log('this node have no keys left');
            console.log('make it the selected child');
            this.keys = selectedChild.keys;
            this.childs = selectedChild.childs;
            selectedChild.parent = null;
          }
        }
        setTimeout(() => selectedChild.delete(value), delay);
        console.log(' ******** End Step ****');
      } else {
        setTimeout(() => selectedChild.delete(value), delay);
        console.log(' ******** End Step ****');
      }

      if (!this.verify()) {
        console.error('Error');
        return;
      }
      console.log(' ******** End Step ****');
    }
  }

  busqueda(value) {
    running = true;
    if (!this.verify()) {
      console.error('Busqueda: error al Busqueda');
      running = false;
      return;
    }
    currentNode = this;
    console.log('Busqueda: Nodo Actual');
    console.log(`Valor ${value}`);
    this.log();
    if (this.keys.includes(value)) {
      console.log('Busqueda: Nodo Actual contiene valor');
      const index = this.keys.findIndex((v) => v === value);

      running = false;
      return;

    } else {
      console.log('Busqueda: Nodo Actual no contiene valor');
      let i = 0;
      if (this.childs.length === 0) {
        console.log('Busqeda :Valor no encontrado en el B tree');
        running = false;
        return;
      }
      while (this.keys[i] < value) i += 1;
      const selectedChild = this.childs[i];
      console.log('Busqueda Hijo elegido');
      selectedChild.log();
      if (selectedChild.keys.length === this.degree - 1) {
        console.log('Busqueda: Selected child does not have enough keys');
        // index of selected child
        const thisIndex = i;

        // the left sibling
        console.log('Busqueda: hermano izquierdo');
        const leftSibling = this.childs[thisIndex - 1];
        leftSibling && leftSibling.log();

        // the right sibling
        console.log('Busqueda: right sibling');
        const rightSibling = this.childs[thisIndex + 1];
        rightSibling && rightSibling.log();

        if (leftSibling && leftSibling.keys.length >= this.degree) {
          console.log('Busqueda: move key from left sibling');
          selectedChild.keys.unshift(this.keys[thisIndex - 1]);
          this.keys[thisIndex - 1] = leftSibling.keys[leftSibling.keys.length - 1];
          //leftSibling.keys.splice(leftSibling.keys.length - 1, 1);
          if (leftSibling.childs.length > 0) {
            const childToMove = leftSibling.childs[leftSibling.childs.length - 1];
            childToMove.parent = selectedChild;
            selectedChild.childs.unshift(childToMove);
           // leftSibling.childs.splice(leftSibling.childs.length - 1, 1);
          }
        }
        setTimeout(() => selectedChild.busqueda(value), delay);
        console.log(' ******** End Step ****');
      } else {
        setTimeout(() => selectedChild.busqueda(value), delay);
        console.log(' ******** End Step ****');
      }

      if (!this.verify()) {
        console.error('something went wrong');
        return;
      }
      console.log(' ******** End Step ****');
    }
  }

  draw(x, y, size = 10, hsplit = 30, vsplit = 30) {
    this.keys.map((value, index) => {
      const valX = x + index * size;

      stroke(color(0, 0, 120));
      strokeWeight(1);
      if (this === currentNode) {
        stroke('red');
        strokeWeight(2)
      }
      square(valX, y, size);
      stroke(0);
      strokeWeight(1)
      textSize(15);
      text(value, valX + size / 2, y + size / 2);
    });

    let currentX = x + size * this.keys.length + hsplit;
    this.childs.map((child, index) => {
      stroke(color(0, 0, 120));
      strokeWeight(3)
      line(x + size * index, y + size, currentX, y + size + vsplit);
      currentX = child.draw(currentX, y + size + vsplit, size, hsplit, vsplit);
    });

    return currentX;
  }
}
