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


const gameGridBase = [
    [{allowedMoves: keysD, type:startType},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysAS, type:normalType},{allowedMoves: keysSD, type:normalType},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysAS, type:normalType}],
    [{allowedMoves: keysSD, type:normalType},{allowedMoves: keysAS, type:normalType},{allowedMoves: keysD, type:normalType},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysAWS, type:normalType, hasGate: keysD, openGate: false},{allowedMoves: keysWSD, type:normalType, hasGate: keysA, openGate: false},{allowedMoves: keysASD, type:normalType},{allowedMoves: keysAS, type:normalType},{allowedMoves: keysWS, type:normalType}],
    [{allowedMoves: keysW, type:normalType},{allowedMoves: keysWD, type:normalType},{allowedMoves: keysASD, type:normalType, hasGate: keysS, openGate: true},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysWA, type:normalType},{allowedMoves: keysWS, type:normalType},{allowedMoves: keysWS, type:normalType},{allowedMoves: keysWS, type:normalType},{allowedMoves: keysWS, type:normalType}],
    [{allowedMoves: keysSD, type:normalType},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysAWD, type:normalType, hasGate: keysW, openGate: true},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysAS, type:normalType},{allowedMoves: keysWS, type:normalType},{allowedMoves: keysWS, type:normalType},{allowedMoves: keysWSD, type:normalType},{allowedMoves: keysWA, type:normalType}],
    [{allowedMoves: keysWS, type:normalType},{allowedMoves: keysD, type:normalType},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysASD, type:normalType},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysAWS, type:normalType},{allowedMoves: keysWS, type:normalType},{allowedMoves: keysWS, type:normalType},{allowedMoves: keysWD, type:normalType},{allowedMoves: keysA, type:normalType}],
    [{allowedMoves: keysWS, type:normalType},{allowedMoves: keysSD, type:normalType},{allowedMoves: keysAS, type:normalType},{allowedMoves: keysWS, type:normalType},{allowedMoves: keysSD, type:normalType},{allowedMoves: keysAWD, type:normalType},{allowedMoves: keysAWD, type:normalType},{allowedMoves: keysAWD, type:normalType},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysAS, type:normalType}],
    [{allowedMoves: keysWS, type:normalType},{allowedMoves: keysWS, type:normalType},{allowedMoves: keysWS, type:normalType},{allowedMoves: keysWS, type:normalType},{allowedMoves: keysWS, type:normalType},{allowedMoves: keysSD, type:normalType},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysASD, type:normalType},{allowedMoves: keysAS, type:normalType},{allowedMoves: keysWS, type:normalType}],
    [{allowedMoves: keysW, type:normalType},{allowedMoves: keysWS, type:normalType},{allowedMoves: keysWS, type:normalType},{allowedMoves: keysWS, type:normalType, hasGate: keysD,openGate: true},{allowedMoves: keysWS, type:normalType, hasGate: keysA,openGate: true},{allowedMoves: keysWD, type:normalType},{allowedMoves: keysAS, type:normalType},{allowedMoves: keysWS, type:normalType},{allowedMoves: keysWS, type:normalType},{allowedMoves: keysWS, type:normalType}],
    [{allowedMoves: keysSD, type:normalType},{allowedMoves: keysWA, type:normalType},{allowedMoves: keysWD, type:normalType},{allowedMoves: keysAWS, type:normalType},{allowedMoves: keysWD, type:normalType},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysAW, type:normalType},{allowedMoves: keysWS, type:normalType},{allowedMoves: keysWS, type:normalType},{allowedMoves: keysWS, type:normalType}],
    [{allowedMoves: keysW, type:finishType},{allowedMoves: keysD, type:normalType},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysAWD, type:normalType},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysAD, type:normalType},{allowedMoves: keysAW, type:normalType},{allowedMoves: keysWD, type:normalType},{allowedMoves: keysWA, type:normalType}]
];

let gameGrid = [];

let gridX = 0;
let gridY = 0;
let score = 200;
let level = 0;
let isComplete = false, isPortal = false;

player.htmlElement.style.left = player.positionLeft +'px';
player.htmlElement.style.top = player.positionTop + 'px';

window.addEventListener('keypress', (event) =>  {

    if (isComplete) return;
    
    let currentTile = gameGrid[gridX][gridY];
    const currentType = currentTile.type;

    switch(event.keyCode)
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
            resetStartPosition();
        }
        else{
            const lblScore = document.getElementById('lblScore');
            lblScore.innerText = "Game over"; 
        }
    }

});

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

function resetStartPosition()
{
    const gameBoard = document.getElementsByClassName("gameBoard")[0];
    gameBoard.innerHTML = '';
    player.positionLeft = Math.floor(gameBoard.getBoundingClientRect().left)+1;
    player.positionTop = Math.floor(gameBoard.getBoundingClientRect().top)+2;
    gridX = 0;
    gridY = 0;
    isComplete = false, isPortal = false;    

    player.htmlElement.style.left = player.positionLeft + 'px';
    player.htmlElement.style.top = player.positionTop + 'px';
    

    setupTiles();
}

function setupTiles()
{
    const lblScore = document.getElementById('lblScore');
    lblScore.innerText = "You have " + score + " points"; 

    gameGrid = []
    for(let i=0;i<gameGridBase.length;i++)
    {
        let row = [];
        for(let j=0;j<gameGridBase[i].length;j++)
        {
            row[j] = gameGridBase[i][j];
        }

        gameGrid[i] = row;
    }
    
    level++;
    const lblLevel = document.getElementById('lblLevel');
    lblLevel.innerText = 'Level ' + level;
    
    alterMaze();

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

                if (costCount < 5)
                {
                    if (randomTile < 15)
                    {
                        costCount++;
                        gridTile.type = cost1Type;
                    }

                    if (randomTile < 10)
                    {
                        gridTile.type = cost2Type;
                    }

                    if (randomTile < 5)
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

function alterMaze()
{
    randomChange = Math.floor(Math.random() * 100);

    if (randomChange < 95)
    {
        gameGrid[5][3].allowedMoves = keysW;
        gameGrid[6][3].allowedMoves = keysAD;
        gameGrid[6][2].allowedMoves = keysAWD;
        gameGrid[6][4].allowedMoves = keysAWS;
        gameGrid[7][3].allowedMoves = keysS;
        
        gameGrid[7][3].hasGate = '';
        gameGrid[7][4].hasGate = '';

        gameGrid[9][7].hasGate = keysD;
        gameGrid[9][8].hasGate = keysA;
    }

    if (randomChange < 90)
    {
        gameGrid[7][7].allowedMoves = keysW;
        gameGrid[8][7].allowedMoves = keysS;
    }

    if (randomChange < 85)
    {
        gameGrid[6][2].allowedMoves = keysWD;
        gameGrid[7][2].allowedMoves = keysS;
    }

    if (randomChange < 80)
    {
        gameGrid[2][0].allowedMoves = keysWS;
        gameGrid[3][0].allowedMoves = keysWSD;
    }

    if (randomChange < 75)
    {
        gameGrid[3][6].allowedMoves = keysS;
        gameGrid[2][6].allowedMoves = keysW;
    }

    if (randomChange < 70)
    {
        gameGrid[3][0].allowedMoves = keysWD;
        gameGrid[4][0].allowedMoves = keysSD;
        gameGrid[4][1].allowedMoves = keysAD;
    }

    if (randomChange < 65)
    {
        gameGrid[0][8].allowedMoves = keysA;
        gameGrid[0][9].allowedMoves = keysS;
    }

    if (randomChange < 60)
    {
        gameGrid[5][5].allowedMoves = keysWA;
        gameGrid[5][6].allowedMoves = keysWS;
        gameGrid[5][7].allowedMoves = keysWD;
        gameGrid[6][6].allowedMoves = keysAWD;
    }

    if (randomChange < 55)
    {
        gameGrid[3][3].allowedMoves = keysAS;
        gameGrid[3][4].allowedMoves = keysD;
        gameGrid[4][3].allowedMoves = keysAWSD;
    }

    if (randomChange < 50)
    {
        gameGrid[1][3].allowedMoves = keysAS;
        gameGrid[1][4].allowedMoves = keysD;
        gameGrid[2][3].allowedMoves = keysAWD;
    }

    if (randomChange < 45)
    {
        gameGrid[2][7].allowedMoves = keysW;
        gameGrid[3][7].allowedMoves = keysS;
    }

    if (randomChange < 40)
    {
        gameGrid[8][4].allowedMoves = keysW;
        gameGrid[8][5].allowedMoves = keysSD;
        gameGrid[9][5].allowedMoves = keysAWD;
    }

    if (randomChange < 35)
    {
        gameGrid[4][5].allowedMoves = keysAWD;
        gameGrid[4][6].allowedMoves = keysAWS;
        gameGrid[5][5].allowedMoves = keysA;

        gameGrid[2][2].hasGate = '';
        gameGrid[3][2].hasGate = '';

        gameGrid[2][2].allowedMoves = keysAD;
        gameGrid[3][2].allowedMoves = keysAD;

        gameGrid[4][4].hasGate = keysS;
        gameGrid[5][4].hasGate = keysW;

        gameGrid[4][9].hasGate = keysS;
        gameGrid[5][9].hasGate = keysW;
    }

    if (randomChange < 30)
    {
        gameGrid[7][0].allowedMoves = keysWS;
        gameGrid[8][0].allowedMoves = keysWS;
        gameGrid[8][1].allowedMoves = keysW;
    }

    if (randomChange < 25)
    {
        gameGrid[5][0].allowedMoves = keysW;
        gameGrid[6][0].allowedMoves = keysSD;
        gameGrid[6][1].allowedMoves = keysAWS;

        gameGrid[1][5].hasGate = '';
        gameGrid[1][6].hasGate = '';

        gameGrid[2][5].hasGate = keysD;
        gameGrid[2][6].hasGate = keysA;
    }

    if (randomChange < 20)
    {
        gameGrid[4][4].allowedMoves = keysA;
        gameGrid[4][5].allowedMoves = keysWD;
        
        gameGrid[4][9].allowedMoves = keysAS;
        gameGrid[5][9].allowedMoves = keysAWS;
    }

    if (randomChange < 15)
    {
        gameGrid[0][2].allowedMoves = keysAS;
        gameGrid[1][2].allowedMoves = keysWA;
        gameGrid[1][1].allowedMoves = keysASD;
        gameGrid[0][3].allowedMoves = keysD;
        gameGrid[1][3].allowedMoves = keysS;
    }

    if (randomChange < 10)
    {
        gameGrid[8][4].allowedMoves = keysWS;
        gameGrid[9][4].allowedMoves = keysAW;
        gameGrid[9][5].allowedMoves = keysWD;
        
        gameGrid[3][2].allowedMoves = keysA;
        gameGrid[3][3].allowedMoves = keysSD;
        gameGrid[3][4].allowedMoves = keysAD;
        
    }

    if (randomChange < 5)
    {
        gameGrid[5][1].allowedMoves = keysD;
        gameGrid[6][1].allowedMoves = keysAS;
        gameGrid[8][1].allowedMoves = keysWS;
        gameGrid[9][1].allowedMoves = keysWD;

        gameGrid[7][3].hasGate = '';
        gameGrid[7][4].hasGate = '';

        gameGrid[5][6].hasGate = keysD;
        gameGrid[5][7].hasGate = keysA;

        gameGrid[9][7].hasGate = '';
        gameGrid[9][8].hasGate = '';
    }
}

setupTiles();