const tallyArray = ['HungerChange','ThirstChange','Calories','Carbohydrates','Proteins','Lipids']
const translations = []
translations['HungerChange'] = 'Hunger'
translations['ThirstChange'] = 'Thirst'
translations['Calories'] = 'Calories'
translations['Carbohydrates'] = 'Carbohydrates'
translations['Proteins'] = 'Proteins'
translations['Lipids'] = 'Fat'
const levelMultiplerArray = []
const sourceLoc = 'txtFiles/'
levelMultiplerArray[0] = 1
levelMultiplerArray[1] = 1/15 + 1
levelMultiplerArray[2] = 2/15 + 1
levelMultiplerArray[3] = 3/15 + 1
levelMultiplerArray[4] = 4/15 + 1
levelMultiplerArray[5] = 5/15 + 1
levelMultiplerArray[6] = 6/15 + 1
levelMultiplerArray[7] = 7/15 + 1
levelMultiplerArray[8] = 8/15 + 1
levelMultiplerArray[9] = 9/15 + 1
levelMultiplerArray[10] = 10/15 + 1
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
    let folderString = await (await getThings(sourceLoc)).toLowerCase()
    let fileArray = folderString.substring(folderString.indexOf('href="/'), folderString.length).split('href="/')
    //let fileArray = folderString.toLowerCase().substring()
    //let fileArray = folderString.substring(folderString.indexOf('HREF="'), folderString.length).split('HREF="')
    let allArray = new Array()
    for (let i = 0; i < fileArray.length; i++) {
        let el = fileArray[i]
        if (el.includes('.txt')) {
            //let filePath = el.substring(0, el.indexOf('"'))
            let filePath = el.substring(el.indexOf(sourceLoc.toLowerCase()), el.indexOf('"'))
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
        parentEl.classList.add(`baseitem_${itemName.replace(new RegExp(' ','g'),'')}`)
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
        //downChevron.addEventListener('click',expandContract)
        //buttonHolder.appendChild(downChevron)
        //for BRANDON
        iconTitle.appendChild(downChevron)
        //add/remove icon
        let rightChevron = document.createElement('i')
        rightChevron.classList.add('fa-solid','fa-chevron-right', 'left-right')
        rightChevron.dataset.adrucTargetElement = `#${item[1]}${idI}`
        //rightChevron.addEventListener('click',addRemove)
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
    //set up the various event listeners
    setUpEventListeners('.general-search','keyup',searchFilter)
    setUpEventListeners('#evolvedrecipe .recipe .left-right','click',addRemove)
    setUpEventListeners('#evolvedrecipe .recipe .up-down','click',expandContract)
}
function setUpEventListeners(selector,ev,fx) {
    let items = document.querySelectorAll(selector)
    items.forEach(item => {
        item.addEventListener(ev,fx)
    })
}
function removeEventListeners(selector,ev,fx) {
    let items = document.querySelectorAll(selector)
    items.forEach(item => {
        item.removeEventListener(ev,fx)
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
    //likewise, create all the containers to hold the sums
    tallyArray.forEach(item => {
        let statBlock = sumContainer.querySelectorAll(`.sum${item}`)
        if (statBlock.length == 0) {
            //this statblock has not been created
            let theLI = document.createElement('li')
            theLI.classList.add(`sum${item}`)
            let keySpan = document.createElement('span')
            keySpan.classList.add('keyPair', 'afterColon')
            keySpan.innerText = translations[item]
            let valueSpan = document.createElement('span')
            valueSpan.classList.add('valuePair')
            valueSpan.innerText = 0
            theLI.appendChild(keySpan)
            theLI.appendChild(valueSpan)
            sumContainer.appendChild(theLI)
        }
    })
    let recName = document.querySelectorAll('#selectedThings .recipeTitle')[0].innerText
    //console.log(recName)
    let currLevel = 0
    let levelMultiplier = levelMultiplerArray[currLevel] 
    let testThing = []
    let selectedItems = document.querySelectorAll(".selectedItem .foodItem")    
    selectedItems.forEach(selectedItem => {
        let theAmount = selectedItem.querySelectorAll(".EvolvedRecipe .valuePair")[0].innerText.split(`${recName}:`)[1].split(";")[0].replace('|Cooked','')
        let HungerChange = selectedItem.querySelectorAll(".HungerChange .valuePair")[0].innerText
        let whichValue = ''
        //console.log(HungerChange)
        if (Math.abs(HungerChange) == theAmount) {
            //HungerChange
            whichValue = Math.abs(HungerChange)
        } else {
            whichValue = theAmount
        }   
        
        let multiplier = (whichValue - (3 * currLevel) / 100 * whichValue) / Math.abs(HungerChange)
        
        tallyArray.forEach(item => {
            let theValue = selectedItem.querySelectorAll(`.${item} .valuePair`)
            if (theValue.length > 0) {
                let tempVal = ''
                if (testThing[item]) {
                    tempVal = testThing[item]
                } else {
                    tempVal = 0
                }
                if (item == "HungerChange") {
                    testThing[item] = tempVal + Number(HungerChange)
                } else {
                    testThing[item] = tempVal + theValue[0].innerText * multiplier * levelMultiplier
                }
            }
        })
    })
    tallyArray.forEach(item => {
        //check if there is a base value assigned
        let statBlock = document.querySelectorAll(`.sum${item}`)
        //console.log(statBlock)
        let initVal = ''
        if (statBlock[0].querySelectorAll('[data-adruc-base-value]').length > 0) {
            //grab the base value
            initVal = Number(statBlock[0].querySelectorAll('[data-adruc-base-value]')[0].dataset.adrucBaseValue)
            //console.log(statBlock)
            //console.log(initVal)
        } else {
            //reset to 0
            initVal = 0
        }
        let addVal = ''
        //statBlock[0].innerText = initVal + testThing[item]
        if (testThing[item]) {
            addVal = Number(testThing[item])
        } else {
            addVal = 0
        }
        statBlock[0].querySelectorAll('.valuePair')[0].innerText = Math.round((initVal + addVal + Number.EPSILON) * 100) / 100
    })
    //let addedItems
    /*tallyArray.forEach(item => {
        let itemDatas = document.querySelectorAll(".selectedItem ." + item)
        let sumTotal = 0
        
        //need to get the following information:
        itemDatas.forEach(itemData => {
            //console.log(itemData)

            //sumTotal = sumTotal + parseFloat(itemData.querySelectorAll(".valuePair")[0].innerText)
            sumTotal = sumTotal + Number(itemData.querySelectorAll(".valuePair")[0].innerText)
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
            valuePair.innerText = 0
            checkItem.appendChild(keyPair)
            checkItem.appendChild(valuePair)
            sumContainer.appendChild(checkItem)
        }
        //document.querySelectorAll(".sum" + item + " .valuePair")[0].innerText = parseFloat(document.querySelectorAll(".sum" + item + " .valuePair")[0].innerText) + sumTotal
        document.querySelectorAll(".sum" + item + " .valuePair")[0].innerText = Number(document.querySelectorAll(".sum" + item + " .valuePair")[0].innerText) + sumTotal
    })*/
}
function makeStatBlock(cssClass,) {

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
    findThings()
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
        //chevronCheck.classList.remove('fa-chevron-right')
        //chevronCheck.classList.add('fa-chevron-left')
        whatDo = 'add'
    } else {
        //remove
        //chevronCheck.classList.remove('fa-chevron-left')
        //chevronCheck.classList.add('fa-chevron-right')
        whatDo = 'remove'
    }
    switch(whatTo) {
        case 'recipe':
            switch(whatDo) {
                case 'add':
                    //remove eventlisteners on the recipes
                    removeEventListeners('#evolvedrecipe .recipe .left-right','click',addRemove)
                    removeEventListeners('#evolvedrecipe .recipe .up-down','click',expandContract)
                    
                    //document.getElementById("evolvedrecipe").classList.add("showIngredients")
                    //document.getElementById("displayer").classList.add("showIngredients")
                    document.getElementById('evolvedrecipe').classList.remove('expanded')
                    document.getElementById('evolvedrecipe').classList.add('collapsed')
                    document.getElementById('item').classList.remove('collapsed')
                    document.getElementById('item').classList.add('expanded')
                    let addedThing = document.getElementById('selectedThings')
                    //need to make a new parentItem and redo the id, but leave for now
                    let newParent = parentItem.cloneNode(true)
                    
                    let chevronCheck = newParent.querySelectorAll('.left-right')[0]
                    chevronCheck.classList.remove('fa-chevron-right')
                    chevronCheck.classList.add('fa-chevron-left')
                    
                    
                    //update the id of the ul and the data-adruc-target-element
                    newParent.id = `${newParent.id}_1`
                    
                    let upDown = newParent.querySelectorAll('.up-down')[0]
                    upDown.dataset.adrucTargetElement = `#ul${newParent.id}`
                    upDown.addEventListener('click',expandContract)
                    let leftRight = newParent.querySelectorAll('.left-right')[0]
                    leftRight.dataset.adrucTargetElement = `#${newParent.id}`
                    leftRight.addEventListener('click',addRemove)
                    newParent.querySelectorAll('.recipeContents')[0].id = `ul${newParent.id}`
                    
                    
                    /*addedThing.appendChild(parentItem)
                    parentItem.querySelectorAll('.up-down')[0].addEventListener('click',expandContract)
                    parentItem.querySelectorAll('.left-right')[0].addEventListener('click',addRemove)*/

                    addedThing.appendChild(newParent)
                    newParent.querySelectorAll('.up-down')[0].addEventListener('click',expandContract)
                    newParent.querySelectorAll('.left-right')[0].addEventListener('click',addRemove)

                    //document.getElementById('evolvedrecipe').classList.add("test")
                    
                    //let EvolvedRecipes = document.querySelectorAll('#item .EvolvedRecipe .valuePair')
                    let allFoodItems = document.querySelectorAll('.foodItem')
                    allFoodItems.forEach(item => {
                        let evolvedRecipe = item.querySelectorAll('.EvolvedRecipe .valuePair')
                        if (evolvedRecipe.length == 0) {
                            item.classList.add('noShow')
                        } else {
                            
                            //if (evolvedRecipe[0].innerText.includes(`${parentItem.querySelectorAll('.recipeTitle')[0].innerText}:`)) {
                                if (evolvedRecipe[0].innerText.includes(`${newParent.querySelectorAll('.recipeTitle')[0].innerText}:`)) {
                                    item.classList.remove('noShow')
                                    //console.log(item)
                                    setUpEventListeners(`#${item.id} .up-down`,'click',expandContract)
                                    setUpEventListeners(`#${item.id} .left-right`,'click',addRemove)
                                } else {
                                    item.classList.add('noShow')
                                    removeEventListeners(`#${item.id} .up-down`,'click',expandContract)
                                    removeEventListeners(`#${item.id} .left-right`,'click',addRemove)
                                }
                                
                            }
                        })
                        //add eventlisteners on the ingredients
                        //setUpEventListeners('#item .foodItem .left-right','click',addRemove)
                        //setUpEventListeners('#item .foodItem .up-down','click',expandContract)
                        makeIngredientSlots(parentItem)
                        tallyTheThings()
                        baseItemInit(parentItem)
                        break
                        case 'remove':
                    document.getElementById('selectedThings').innerHTML = ''
                    document.getElementById('evolvedrecipe').classList.add('expanded')
                    document.getElementById('evolvedrecipe').classList.remove('collapsed')
                    document.getElementById('item').classList.add('collapsed')
                    document.getElementById('item').classList.remove('expanded')
                    //re-add the recipe eventlisteners
                    setUpEventListeners('#evolvedrecipe .recipe .left-right','click',addRemove)
                    setUpEventListeners('#evolvedrecipe .recipe .up-down','click',expandContract)
                    //remove any ingredient eventlisteners
                    removeEventListeners('#item .foodItem .left-right','click',addRemove)
                    removeEventListeners('#item .foodItem .up-down','click',expandContract)
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
                        
                        let chevronCheck = newParent.querySelectorAll('.left-right')[0]
                        chevronCheck.classList.remove('fa-chevron-right')
                        chevronCheck.classList.add('fa-chevron-left')

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
                    let parentLI = this.parentElement
                    //crawl upwards until the LI is hit
                    while (parentLI.tagName !== "LI") {
                        parentLI = parentLI.parentElement
                    }
                    parentLI.innerHTML = ''
                    //re-add emptyOLLI
                    parentLI.classList.add('emptyOLLI')
                    //call tallyTheThings()
                    tallyTheThings()
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
function baseItemInit(item) {
    if (item.querySelectorAll('.BaseItem .valuePair')[0]) {
        let baseItem = document.querySelectorAll(`.baseitem_${item.querySelectorAll('.BaseItem .valuePair')[0].innerText}`)[0]
        tallyArray.forEach(item => {
            if (baseItem.querySelectorAll(`.${item}`).length > 0) {
                let theItem = document.querySelectorAll(`.sum${item} .valuePair`)[0]
                theItem.innerText = baseItem.querySelectorAll(`.${item} .valuePair`)[0].innerText
                //document.querySelectorAll(`.sum${item} .valuePair`)[0].innerText = baseItem.querySelectorAll(`.${item} .valuePair`)[0].innerText
                theItem.dataset.adrucBaseValue = baseItem.querySelectorAll(`.${item} .valuePair`)[0].innerText

            }
            
        })
    }

    
}
function findThings() {
    /*let things = document.querySelectorAll('.foodItem') 
    let theObj = new Object
    things.forEach(thing => {
        if (thing.querySelectorAll('.Carbohydrates .valuePair')[0] && thing.querySelectorAll('.Proteins .valuePair')[0] && thing.querySelectorAll('.Lipids .valuePair')[0] && thing.querySelectorAll('.Calories .valuePair')[0]) {
            let carbs = thing.querySelectorAll('.Carbohydrates .valuePair')[0].innerText
            let prots = thing.querySelectorAll('.Proteins .valuePair')[0].innerText
            let fats = thing.querySelectorAll('.Lipids .valuePair')[0].innerText
            let cals = thing.querySelectorAll('.Calories .valuePair')[0].innerText
            if (carbs > 0 || prots > 0 || fats > 0) {
                if (carbs > 0 && prots == 0 && fats == 0) {
                    
                    //console.log(`item: ${thing.querySelectorAll('.foodItemTitle')[0].innerText}, calories: ${cals}, carbs: ${carbs}, protein: ${prots}, fats: ${fats}`)
                    //console.log(thing)
                    let lis = thing.querySelectorAll('li')
                    let theString = `item: ${thing.querySelectorAll('.foodItemTitle')[0].innerText}, calories: ${cals}, carbs: ${carbs}, protein: ${prots}, fats: ${fats}\t`
                    lis.forEach(li => {
                        theString = theString + `${li.querySelectorAll('.keyPair')[0].innerText}: ${li.querySelectorAll('.valuePair')[0].innerText}\t`
                    })
                    console.log(theString)
                }
            }
        }

    })*/
    /*let things = document.querySelectorAll('.foodItem .keyPair')
    let theKeys = new Array()
    let initialArr = new Array()
    initialArr.push('DisplayName')
    initialArr.push('HungerChange')
    initialArr.push('Calories')
    initialArr.push('Carbohydrates')
    initialArr.push('Lipids')
    initialArr.push('Proteins')
    initialArr.push('ThirstChange')
    initialArr.push('UnhappyChange')
    initialArr.push('Weight')
    initialArr.push('FoodType')
    //initialArr.push('')
    things.forEach(thing => {
        theKeys.push(thing.innerText)
    })
    let returnArr = theKeys.filter(onlyUnique)
    returnArr.sort()
    returnArr = initialArr.concat(returnArr)
    let headerString = returnArr.join('\t')
    let massiveArray = new Array()
    massiveArray.push(headerString)
    things = document.querySelectorAll('.foodItem')
    things.forEach(thing => {
        //console.log(thing.querySelectorAll('.CantEat'))
        if (thing.querySelectorAll('.CantEat').length == 0 && thing.querySelectorAll('.Calories').length !== 0) {
            let tempStr = ''
            for (let i = 0; i < returnArr.length; i++) {
                //console.log(returnArr[i])
                let item = thing.querySelectorAll(`.${returnArr[i]} .valuePair`)[0]
                if (item) {
                    tempStr = `${tempStr}${item.innerText}\t`
                } else {
                    tempStr = `${tempStr}N/A\t`
                }
            }
            massiveArray.push(tempStr)
        }
    })
    //console.log(massiveArray)
    let doot = massiveArray.join('\n')
    console.log(doot)*/
    //let thingies = document.querySelectorAll('.BaseItem .valuePair')
    //console.log(thingies)
    /*thingies.forEach(thing => {
        console.log(thing.innerText)
    })*/

}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index
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