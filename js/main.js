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
    let folderString = await (await getThings('txtFiles/')).toLowerCase()
    let fileArray = folderString.substring(folderString.indexOf('href="/'), folderString.length).split('href="/')
    //let fileArray = folderString.toLowerCase().substring()
    //let fileArray = folderString.substring(folderString.indexOf('HREF="'), folderString.length).split('HREF="')
    //console.log(fileArray)
    let allArray = new Array()
    for (let i = 0; i < fileArray.length; i++) {
        let el = fileArray[i]
        if (el.includes('.txt')) {
            //console.log(el)
            //let filePath = el.substring(0, el.indexOf('" class="'))
            let filePath = el.substring(0, el.indexOf('"'))
            console.log(filePath)
            //let filePath = el.substring(el.indexOf('txtFiles/'),el.indexOf('">'))

            let fileText = await getThings(filePath)
            let splitString = ''
            let filterString = ''
            let delimiter = ''
            let parentClass = ''
            let childClass = ''
            let titleClass = ''
            let addInString = ''
            if (fileText.includes('BaseItem:')) {
                //splitString = 'evolvedrecipe'
                splitString = /\s+evolvedrecipe\s+/
                filterString = 'BaseItem'
                delimiter = ':'
                parentClass = "recipe"
                childClass = "recipeContents"
                titleClass = "recipeTitle"
                addInString = 'evolvedrecipe'
            } else {
                splitString = /\s+item\s+/
                //filterString = 'EvolvedRecipe'
                filterString = 'DisplayName'
                delimiter = '='
                parentClass = "foodItem"
                childClass = "foodItemContents"
                titleClass = "foodItemTitle"
                addInString = "item"
            }
            let tmpArr = fileText.split(splitString)
            tmpArr.forEach(tmpEl => {
                if (tmpEl.includes(filterString)) {
                    //                  0           1           2       3          4            5           6
                    allArray.push( [splitString, parentClass, tmpEl, titleClass, childClass, delimiter, addInString])
                }
            })
        }
    }
    allArray.sort()
    let idI = 0
    allArray.forEach(item => {
        //main div
        let parentEl = document.createElement("div")
        document.getElementById(item[6]).appendChild(parentEl)
        parentEl.classList.add(item[1])
        parentEl.id = item[1] + idI
        //icon-title-button holder
        let iconTitleButton = document.createElement("div")
        iconTitleButton.classList.add('icon-title-button')
        parentEl.appendChild(iconTitleButton)
        //icon-title holder
        let iconTitle = document.createElement('div')
        iconTitle.classList.add('icon-title')
        iconTitleButton.appendChild(iconTitle)
        //icon
        let icon = document.createElement('img')
        icon.classList.add("item-icon")
        iconTitle.appendChild(icon)
        //title
        let titleEl = document.createElement('h3')
        titleEl.classList.add(item[3])
        let itemName = item[2].substring(0,item[2].indexOf('{')).trim()
        titleEl.innerText = itemName
        iconTitle.appendChild(titleEl)
        //button holder
        let buttonHolder = document.createElement('div')
        buttonHolder.classList.add('buttonHolder')
        iconTitleButton.appendChild(buttonHolder)
        //expand/contract icon
        let downChevron = document.createElement('i')
        downChevron.classList.add('fa-solid', 'fa-chevron-down', 'up-down')
        downChevron.dataset.adrucTargetElement = `#ul${item[1]}${idI}`
        downChevron.addEventListener('click',expandContract)
        //buttonHolder.appendChild(downChevron)
        //for BRANDON
        iconTitle.appendChild(downChevron)
        //add/remove icon
        let rightChevron = document.createElement('i')
        rightChevron.classList.add('fa-solid','fa-chevron-right', 'left-right')
        rightChevron.dataset.adrucTargetElement = `#${item[1]}${idI}`
        rightChevron.addEventListener('click',addRemove)
        buttonHolder.appendChild(rightChevron)
        //ul
        let attribEl = document.createElement('ul')
        attribEl.classList.add(item[4], "noShow")
        attribEl.id = `ul${item[1]}${idI}`
        parentEl.appendChild(attribEl)
        //create a "name" attribute
        let nameAttrib = document.createElement('li')
        nameAttrib.classList.add('item-name', itemName.replaceAll(' ','_'))
        attribEl.appendChild(nameAttrib)
        let leftSpan = document.createElement('span')
        leftSpan.classList.add('afterColon','keyPair')
        leftSpan.innerText = "item-name"
        nameAttrib.appendChild(leftSpan)
        let rightSpan = document.createElement('span')
        rightSpan.classList.add('valuePair')
        rightSpan.innerText = itemName
        nameAttrib.appendChild(rightSpan)
        let attribArr = item[2].substring(item[2].indexOf('{') + 1 ,item[2].indexOf('}') - 1).trim().split(',')
        attribArr.forEach(attrib => {
            if (attrib) {
                //li's
                let liEl = document.createElement('li')
                let attribSpl = attrib.split(item[5])
                //console.log(attribSpl[0])
                let attribName = attribSpl[0].trim()
                liEl.classList.add(attribName)
                attribEl.appendChild(liEl)
                let leftSpan = document.createElement('span')
                leftSpan.classList.add('afterColon', 'keyPair')
                leftSpan.innerText = attribName
                liEl.appendChild(leftSpan)
                let rightSpan = document.createElement('span')
                rightSpan.classList.add('valuePair')
                rightSpan.dataset.adrucTargetElement = `#${item[1]}${idI}`
                let attribVal = attribSpl[1].trim()
                rightSpan.innerText = attribVal
                liEl.appendChild(rightSpan)
                if (attribName == 'Icon') {
                    //let thing1 = `/img/Item_${attribVal}.png`
                    let thing1 = `img/Item_${attribVal}.png`
                    icon.src = thing1
                }
                if (attribName == 'ResultItem') {
                    //need to get the icon from here
                    let doots = allArray.filter(function(v,i) {
                        
                        return v[2].substring(0,v[2].indexOf('{')).trim() === attribVal
                    })
                    //console.log(doots)
                    for (let ii = 0; ii < doots.length; ii++){
                        if (doots[ii] !== item) {
                            //let thing1 = `/img/Item_${doots[ii][2].split('Icon = ')[1].substring(0,doots[ii][2].split('Icon = ')[1].indexOf(','))}.png`
                            let thing1 = `img/Item_${doots[ii][2].split('Icon = ')[1].substring(0,doots[ii][2].split('Icon = ')[1].indexOf(','))}.png`
                            icon.src = thing1
                        }

                    }

                }
            }
        })
        idI++
    })
    //removal of drag
    /*document.getElementById('selectedThings').addEventListener('dragenter',dragEnter)
    document.getElementById('selectedThings').addEventListener('dragleave',dragLeave)
    document.getElementById('selectedThings').addEventListener('dragover',dragOver)*/
    //set up filters
    let filters = document.querySelectorAll('.general-search')
    filters.forEach(filter => {
        filter.addEventListener('keyup',searchFilter)
    })
}
async function getThings(path) {
    let theObject = await fetch(path)
    let theString = await theObject.text()
    return theString
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

    this.removeEventListener('click',removeIngredient)
    this.parentElement.parentElement.classList.add('emptyOLLI')
    this.parentElement.remove()
    tallyTheThings()
}
function searchFilter() {
    let filterItems = document.querySelectorAll(`${this.dataset.adrucFtarget}`)
    filterItems.forEach(filterItem => {
        let filterCompare = filterItem.querySelectorAll(`${this.dataset.adrucCompareLocation}`)[0].innerText.toLowerCase()
        if (filterCompare.indexOf(this.value.toLowerCase()) == -1) {
            filterItem.classList.add("filterNoShow")
        } else {
            filterItem.classList.remove("filterNoShow")
        }
    })
}
function expandContract() {
    let parentItem = findTargetElement(this)
    
    if (this.classList.toString().includes('fa-chevron-down')) {
        //expand
        this.classList.remove('fa-chevron-down')
        this.classList.add('fa-chevron-up')
        parentItem.classList.remove('noShow')
        //this.parentElement.parentElement.parentElement.querySelectorAll('ul')[0].classList.remove('noShow')
    } else {
        //contract
        this.classList.remove('fa-chevron-up')
        this.classList.add('fa-chevron-down')
        parentItem.classList.add('noShow')
        //this.parentElement.parentElement.parentElement.querySelectorAll('ul')[0].classList.add('noShow')
    }
}
function addRemove() {
    let parentItem = findTargetElement(this)
    let chevronCheck = parentItem.querySelectorAll('.left-right')[0]
    let whatTo = ''
    let whatDo = ''
    if (parentItem.classList.toString().includes('recipe')) {
        whatTo = 'recipe'
    } else {
        whatTo = 'foodItem'
    }
    if (chevronCheck.classList.toString().includes('fa-chevron-right')) {
        //add
        chevronCheck.classList.remove('fa-chevron-right')
        chevronCheck.classList.add('fa-chevron-left')
        whatDo = 'add'
    } else {
        //remove
        chevronCheck.classList.remove('fa-chevron-left')
        chevronCheck.classList.add('fa-chevron-right')
        whatDo = 'remove'
    }
    switch(whatTo) {
        case 'recipe':
            switch(whatDo) {
                case 'add':
                    document.getElementById("evolvedrecipe").classList.add("test")
                    let addedThing = document.getElementById('selectedThings')
                    addedThing.appendChild(parentItem)
                    parentItem.querySelectorAll('.up-down')[0].addEventListener('click',expandContract)
                    parentItem.querySelectorAll('.left-right')[0].addEventListener('click',addRemove)
                    //document.getElementById('evolvedrecipe').classList.add("noShow")
                    //let EvolvedRecipes = document.querySelectorAll('#item .EvolvedRecipe .valuePair')
                    let allFoodItems = document.querySelectorAll('.foodItem')
                    allFoodItems.forEach(item => {
                        let evolvedRecipe = item.querySelectorAll('.EvolvedRecipe .valuePair')
                        if (evolvedRecipe.length == 0) {
                            item.classList.add('noShow')
                        } else {
                            /*console.log(evolvedRecipe)
                            console.log(evolvedRecipe.innerText)*/

                            if (evolvedRecipe[0].innerText.includes(`${parentItem.querySelectorAll('.recipeTitle')[0].innerText}:`)) {
                                item.classList.remove('noShow')
                            } else {
                                item.classList.add('noShow')
                            }
                            
                        }
                    })
                    /*EvolvedRecipes.forEach(item => {
                        
                        let parentElement = findTargetElement(item)
                        if (item.innerText.includes(`${parentItem.querySelectorAll('.recipeTitle').innerText}:`)) {
                            parentElement.classList.remove('noShow')
                        } else {
                            parentElement.classList.add('noShow')
                        }
                    })*/
                    makeIngredientSlots(parentItem)
                    tallyTheThings()
                    break
                case 'remove':
                    document.getElementById('selectedThings').innerHTML = ''
                    document.getElementById('evolvedrecipe').classList.remove('noShow')
                    break
            }
            break
        case 'foodItem':
            switch(whatDo) {
                case 'add':
                    //find the first emptyOLLI
                    let emptySlots = document.querySelectorAll('.emptyOLLI')
                    if (emptySlots.length == 0) {
                        alert("no empty slots - remove an ingredient first")
                    } else {
                        let newParent = parentItem.cloneNode(true)
                        
                        //update the id of the ul and the data-adruc-target-element
                        newParent.id = `${newParent.id}_${emptySlots.length}`
                        
                        let upDown = newParent.querySelectorAll('.up-down')[0]
                        upDown.dataset.adrucTargetElement = `#ul${newParent.id}`
                        upDown.addEventListener('click',expandContract)
                        let leftRight = newParent.querySelectorAll('.left-right')[0]
                        leftRight.dataset.adrucTargetElement = `#${newParent.id}`
                        leftRight.addEventListener('click',addRemove)
                        newParent.querySelectorAll('.foodItemContents')[0].id = `ul${newParent.id}`
                        emptySlots[0].appendChild(newParent)
                        emptySlots[0].classList.remove('emptyOLLI')
                        //re-add the eventlisteners
                        tallyTheThings()
                    }
                    break
                case 'remove':
                    //set the innerHTML of the clicked item's LI to ''
                    let parentLI = this.parentElement.parentElement.parentElement
                    parentLI.innerHTML = ''
                    //call tallyTheThings()
                    tallyTheThings()
                    //re-add emptyOLLI
                    parentLI.classList.add('emptyOLLI')
                    break
            }
            break
    }
}
function findTargetElement(originalElement) {
    let targetElements = document.querySelectorAll(originalElement.dataset.adrucTargetElement)
    
    if (targetElements.length == 1) {
        targetElements = targetElements[0]
    }
    return targetElements
}


/*OLD STUFF
function dragRStart() {
    //When dragging recipes
    document.getElementById('selectedThings').classList.add('dragLanding')
    let hideItems = document.querySelectorAll('.' + this.classList[0])
    hideItems.forEach(item => {
        if (item !== this) {

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
}*/