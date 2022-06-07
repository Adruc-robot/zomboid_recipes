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
        //icon-title holder
        let iconTitle = document.createElement("div")
        iconTitle.classList.add('icon-title')
        parentEl.appendChild(iconTitle)
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
        //expand/contract icon
        let downChevron = document.createElement('i')
        downChevron.classList.add('fa-solid', 'fa-chevron-down', 'up-down')
        downChevron.addEventListener('click',expandContract)
        iconTitle.appendChild(downChevron)
        //add/remove icon
        let rightChevron = document.createElement('i')
        rightChevron.classList.add('fa-solid','fa-chevron-right', 'left-right')
        rightChevron.addEventListener('click',addRemove)
        iconTitle.appendChild(rightChevron)
        //ul
        let attribEl = document.createElement('ul')
        attribEl.classList.add(item[4], "noShow")
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
                let attribVal = attribSpl[1].trim()
                rightSpan.innerText = attribVal
                liEl.appendChild(rightSpan)
                if (attribName == 'Icon') {
                    let thing1 = `/img/Item_${attribVal}.png`
                    icon.src = thing1
                }
                if (attribName == 'ResultItem') {
                    //need to get the icon from here
                    //let tmpFlter = new RegExp(attribVal + "\\r")
                    //console.log(tmpFlter)
                    //console.log(`looking for: ${attribVal}`)
                    let doots = allArray.filter(function(v,i) {
                        
                        return v[2].substring(0,v[2].indexOf('{')).trim() === attribVal
                    })
                    //console.log(doots)
                    for (let ii = 0; ii < doots.length; ii++){
                        if (doots[ii] !== item) {
                            //console.log(item)
                            //console.log(doots[ii][2])
                            let thing1 = `/img/Item_${doots[ii][2].split('Icon = ')[1].substring(0,doots[ii][2].split('Icon = ')[1].indexOf(','))}.png`
                            //test if it's there
                            //let checker = getThings(thing1)
                            //console.log(checker)
                            icon.src = thing1
                        }

                    }
                    doots.forEach(doot => {
                        if (doot != item) {
                            /*let thing1 = `/img/Item_${doot[2].split('Icon = ')[1].substring(0,doot[2].split('Icon = ')[1].indexOf(','))}.png`
                            //test if it's there
                            let checker = getThings(path)
                            console.log(checker)
                            icon.src = thing1*/


                            
                            //console.log(thing1)
                        }
                    })
                    //console.log(doot)
                    /*console.log(allArray.filter(function(v,i) {
                        //return v[2] === attribVal
                        //console.log(v)
                    }))*/
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
            filterItem.classList.add("noShow")
        } else {
            filterItem.classList.remove("noShow")
        }
    })
}
function expandContract() {
    if (this.classList.toString().includes('fa-chevron-down')) {
        //expand
        this.classList.remove('fa-chevron-down')
        this.classList.add('fa-chevron-up')
        this.parentElement.parentElement.querySelectorAll('ul')[0].classList.remove('noShow')
    } else {
        //contract
        this.classList.remove('fa-chevron-up')
        this.classList.add('fa-chevron-down')
        this.parentElement.parentElement.querySelectorAll('ul')[0].classList.add('noShow')
    }
}
function addRemove() {
    //determine if this is a recipe or foodItem
    let parentItem = this.parentElement.parentElement.cloneNode(true)
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
                    document.getElementById('selectedThings').appendChild(parentItem)
                    document.getElementById('evolvedrecipe').classList.add("noShow")
                    //call makeIngredientSlots
                    //call tallyTheThings
                    //hide #evolvedrecipe
                    break
                case 'remove':
                    document.getElementById('selectedThings').innerHTML = ''
                    document.getElementById('evolvedrecipe').classList.remove('noShow')
                    //set the innerHTML of #selectedThings to ''
                    //unhide #evolvedrecipe
                    break
            }
            break
        case 'foodItem':
            break
    }
}