const gameBoard = document.getElementsByClassName("gameBoard")[0];
const playerStartLeft = Math.floor(gameBoard.getBoundingClientRect().left)+1;
const playerStartTop = Math.floor(gameBoard.getBoundingClientRect().top)+2;
const player = {
    htmlElement: document.getElementsByClassName("player")[0],
    positionLeft: playerStartLeft,
    positionTop: playerStartTop
};

const normalType = 0, boost1Type = 10, boost2Type = 20, boost3Type = 30, cost1Type = 6, cost2Type = 12, cost3Type = 18, portalType = 50, startType = 2, finishType = 3;
const keysA = 'a', keysS = 's', keysW = 'w', keysD = 'd', keysAD = 'ad', keysAS = 'as', keysAW = 'aw',keysWS = 'ws', keysWA = 'wa', keysWD = 'wd', keysSD = 'sd';
const keysASD = 'asd', keysAWD = 'awd', keysWSD = 'wsd', keysAWS='aws', keysAWSD = 'awsd';

const btnW = document.getElementById("btnW");
const btnS = document.getElementById("btnS");
const btnA = document.getElementById("btnA");
const btnD = document.getElementById("btnD");

let gameGrid = [];

let gridX = 0;
let gridY = 0;
let score = 200;
let level = 0;
let isComplete = false, isPortal = false;

// player.htmlElement.style.left = player.positionLeft +'px';
// player.htmlElement.style.top = player.positionTop + 'px';

window.addEventListener('keypress', (event) =>  {
    ProcessKeyPress(event.keyCode);
});

btnW.addEventListener('click', () => { ProcessKeyPress(119)});
btnS.addEventListener('click', () => { ProcessKeyPress(115)});
btnA.addEventListener('click', () => { ProcessKeyPress(97)});
btnD.addEventListener('click', () => { ProcessKeyPress(100)});

function ProcessKeyPress(keyValue){
    if (isComplete) return;
    
    let currentTile = gameGrid[gridX][gridY];
    const currentType = currentTile.type;

    switch(keyValue)
    {
        case 119:
            {
                MoveUp(currentTile)
                break;
            }
        case 115:
            {
                MoveDown(currentTile);
                break;
            }
        case 97:
            {
                MoveLeft(currentTile)
                break;
            }
        case 100:
            {
                MoveRight(currentTile)
                break;
            }
    };

    if (!isPortal){
        player.htmlElement.style.left = player.positionLeft + 'px';
        player.htmlElement.style.top = player.positionTop + 'px';
    }
 
    isPortal = false;

    if (AtFinish())
    {
        isComplete = true;
        if (score > 0){
            resetMaze();
        }
        else{
            const lblScore = document.getElementById('lblScore');
            lblScore.innerText = "Game over"; 
        }
    }
}

function MoveUp(currentTile)
{
    
    if (currentTile.hasGate != undefined && !currentTile.openGate  && currentTile.hasGate.indexOf(keysW) > -1)
        {
            return;
        }

    if (currentTile.allowedMoves.indexOf(keysW) > -1 || (currentTile.hasGate != undefined && currentTile.openGate && currentTile.hasGate.indexOf(keysW) > -1))
    {
        player.positionTop -= 36;
        gridX--;
        OnValidKeyPress();
    }
}

function MoveDown(currentTile)
{
    if (currentTile.hasGate != undefined && !currentTile.openGate && currentTile.hasGate.indexOf(keysS) > -1)
    {
        return;
    }

    if (currentTile.allowedMoves.indexOf(keysS) > -1 || (currentTile.hasGate != undefined && currentTile.openGate && currentTile.hasGate.indexOf(keysS) > -1))
        {
            player.positionTop += 36;
            gridX++;
            OnValidKeyPress();
        }
}

function MoveLeft(currentTile)
{
    if (currentTile.hasGate != undefined && !currentTile.openGate && currentTile.hasGate.indexOf(keysA) > -1)
    {
        return;
    }

    if (currentTile.allowedMoves.indexOf(keysA) > -1 || (currentTile.hasGate != undefined && currentTile.openGate && currentTile.hasGate.indexOf(keysA) > -1))
        {
            player.positionLeft -= 36;
            gridY--;
            OnValidKeyPress();
        }
}

function MoveRight(currentTile)
{

    if (currentTile.hasGate != undefined && !currentTile.openGate && currentTile.hasGate.indexOf(keysD) > -1)
    {
        return;
    }

    if (currentTile.allowedMoves.indexOf(keysD) > -1 || (currentTile.hasGate != undefined && currentTile.openGate && currentTile.hasGate.indexOf(keysD) > -1))
        {
            player.positionLeft += 36;
            gridY++;
            OnValidKeyPress();
        }
}

function OnValidKeyPress()
{
    SetScore();
    openCloseGates();
    teleportPlayer();
}

function SetScore()
{
    let minAmount = 1;
    let isBoost = false;
    let gameTile = gameGrid[gridX][gridY];

    switch (gameTile.type)
    {
        case boost1Type:
            {
                minAmount = -5;
                isBoost = true;
                setAsNormalTile(gameTile);
            }
        case boost2Type:
            {
                minAmount = -10;
                isBoost = true;
                setAsNormalTile(gameTile);
            }
        case boost3Type:
            {
                minAmount = -20;
                isBoost = true;
                setAsNormalTile(gameTile);
            }
        case cost1Type:
            {
                minAmount = 5;
                setAsNormalTile(gameTile);
            }
        case cost2Type:
            {
                minAmount = 10;
                setAsNormalTile(gameTile);
            }
        case cost3Type:
            {
                minAmount = 20;
                setAsNormalTile(gameTile);
            }
    }

    if (score - minAmount > -1 && !isBoost)
    {
        score = score - minAmount;
    }
    else if (isBoost){
        score = score + minAmount;
    }

    const lblScore = document.getElementById('lblScore');
    lblScore.innerText = "You have " + score + " points"; 
}

function AtFinish()
{
    return (gameGrid[gridX][gridY].type === finishType);
}

function generateBorderClassname(allowedMoves)
{
    let cssName = 'border';

    if (allowedMoves.indexOf(keysW) == -1)
    {
        cssName += 'Top';
    }

    if (allowedMoves.indexOf(keysS) == -1)
    {
        cssName += 'Bottom';
    }

    if (allowedMoves.indexOf(keysA) == -1)
    {
        cssName += 'Left';
    }

    if (allowedMoves.indexOf(keysD) == -1)
    {
        cssName += 'Right';
    }

    return cssName;
}

function resetMaze()
{
    const gameBoard = document.getElementsByClassName("gameBoard")[0];
    gameBoard.innerHTML = '';
    
    loadJson();

    isComplete = false, isPortal = false;    


}

function setupTiles()
{
    const lblScore = document.getElementById('lblScore');
    lblScore.innerText = "You have " + score + " points"; 
    
    level++;
    const lblLevel = document.getElementById('lblLevel');
    lblLevel.innerText = 'Level ' + level;

    let costCount = 0;
    let boostCount = 0;
    let portalCount = 0;

    for(let i=0;i<gameGrid.length;i++)
    {
        for(let j=0;j<gameGrid[i].length;j++)
        {
            let gridTile = gameGrid[i][j];
            let borderClassName = generateBorderClassname(gridTile.allowedMoves);
            let newTile = document.createElement("div");
            newTile.classList.add('gameTile',borderClassName);

           if (gridTile.type !== startType && gridTile.type !== finishType)
            {
                let randomTile = Math.floor(Math.random() * 500);

                if (costCount < 3 + Math.floor(0.3 * level))
                {
                    if (randomTile < 150)
                    {
                        costCount++;
                        gridTile.type = cost1Type;
                    }

                    if (randomTile < 100)
                    {
                        gridTile.type = cost2Type;
                    }

                    if (randomTile < 50)
                    {
                        gridTile.type = cost3Type;
                    }
                }

                randomTile = Math.floor(Math.random() * 500);

                if (boostCount < 5)
                {
                    if (randomTile > 450)
                    {
                        boostCount++;
                        gridTile.type = boost1Type;
                    }

                    if (randomTile > 460)
                    {
                        gridTile.type = boost2Type;
                    }

                    if (randomTile > 480)
                    {
                        gridTile.type = boost3Type;
                    }
                }

                
                randomTile = Math.floor(Math.random() * 100);

                if (portalCount < 3)
                {
                    if (randomTile > 95)
                    {
                        portalCount++;
                        gridTile.type = portalType;
                        gridTile.portalCount = 3;
                    }
                }
            }

            if (gridTile.type === startType)
            {
                newTile.classList.add('tileStart');
                gridX = i;
                gridY = j;
                setPlayerStart();
            }

            if (gridTile.type === finishType)
            {
                newTile.classList.add('tileFinish');
            }

            if (gridTile.type === boost1Type || gridTile.type === boost2Type  || gridTile.type === boost3Type )
            {
                newTile.innerHTML = '<i class="fa-solid fa-gem"></i>';
                newTile.classList.add('tileLvl' + gridTile.type / 10 + 'Boost');
            }

            if (gridTile.type === cost1Type || gridTile.type === cost2Type  || gridTile.type === cost3Type )
            {
                newTile.innerHTML = '<i class="fa-solid fa-bomb"></i>';
                newTile.classList.add('tileLvl' + gridTile.type / 6 + 'Cost');
            }

            if (gridTile.hasGate != undefined && gridTile.hasGate.indexOf(keysD) > -1)
            {
                newTile.classList.add('gateRight');
                if (gridTile.openGate)
                {
                    newTile.classList.add('open');
                }
            }

            if (gridTile.hasGate != undefined && gridTile.hasGate.indexOf(keysA) > -1)
            {
                newTile.classList.add('gateLeft');
                if (gridTile.openGate)
                {
                    newTile.classList.add('open');
                }
            }

            if (gridTile.hasGate != undefined && gridTile.hasGate.indexOf(keysW) > -1)
            {
                newTile.classList.add('gateTop');
                if (gridTile.openGate)
                {
                    newTile.classList.add('open');
                }
            }

            if (gridTile.hasGate != undefined && gridTile.hasGate.indexOf(keysS) > -1)
            {
                newTile.classList.add('gateBottom');
                if (gridTile.openGate)
                {
                    newTile.classList.add('open');
                }
            }

            if (gridTile.type === portalType)
            {
                newTile.innerHTML = '<i class="fa-solid fa-street-view"></i>';
                newTile.classList.add('tilePortal');
            }

            newTile.setAttribute('id','gameTile'+i+j);

            gameBoard.append(newTile)
        }
    }
}

function openCloseGates()
{
    for(let i=0;i<gameGrid.length;i++)
    {
        for(let j=0;j<gameGrid[i].length;j++)
        {
            let gridTile = gameGrid[i][j];
            if (gridTile.hasGate != undefined)
            {
                randomGateState = Math.floor(Math.random() * 100);

                if (randomGateState > 25)
                {
                    htmlElement = document.getElementById('gameTile'+i+j);
                    htmlElement.classList.toggle('open');
                    gridTile.openGate = !gridTile.openGate;
                }
            }
        }
    }
}

function setAsNormalTile(tile)
{
    htmlElement = document.getElementById('gameTile'+gridX+gridY);
    htmlElement.classList.remove(getTileCSSClass(tile));
    htmlElement.innerHTML = '';
    tile.type = normalType;
}

function getTileCSSClass(tile)
{
    switch(tile.type)
    {
        case boost1Type:
            {
                return "tileLvl1Boost";
            }
    }
}

function teleportPlayer()
{
    let gameTile = gameGrid[gridX][gridY];

    if (gameTile.type === portalType && gameTile.portalCount > 0)
    {
        gameTile.portalCount--;

        if (gameTile.portalCount < 1){
            setAsNormalTile(gameTile);
        }

        gridX = Math.floor(Math.random() * gameGrid.length - 1);
        gridY = Math.floor(Math.random() * gameGrid.length - 1);

        if (gridX < 0) gridX = 0;
        if (gridY < 0) gridY = 0;

        player.positionLeft = playerStartLeft + (36 * gridY);
        player.positionTop = playerStartTop + (36 * gridX);

        player.htmlElement.style.left = player.positionLeft + 'px';
        player.htmlElement.style.top = player.positionTop + 'px';

        SetScore();

        isPortal = true;
    }
}

function loadJson()
{
    let fileName = 'gridBase' + Math.floor(Math.random() * 6) + '.json';

    fetch(fileName)
    .then(response => response.json())
    .then(json => {gameGrid = json; setupTiles() });
}

function setPlayerStart()
{
    player.positionLeft = playerStartLeft + (36 * gridY);
    player.positionTop = playerStartTop + (36 * gridX);

    player.htmlElement.style.left = player.positionLeft + 'px';
    player.htmlElement.style.top = player.positionTop + 'px';
}

resetMaze();