const tallyArray = ["Calories","Carbohydrates","HungerChange","Lipids","Proteins"]
let bOver = false
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
    let i = 0
    allArray.forEach(item => {
        //main div
        let  parentEl = document.createElement("div")
        document.getElementById(item[0]).appendChild(parentEl)
        parentEl.classList.add(item[1], 'accordion-item')
        parentEl.setAttribute('draggable',true)
        parentEl.addEventListener('dragstart', dragStart)
        parentEl.addEventListener('dragend', dragEnd)
        parentEl.addEventListener('drop', dragDrop)
        //title
        let titleEl = document.createElement('h3')
        /*titleEl.innerHTML = '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ulNumber' + i + '" aria-expanded="false" aria-controls="ulNumber' + i + '>' + item[2].substring(0,item[2].indexOf('{')).trim() + '</button>'*/
        titleEl.classList.add(item[3], "accordion-header")
        parentEl.appendChild(titleEl)
        //accordion button
        let titBTN = document.createElement('button')
        titBTN.classList.add('accordion-button','collapsed')
        titBTN.dataset.bsToggle = 'collapse'
        titBTN.dataset.bsTarget = '#ulNumber' + i
        titBTN.innerText = item[2].substring(0,item[2].indexOf('{')).trim()
        titBTN.type = "button"
        titleEl.appendChild(titBTN)
        //ul
        let attribEl = document.createElement('ul')
        attribEl.classList.add(item[4], 'accordion-body', 'accordion-collapse', 'collapse')
        attribEl.id = 'ulNumber' + i
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
        i++
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
function dragStart() {
    //console.log('drag started')
    document.getElementById('selectedThings').classList.add('dragLanding')
    //console.log(this.classList)
    let hideItems = document.querySelectorAll('.' + this.classList[0])
    hideItems.forEach(item => {
        if (item !== this) {
            item.classList.add('noShow')
        }
    })

}
function dragEnd() {
    let landingPad = document.getElementById('selectedThings')
    if (bOver) {
        //do things
        landingPad.innerHTML = ''
        landingPad.appendChild(this)
        makeIngredientSlots(this)
    } else {
        landingPad.classList.remove('dragLanding')
        let hideItems = document.querySelectorAll('.' + this.classList[0])
        hideItems.forEach(item => {
            if (item !== this) {
                item.classList.remove('noShow')
            }
        })
    }
    document.getElementById('selectedThings').classList.remove('dragLanding')
}
function dragDrop() {
    //console.log('drag drop')
}
function dragEnter() {
    //console.log('drag enter')
    bOver = true
    //console.log(bOver)
}
function dragLeave() {
    //console.log('drag leave')
    bOver = false
    //console.log(bOver)
}
function dragOver(e) {
    e.preventDefault()
    //console.log('drag over')
}
function makeIngredientSlots(parentItem) {
    console.log(parentItem)
    let ingUL = document.createElement('ul')
    document.getElementById('selectedThings').appendChild(ingUL)
    document.getElementById('selectedThings').removeEventListener('dragenter',dragEnter)
    document.getElementById('selectedThings').removeEventListener('dragleave',dragLeave)
    document.getElementById('selectedThings').removeEventListener('dragover',dragOver)
    //let loopVal = parentItem.querySelectorAll('.MaxItems .valuePair')[0].innerText.parseInt() 
    //console.log(parentItem.querySelectorAll('.MaxItems .valuePair')[0].innerText)
    let loopVal = parentItem.querySelectorAll('.MaxItems .valuePair')[0].innerText
    for (i = 0; i < loopVal; i++) {
        let ingLI = document.createElement('li')
        ingLI.innerText = 'Drag over ingredient #' + (i + 1)
        ingUL.appendChild(ingLI)
    }

}
let redData = new Array()
function         testFolderContents(filePath) {
    let folderContents = new XMLHttpRequest()
    folderContents.open("GET", filePath, true)
    folderContents.onreadystatechange = function () {
        if (folderContents.readyState === 4) {
            if (folderContents.status === 200 || folderContents.status == 0) {
                //console.log(folderContents.responseText)
                let testing = folderContents.responseText
                //console.log(typeof testing)
                //console.log(testing.substring(testing.indexOf("href="), testing.length))
                let newTesting = testing.substring(testing.indexOf("href=\""), testing.length).split("href=\"")
                newTesting.forEach(el => {
                    if (el.indexOf(".txt") > -1) {
                        
                        fileArray.push(el.substring(0,el.indexOf('" class')))
                        let thePath = el.substring(0,el.indexOf('" class'))
                        let fileContents = new XMLHttpRequest()
                        fileContents.open("GET", thePath, true)
                        fileContents.onreadystatechange = function () {
                            if (fileContents.readyState === 4) {
                                if (fileContents.status === 200 || fileContents.status == 0) {
                                    redData[redData.length + 1] = fileContents.responseText
                                    console.log(fileContents.responseText)
                                }
                            }
                        }
                        fileContents.send(null)
                    }
                })
                console.log(redData)
                console.log(redData[1])
            }
            /*let redData = new Array()
            fileArray.forEach(file => {
                let fileContents = new XMLHttpRequest()
                fileContents.open("GET", file, true)
                fileContents.onreadystatechange = function () {
                    if (fileContents.readyState === 4) {
                        if (fileContents.status === 200 || fileContents.status == 0) {
                            redData[redData.length + 1] == fileContents.responseText
                            console.log(file)
                            //console.log(typeof fileContents.responseText)

                        }
                    }
                }
                fileContents.send(null)
            })*/
            /*console.log(typeof redData)
            testDoot = ["this","that","theother"]
            console.log(typeof testDoot)
            redData.forEach(dataSet => {
                console.log(dataSet)
            })*/
        }
    }
    folderContents.send(null)
}

/*
processFile(callback_function_name)

function processFile(callback_function_name) {

}

*/

/*testProcess(filePath, returnArr) {
    let fileContents = new XMLHttpRequest()
    fileContents.open("get", filePath, true)
    fileContents.onreadystatechange = function () {
        if (fileContents.readyStat === 4) {
            if (fileContents.status === 200 || fileContents.status == 0) {
                returnArr.push(fileContents.responseText)
            }
        }
    }
    fileContents.send(null)
    fileRead = true
    return fileRead, returnArr
}*/
function readTextFile(filePath) {
    let parentClass
    let childClass
    let titleClass
    let bFilter = false
    //variable set up
    switch (filePath) {
        case "/txtFiles/evolvedrecipes.txt":
            parentClass = "recipe"
            childClass = "recipeContents"
            titleClass = "recipeTitle"
            bFilter = true
            break;
        case "/txtFiles/items_food.txt":
            parentClass = "foodItem"
            childClass = "foodItemContents"
            titleClass = "foodItemTitle"
            break;
    }
    let rawFile = new XMLHttpRequest()
    rawFile.open("GET", filePath, true)
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                let allText = rawFile.responseText;
                while (allText.length > 1) {
                    let theThings = processFile(allText)
                    if (theThings["name"]) {
                        let recDiv = document.createElement("div")
                        recDiv.classList.add(parentClass)
                        if (bFilter) {
                            recDiv.classList.add("clickFilter")
                        }
                        let updatedName
                        if (theThings["name"].indexOf("evolvedrecipe") > -1) {
                            updatedName = theThings["name"].replace("evolvedrecipe ", "").trim()
                        } else {
                            updatedName = theThings["name"].trim()
                        }
                        recDiv.innerHTML = "<h3 class='"+ titleClass + " accordion-header'><button class='accordion-button' type='button' data-bs-toggle='collapse' data-bs-target='" + updatedName + "</h3>"
                        let allItems = theThings["itemArray"]
                        let theList = document.createElement("ul")
                        theList.classList.add(childClass)
                        
                        allItems.forEach(item => {
                            
                            let listItem = document.createElement("li")
                            
                            if (item.trim()) {
                                
                                let splitValue = ""
                                if (item.indexOf("=") == -1) {
                                    splitValue = ":"
                                    spanclass = "afterColon"
                                    
                                } else {
                                    splitValue = "="
                                    spanclass = "afterEqual"
                                }
                                let theValues = item.trim().split(splitValue)
                                let theSpan1 = document.createElement("span")
                                listItem.classList.add(theValues[0].trim())
                                theSpan1.classList.add("keyPair", spanclass)
                                theSpan1.innerText = theValues[0].trim()

                                let theSpan2 = document.createElement("span")
                                theSpan2.classList.add("valuePair")
                                theSpan2.innerText = theValues[1].trim()

                                listItem.appendChild(theSpan1)
                                listItem.appendChild(theSpan2)

                                theList.appendChild(listItem)
                            }
                        })
                        recDiv.appendChild(theList)
                        document.getElementById("manipulated").appendChild(recDiv)
                    }
                    allText = theThings["remainder"]
                }
            }
        }
        filterClickSetUp()
        //testing
        //sortItems("manipulated","recipe")
        /*console.log(testThing)
        testThing.sort(function (a, b) {
            return a - b
        })
        console.log(testThing)*/
    }
    rawFile.send(null);

}
function filterClickSetUp() {
    
    let theFilters = document.querySelectorAll(".clickFilter")
    
    theFilters.forEach(theFilter => {
        
        theFilter.addEventListener("click", (ev) => {
            let theFilterClickItem = findParent(ev.target, "clickFilter")
            let foodItems = document.querySelectorAll(".foodItem")
            foodItems.forEach(foodItem => {
                let evolRecipe = foodItem.querySelectorAll(".EvolvedRecipe")[0]
                //if (foodItem.querySelectorAll(".EvolvedRecipe").length != 0) {
                if (evolRecipe) {
                    
                    //this particular food item has an evolvedrecipe associated with it
                    if (evolRecipe.innerText.indexOf(theFilterClickItem.querySelectorAll(".recipeTitle")[0].innerText + ":") > -1) {
                        
                        foodItem.classList.remove("noShow")
                        foodItem.addEventListener("click", (ev) => {

                            let theTarget = findParent(ev.target,"foodItem")

                            addToSelected(theTarget)
                        })
                    } else {
                        foodItem.classList.add("noShow")
                    }

                } else {
                    foodItem.classList.add("noShow")
                }
            })
            
            let loopTo = theFilterClickItem.querySelectorAll(".MaxItems .valuePair")[0].innerText
            if (loopTo) {
                let selectedItems = document.getElementById("selectedThings")
                selectedItems.innerHTML = ""
                let selectedList = document.createElement("ol")
                selectedList.classList.add("selectedItem")
                
                selectedList.innerText = theFilterClickItem.querySelectorAll(".recipeTitle")[0].innerText
                for (let i = 0; i < loopTo; i++) {
                    let listItem = document.createElement("li")
                    selectedList.appendChild(listItem)
                }
                let listDiv = document.createElement("div")
                listDiv.appendChild(selectedList)
                selectedItems.appendChild(listDiv)
            }
        })
    })
}
function findParent(clickedItem,classOfInterest) {
    
    while (!(clickedItem.classList.contains(classOfInterest))) {
        clickedItem = clickedItem.parentElement
    }
    return clickedItem
}
function addToSelected(target) {
    let elIs = document.querySelectorAll(".selectedItem li")
    let entered = false

    elIs.forEach(elI => {
        if (!entered) {
            if (!elI.innerHTML) {
                elI.innerHTML = target.innerHTML
                entered = true
            }
        }
    })
    tallyTheThings()
}

function removeFromSelected(target) {

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
            //console.log(typeof itemData.querySelectorAll(".valuePair")[0].innerText)
            sumTotal = sumTotal + parseFloat(itemData.querySelectorAll(".valuePair")[0].innerText)
            console.log(item + ": " + sumTotal)
        })
        
        if (sumTotal) {
            //there is a element for this item
            let checkItem = document.querySelector(".sum" + item)
            if (!checkItem) {
                console.log()
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
            //valuePair.innerText = sumTotal

        }
    })
}


function processFile(fileText) {
    let sectionStart = fileText.indexOf("{")
    let sectionEnd = fileText.indexOf("}")

    let item = fileText.substring(sectionStart + 1,sectionEnd)

    let title = item.substring(0,item.indexOf("{")).trim()
    let itemArray = new Array()
    returnArray = new Array()
    if (item.indexOf(":") > -1 || item.indexOf("=") > -1) {
        itemArray = item.substring(item.indexOf("{") + 1).split(",")
        returnArray["name"] = title
        returnArray["itemArray"] = itemArray
        //returnArray["remainder"] = "{" + fileText.substring(sectionEnd + 1, fileText.length).trim()
        //this doesn't work since we are processing the text item by item
        /*returnArray.sort(function (a, b) {
            console.log("insort")
            return a["name"] - b["name"]
        })*/
        //return returnArray
    } else {
        //return null
        returnArray["name"] = null
    }
    returnArray["remainder"] = "{" + fileText.substring(sectionEnd + 1, fileText.length).trim()
    return returnArray
}
function sortItems(parentID,sortingClass) {
    let doot = document.querySelectorAll("#" + parentID + " ." + sortingClass)

    console.log(doot)
    //doot.sort(a, b => return a - b)
    doot.sort(function (a, b) {
        return a - b
    })
    /*returnArray.sort(function (a, b) {
        console.log("insort")
        return a["name"] - b["name"]
    })*/
}

function readTextFile2(filePath) {
    let parentClass = ""
    let childClass = ""
    let titleClass = ""
    //variable set up
    switch (filePath) {
        case "/txtFiles/evolvedrecipes.txt":
            parentClass = "recipe"
            childClass = "recipeContents"
            titleClass = "recipeTitle"
            break;
        case "/txtFiles/items_food.txt":
            parentClass = "foodItem"
            childClass = "foodItemContents"
            titleClass = "foodItemTitle"
            break;
    }
    let rawFile = new XMLHttpRequest()
    //rawFile.open("GET", filePath, false)
    rawFile.open("GET", filePath, true)
    let subItems = new Array()
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                let allText = rawFile.responseText;
                
                while (allText.length > 1) {
                    let theThings = processFile(allText)
                    if (theThings["name"]) {
                        let recDiv = document.createElement("div")
                        recDiv.classList.add(parentClass)
                        //let itemName = theThings["name"].replace(/\/\*+(\s+([a-zA-Z]+\s+)+)\*+\/\s/i,"")
                        let itemName = theThings["name"]
                        //if (itemName.indexOf(/\/\*/) > -1) {
                        if (/\/\*/.test(itemName)) {
                            //this has the /* stuff in it, get rid of it
                            itemName = itemName.substring(itemName.lastIndexOf("*/") + 2, itemName.length).trim()
                        }
                        itemName = itemName.replace("item","").trim()
                        //recDiv.innerHTML = "<h3 class='"+ titleClass + "'>" + theThings["name"].trim() + "</h3>"
                        recDiv.innerHTML = "<h3 class='"+ titleClass + "'>" + itemName + "</h3>"
                        let allItems = theThings["itemArray"]
                        let theList = document.createElement("ul")
                        theList.classList.add(childClass)
                        
                        allItems.forEach(item => {
                            
                            let listItem = document.createElement("li")
                            
                            if (item.trim()) {
                                
                                let splitValue = ""
                                if (item.indexOf("=") == -1) {
                                    splitValue = ":"
                                    spanclass = "afterColon"

                                } else {
                                    splitValue = "="
                                    spanclass = "afterEqual"
                                }
                                let theValues = item.trim().split(splitValue)
                                let theSpan1 = document.createElement("span")
                                listItem.classList.add(theValues[0].trim())
                                theSpan1.classList.add("keyPair", spanclass)
                                theSpan1.innerText = theValues[0].trim()
                                
                                let theSpan2 = document.createElement("span")
                                theSpan2.classList.add("valuePair")
                                theSpan2.innerText = theValues[1].trim()

                                /*if (subItems.length == 0) {
                                    subItems.push(theValues[0].trim())
                                } else if (!(subItems.indexOf(theValues[0]))) {
                                    subItems.push(theValues[0].trim())
                                }*/
                                if (subItems.indexOf(theValues[0].trim()) == -1) {
                                    subItems.push(theValues[0].trim())
                                }
                                if (theValues[0].trim() == "EvolvedRecipe") {
                                    theSpan2.classList.add("EvolvedRecipe")
                                }

                                listItem.appendChild(theSpan1)
                                listItem.appendChild(theSpan2)

                                theList.appendChild(listItem)
                            }
                        })
                        recDiv.appendChild(theList)
                        document.getElementById("doot").appendChild(recDiv)
                    }
                    allText = theThings["remainder"]   
                }
            }
        }
    }
    rawFile.send(null);
}

function readTextFile3(filePath) {
    let parentClass = ""
    let childClass = ""
    let titleClass = ""
    //variable set up
    switch (filePath) {
        case "evolvedrecipes.txt":
            parentClass = "recipe"
            childClass = "recipeContents"
            titleClass = "recipeTitle"
            break;
        case "items_food.txt":
            parentClass = "foodItem"
            childClass = "foodItemContents"
            titleClass = "foodItemTitle"
            break;
        case "/txtFiles/farming.txt":
            parentClass = "foodItem"
            childClass = "foodItemContents"
            titleClass = "foodItemTitle"
            break;
    }
    let rawFile = new XMLHttpRequest()
    //rawFile.open("GET", filePath, false)
    rawFile.open("GET", filePath, true)
    let subItems = new Array()
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                let allText = rawFile.responseText;
                
                while (allText.length > 1) {
                    let theThings = processFile(allText)
                    if (theThings["name"]) {
                        let recDiv = document.createElement("div")
                        recDiv.classList.add(parentClass)
                        //let itemName = theThings["name"].replace(/\/\*+(\s+([a-zA-Z]+\s+)+)\*+\/\s/i,"")
                        let itemName = theThings["name"]
                        //if (itemName.indexOf(/\/\*/) > -1) {
                        if (/\/\*/.test(itemName)) {
                            //this has the /* stuff in it, get rid of it
                            itemName = itemName.substring(itemName.lastIndexOf("*/") + 2, itemName.length).trim()
                        }
                        itemName = itemName.replace("item","").trim()
                        //recDiv.innerHTML = "<h3 class='"+ titleClass + "'>" + theThings["name"].trim() + "</h3>"
                        recDiv.innerHTML = "<h3 class='"+ titleClass + "'>" + itemName + "</h3>"
                        let allItems = theThings["itemArray"]
                        let theList = document.createElement("ul")
                        theList.classList.add(childClass)
                        
                        allItems.forEach(item => {
                            
                            let listItem = document.createElement("li")
                            
                            if (item.trim()) {
                                
                                let splitValue = ""
                                /*if (item.indexOf("=") == -1) {
                                    splitValue = ":"
                                    spanclass = "afterColon"

                                } else if (item.indexOf(":") == -1) {
                                    splitValue = "="
                                    spanclass = "afterEqual"
                                }*/
                                if (item.indexOf("=") > -1) {
                                    splitValue = "="
                                    spanclass = "afterEqual"
                                } else if (item.indexOf(":") > -1) {
                                    splitValue = ":"
                                    spanclass = "afterColon"
                                }
                                let theValues = item.trim().split(splitValue)
                                console.log(item)
                                let theSpan1 = document.createElement("span")
                                listItem.classList.add(theValues[0].trim())
                                theSpan1.classList.add("keyPair", spanclass)
                                theSpan1.innerText = theValues[0].trim()
                                
                                let theSpan2 = document.createElement("span")
                                theSpan2.classList.add("valuePair")
                                theSpan2.innerText = theValues[1].trim()

                                /*if (subItems.length == 0) {
                                    subItems.push(theValues[0].trim())
                                } else if (!(subItems.indexOf(theValues[0]))) {
                                    subItems.push(theValues[0].trim())
                                }*/
                                if (subItems.indexOf(theValues[0].trim()) == -1) {
                                    subItems.push(theValues[0].trim())
                                }
                                if (theValues[0].trim() == "EvolvedRecipe") {
                                    theSpan2.classList.add("EvolvedRecipe")
                                }

                                listItem.appendChild(theSpan1)
                                listItem.appendChild(theSpan2)

                                theList.appendChild(listItem)
                            }
                        })
                        recDiv.appendChild(theList)
                        document.getElementById("doot").appendChild(recDiv)
                    }
                    allText = theThings["remainder"]
                }
            }
        }
    }
    rawFile.send(null);
}