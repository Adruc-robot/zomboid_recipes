const tallyArray = ["Calories","Carbohydrates","HungerChange","Lipids","Proteins"]
let bOver = false
let overObject
let idI = 0
//mimics jquerys document ready begin
let domReady = function(callback) {
    document.readyState === "interactive" || document.readyState === "complete" ? callback() : document.addEventListener("DOMContentLoaded", callback);
}

domReady(function() {
    main()    
    

})

async function main() {
    let folderString = await getThings('/txtFiles/')
    let fileArray = folderString.substring(folderString.indexOf("href=\""), folderString.length).split("href=\"")
    let allArray = new Array()
    for (let i = 0; i < fileArray.length; i++) {
        let el = fileArray[i]
        if (el.includes('.txt')) {
            let filePath = el.substring(0, el.indexOf('" class="'))
            let fileText = await getThings(filePath)
            let splitString = ''
            let filterString = ''
            let delimiter = ''
            let parentClass = ''
            let childClass = ''
            let titleClass = ''
            if (fileText.includes('BaseItem:')) {
                splitString = 'evolvedrecipe'
                filterString = 'BaseItem'
                delimiter = ':'
                parentClass = "recipe"
                childClass = "recipeContents"
                titleClass = "recipeTitle"
            } else {
                splitString = 'item'
                filterString = 'EvolvedRecipe'
                delimiter = '='
                parentClass = "foodItem"
                childClass = "foodItemContents"
                titleClass = "foodItemTitle"
            }
            let tmpArr = fileText.split(splitString)
            tmpArr.forEach(tmpEl => {
                if (tmpEl.includes(filterString)) {
                    //                  0           1           2       3          4            5
                    allArray.push( [splitString, parentClass, tmpEl, titleClass, childClass, delimiter])
                }
            })
        }
    }
    allArray.sort()
    let idI = 0
    allArray.forEach(item => {
        //main div
        let  parentEl = document.createElement("div")
        document.getElementById(item[0]).appendChild(parentEl)
        parentEl.classList.add(item[1], 'accordion-item')
        parentEl.setAttribute('draggable',true)
        if (item[1] == 'recipe') {
            parentEl.addEventListener('dragstart', dragRStart)
            parentEl.addEventListener('dragend', dragREnd)
        } else {
            parentEl.addEventListener('dragstart', dragIStart)
            parentEl.addEventListener('dragend', dragIEnd)
        }
        //title
        let titleEl = document.createElement('h3')
        titleEl.classList.add(item[3], "accordion-header")
        parentEl.appendChild(titleEl)
        //accordion button
        let titBTN = document.createElement('button')
        titBTN.classList.add('accordion-button','collapsed')
        titBTN.dataset.bsToggle = 'collapse'
        titBTN.dataset.bsTarget = '#ulNumber' + idI
        titBTN.innerText = item[2].substring(0,item[2].indexOf('{')).trim()
        titBTN.type = 'button'
        titleEl.appendChild(titBTN)
        //ul
        let attribEl = document.createElement('ul')
        attribEl.classList.add(item[4], 'accordion-body', 'accordion-collapse', 'collapse')
        attribEl.id = 'ulNumber' + idI
        parentEl.appendChild(attribEl)
        let attribArr = item[2].substring(item[2].indexOf('{') + 1 ,item[2].indexOf('}') - 1).trim().split(',')
        attribArr.forEach(attrib => {
            if (attrib) {
                //li's
                let liEl = document.createElement('li')
                let attribSpl = attrib.split(item[5])
                liEl.classList.add(attribSpl[0].trim())
                attribEl.appendChild(liEl)
                let leftSpan = document.createElement('span')
                leftSpan.classList.add('afterColon', 'keyPair')
                leftSpan.innerText = attribSpl[0].trim()
                liEl.appendChild(leftSpan)
                let rightSpan = document.createElement('span')
                rightSpan.classList.add('valuePair')
                rightSpan.innerText = attribSpl[1].trim()
                liEl.appendChild(rightSpan)
            }
        })
        idI++
    })
    document.getElementById('selectedThings').addEventListener('dragenter',dragEnter)
    document.getElementById('selectedThings').addEventListener('dragleave',dragLeave)
    document.getElementById('selectedThings').addEventListener('dragover',dragOver)

}
async function getThings(path) {
    let theObject = await fetch(path)
    let theString = await theObject.text()
    return theString
}
function dragRStart() {
    //When dragging recipes
    document.getElementById('selectedThings').classList.add('dragLanding')
    let hideItems = document.querySelectorAll('.' + this.classList[0])
    hideItems.forEach(item => {
        if (item !== this) {
            console.log(this)
            item.classList.add('noShow')
        }
    })
}
function dragIStart() {
    //When dragging ingredients
    let landingPads = document.querySelectorAll('.emptyOLLI')
    landingPads.forEach(landingPad => {
        if (landingPad.innerText == '') {
            landingPad.classList.add('dragILanding')
            landingPad.addEventListener('dragenter',dragEnter)
            landingPad.addEventListener('dragleave',dragLeave)
            landingPad.addEventListener('dragover',dragOver)
        }
    })
}
function dragREnd() {
    //When dragging recipes
    let landingPad = document.getElementById('selectedThings')
    if (bOver) {
        //do things
        landingPad.innerHTML = ''
        landingPad.appendChild(this)
        document.getElementById('selectedThings').removeEventListener('dragenter',dragEnter)
        document.getElementById('selectedThings').removeEventListener('dragleave',dragLeave)
        document.getElementById('selectedThings').removeEventListener('dragover',dragOver)
        document.getElementById('evolvedrecipe').classList.add("noShow")
        makeIngredientSlots(this)
    } else {
        landingPad.classList.remove('dragLanding')
        let hideItems = document.querySelectorAll('.' + this.classList[0])
        hideItems.forEach(item => {
            item.classList.remove('noShow')
        })
    }
    document.getElementById('selectedThings').classList.remove('dragLanding')
}
function dragIEnd() {
    //when dragging ingredients
    let landingPads = document.querySelectorAll('.emptyOLLI')
    if (overObject) {
        let thisClone = this.cloneNode(true)
        //Need to update the id so that the accordion doesn't open ALL similar items. Update the button's target and the ul id so they match
        for (let i = 0; i < overObject.parentElement.childNodes.length; i++) {
            if (overObject == overObject.parentElement.childNodes[i]) {
                //use this "i" to append to the ID's
                thisClone.querySelectorAll('.accordion-button')[0].dataset.bsTarget = thisClone.querySelectorAll('.accordion-button')[0].dataset.bsTarget + '_' + i
                thisClone.querySelectorAll('.foodItemContents')[0].id = thisClone.querySelectorAll('.foodItemContents')[0].id + '_' + i
                i = overObject.parentElement.childNodes.length
            }
        }
        let stuffHolder = document.createElement('div')
        stuffHolder.classList.add('gFlex')
        overObject.appendChild(stuffHolder)
        stuffHolder.appendChild(thisClone)
        overObject.classList.remove('emptyOLLI')
        //add a button to remove the ingredient
        let removeBTN = document.createElement('button')
        removeBTN.classList.add('btn', 'btn-danger')
        removeBTN.innerText = 'Remove'
        removeBTN.type = 'button'
        stuffHolder.appendChild(removeBTN)
        removeBTN.addEventListener('click', removeIngredient)
        //overObject.appendChild(removeBTN)
        tallyTheThings()
    }
    landingPads.forEach(landingPad => {
        landingPad.classList.remove('dragILanding')
        landingPad.removeEventListener('dragenter',dragEnter)
        landingPad.removeEventListener('dragleave',dragLeave)
        landingPad.removeEventListener('dragover',dragOver)
    })
}


function dragEnter() {
    bOver = true
    overObject = this
}
function dragLeave() {
    bOver = false
    overObject = undefined
}
function dragOver(e) {
    e.preventDefault()
}
function makeIngredientSlots(parentItem) {
    let ingOL = document.createElement('ol')
    ingOL.classList.add('selectedItem')
    document.getElementById('selectedThings').appendChild(ingOL)
    let loopVal = parentItem.querySelectorAll('.MaxItems .valuePair')[0].innerText
    for (i = 0; i < loopVal; i++) {
        let ingLI = document.createElement('li')
        ingLI.classList.add('emptyOLLI')
        ingOL.appendChild(ingLI)
    }

}
function tallyTheThings() {
    //tallyTheThings will happen before and after the selectedThings div is populated, so make sure sumContainer actually exists
    let sumContainer = document.querySelectorAll(".sumContainer")[0]
    if (!sumContainer) {
        sumContainer = document.createElement("ul")
        sumContainer.classList.add("sumContainer")
        sumContainer.innerHTML = "<h3>Totals</h3>"
        document.getElementById("selectedThings").appendChild(sumContainer)
    }    
    
    tallyArray.forEach(item => {
        let itemDatas = document.querySelectorAll(".selectedItem ." + item)
        let sumTotal = 0
        itemDatas.forEach(itemData => {
            sumTotal = sumTotal + parseFloat(itemData.querySelectorAll(".valuePair")[0].innerText)
        })
        let checkItem = document.querySelector(".sum" + item)
        if (!checkItem) {
            //there isn't, create the it
            checkItem = document.createElement("li")
            checkItem.classList.add("sum" + item)
            let keyPair = document.createElement("span")
            keyPair.innerText = item
            keyPair.classList.add("keyPair","afterColon")
            let valuePair = document.createElement("span")
            valuePair.classList.add("valuePair")
            checkItem.appendChild(keyPair)
            checkItem.appendChild(valuePair)
            sumContainer.appendChild(checkItem)
        }
        document.querySelectorAll(".sum" + item + " .valuePair")[0].innerText = sumTotal
    })
}
function removeIngredient() {
    console.log('doot')
    //console.log(this.parentElement.parentElement)
    this.removeEventListener('click',removeIngredient)
    this.parentElement.parentElement.classList.add('emptyOLLI')
    this.parentElement.remove()
    tallyTheThings()
}