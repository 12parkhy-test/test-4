let canvas = document.getElementById("canvas")
let context = canvas.getContext("2d")

let wCanvas = canvas.width
let hCanvas = canvas.height
let numRows = 50
let numCols = 50
let wCell = (wCanvas - 200) / numCols
let hCell = (hCanvas - 200) / numRows
let extra
if (numRows < 10) {
    extra = hCell * 0.01
}
else if (numCols < 10) {
    extra = wCell * 0.01
}
else {
    extra = wCell * 0.1
}

let checkMine = (point) => {
    let x = (Math.abs(point[0])).toString()
    let y = (Math.abs(point[1])).toString()
    let xSum = 0
    let ySum = 0
    for (let i = 0; i < x.length; i++) {
        xSum = xSum + parseInt(x[i])
    }
    for (let i = 0; i < y.length; i++) {
        ySum = ySum + parseInt(y[i])
    }
    let totalSum = xSum + ySum
    if (totalSum > 23) {
        return true
    }
    else {
        return false
    }
}
//n stands for none, m stands for mine, b stands for beginning, e stands for ending, v stands for visited 
let cells = []
for (let i = 0; i < numCols; i++) {
    cells[i] = []
    for (let j = 0; j < numRows; j++) {
        cells[i][j] = { x: i, y: j, info: 'n' }
        let cell = cells[i][j]
        if (checkMine([i, j])) {
            cell.info = 'm'
        }
    }
}

cells[0][0].info = 'b'

let erase = () => {
    context.clearRect(0, 0, wCanvas, hCanvas)
}

let createRect = (x, y, w, h, info) => {
    if (info == 'b') {
        context.fillStyle = '#c542f5'
    }
    else if (info == 'm') {
        context.fillStyle = 'red'
    }
    else if (info == 'n') {
        context.fillStyle = 'grey'
    }
    else if (info == 'v') {
        context.fillStyle = 'yellow'
    }
    context.beginPath()
    context.rect(x, y, w, h)
    context.closePath()
    context.fill()
}

let createGraph = () => {
    erase()
    for (let i = 0; i < numCols; i++) {
        for (let j = 0; j < numRows; j++) {
            let cell = cells[i][j]
            createRect(cell.x * (wCell + extra), cell.y * (hCell + extra), wCell, hCell, cell.info)
        }
    }
}

let findSolution = () => {
    let xCoords = [0]
    let yCoords = [0]
    let solution = false
    let xCoord
    let yCoord
    while (xCoords.length > 0 && !solution) {
        xCoord = xCoords.shift()
        yCoord = yCoords.shift()
        if (xCoord > 0) {
            if (cells[xCoord - 1][yCoord].info == 'e') {
                solution = true
            }
        }
        if (xCoord <= numCols - 2) {
            if (cells[xCoord + 1][yCoord].info == 'e') {
                solution = true
            }
        }
        if (yCoord > 0) {
            if (cells[xCoord][yCoord - 1].info == 'e') {
                solution = true
            }
        }
        if (yCoord <= numRows - 2) {
            if (cells[xCoord][yCoord + 1].info == 'e') {
                solution = true
            }
        }
        if (xCoord > 0) {
            if (cells[xCoord - 1][yCoord].info == 'n') {
                xCoords.push(xCoord - 1)
                yCoords.push(yCoord)
                cells[xCoord - 1][yCoord].info = cells[xCoord][yCoord].info + 'l'
            }
        }
        if (xCoord <= numCols - 2) {
            if (cells[xCoord + 1][yCoord].info == 'n') {
                xCoords.push(xCoord + 1)
                yCoords.push(yCoord)
                cells[xCoord + 1][yCoord].info = cells[xCoord][yCoord].info + 'r'
            }
        }
        if (yCoord > 0) {
            if (cells[xCoord][yCoord - 1].info == 'n') {
                xCoords.push(xCoord)
                yCoords.push(yCoord - 1)
                cells[xCoord][yCoord - 1].info = cells[xCoord][yCoord].info + 'u'
            }
        }
        if (yCoord <= numRows - 2) {
            if (cells[xCoord][yCoord + 1].info == 'n') {
                xCoords.push(xCoord)
                yCoords.push(yCoord + 1)
                cells[xCoord][yCoord + 1].info = cells[xCoord][yCoord].info + 'd'
            }
        }
    }
    if (!solution) {
        //console.log('No solution!')
        return false
    }
    else {
        //console.log('Solution!')
        return true
    }
}

let changeStatus = (state) => {
    let status = document.getElementById('status')
    if (state == 'loading') {
        status.innerText = 'Loading...'
    }
    else if (state == 'done') {
        status.innerText = 'Done!'
    }
    else if (state == 'reset') {
        status.innerText = ''
    }
}

let showResults = () => {
    reset()
    let visited = []
    changeStatus('loading')
    for (let i = 0; i < numCols; i++) {
        resetData()
        for (let j = 0; j < numRows; j++) {
            resetData()
            if (cells[i][j].info != 'm') {
                cells[i][j].info = 'e'
                if (findSolution()) {
                    visited.push(cells[i][j])
                }
            }
        }
    }
    changeStatus('done')
    let numVisited = document.getElementById('num-visited')
    numVisited.innerText = ` Number of cells visited: ${visited.length}`
    let percArea = document.getElementById('perc-area')
    let numCells = numCols * numRows
    percArea.innerText = `, A robot can access ${visited.length / numCells * 100}% of the total area.`
    for (let i = 1; i < visited.length; i++) {
        let x = visited[i].x
        let y = visited[i].y
        cells[x][y].info = 'v'
    }
    createGraph()
}

let reset = () => {
    changeStatus('reset')
    let numVisited = document.getElementById('num-visited')
    numVisited.innerText = ''
    let percArea = document.getElementById('perc-area')
    percArea.innerText = ''
    for (let i = 0; i < numCols; i++) {
        cells[i] = []
        for (let j = 0; j < numRows; j++) {
            cells[i][j] = { x: i, y: j, info: 'n' }
            let cell = cells[i][j]
            if (checkMine([i, j])) {
                cell.info = 'm'
            }
        }
    }
    cells[0][0].info = 'b'
    createGraph()
}

let resetData = () => {
    for (let i = 0; i < numCols; i++) {
        cells[i] = []
        for (let j = 0; j < numRows; j++) {
            cells[i][j] = { x: i, y: j, info: 'n' }
            let cell = cells[i][j]
            if (checkMine([i, j])) {
                cell.info = 'm'
            }
        }
    }
    cells[0][0].info = 'b'
}

let change = (name, value) => {
    if (name == 'numCols') {
        numCols = value
    }
    else if (name == 'numRows') {
        numRows = value
    }
    wCell = (wCanvas - 200) / numCols
    hCell = (hCanvas - 200) / numRows
    if (numRows < 10) {
        extra = hCell * 0.01
    }
    else if (numCols < 10) {
        extra = wCell * 0.01
    }
    else {
        extra = wCell * 0.1
    }

}
let changeNumCells = () => {
    let numCells = document.getElementById('num-cells')
    numCells.innerText = `Number of Cells: ${numCols * numRows}`
    reset()
}

createGraph()
let numCells = document.getElementById('num-cells')
numCells.innerText = `Number of Cells: ${numCols * numRows}`

let svg = d3.select('svg')
let data = [{yLoc: 14, desc: 'Starting Point'}, {yLoc: 33, desc: "Unable To Access (After Clicking Show Results Button) / Not Explored Yet (Before Clicking Show Results Button)"}, {yLoc: 53, desc: 'Mine'}, {yLoc:73 , desc: 'Explored'}]
let legendG = svg.append('g').attr('id', 'legend')
legendG.selectAll('text').data(data).enter().append('text')
.attr('x', (d, i) => {return 40})
.attr('y', (d, i) => {return d.yLoc})
.text((d, i) => {return d.desc}) 
 
