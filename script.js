let typeOfBlock;
//Declare Variables
const textFontSizeInt = 12;
const textFontSize = textFontSizeInt + 'px';
const root = document.querySelector(':root');
const body = document.querySelector('body');
let currentModules = [];
let stoppedAnimation = false;
let previousDiv = '';
let inArchive = false;
let inRoutine = false;
let archiveDate;
let clearingStorage = false;
let actualSaveInterval;
let backgroundColors = [
    [92, 74, 99], 
    [94, 90, 110], 
    [85, 108, 128], 
    [16, 130, 121],
    [32, 32, 32], 
    [73, 99, 90], 
    [97, 59, 59], 
    [107, 76, 93], 
    [99, 114, 117]
];
const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
let storageObject = {

}

let customizations;

const comparisons = [
    'Looking Forward To', 
    'Intentions', 
    'Schedule', 
    "Tomorrow's Schedule", 
    'Reflections'
];

const goalComparisons = [
    'Weekly',
    'Monthly',
    'Annual'
];

let goalsSave = [
    [],
    [],
    []
];

let inputFromFunction;

const modulesSpecs = [

    //Looking Forward To
    { 'Header': "Looking Forward To", 'bulletType': 'Bullet', 'pAmount': 1},

    //Intentions
    { 'Header': "Intentions", 'bulletType': 'Checkbox', 'pAmount': 1}, 

    //Schedule
    { 'Header': "Schedule", 'bulletType': 'None', 'pAmount': 1},

    //Tomorrow's Schedule
    { 'Header': "Tomorrow's Schedule", 'bulletType': 'None', 'pAmount': 1},

    //Reflections
    { 'Header': "Reflections", 'pAmount': 3, 'p0': 'What to improve on:', 'p1': 'What I am proud of:', 'p2': "What's on my mind:"},

    {},

    {},

    {},

    {},

    {},

    //Goals
    { 'Header': 'Goals', 'bulletType': 'Checkbox'},

    //Morning Routine
    { 'Header': 'Morning Routine', 'bulletType': 'None'}
];

let modulesSave = [
    [],
    [],
    [],
    [],
    []
];

function checkForLocalStorageObjects() {
    if(localStorage.getItem('Goals') === null) {
        let object = {
            'Weekly': {},
            'Monthly': {},
            'Annual': {}
        };
        localStorage['Goals'] = JSON.stringify(object);
    }
    if(localStorage.getItem('Customization') === null) {
        let object = {
            'Color Scheme': 0,
            'Routine': [
                {
                    'Name': 'Routine',
                    'Text': []
                },
                {
                    'Name': 'Routine 2',
                    'Text': []
                },
                {
                    'Name': 'Routine 3',
                    'Text': []
                },
                {
                    'Name': 'Routine 4',
                    'Text': []
                },
                {
                    'Name': 'Routine 5',
                    'Text': []
                },
                {
                    'Name': 'Routine 6',
                    'Text': []
                },
                {
                    'Name': 'Routine 7',
                    'Text': []
                }
            ],
            'Active Routine': 0,
            'Kept Modules': []
        };
        localStorage['Customization'] = JSON.stringify(object);
    }
    customizations = JSON.parse(localStorage['Customization']);
    changeColorScheme(customizations['Color Scheme']);
}

function openAnimation() {
    let bedText = document.getElementById('bedText');
    bedText.classList.add('bedGrow');

    let textArr = ['etter','very','ay'];

    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < textArr[i].length; j++) {
            let p = document.createElement('p');
            p.innerHTML = textArr[i].substring(j, j+1);
            p.classList.add(`letters${i}`);
            p.classList.add('letterToDelete');

            const container = document.getElementById('textContainer');
            const containerRect = container.getBoundingClientRect();
            const containerWidth = container.offsetWidth;
            p.style.left = containerRect.left + containerWidth / 6 * (0.5 + i * 2) + 'px';
            body.appendChild(p);

            setTimeout(function() {
                fallDown(i, j);
            }, 500);
        }
    }
    setTimeout(() => { 
        if(!stoppedAnimation) {
            let journalText = document.createElement('p');
            journalText.innerHTML = 'Journal';
            journalText.classList.add('journalText');
            body.appendChild(journalText);
            setTimeout(() => {
                    appGo();
            },2000);
        }
    }, 5000);
}

function fallDown(i, j) {
    let elements = document.querySelectorAll(`.letters${i}`);
    const element = elements[j];
    element.style.display = 'block';
  
    // Set opacity to 0 initially
    element.style.opacity = 0;
  
    element.style.transitionDuration = `${300 * (j+1)}ms`;

    let adjust = 1;
    if(j % 2 == 0) {
        adjust = -1;
    }

    // Use setTimeout to delay changing opacity to 1
    setTimeout(() => {
        element.style.opacity = 1;
        element.style.transform = `translate(${10 * adjust}%, ${80 * (j+1)}%)`;
        setTimeout(() => {
            element.style.transitionDuration = '300ms';
            element.style.transform = `translate(${10 * adjust}%, ${80 * (j+1)}%) rotate(${-6 * adjust}deg)`;
        },300 * (j+1)-300);
    }, 10);

    setTimeout(() => {
        element.style.transitionDuration = `1000ms`;
        element.style.transitionTimingFunction = 'cubic-bezier(.52,-0.84,.81,-0.19)';
        element.style.transform = `translate(0%, 0%) rotate(${6*adjust}deg)`;
        setTimeout(() => {
            element.style.transitionDuration = `300ms`;
            element.style.transitionTimingFunction = 'ease-in';
            element.style.opacity = 0;
            setTimeout(() => {
                let bed = document.getElementById('bedText');
                bed.style.transform = `scale(1.5)`;
                setTimeout(() => {
                    bed.style.transitionTimingFunction = 'cubic-bezier(.79,1.49,.05,.86)';
                    bed.style.transform = `scale(1)`;
                    setTimeout(() => {

                    },500);
                },500);
            },150);
        }, 700);
        
    }, 2500);   
    
}

function stopAnimation() {
    appGo();
    stoppedAnimation = true;
}

window.onload = function() {
    openAnimation();
};

spotGradientFade();
let spotGradientFadeInterval = setInterval(spotGradientFade,2000/20);

function spotGradientFade() {
    let div = document.createElement('div');
    div.classList.add('animationGradients');
    div.style.top = `${Math.random()*100}%`;
    div.style.left = `${Math.random()*100}%`;
    body.appendChild(div);

    div.classList.add('bodyFadeIn');
    setTimeout(function() {
        div.classList.remove('bodyFadeIn');
        div.classList.add('bodyFadeOut');
        setTimeout(function() {
            div.remove();
        },1000);
    },1000);
}

function appGo() {
    stoppedAnimation = true;

    let textContainer = document.getElementById('textContainer');
    let letters = document.querySelectorAll('.letterToDelete');
    let journalText = document.querySelector('.journalText');
    textContainer.style.display = 'none';
    setTimeout(() => {
        textContainer.remove();
    },10000);

    letters.forEach(letter => {
        letter.style.display = 'none';
        setTimeout(() => {
            letter.remove();
        },10000);
    });

    if(journalText) {
        journalText.remove();
    }
    
    const afterIntro = document.querySelector('.afterIntro');
    afterIntro.style.display = 'block';

    body.style.backgroundColor = 'transparent';
    body.style.backgroundImage = 'linear-gradient(var(--gradientStart), var(--backgroundColor))';

    let animationHover = document.getElementById('animationHover');
    if(animationHover !== null) {
        animationHover.remove();
    }

    let animationGradients = document.querySelectorAll('.animationGradients');
    animationGradients.forEach(gradient => {
        gradient.remove();
    });
    clearInterval(spotGradientFadeInterval);

    checkForLocalStorageObjects();

    restore();

    actualSaveInterval = setInterval(saveInterval,500);

    const lookingForwardToBlock = document.getElementById('lookingForwardToBlock');
    const intentionsBlock = document.getElementById('intentionsBlock');
    const scheduleBlock = document.getElementById('scheduleBlock');
    const tomorrowsScheduleBlock = document.getElementById('tomorrowsScheduleBlock');
    const reflectionsBlock = document.getElementById('reflectionsBlock');
    const goalsBlock = document.getElementById('goalsBlock');

    lookingForwardToBlock.addEventListener('mousedown', (event) => {
        lookingForwardToBlock.style.borderRadius = '30px';
        lookingForwardToBlock.style.cursor = 'pointer';
        typeOfBlock = 0;
    });

    intentionsBlock.addEventListener('mousedown', (event) => {
        intentionsBlock.style.borderRadius = '30px';
        intentionsBlock.style.cursor = 'pointer';
        typeOfBlock = 1;
    });

    scheduleBlock.addEventListener('mousedown', (event) => {
        scheduleBlock.style.borderRadius = '30px';
        scheduleBlock.style.cursor = 'pointer';
        typeOfBlock = 2;
    });

    tomorrowsScheduleBlock.addEventListener('mousedown', (event) => {
        tomorrowsScheduleBlock.style.borderRadius = '30px';
        tomorrowsScheduleBlock.style.cursor = 'pointer';
        typeOfBlock = 3;
    });

    reflectionsBlock.addEventListener('mousedown', (event) => {
        reflectionsBlock.style.borderRadius = '30px';
        reflectionsBlock.style.cursor = 'pointer';
        typeOfBlock = 4;
    });
    
    lookingForwardToBlock.addEventListener('dragend', function(event) {
        lookingForwardToBlock.style.borderRadius = '5px';
    });

    intentionsBlock.addEventListener('dragend', function(event) {
        intentionsBlock.style.borderRadius = '5px';
    });

    scheduleBlock.addEventListener('dragend', function(event) {
        scheduleBlock.style.borderRadius = '5px';
    });

    tomorrowsScheduleBlock.addEventListener('dragend', function(event) {
        tomorrowsScheduleBlock.style.borderRadius = '5px';
    });

    reflectionsBlock.addEventListener('dragend', function(event) {
        reflectionsBlock.style.borderRadius = '5px';
    });

    lookingForwardToBlock.addEventListener('click', function(event) {
        lookingForwardToBlock.style.borderRadius = '5px';
        drop();
    });

    intentionsBlock.addEventListener('click', function(event) {
        intentionsBlock.style.borderRadius = '5px';
        drop();
    });

    scheduleBlock.addEventListener('click', function(event) {
        scheduleBlock.style.borderRadius = '5px';
        drop();
    });

    tomorrowsScheduleBlock.addEventListener('click', function(event) {
        tomorrowsScheduleBlock.style.borderRadius = '5px';
        drop();
    });

    reflectionsBlock.addEventListener('click', function(event) {
        reflectionsBlock.style.borderRadius = '5px';
        drop();
    });

    for(let i = 0; i < customizations['Kept Modules'].length; i++) {
        typeOfBlock = customizations['Kept Modules'][i];
        drop();
    }
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function allowDrop(event) {
    event.preventDefault();
}

function makeGoalsModule() {
    let blocker = document.createElement('div');
    blocker.id = 'goalsBlocker';
    body.appendChild(blocker);
    
    let div = document.createElement('div');
    div.id = 'goalsModule';
    div.classList.add('grow')
    body.appendChild(div);

    let x = document.createElement('button');
    x.innerHTML = '&times;';
    x.classList.add('xButtons');
    div.appendChild(x);
    x.addEventListener('mousedown', function() {
        div.classList.remove('grow');
        div.classList.add('goalsShrink');
        setTimeout(function() {
            let permission = savePermission();
            if(permission && !inArchive) {
                save();
                restore();
            }
            div.remove();
            blocker.remove();
        },300);
    });
    let arr = [];
    for(let i = 0; i < goalComparisons.length; i++) {
        let container = document.createElement('div');
        container.classList.add('modules');
        container.classList.add('goalsModules');
        container.style.opacity = '0';
        div.appendChild(container);
        arr.push(container);

        let header = document.createElement('h3');
        header.classList.add('goalsModulesHeader');
        header.innerHTML = goalComparisons[i];
        container.appendChild(header);

        let smallContainer = document.createElement('div');
        smallContainer.classList.add('goalsSmallContainer')
        smallContainer.id = `goalsContainer${i}`;
        container.appendChild(smallContainer);

        let refreshButton = document.createElement('p');
        refreshButton.innerHTML = '&#x21bb;';
        refreshButton.classList.add('refreshButtons');
        container.appendChild(refreshButton);
        refreshButton.addEventListener('mousedown', function() {
            smallContainer.innerHTML = '';
            newBullet(smallContainer, 10, null);
        });

        container.addEventListener('click', function(event) {
            moduleClickListener(event, 10, smallContainer, container);
        });

        container.addEventListener('keydown', function(event) {
            if(event.key == 'Enter') {
                setTimeout(function() {
                    let textareas = container.querySelectorAll('textarea');
                    textareas.forEach(textarea => {
                        if(textarea.value.includes('\n')) {
                            textarea.value = textarea.value.replace(/\n/g, '');
                            if(textarea.scrollHeight <= textarea.clientHeight) {
                                textarea.rows --;
                            }
                        }
                    });
                },10);
                moduleClickListener(event, 10, smallContainer, container);
            }
        });

        if(goalsSave[i].length == 0) {
            newBullet(smallContainer,10,undefined);
        } else {
            for(let j = 0; j < goalsSave[i].length; j++) {
                newBullet(smallContainer, 10, goalsSave[i][j]);
            }
        }
    }
    setTimeout(function() {
        arr[0].classList.add('fadeIn');
        setTimeout(function() {
            arr[0].style.opacity = '1';
            arr[1].classList.add('fadeIn');
            setTimeout(function() {
                arr[1].style.opacity = '1';
                arr[2].classList.add('fadeIn');
                setTimeout(function() {
                    arr[2].style.opacity = '1';
                },200);
            },200);
        },200);
    },200);

}

function drop(event) {
    if(typeOfBlock == 10) {
        makeGoalsModule();
    } else if(currentModules.indexOf(modulesSpecs[typeOfBlock]['Header']) == -1) {
        if(currentModules.length >= 2) {
            let modules = document.querySelectorAll('.modules');
            modules.forEach(module => {
                if(comparisons.indexOf(module.id.substring(0,module.id.length-7)) != -1) {
                    //module.style.width = '31%';
                } else {
                    //module.style.width = '47%';
                }
            });
        }
        if(event) {
            event.preventDefault();
        }
        let dropBox = document.getElementById("dropBox");

        let module = document.createElement('div');
        module.style.margin = '1%';
        module.classList.add('modules');
        module.classList.add('modulesGrow');
        module.id = modulesSpecs[typeOfBlock]['Header'] + ' Module';
        currentModules.push(modulesSpecs[typeOfBlock]['Header']);

        dropBox.appendChild(module);

        if(currentModules.length >= 3) {
            //module.style.width = '31%';
            dropBox.scrollTop = dropBox.scrollHeight/2;
        }

        let x = document.createElement('button');
        x.innerHTML = '&times;';
        x.classList.add('xButtons');

        const type = typeOfBlock;
        x.addEventListener('mousedown', function() {
            module.classList.remove('modulesGrow');
            module.classList.add('modulesRemove');
            setTimeout(function() {
                let permission = savePermission();
                if(permission && !inArchive) {
                    save();
                    restore();
                }
                module.remove();
                currentModules.splice(currentModules.indexOf(modulesSpecs[type]['Header']),1);
            },300);
        });
        module.appendChild(x);

        let header = document.createElement('h3');
        header.innerHTML = modulesSpecs[typeOfBlock]['Header'];
        header.style.textAlign = 'center';
        header.style.color = 'rgb(200,200,200)'
        header.style.fontSize = '17px';
        header.style.marginTop = '5%';
        header.style.marginBottom = '0px';
        header.style.marginLeft = '11%';
        header.style.marginRight = '8%';
        if(modulesSpecs[typeOfBlock]['Header'] == 'Looking Forward To') {
            header.style.fontSize = '15px';
            header.style.marginTop = '5.7%';
        }
        if(modulesSpecs[typeOfBlock]['Header'] == "Tomorrow's Schedule") {
            header.style.fontSize = '14px';
            header.style.marginTop = '5.85%';
            header.style.marginBottom = '0.2%';
            header.style.marginLeft = '9%';
        }
        module.appendChild(header);

        createInnerText(module)
    }
}

function createInnerText(module) {
    let bigContainer = document.createElement('div');
    bigContainer.style.height = '90%';
    bigContainer.style.marginLeft = '5%';
    if([4].indexOf(typeOfBlock) != -1) {
        bigContainer.style.display = 'flex';
        bigContainer.style.flexDirection = 'column';
        bigContainer.style.justifyContent = 'space-around';
    } else if([0,1,2,3].indexOf(typeOfBlock) != -1) {
        bigContainer.style.display = 'flex';
        bigContainer.style.flexDirection = 'column';
        bigContainer.style.justifyContent = 'start';
        bigContainer.style.overflow = 'auto';
        bigContainer.style.height = '80%';

        let refreshButton = document.createElement('p');
        refreshButton.innerHTML = '&#x21bb;';
        refreshButton.classList.add('refreshButtons');
        module.appendChild(refreshButton);
        const type = typeOfBlock;
        refreshButton.addEventListener('mousedown', function() {
            bigContainer.innerHTML = '';
            newBullet(bigContainer, type, null);
        });
    }

    module.appendChild(bigContainer);
    for(let i = 0; i < modulesSpecs[typeOfBlock]['pAmount']; i++) {

        if([0,1,2,3].indexOf(typeOfBlock) != -1) {
            const type = typeOfBlock;
            const container = bigContainer;
            container.style.marginTop = '4%';
            container.style.width = '92%';

            if(modulesSave[type].length == 0) {
                newBullet(container,typeOfBlock);
            }

            module.addEventListener('click', function(event) {
                moduleClickListener(event, type, container, module);
            });

            module.addEventListener('keydown', function(event) {
                if(event.keyCode === 13) {
                    if([2,3,11].indexOf(type) != -1) { //This function is duplicated for the Routine module
                        let focusedElement = document.activeElement;
                        checkTimes(type,module);
                        checkTimeOrder(container);
                        let textareas = container.querySelectorAll('textarea');
                        let index;
                        for(let i = 0; i < textareas.length; i++) {
                            if(textareas[i] == focusedElement && i % 2 == 0) {
                                index = i;
                            }
                        }
                        if(index !== undefined) {
                            if(!inArchive) {
                                textareas[index+1].focus();
                            }
                            setTimeout(function() {
                                const textarea = textareas[index+1];
                                if(textarea.value.includes('\n')) {
                                    textarea.value = textarea.value.replace(/\n/g, '');
                                    if(textarea.scrollHeight <= textarea.clientHeight) {
                                        textarea.rows --;
                                    }
                                }
                            },10);
                        }
                    } else { //This function is duplicated for the Goals module
                        setTimeout(function() {
                            let textareas = module.querySelectorAll('textarea');
                            textareas.forEach(textarea => {
                                if(textarea.value.includes('\n')) {
                                    textarea.value = textarea.value.replace(/\n/g, '');
                                    if(textarea.scrollHeight <= textarea.clientHeight) {
                                        textarea.rows --;
                                    }
                                }
                            });
                        },10);
                        moduleClickListener(event, type, container, module);
                    }
                }
            });
            
            for(let i = 0; i < modulesSave[type].length; i++) {
                newBullet(container,type,modulesSave[type][i]);
            }
            if(modulesSave[type].length != 0 && [2,3,11].indexOf(type) != -1) {
                checkTimes(type, module);
                checkTimeOrder(container);
            }

        }
        if(typeOfBlock == 4) {
            let container = document.createElement('div');
            bigContainer.appendChild(container);
            let paragraph = document.createElement('p');
            paragraph.innerHTML = modulesSpecs[typeOfBlock]['p' + i];
            container.appendChild(paragraph);

            let input = document.createElement('textarea');
            input.classList.add('reflectionsTextArea');
            input.rows = 1;
            input.style.fontSize = textFontSize;

            let text = modulesSave[typeOfBlock][i];
            if(typeof text !== 'undefined') {
                input.value = text;
            }
            
            container.appendChild(input);
        }
    }
    listenersForRows();
}

function checkTimeOrder(container) {
    let timeSelectors = container.querySelectorAll('.scheduleTimeSelect');
    let times = [];
    timeSelectors.forEach(timeSelector => {
        let text = timeSelector.value;
        let time;
        if (text != '') {
        let textArr = text.split(/[ :]/);
        let adjust = 0;
        if ((text.toLowerCase()).includes('pm')) {
            adjust = 1;
        }
        if(textArr[0] == 12) {
            textArr[0] = 0;
        }
        time = parseInt(textArr[0]) * 60 + parseInt(textArr[1]) + 12 * 60 * adjust;
        } else if(times.length > 0) {
            time = times[times.length - 1];
        } else {
            time = 0;
        }
        times.push(time);
    });
    let originalTimes = [...times];
    times.sort((a, b) => a - b);
  
    const divs = container.children;
    for (let i = 0; i < divs.length; i++) {
        let div = divs[originalTimes.indexOf(times[i])];
        div.classList.remove('newTextSection');
        originalTimes.splice(originalTimes.indexOf(times[i]), 1);
        container.removeChild(div);
        container.appendChild(div);
    }
  }
  

function listenersForRows() {
    const textareas = document.querySelectorAll("textarea");
  
    if (textareas.length > 0) {
        textareas.forEach(textarea => {
            textarea.removeEventListener("input", updateRows);
            textarea.addEventListener("input", updateRows);
            updateRows.call(textarea);
      });
    }
  }
  
function updateRows() {
    const minimumRows = 1;
    let maximumRows;
    if(this.classList.contains('bulletInput') || this.classList.contains('archiveSearch')) {
        maximumRows = 2;
    } else {
        maximumRows = 5;
    }

    console.log(this.scrollHeight);
    console.log(this.clientHeight);
    console.log('');

    if (this.scrollHeight - this.clientHeight > 1) {
        for(let i = 0; i < maximumRows; i++) {
            if(this.scrollHeight > this.clientHeight && this.rows < maximumRows) {
                this.rows ++;
            } else {
                i = maximumRows;
            }
        }
    } else {
        for(let i = 0; i < maximumRows; i++) {
            if(this.rows > minimumRows) {
                this.rows --;
                if(this.scrollHeight - this.clientHeight > 1) {
                    this.rows++;
                }
            }
        }
    }
}
  
function moduleClickListener(event,blockType,container,module) {
    let hrs = module.querySelectorAll('hr');
    const hrRect = hrs[hrs.length-1].getBoundingClientRect()
    let hr = hrRect.top;
    if(event.clientY > hr || event.keyCode !== undefined) {
        if([2,3,11].indexOf(blockType) != -1) {
            checkTimes(blockType,module);
            checkTimeOrder(container);
        }
        let values = [];
        let holders = container.querySelectorAll('.bulletHolderDiv');
        let textareas = container.querySelectorAll('textarea');
        if(holders.length > 1) {
            textareas.forEach(textarea => {
                values.push(textarea.value);
            });
            clearIndexes = [];
            for(let i = 0; i < values.length; i++) {
                if(values[i] == '') {
                    if([2,3,11].indexOf(blockType) != -1) {
                        if(i % 2 == 1 && values[i-1] == '') {
                            clearIndexes.push((i-1)/2);
                        }
                    } else {
                        clearIndexes.push(i);
                    }
                }
            }
            for(let i = 0; i < clearIndexes.length; i++) {
                holders[clearIndexes[i]].classList.add('removeTextSection');
                setTimeout(() => {
                    holders[clearIndexes[i]].remove();
                },200);
            }

            if(clearIndexes.length == 0) {
                newBullet(container,blockType);
            }
        } else {
            if(textareas[0].value != '') {
                newBullet(container,blockType);
            }
        }
    }
}

function checkTimes(blockType,module) {
    if([2,3,11].indexOf(blockType) != -1) {
        timeSelectors = module.querySelectorAll('.scheduleTimeSelect')
        timeSelectors.forEach(timeSelector => {
            let text = timeSelector.value;
            let tempArr = text.split(':');
            tempArr[1] += ' ';
            let textArr = [parseInt(tempArr[0]),parseInt(tempArr[1].substring(0,2)),tempArr[1].substring(2)];
            let validTime = true;
            if(textArr[2] == ' ') {
                textArr.splice(2,1);
            }
            if(textArr[0] != 'NaN' && textArr[1] != 'NaN') {
                if(textArr[0] < 24 && textArr[1] < 60) {
                    if(textArr.length == 3) {
                        textArr[2] = textArr[2].replace(/[ ,.]/g, "");
                        if((textArr[2].toLowerCase()).includes('am') || (textArr[2].toLowerCase()).includes('pm')) {
                            textArr[2] = textArr[2].toUpperCase();
                        } else {
                            textArr[2] = 'AM';
                        }
                    } else if(textArr.length == 2) {
                        if(textArr[0] > 12) {
                            textArr.push('PM');
                            textArr[0] -= 12;
                        } else {
                            textArr.push('AM');
                        }
                    } else {
                        validTime = false;
                    }
                } else {
                    validTime = false;
                }
            } else {
                validTime = false;
            }
            if(text == '') {
            } else if(!validTime) {
                timeSelector.value = '';
                timeSelector.placeholder = 'Invalid';
                timeSelector.rows = 1;
                timeSelector.classList.add('redPlaceholder');
            } else {
                timeSelector.classList.remove('redPlaceholder');
                if(textArr[1].toString().length == 1) {
                    textArr[1] = '0' + textArr[1];
                }
                timeSelector.value = [textArr[0], textArr[1]].join(':') + ` ${textArr[2]}`;
                timeSelector.placeholder = 'Time';
                timeSelector.color = 'white';
            }
        });

    }
}

function newBullet(container,blockType,inputText) {
    let bulletType = modulesSpecs[blockType]['bulletType'];

    const div = document.createElement('div');
    div.classList.add('bulletHolderDiv');
    div.style.width = '100%';
    container.appendChild(div);

    let longerWaitTime = false;
    if(inputText === null) {
        longerWaitTime = true;
        inputText = undefined;
    }

    if(bulletType == 'Bullet') {
        let label = document.createElement('label');
        label.style.display = 'flex';
        div.appendChild(label);

        let p = document.createElement('p');
        p.innerHTML = '•';
        label.appendChild(p);
        p.style.marginLeft = '2%';
        p.style.marginRight = '2%';
        p.style.marginTop = 'auto';
        p.style.marginBottom = 'auto';

        let input = document.createElement('textarea');
        input.classList.add('bulletInput');
        input.style.marginRight = '0';
        input.style.marginTop = '11.5px';
        input.style.marginBottom = '11.5px';
        input.rows = 1;
        setTimeout(function() {
            if(!inArchive) {
                input.focus();
            }
        },20);
        label.appendChild(input);
        if(typeof inputText !== 'undefined') {
            input.value = inputText;
        }
    } else if(bulletType == 'Checkbox') {
        let label = document.createElement('label');
        label.style.display = 'flex';
        div.appendChild(label);

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.style.marginRight = '4%';
        checkbox.style.marginLeft = '2%';
        checkbox.style.marginTop = '20px';
        label.appendChild(checkbox);
        if(typeof inputText !== 'undefined') {
            if(inputText.endsWith('_0')) {
                checkbox.checked = false;
            } else if(inputText.endsWith('_1')) {
                checkbox.checked = true;
            }
        }

        let input = document.createElement('textarea');
        input.rows = 1;
        input.classList.add('bulletInput')
        input.style.margin = '0%';
        input.style.marginTop = '11px';
        setTimeout(function() {
            if(!inArchive) {
                input.focus();
            }
        },20);
        label.appendChild(input);
        if(typeof inputText !== 'undefined') {
            input.value = inputText.substring(0,inputText.length-2);
        }
    } else if(bulletType == 'None') {
        let label = document.createElement('label');
        label.style.display = 'flex';
        label.style.flexDirection = 'column';
        div.appendChild(label);

        div.style.position = 'relative';

        let input = document.createElement('textarea');
        input.rows = 1;
        input.classList.add('bulletInput');
        input.classList.add('scheduleInput');
        input.placeholder = 'Event';
        if(longerWaitTime) {
            setTimeout(function() {
                if(!inArchive) {
                    input.focus();
                }
            },200);
        } else {
            setTimeout(function() {
                if(!inArchive) {
                    input.focus();
                }
            },20);
        }
        label.appendChild(input);

        let timeSelect = document.createElement('textarea');
        timeSelect.classList.add('scheduleTimeSelect');
        timeSelect.rows = 1;
        timeSelect.placeholder = 'Time';
        label.appendChild(timeSelect);

        if(blockType == 2) {
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('scheduleCheckbox');
            div.appendChild(checkbox);

            if(typeof inputText !== 'undefined') {
                if(inputText.endsWith('_0')) {
                    checkbox.checked = false;
                } else {
                    checkbox.checked = true;
                }
                inputText = inputText.substring(0,inputText.length-2);
            }
        } else if(blockType == 11) {
            
        } else if(inputText !== undefined) {
            inputText = inputText.substring(0,inputText.length-2);
        }

        function checkClick(timeSelect) {
            const saveText = timeSelect.value;
            timeSelect.value = '';
            function clickHandler(event) {
                if(event.target != timeSelect) {
                    if(timeSelect.value == '') {
                        timeSelect.value = saveText;
                    }
                    timeSelect.removeEventListener('mousedown', clickHandler);
                }
            }
            function keyHandler(event) {
                if(event.keyCode === 13) {
                    document.removeEventListener('mousedown', clickHandler);
                    timeSelect.removeEventListener('mousedown', clickHandler);
                }
            }
            document.addEventListener('mousedown', clickHandler);
            document.addEventListener('keydown', keyHandler);
        }
        
        timeSelect.addEventListener('mousedown', function() {
            checkClick(timeSelect);
        });

        if(typeof inputText !== 'undefined') {
            const lastIndex = inputText.lastIndexOf('_');
            input.value = inputText.slice(0,lastIndex);
            timeSelect.value = inputText.slice(lastIndex + 1);
        }
    }

    let hr = document.createElement('hr');
    hr.style.border = '0.5px solid rgb(140,140,140)';
    hr.style.backgroundColor = 'rgba(0,0,0,0)'
    hr.style.width = '90%';
    if(bulletType == 'Checkbox') {
        hr.style.marginTop = 'calc(1.16vh + 11px)';
        hr.style.marginBottom = '1.16vh';
    }
    if(bulletType == 'None') {
        hr.style.marginTop = '6px';
    }
    div.appendChild(hr);

    container.scrollTop = container.scrollHeight;
    setTimeout(function() {
        container.scrollTop = container.scrollHeight;
    }, 300);

    div.classList.add('newTextSection');
    listenersForRows();
}

let menuGrowGo = 0;
function menu() {
    let hamburger = document.getElementById('hamburger');
    let hamburgerIcon = document.getElementById('hamburgerIcon');
    let hamburgerList = document.getElementById('hamburgerListId');
    if(hamburger.classList.contains('menuGrow')) {
        let remove = document.querySelector('.colorMenu');
        if(remove !== null && remove !== undefined) {
            remove.remove();
        }
    }
    hamburger.classList.toggle('menuGrow');
    hamburgerIcon.classList.toggle('hamburgerRotate');
    if(menuGrowGo != 0) {
        hamburger.classList.toggle('menuShrink');
        hamburgerIcon.classList.toggle('hamburgerRotateBackwards');
    }
    menuGrowGo++;
    if(menuGrowGo % 2 == 1) {
        setTimeout(function() {
            hamburgerList.classList.toggle('hiding');
            hamburgerList.classList.toggle('showing');
        },500);
    } else {
        hamburgerList.classList.toggle('hiding');
        hamburgerList.classList.toggle('showing');
    }
}

let previousDay;
function savePermission() {
    if(previousDay !== undefined) {
        let today = new Date();
        today = today.toLocaleString(undefined, options);                
        today = today.substring(0,10);
        if(previousDay !== today) {
            previousDay = new Date();
            previousDay = previousDay.toLocaleString(undefined, options);                
            previousDay = previousDay.substring(0,10);

            let keptModules = [...customizations['Kept Modules']];
            setTimeout(() => {
                for(let i = 0; i < keptModules.length; i++) {
                    typeOfBlock = keptModules[i];
                    drop();
                }
            },1100);
            return false;
        } else {
            previousDay = new Date();
            previousDay = previousDay.toLocaleString(undefined, options);                
            previousDay = previousDay.substring(0,10);
            return true;
        }
    } else {
        previousDay = new Date();
        previousDay = previousDay.toLocaleString(undefined, options);                
        previousDay = previousDay.substring(0,10);
        return true;
    }
}

function getTomorrowsStuff() {
    let today = new Date();
    let tomorrow = new Date(today.getTime() + 1000 * 60 * 60 * 24);

    tomorrow = tomorrow.toLocaleString(undefined, options);                
    tomorrow = tomorrow.substring(0,10);

    let keys = Object.keys(localStorage);
    keys.sort(function(a, b) {
      return new Date(b) - new Date(a);
    });
    
    let tomorrowModulesSave = [];
    for(let i = 0; i < comparisons.length; i++) {
        tomorrowModulesSave.push([]);
    }

    for(const key of keys) {
        if(key == tomorrow) {
            const textJSON = localStorage.getItem(key);
            const storedText = JSON.parse(textJSON);
            for(let i = 0; i < comparisons.length; i++) {
                for(let j = 0; j < storedText[comparisons[i]].length; j++) {
                    tomorrowModulesSave[i].push(storedText[comparisons[i]][j]);
                }
            }
            break;
        }
    }
    return tomorrowModulesSave;
}

function save(archiveDate) {
    let storedText = {
        'Looking Forward To': [],
        'Intentions': [],
        'Schedule': [],
        "Tomorrow's Schedule": [],
        'Reflections': []
    };
    let storedTextTomorrow = {
        'Looking Forward To': [],
        'Intentions': [],
        'Schedule': [],
        "Tomorrow's Schedule": [],
        'Reflections': []
    }
    let tomorrow = getTomorrowsStuff();
    for(let i = 0; i < comparisons.length; i++) {
        storedTextTomorrow[comparisons[i]] = [...tomorrow[i]];
    }

    for(let i = 0; i < comparisons.length; i++) {
        if(currentModules.indexOf(comparisons[i]) == -1) {
            storedText[comparisons[i]] = modulesSave[i];
        }
    }
    for(let i = 0; i < currentModules.length; i++) {
        let id = currentModules[i] + ' Module';
        let module = document.getElementById(id);
        const textareas = module.querySelectorAll('textarea');
        let checkboxes = module.querySelectorAll("input[type='checkbox']");
        checkboxes = Array.from(checkboxes);
        let j = 1;
        let lastTextAreaValue;
        textareas.forEach(textarea => {
            let text = textarea.value;
            if(text == '' && ['Reflections','Schedule',"Tomorrow's Schedule"].indexOf(currentModules[i]) == -1) {

            } else {
                if(modulesSpecs[comparisons.indexOf(currentModules[i])]['bulletType'] == 'Checkbox') {
                    if(checkboxes[j-1].checked) {
                        text += '_1';
                    } else {
                        text += '_0';
                    }
                }
                if(['Schedule',"Tomorrow's Schedule"].indexOf(currentModules[i]) != -1 && j % 2 == 0) {
                    if(lastTextAreaValue != '') {
                        let adjust = '0';
                        if(['Schedule'].indexOf(currentModules[i]) != -1) {
                            if(checkboxes[Math.floor((j-1)/2)].checked) {
                                adjust = '1';
                            }
                        }
                        storedText[currentModules[i]][storedText[currentModules[i]].length-1] += `_${text}_${adjust}`;
                    }
                } else {
                    if(text != '' || ['Schedule',"Tomorrow's Schedule"].indexOf(currentModules[i]) == -1) {
                        storedText[currentModules[i]].push(text);
                    }
                }
            }
            j++;
            lastTextAreaValue = textarea.value;
        });
    }

    if(storedText['Reflections'].every(element => element === '')) {
        storedText['Reflections'] = [];
    }

    const textJSON = JSON.stringify(storedText);
    let date = new Date();

    let dateTMR = new Date(date.getTime() + 1000 * 60 * 60 * 24);

    date = date.toLocaleString(undefined, options);                
    date = date.substring(0,10);

    if(archiveDate !== undefined) {
        date = archiveDate;
    }

    const key = date;
    localStorage.setItem(key, textJSON);

    if(archiveDate === undefined) {
        storedTextTomorrow['Schedule'] = [...storedText["Tomorrow's Schedule"]];
        const textJSONTMR = JSON.stringify(storedTextTomorrow);
        dateTMR = dateTMR.toLocaleString(undefined, options);                
        dateTMR = dateTMR.substring(0,10);
        const keyTMR = dateTMR;
        localStorage.setItem(keyTMR, textJSONTMR);
    }

    let isGoalsActive = document.getElementById('goalsModule');
    if(isGoalsActive !== null && isGoalsActive !== undefined) {
        let textSave = [[], [], []];
        let divs = isGoalsActive.querySelectorAll('.goalsModules');
        for(let i = 0; i < 3; i++) {
            let div = divs[i];
            let textareas = div.querySelectorAll('textarea');
            let checkboxes = div.querySelectorAll("input[type='checkbox']");
            j = 0;
            textareas.forEach(textarea => {
                let text = textarea.value;
                if(text != '') {
                    if(checkboxes[j].checked) {
                        text += '_1';
                    } else {
                        text += '_0';
                    }
                    textSave[i].push(text);
                }
            });
        }
        let goalsObject = JSON.parse(localStorage.getItem('Goals'));

        let today = new Date();

        let dayOfWeek = today.getDay();
        if(dayOfWeek == 0) {
            dayOfWeek = 7;
        }
        dayOfWeek--;
        let weekDate = new Date(today.getTime() - 1000 * 60 * 60 * 24 * dayOfWeek);
        weekDate = weekDate.toLocaleString(undefined, options);                
        weekDate = weekDate.substring(0,10);
        let month = date.substring(0,2);
        let year = date.substring(6,10);
        let timeArr = [weekDate,`${month}/${year}`,year];

        goalsObject['Weekly'][timeArr[0]] = textSave[0];
        goalsObject['Monthly'][timeArr[1]] = textSave[1];
        goalsObject['Annual'][timeArr[2]] = textSave[2];

        localStorage.setItem('Goals', JSON.stringify(goalsObject));
    }

    customizations['Kept Modules'] = [];
    for(let i = 0; i < currentModules.length; i++) {
        customizations['Kept Modules'].push(comparisons.indexOf(currentModules[i]));
    }

    let routineIsActive = document.getElementById('routineModule');
    if(routineIsActive !== undefined && routineIsActive !== null) {
        let textareas = routineIsActive.querySelectorAll('textarea');
        let textArr = [];
        for(let i = 0; i < textareas.length; i++) {
            let textarea = textareas[i];
            if(i % 2 == 0) {
                if(textarea.value != '') {
                    textArr.push(textarea.value);
                }
            } else {
                if(textareas[i-1].value != '') {
                    textArr[textArr.length-1] += `_${textarea.value}`;
                }
            }
        }
        customizations['Routine'][customizations['Active Routine']]['Text'] = [...textArr];
    }

    localStorage['Customization'] = JSON.stringify(customizations);
}

function restore() {
    for(let i = 0; i < modulesSave.length; i++) {
        modulesSave[i] = [];
    }

    let keys = Object.keys(localStorage);
    keys.sort(function(a, b) {
      return new Date(b) - new Date(a);
    });

    let today = new Date();
    today = today.toLocaleString(undefined, options);                
    today = today.substring(0,10);

    if(localStorage[today] !== null && localStorage[today] !== undefined) {
        const textJSON = localStorage[today];
        const storedText = JSON.parse(textJSON);
        for(let i = 0; i < comparisons.length; i++) {
            for(let j = 0; j < storedText[comparisons[i]].length; j++) {
                modulesSave[i].push(storedText[comparisons[i]][j]);
            }
        }
    }
    let thisDay = new Date();
    let dayOfWeek = thisDay.getDay();
    if(dayOfWeek == 0) {
        dayOfWeek = 7;
    }
    dayOfWeek--;
    let weekDate = new Date(thisDay.getTime() - 1000 * 60 * 60 * 24 * dayOfWeek);
    weekDate = weekDate.toLocaleString(undefined, options);                
    weekDate = weekDate.substring(0,10);
    let month = today.substring(0,2);
    let year = today.substring(6,10);
    let timeArr = [weekDate,`${month}/${year}`,year];
    let goalsObject = JSON.parse(localStorage['Goals']);
    for(let i = 0; i < 3; i++) {
        if(goalsObject[goalComparisons[i]][timeArr[i]] !== undefined && goalsObject[goalComparisons[i]][timeArr[i]] !== null) {
            goalsSave[i] = [...goalsObject[goalComparisons[i]][timeArr[i]]];
        }
    }

    let storedRoutine = JSON.parse(localStorage['Customization']);
    customizations['Routine'] = [...storedRoutine['Routine']];
}

function clearLocalStorage() {
    clearAllModules();
    setTimeout(function() {
        localStorage.clear();
        clearModulesSave();
        checkForLocalStorageObjects();
    },300);
}

function clearAllModules() {
    let div = document.getElementById('goalsModule');
    let blocker = document.getElementById('goalsBlocker');
    for(let i = 0; i < currentModules.length; i++) {
        let module = document.getElementById(currentModules[i] + ' Module');
        module.classList.remove('modulesGrow');
        module.classList.add('modulesRemove');
        setTimeout(function() {
            module.remove();
            currentModules.splice(currentModules.indexOf(currentModules[i]),1);
        },300);
    }

    if(div !== null) {
        div.classList.remove('grow');
        div.classList.add('goalsShrink');

        setTimeout(function() {
            div.remove();
            blocker.remove();
        },300);
    }

    let routineBackground = document.getElementById('routineBackground');
    if(routineBackground !== null) {
        routineBackground.classList.remove('grow');
        routineBackground.classList.add('goalsShrink');
        
        setTimeout(function() {
            routineBackground.remove();
            inRoutine = false;
        },300);
    }
}

function clearModulesSave() {
    for(let i = 0; i < modulesSave.length; i++) {
        modulesSave[i] = [];
    }
    for(let j = 0; j < goalsSave.length; j++) {
        goalsSave[j] = [];
    }
}

function saveInterval() {
    let permission = savePermission();
    if(permission) {
        save();
        restore();
    } else {
        restore();
        clearAllModules();
    }
}

function archive() {
    archiveDate = '';
    clearInterval(actualSaveInterval);
    saveInterval();
    clearAllModules();
    clearModulesSave();
    inArchive = true;   

    let settingsOptions = document.querySelectorAll('.homescreenLinks, .hamburgerHr');
    settingsOptions.forEach(settingsOption => {
        settingsOption.style.display = 'none';
    });

    let container = document.getElementById('hamburgerListId');
    let settingsHr = document.getElementById('settingsHr');

    let backButton = document.createElement('button');
    backButton.classList.add('archiveButtons');
    backButton.innerHTML = 'Back';
    container.insertBefore(backButton, settingsHr);
    backButton.addEventListener('click', leaveArchive);

    let saveButton = document.createElement('button');
    saveButton.classList.add('archiveButtons');
    saveButton.innerHTML = 'Save';
    container.insertBefore(saveButton, settingsHr);
    saveButton.addEventListener('click', saveArchive);

    let wordSelect = document.createElement('textarea');
    wordSelect.classList.add('archiveSearch');
    wordSelect.placeholder = 'Search';
    wordSelect.rows = 1;
    container.insertBefore(wordSelect, settingsHr);
    listenersForRows();
    wordSelect.addEventListener('input', searchArchive);

    let div = document.createElement('div');
    div.id = 'timeSelect';
    container.appendChild(div);
    makeDateBar(div);
}

function searchArchive() {
    clearAllModules();
    previousDiv = '';
    let value = this.value.toLowerCase();
    let textIsIn = {};
    let div = document.getElementById('timeSelect');
    if(value != '') {
        let storedKeys = Object.keys(storageObject).sort((a, b) => {
            return Object.keys(storageObject).indexOf(a) - Object.keys(storageObject).indexOf(b);
        });
        for(let i = 0; i < storedKeys.length; i++) {
            let key = storedKeys[i];
            for(let j = 0; j < comparisons.length; j++) {
                const comparison = comparisons[j];
                for(let k = 0; k < storageObject[key][comparison].length; k++) {
                    if(storageObject[key][comparison][k].toLowerCase().includes(value)) {
                        if(!(key in textIsIn)) {
                            textIsIn[key] = [];
                        }
                        textIsIn[key].push(comparison);
                    }
                }
            }
        }
        let listOfKeys = Object.keys(textIsIn);
        for(let i = 0; i < listOfKeys.length; i++) {
            textIsIn[listOfKeys[i]] = [...removeDuplicates(textIsIn[listOfKeys[i]])];
        }
        div.innerHTML = '';
        let keys = Object.keys(textIsIn);
        makeDateBar(div,keys,textIsIn);
    } else {
        div.innerHTML = '';
        makeDateBar(div);
    }
}

function removeDuplicates(arr) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
      if (!result.includes(arr[i])) {
        result.push(arr[i]);
      }
    }
    return result;
}  

function makeDateBar(menu,searchKeys,textIsIn) {
    let keys = Object.keys(localStorage);
    let dateKeys = [];

    for (let i = 0; i < keys.length; i++) {
        let keyArr = keys[i].split('/');
        let date = new Date(keyArr[2], keyArr[0] - 1, keyArr[1]);
    
        if (!isNaN(date)) {
            dateKeys.push(keys[i]);
        }
    }

    dateKeys.sort(function(a, b) {
        // Split the strings into components
        var aComponents = a.split("/");
        var bComponents = b.split("/");
    
        // Pass the components to the Date constructor in the correct order
        var aDate = new Date(aComponents[2], aComponents[0] - 1, aComponents[1]);
        var bDate = new Date(bComponents[2], bComponents[0] - 1, bComponents[1]);
    
        // Compare the dates and return the result
        return bDate - aDate;
    });

    let today = new Date();
    today = today.toLocaleString(undefined, options);                
    today = today.substring(0,10);
    
    if(textIsIn !== undefined) {
        dateKeys = searchKeys;
    }

    for (const key of dateKeys) {
        if(checkDate(today,key)) {

            let div = document.createElement('div');
            div.classList.add('menuItem');
            div.id = key;
            menu.appendChild(div);

            let p = document.createElement('p');
            p.classList.add('dates');
            p.innerHTML = key;
            div.appendChild(p);

            if(textIsIn !== undefined) {
                let h6 = document.createElement('h6');
                h6.classList.add('archiveSearchModuleList')
                let text = '';
                for(let i = 0; i < textIsIn[key].length; i++) {
                    text = text + textIsIn[key][i] + '<br>';
                }
                h6.innerHTML = text;
                div.appendChild(h6);
            }

            let hr = document.createElement('hr');
            hr.classList.add('dateHr');
            div.appendChild(hr);

            const textJSON = localStorage.getItem(key);
            const storedText = JSON.parse(textJSON);
            storageObject[key] = storedText;
        }
    }
    menu.addEventListener('click',archiveDateClick);
}

function archiveDateClick(event) {
    clearAllModules();
    clearModulesSave();
    let div;
    if(event.target.classList.contains('menuItem')) {
        div = event.target;
    } else if(event.target.id == 'timeSelect') {
        div = "Do not go";
    } else {
        div = event.target.parentElement;
    }

    if(div != 'Do not go') {

        div.style.backgroundColor = 'rgb(150,150,150,0.3)';

        if(previousDiv != '') {
            previousDivElement = document.getElementById(previousDiv);
            previousDivElement.style.backgroundColor = 'transparent';
        }

        if(previousDiv == div.id) {
            previousDiv = '';
        } else {
            previousDiv = div.id;
        }

        let p = div.querySelector('p');
        archiveDate = p.innerHTML;

        let storedText = storageObject[p.innerHTML];
        for(let i = 0; i < comparisons.length; i++) {
            for(let j = 0; j < storedText[comparisons[i]].length; j++) {
                modulesSave[i].push(storedText[comparisons[i]][j]);
            }
        }

        let goalsObject = JSON.parse(localStorage['Goals']);
        const dateParts = archiveDate.split('/');
        const thisDay = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`);

        let dayOfWeek = thisDay.getDay();
        if(dayOfWeek == 0) {
            dayOfWeek = 7;
        }
        dayOfWeek--;
        let weekDate = new Date(thisDay.getTime() - 1000 * 60 * 60 * 24 * dayOfWeek);
        weekDate = weekDate.toLocaleString(undefined, options);                
        weekDate = weekDate.substring(0,10);
        let month = archiveDate.substring(0,2);
        let year = archiveDate.substring(6,10);
        let timeArr = [weekDate,`${month}/${year}`,year]

        for(let i = 0; i < 3; i++) {
            if(goalsObject[goalComparisons[i]][timeArr[i]] !== undefined && goalsObject[goalComparisons[i]][timeArr[i]] !== null) {
                goalsSave[i] = [...goalsObject[goalComparisons[i]][timeArr[i]]];
            } else {
                goalsSave[i] = [''];
            }
        }
    }

}

function checkDate(dateStr, comparisonDateStr) {
    const date = new Date(dateStr);
    const comparisonDate = new Date(comparisonDateStr);
    return (date.getTime() >= comparisonDate.getTime());
}

function leaveArchive() {
    clearAllModules();
    clearModulesSave();
    restore();
    previousDiv = '';
    let container = document.getElementById('timeSelect');
    container.remove();

    let buttons = document.querySelectorAll('.archiveButtons');
    buttons.forEach(button => {
        button.remove();
    });

    let searchBar = document.querySelector('.archiveSearch');
    searchBar.remove();

    let settingsOptions = document.querySelectorAll('.homescreenLinks, .hamburgerHr');
    settingsOptions.forEach(settingsOption => {
        settingsOption.style.display = 'block';
    });

    inArchive = false;
    actualSaveInterval = setInterval(saveInterval, 500);
}

function saveArchive() {
    save(archiveDate);
}

function colorChange() {
    let maybeRemoveBlock = document.querySelector('.colorMenu');
    if(maybeRemoveBlock === null || maybeRemoveBlock === undefined) {
        const colorSchemeBox = document.getElementById('colorChangeId');
        const rect = colorSchemeBox.getBoundingClientRect();
        let boxYValue = rect.top;
        let boxXValue = window.innerWidth - rect.left;
        let colorSchemeBoxHeight = colorSchemeBox.offsetHeight;

        let colorMenu = document.createElement('div');
        colorMenu.classList.add('colorMenu');
        colorMenu.classList.add('fadeIn');
        body.appendChild(colorMenu);
        colorMenu.style.top = `calc(${boxYValue}px - 15vw + ${colorSchemeBoxHeight/2}px)`;
        colorMenu.style.right = `calc(${boxXValue}px + 2vw)`;
        var divs = [];

        for(let i = 0; i < backgroundColors.length; i++) {
            let div = document.createElement('div');
            div.classList.add('colorMenuBox');
            colorMenu.appendChild(div);
            if(i == customizations['Color Scheme']) {
                div.style.border = '1px solid white';
            }
            divs.push(div);

            div.style.backgroundImage = `linear-gradient(${getRGB(backgroundColors[i], 1.47)}, ${getRGB(backgroundColors[i], 1)})`;

            let smallerDiv = document.createElement('div');
            smallerDiv.classList.add('colorMenuSmallerBox');
            smallerDiv.style.backgroundColor = getRGB(backgroundColors[i], 0.7);
            smallerDiv.style.border = `1px solid ${getRGB(backgroundColors[i], 1.45, undefined, true)}`;
            div.appendChild(smallerDiv);

            let smallModule = document.createElement('div');
            smallModule.classList.add('colorMenuSmallModule');
            smallModule.style.backgroundColor = getRGB(backgroundColors[i], 1);
            smallModule.style.border = `0.5px solid ${getRGB(backgroundColors[i], 1.45, undefined, true)}`;
            smallerDiv.appendChild(smallModule);

            let title = document.createElement('p');
            title.classList.add('colorMenuSmallTitle');
            title.innerHTML = 'Module Name';
            smallModule.appendChild(title);

            let text = document.createElement('p');
            text.classList.add('colorMenuSmallText');
            text.innerHTML = 'Text';
            text.style.backgroundColor = getRGB(backgroundColors[i], 0.85);
            smallModule.appendChild(text);

            div.addEventListener('click', function() {
                divs[customizations['Color Scheme']].style.border = '1px solid transparent';
                
                changeColorScheme(i);
                
                divs[i].style.border = '1px solid white';
                customizations['Color Scheme'] = i;
                localStorage['Customization'] = JSON.stringify(customizations);
            });
        }
    } else {
        maybeRemoveBlock.classList.remove('fadeIn');
        maybeRemoveBlock.classList.add('fadeOut');
        setTimeout(function() {
            maybeRemoveBlock.remove();
        },300);
    }
}

function getRGB(colors, change, alpha, average) {
    let sum = 0;
    for(let i = 0; i < colors.length; i++) {
        sum += colors[i];
    }
    if(change > 1 && sum > 128*3) {
        change = 1/change;
    }
    if(average) {
        let av = sum/3;
        if(av < 88.333333) {
            change += (88.3333-av)/70;
        }
        return `rgb(${av * change}, ${av * change}, ${av * change})`;
    } else if(alpha === undefined) {
        return `rgb(${colors[0] * change}, ${colors[1] * change}, ${colors[2] * change})`;
    } else {
        return `rgba(${colors[0] * change}, ${colors[1] * change}, ${colors[2] * change}, ${alpha})`;
    }
}

function changeColorScheme(i) {
    root.style.setProperty('--backgroundColor', getRGB(backgroundColors[i], 1));
    root.style.setProperty('--veryCloseBackgroundColor', getRGB(backgroundColors[i], 0.95));
    root.style.setProperty('--middleBackgroundColor', getRGB(backgroundColors[i], 0.85));
    root.style.setProperty('--darkerBackgroundColor', getRGB(backgroundColors[i], 0.7));
    root.style.setProperty('--darkerBackgroundColorHalf', getRGB(backgroundColors[i], 0.7, 0.9));
    root.style.setProperty('--gradientStart', getRGB(backgroundColors[i], 1.47));
    root.style.setProperty('--borderColor', getRGB(backgroundColors[i], 1.45, undefined, true));
}

function routine() {
    if(!inRoutine) {
        inRoutine = true;
        let div = document.createElement('div');
        div.classList.add('routineBackground');
        div.id = 'routineBackground';
        div.classList.add('grow');
        body.appendChild(div);

        let module = document.createElement('div');
        module.classList.add('modules');
        module.id = 'routineModule';
        module.style.height = '100%';
        module.style.width = '55%';
        module.style.borderLeft = 'none';
        module.style.boxSizing = 'content-box';
        div.appendChild(module);

        let routineOptions = document.createElement('div');
        routineOptions.classList.add('routineOptions');
        routineOptions.id = 'routineOptions';
        div.appendChild(routineOptions);

        let differentRoutines = document.createElement('div');
        differentRoutines.classList.add('differentRoutinesBox');
        routineOptions.appendChild(differentRoutines);

        for(let i = 0; i < customizations['Routine'].length; i++) {
            let smallDiv = document.createElement('div');
            smallDiv.classList.add('differentRoutinesDiv');
            differentRoutines.appendChild(smallDiv);

            let button = document.createElement('button');
            button.innerHTML = customizations['Routine'][i]['Name'];
            button.classList.add('differentRoutinesButtons');
            smallDiv.appendChild(button);

            function changeButton() {
                let permission = savePermission();
                if(permission) {
                    save();
                    restore();
                }
                module.innerHTML = '';
                customizations['Active Routine'] = i;
                makeRoutineModule(module,div);
            }
            button.addEventListener('mousedown', changeButton);

            
            let editButton = document.createElement('i');
            editButton.className = 'fas fa-pencil-alt';
            editButton.classList.add('routineOptionsEditName');
            smallDiv.appendChild(editButton);

            let editButtonClicked = false;
            editButton.addEventListener('mousedown', function() {
                if(!editButtonClicked) {
                    editButton.style.display = 'none';
                    editButtonClicked = true;
                    let textToSave = customizations['Routine'][i]['Name'];
                    let textarea = document.createElement('textarea');
                    button.innerHTML = '';
                    textarea.classList.add('routineOptionsEditTextArea');
                    textarea.rows = 1;
                    textarea.value = textToSave;
                    setTimeout(function() {
                        textarea.focus();
                    },30);
                    button.appendChild(textarea);
                    button.removeEventListener('mousedown', changeButton);

                    textarea.addEventListener('keydown', function(event) {
                        if(event.keyCode == 13) {
                            editButton.style.display = 'inline-block';
                            button.addEventListener('mousedown', changeButton);
                            editButtonClicked = false;
                            if(textarea.value == '') {
                                if(i == customizations['Active Routine']) {
                                    let title = document.querySelector('.goalsModulesHeader');
                                    title.innerHTML = `Routine ${i+1}`;
                                }
                                customizations['Routine'][i]['Name'] = `Routine ${i+1}`;
                                button.innerHTML = `Routine ${i+1}`;
                            } else {
                                if(i == customizations['Active Routine']) {
                                    let title = document.querySelector('.goalsModulesHeader');
                                    title.innerHTML = textarea.value;
                                }
                                customizations['Routine'][i]['Name'] = textarea.value;
                                button.innerHTML = textarea.value;
                            }
                        }
                    });
                }
            });

            if(i != customizations['Routine'].length-1) {
                let hr = document.createElement('hr');
                hr.classList.add('differentRoutinesHr');
                differentRoutines.appendChild(hr);
            }
        }
        let lastHr = document.createElement('hr');
        lastHr.classList.add('routineOptionsSeparator');
        routineOptions.appendChild(lastHr);

        const routineOptionsArray = [
            'Import to Schedule',
            "Import to Tomorrow's Schedule"
        ];

        for(let i = 0; i < routineOptionsArray.length; i++) {
            let button = document.createElement('button');
            button.innerHTML = routineOptionsArray[i];
            button.classList.add('routineButtons')
            routineOptions.appendChild(button);
            button.addEventListener('click', function() {
                let container;
                if(i == 0) {
                    container = document.getElementById('Schedule Module');
                } else if(i == 1) {
                    container = document.getElementById("Tomorrow's Schedule Module");
                }

                let today = new Date();
                today = today.toLocaleString(undefined, options);                
                today = today.substring(0,10);

                if(container !== null && container !== undefined) {
                    container.classList.remove('grow');
                    container.classList.add('modulesRemove');
                    setTimeout(function() {
                        let permission = savePermission();
                        if(permission && !inArchive) {
                            save();
                            restore();
                        }
                        container.remove();
                        if(i == 0) {
                            currentModules.splice(currentModules.indexOf('Schedule'),1);
                            let storedThing = {...JSON.parse(localStorage[today])};
                            for(let i = 0; i < customizations['Routine'][customizations['Active Routine']]['Text'].length; i++) {
                                storedThing['Schedule'].push(customizations['Routine'][customizations['Active Routine']]['Text'][i] + '_0');
                            }
                            localStorage[today] = JSON.stringify(storedThing);
                        } else if(i == 1) {
                            currentModules.splice(currentModules.indexOf("Tomorrow's Schedule"),1);
                            let storedThing = {...JSON.parse(localStorage[today])};
                            for(let i = 0; i < customizations['Routine'][customizations['Active Routine']]['Text'].length; i++) {
                                storedThing["Tomorrow's Schedule"].push(customizations['Routine'][customizations['Active Routine']]['Text'][i] + '_0');
                            }
                            localStorage[today] = JSON.stringify(storedThing);
                        }
                        restore();
                    },300);
                } else {
                    let permission = savePermission();
                    if(permission && !inArchive) {
                        save();
                        restore();
                    }
                    if(i == 0) {
                        let storedThing = {...JSON.parse(localStorage[today])};
                        for(let i = 0; i < customizations['Routine'][customizations['Active Routine']]['Text'].length; i++) {
                            storedThing['Schedule'].push(customizations['Routine'][customizations['Active Routine']]['Text'][i] + '_0');
                        }
                        localStorage[today] = JSON.stringify(storedThing);
                    } else if(i == 1) {
                        let storedThing = {...JSON.parse(localStorage[today])};
                        for(let i = 0; i < customizations['Routine'][customizations['Active Routine']]['Text'].length; i++) {
                            storedThing["Tomorrow's Schedule"].push(customizations['Routine'][customizations['Active Routine']]['Text'][i] + '_0');
                        }
                        localStorage[today] = JSON.stringify(storedThing);
                    }
                    restore();
                }
            });
        }
        makeRoutineModule(module,div);
    }
}

function makeRoutineModule(module,div) {
    let title = document.createElement('h3')
    title.classList.add('goalsModulesHeader');
    title.innerHTML = customizations['Routine'][customizations['Active Routine']]['Name'];
    module.appendChild(title);

    let smallContainer = document.createElement('div');
    smallContainer.classList.add('goalsSmallContainer')
    module.appendChild(smallContainer);

    let x = document.createElement('button');
    x.innerHTML = '&times;';
    x.classList.add('xButtons');
    div.appendChild(x);
    x.addEventListener('mousedown', function() {
        div.classList.remove('grow');
        div.classList.add('goalsShrink');
        setTimeout(function() {
            let permission = savePermission();
            if(permission && !inArchive) {
                save();
                restore();
            }
            div.remove();
            inRoutine = false;
        },300);
    });

    let refreshButton = document.createElement('p');
    refreshButton.innerHTML = '&#x21bb;';
    refreshButton.classList.add('refreshButtons');
    module.appendChild(refreshButton);
    refreshButton.addEventListener('mousedown', function() {
        smallContainer.innerHTML = '';
        newBullet(smallContainer, 11, null);
    });

    module.addEventListener('click', function(event) {
        moduleClickListener(event, 11, smallContainer, module);
    });

    module.addEventListener('keydown', function(event) {
        if(event.keyCode === 13) { //This line is duplicated
            let focusedElement = document.activeElement;
            checkTimes(11,module);
            checkTimeOrder(smallContainer);
            let textareas = smallContainer.querySelectorAll('textarea');
            let index;
            for(let i = 0; i < textareas.length; i++) {
                if(textareas[i] == focusedElement && i % 2 == 0) {
                    index = i;
                }
            }
            if(index !== undefined) {
                if(!inArchive) {
                    textareas[index+1].focus();
                }
                setTimeout(function() {
                    const textarea = textareas[index+1];
                    if(textarea.value.includes('\n')) {
                        textarea.value = textarea.value.replace(/\n/g, '');
                        if(textarea.scrollHeight <= textarea.clientHeight) {
                            textarea.rows --;
                        }
                    }
                },10);
            }
        }
    });

    if(customizations['Routine'][customizations['Active Routine']]['Text'].length == 0) {
        newBullet(smallContainer,11,undefined);
    } else {
        for(let i = 0; i < customizations['Routine'][customizations['Active Routine']]['Text'].length; i++) {
            newBullet(smallContainer, 11, customizations['Routine'][customizations['Active Routine']]['Text'][i]);
        }
    }


    const draggable = document.getElementById('routineOptions');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    draggable.addEventListener('mousedown', dragStart);
    draggable.addEventListener('mouseup', dragEnd);
    draggable.addEventListener('mousemove', drag);
    
    function dragStart(event) {
        initialX = event.clientX - xOffset;
        initialY = event.clientY - yOffset;
        
        if (event.target === draggable) {
            isDragging = true;
        }
    }
    
    function dragEnd(event) {
        initialX = currentX;
        initialY = currentY;
        
        isDragging = false;
    }
    
    function drag(event) {
        if (isDragging) {
            event.preventDefault();
        
            currentX = event.clientX - initialX;
            currentY = event.clientY - initialY;
        
            xOffset = currentX;
            yOffset = currentY;
        
            setTranslate(currentX, currentY, document.getElementById('routineBackground'));
        }
    }
    
    function setTranslate(xPos, yPos, el) {
        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }
}

let comingSoon = (e) => {
    let element = e.target;
    let text = element.innerHTML;
    let re = 'Coming Soon!';
    if(text.length < re.length) {
        let repeatNum = re.length - text.length;
        text += ' '.repeat(repeatNum);
    }
    let i = 0;
    let intervalTime = 20;
    let interval = setInterval(() => {
        if(i <= re.length) {
            text = re.substring(0,i) + text.substring(i);
            element.innerHTML = text;
            i++;
        } else if(text.length != re.length && i <= text.length) {
            text = text.substring(0,i) + text.substring(i+1);
            element.innerHTML = text;
            if(i == text.length) {
                setTimeout(() => {
                    text = text.substring(0, text.length-1);
                    element.innerHTML = text;
                }, intervalTime);
                clearInterval(interval);
            }
        } else {
            clearInterval(interval);
        }
    },intervalTime);
}

let habit = () => {
    
}