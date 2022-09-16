let lastKnownScrollPosition = 0;
let ticking = false;

var screeHeight = 0;
const lineHeight = 30;
var numberOfRows = 0
var vdomRowStartIndex = 0;
var vdom = [];

const init = () => {
    console.log('init', jsonData.length);
    //  upDateScreenHeight
    screeHeight = window.innerHeight;
    //console.log(`screeHeight: ${screeHeight}`);
    numberOfRows = Math.ceil(screeHeight / lineHeight);
    //console.log(`numberOfRows: ${numberOfRows}`);
    // reset vdom
    vdom = [];
    document.getElementById('viewport').innerHTML = '';

    let cw = document.createElement('div');
    cw.id = 'content-wrapper';
    cw.className = 'container content-wrapper';

    for(let i =0; i<numberOfRows; i++){
        let tRow = createRow(i);
        
        cw.appendChild(tRow);
        vdom.push(tRow);
    }

    document.getElementById('viewport').appendChild(cw);
}

const createRow = (index) => {
    let row = document.createElement('div');
    row.id = `row-${index}`;
    row.className = 'row';

    let colId = document.createElement('div');
    colId.className = 'col-1';
    colId.innerHTML = jsonData[index].id;
    row.appendChild(colId);

    let colFn = document.createElement('div');
    colFn.className = 'col-2';
    colFn.innerHTML = jsonData[index].first_name;
    row.appendChild(colFn);

    let colLn = document.createElement('div');
    colLn.className = 'col-2';
    colLn.innerHTML = jsonData[index].last_name;
    row.appendChild(colLn);

    let colEm = document.createElement('div');
    colEm.className = 'col-3';
    colEm.innerHTML = jsonData[index].email;
    row.appendChild(colEm);

    let colGn = document.createElement('div');
    colGn.className = 'col-2';
    colGn.innerHTML = jsonData[index].gender;
    row.appendChild(colGn);

    let colIp = document.createElement('div');
    colIp.className = 'col-2';
    colIp.innerHTML = jsonData[index].ip_address;
    row.appendChild(colIp);

    return row;
}


function renderVdom(scrollPos, scrollDir) {
    
    let posTop = scrollPos % lineHeight;
    document.getElementById("content-wrapper").style = `top:-${posTop}px`;


    let tmpRowStartIndex = Math.floor(scrollPos / lineHeight);

    if(vdomRowStartIndex != tmpRowStartIndex){
        
        //console.log(`scrollDir: ${scrollDir}`);

        try{
            if(scrollDir === 'up'){
                // remove last child
                const element = document.getElementById(`row-${vdomRowStartIndex + numberOfRows}`);
                element.remove();
                vdom.pop();
                // create new first child
                let tRow = createRow(vdomRowStartIndex - 1);
                document.getElementById('content-wrapper').prepend(tRow);
                vdom.unshift(tRow);
            }else{// down
                // remove first child
                const element = document.getElementById(`row-${tmpRowStartIndex - 1}`);
                element.remove();
                vdom.shift();
                // create new last child
                let tRow = createRow(vdomRowStartIndex + numberOfRows);
                document.getElementById('content-wrapper').appendChild(tRow);
                vdom.push(tRow);
            }

            vdomRowStartIndex = tmpRowStartIndex;
        }catch(err){
            console.log(`scrollDir: ${scrollDir} \tvdomRowStartIndex: ${vdomRowStartIndex}`);
        }
    }
    
}

document.addEventListener('scroll', (e) => {
    let scrollDirection = lastKnownScrollPosition > window.scrollY ? 'up' : 'down';
    lastKnownScrollPosition = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            renderVdom(lastKnownScrollPosition, scrollDirection);
            ticking = false;
        });

        ticking = true;
    }
});

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', init);