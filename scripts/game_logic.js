// Function generating Table structure
const genTable = (cols, rows) => {
  let idNum = 0;
  let tableStructure = "<table>\n";
  for (let i = 0; i < rows; i++) {
    tableStructure += "<tr>\n";
    for (let j = 0; j < cols; j++) {
      tableStructure += "<td id='" + idNum + "'></td>"
      idNum++;
    }
    tableStructure += "\n</tr>\n";
  }
  tableStructure += "</table>";
  return tableStructure;
};

// Random unique numbers
const genMinefield = (count, bombsNum, ignoredNum) => {
  const array = new Array;
  for (let i = 0; i < bombsNum; i++) {
    let num = Math.floor(Math.random() * count);
    while (array.indexOf(num) > -1 || num == ignoredNum) {
      num = Math.floor(Math.random() * count);
    }
    array[i] = num;
  }
  return array;
};

//Game Handler
let g_gameOver = 0;
class GameHandler {
  constructor(columns, rows, bombsNum) {
    this.m_columns = columns;
    this.m_rows = rows;
    this.m_cellsNumber = columns * rows
    this.m_bombsNum = bombsNum;
    this.m_firstClick = true;
    this.m_minefield = new Array;
    this.m_safeCells = 0;
  }

  translatePosition(x, y) {
    let _x;
    let _y;
    if (x < 0) {
      _x = 0;
    } else if (x > this.m_columns - 1) {
      _x = this.m_columns - 1;
    } else {
      _x = x;
    }

    if (y < 0) {
      _y = 0;
    } else if (y > this.m_rows - 1) {
      _y = this.m_rows - 1;
    } else {
      _y = y;
    }
    let result = (_y * this.m_columns) + _x;
    return result;
  }
  //return x & y positions 
  getPosition(index) {
    const pos = new Array;
    pos[0] = index % this.m_columns;
    pos[1] = Math.floor(index / this.m_rows);
    return pos;
  }


  checkField(index) {
    if (this.m_firstClick) {
      if (this.m_gameBoard[index].classList.contains("flag")) {
        return;
      }
      this.m_minefield = genMinefield(this.m_columns * this.m_rows, this.m_bombsNum, index);
      console.log(this.m_minefield);
      this.m_minefield.forEach(value => {
        $(this.m_gameBoard[value]).addClass("bomb");
      });
      if (document.querySelector("input[type='checkbox']").checked) {
        $(".bomb").css("background", "#888");
      }
      const pos = this.getPosition(index);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          let subPos = [pos[0] - 1 + j, pos[1] - 1 + i];
          if (this.m_gameBoard[this.translatePosition(subPos[0], subPos[1])].classList.contains("bomb") || this.m_gameBoard[this.translatePosition(subPos[0], subPos[1])].classList.contains("flag")) {
            continue;
          } else {
            if (!(this.m_gameBoard[this.translatePosition(subPos[0], subPos[1])].classList.contains("safe"))) {
              this.m_safeCells++;
              let bombsNum = 0;
              const lastElement = new Array;
              for (let x = 0; x < 3; x++) {
                for (let y = 0; y < 3; y++) {
                  if (this.m_gameBoard[this.translatePosition(subPos[0] - 1 + y, subPos[1] - 1 + x)].classList.contains("bomb")) {
                    if (!(lastElement.includes(this.m_gameBoard[this.translatePosition(subPos[0] - 1 + y, subPos[1] - 1 + x)]))) {
                      bombsNum++;
                      lastElement.push(this.m_gameBoard[this.translatePosition(subPos[0] - 1 + y, subPos[1] - 1 + x)]);
                    }
                  }
                }
              }
              if(bombsNum != 0) {
                $(this.m_gameBoard[this.translatePosition(subPos[0], subPos[1])]).text(bombsNum);
              }
              $(this.m_gameBoard[this.translatePosition(subPos[0], subPos[1])]).addClass("safe");
            }

          }
        }
      }
      this.m_firstClick = false;
    } else {
      if (!g_gameOver) {
        if (this.m_gameBoard[index].classList.contains("safe")) {
          return;
        } else if (this.m_gameBoard[index].classList.contains("flag")) {
          return;
        } else if (this.m_gameBoard[index].classList.contains("bomb")) {
          g_gameOver = 1;
        } else {
          const pos = this.getPosition(index);
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              let subPos = [pos[0] - 1 + j, pos[1] - 1 + i];
              if (this.m_gameBoard[this.translatePosition(subPos[0], subPos[1])].classList.contains("bomb") || this.m_gameBoard[this.translatePosition(subPos[0], subPos[1])].classList.contains("flag")) {
                continue;
              } else {
                if (!(this.m_gameBoard[this.translatePosition(subPos[0], subPos[1])].classList.contains("safe"))) {
                  this.m_safeCells++;
                  let bombsNum = 0;
                  const lastElement = new Array;
                  for (let x = 0; x < 3; x++) {
                    for (let y = 0; y < 3; y++) {
                      if (this.m_gameBoard[this.translatePosition(subPos[0] - 1 + y, subPos[1] - 1 + x)].classList.contains("bomb")) {
                        if (!(lastElement.includes(this.m_gameBoard[this.translatePosition(subPos[0] - 1 + y, subPos[1] - 1 + x)]))) {
                          bombsNum++;
                          lastElement.push(this.m_gameBoard[this.translatePosition(subPos[0] - 1 + y, subPos[1] - 1 + x)]);
                        }
                      }
                    }
                  }
                  if (bombsNum != 0) {
                    $(this.m_gameBoard[this.translatePosition(subPos[0], subPos[1])]).text(bombsNum);
                  }
                  $(this.m_gameBoard[this.translatePosition(subPos[0], subPos[1])]).addClass("safe");
                }
              }
            }
          }
        }
        if ((this.m_cellsNumber - this.m_bombsNum) <= this.m_safeCells) {
          g_gameOver = 2;
        }
      }
    }
  }

//Add click events to table cells
attachEvents(cellsTable) {
  this.m_gameBoard = cellsTable;
  this.m_gameBoard.forEach(elem => {

    $(elem).click(() => {
      this.checkField(elem.id)
    });

    $(elem).contextmenu((e) => {
      e.preventDefault();
      if(elem.classList.contains("flag")) {
        $(elem).html("");
      } else {
        $(elem).html("<span class='fa fa-flag'></span>")
      }
      $(elem).toggleClass("flag");
    });
  });
}

explode() {
  this.m_minefield.forEach(num => {
    $(this.m_gameBoard[num]).addClass("bombFailed");
    $(this.m_gameBoard[num]).html("<span class='fa fa-bomb'></span>");
  });
}
}