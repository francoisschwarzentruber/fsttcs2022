'use strict'


function compute() {
    const M = getMatrixFromText(document.getElementById("dependencyMatrix").value);
    const t = parseInt(document.getElementById("t").value);

    const c = config(M, t);
    document.getElementById("updateMatrix").value = matrixToText(updatedMatrix(M, t));
    console.log(c)

//    document.getElementById("configurationText").value = matrixToText(c);
    document.getElementById("playerSequence").value = playerSequenceToText(getSequenceOfPlayers(M, 20));

    fillConfiguration(document.getElementById("configuration"), M, c);

}

function fillConfiguration(div, M, c) {
    const cells = [];

    div.innerHTML = "";

    function clean() {
        cells.forEach((AC) => AC.forEach((c) => {
            c.classList.remove("dep")
            c.classList.remove("current")
        }));
    }
    for (let a in M) {
        cells[a] = [];

        for (let t = 0; t < 20; t++)  if (c[a][t]) {
            const cell = document.createElement("div");
            cell.classList.add("cell")
            cell.style.gridColumn = t + 1;
            cell.style.gridRow = a + 1;

            cells[a][t] = cell;
            cell.innerHTML = c[a][t];

            cell.onmouseleave = clean;
            cell.onmouseenter = () => {
                cell.classList.add("current");
                for (let b in M) if (a != b) {
                    for (let t2 = 0; t2 <= t + M[a][b]; t2++)
                        cells[b][t2].classList.add("dep");
                        console.log("miaou")
                }


            }

            div.append(cell)
        }
    }
}

window.onload = compute;

/**
 * 
 * @param {*} txt 
 * @returns return the matrix corresponding to txt
 * M[i] is the line number i
 * M[i][j] is the element at line i and column j
 */
function getMatrixFromText(txt) {
    const M = [];

    const lines = txt.split("\n");

    for (const line of lines)
        if (line.trim() != "") {
            const tokens = line.split(" ");
            let L = [];
            for (const token of tokens) {
                const str = token.trim();
                if (str != "")
                    L.push(parseInt(str));
            }
            M.push(L);
        }

    return M;
}


/**
 * 
 * @param {*} x 
 * @returns the text of the number x on 2 characters
 */
function numberToText(x) {
    return (x >= 0 && x <= 9) ? " " + x : x;
}

function matrixToText(M) {
    return M.map(line => line.map(numberToText).join("   ")).join("\n");
}


function agentToText(i) {
    return String.fromCharCode(97 + parseInt(i));
}

function playerSequenceToText(seq) {
    return seq.map((S, t) => `time ${numberToText(t)}: ` + S.map(agentToText).join('')).join('\n');
}

function configConcat(c, c2) {
    let cnew = [];
    for (let a = 0; a < c.length; a++)
        cnew[a] = c[a].concat(c2[a]);
    return cnew;
}


/**
 * 
 * @param {*} M 
 * @param {*} t 
 * @returns the configuration at time t
 */
function config(M, t) {
    if (t == 0)
        return Array(M.length).fill([]);
    else {
        const M2 = updatedMatrix(M, t - 1);
        const c2 = plays(M2, t);
        return configConcat(config(M, t - 1), c2);
    }
}

/**
 * 
 * @param {*} M the current matrix at the current time (maybe different from the initial one)
 * @param {*} symbol (usually the round number)
 * @returns 
 */
function plays(M, symbol) {
    const c = [];
    for (const i in M) {
        const k = Math.min(Math.max(...M[i]), 0);
        /*console.log(M[i])
        console.log(Math.max(...M[i]));
        console.log(k)*/
        // -k = the number of moves of player i
        c[i] = Array(-k).fill(symbol);
    }
    return c;
}


/**
 * 
 * @param {*} M 
 * @returns a copy of the matrix M
 */
function copyMatrix(M) {
    const copyLine = (line) => line.map((x) => x);
    return M.map(copyLine);
}

/**
 * 
 * @param {*} M 
 * @param {*} t 
 * @returns the updated matrix at time t
 */
function updatedMatrix(M, t) {
    if (t == 0)
        return M;
    else {
        let Mu = updatedMatrix(M, t - 1);
        let M2 = copyMatrix(Mu);
        for (const i in M2) {
            const k = Math.min(Math.max(...Mu[i]), 0);
            for (const j in M2)
                M2[i][j] = M2[i][j] - k;
            for (const j in M2)
                M2[j][i] = M2[j][i] + k;
        }
        return M2;
    }


}




/**
 * 
 * @param {*} M 
 * @param {*} timeout
 * @returns the sequence of set of players that progresses at each time til timeout  
 */
function getSequenceOfPlayers(M, timeout) {
    if (timeout == 0)
        return new Array();
    else {
        const S = [];
        for (const i in M) {
            if (Math.min(Math.max(...M[i]), 0) < 0)
                S.push(i);
        }
        const A = getSequenceOfPlayers(updatedMatrix(M, 1), timeout - 1);
        A.unshift(S);
        return A;
    }
}


