
(function inputScopeWrapper($) {

    $(function onDocReady() {

        // Add search button listener
        $('#searchForm').on('submit', function (event) {
            event.preventDefault();
            fredSearch();
        })

        // Add target date frequency listener
        $('#outputFreq').change(outputFreqChange)

    });

    function outputFreqChange() {
        // console.log('test')
        // Grab all rows in comp table body
        // $('#compTableBody')[0].rows[0].cells[1]
        var compRows = $('#compTableBody')[0].rows
        for (i = 0; i < compRows.length; i++) {
            // Grab current output date freq
            var outputFreqTarget = $("#outputFreq")[0].value
            // console.log('output val is: ' + outputFreqTarget)
            var seriesDateFreq = compRows[i].cells[1].innerHTML
            // console.log('series val is: ' + seriesDateFreq)
            var outputVal = eval('freqCompRef.' + outputFreqTarget)
            var seriesVal = eval('freqCompRef.' + seriesDateFreq)
            if (outputVal == seriesVal) {
                compRows[i].cells[5].innerHTML = 'None'
            } else if (outputVal > seriesVal) {
                compRows[i].cells[5].innerHTML =
                    `<select style="width: fit-content;appearance: menulist;">
                    <option title="down" value="fill" hidden>Fill</option>
                    <option title="down" value="down_interpolate" hidden>Linear Interpolation</option>
                    <option title="down" value="prorate" hidden>Prorate</option>
                    <option title="up" value="average" selected>Average</option>
                    <option title="up" value="sum">Sum</option>
                        </select>`
            } else {
                compRows[i].cells[5].innerHTML =
                    `<select style="width: fit-content;appearance: menulist;">
                        <option title="down" value="fill">Fill</option>
                        <option title="down" value="down_interpolate">Linear Interpolation</option>
                        <option title="down" value="prorate">Prorate</option>
                        <option title="up" value="average" hidden>Average</option>
                        <option title="up" value="sum" hidden>Sum</option>
                            </select>`

            }
        }
    }



    // Function that sends search key to backend to trigger search
    function fredSearch() {

        // Display loader
        $('#searchLoader').show()

        var input = document.getElementById("searchInput").value;
        // console.log(input)

        // Send search term to backend to hit FRED API

        // Recieve resposne here - temp placeholder:

        // Test Data
        var searchResponse = [
            ['Real User Cost Index of MSI-ALL Assets (alternative)', 'Monthly', 'M', '1967-01-01', '2013-12-01', 'OCALLA', '%', 'NSA']
            , ['Divisia Money Index: Household Sector and Private Non-Financial Corporations in the United Kingdom', 'Quarterly', 'Q', '1977-01-01', '2016-10-01', 'DMIHHPNFCUKQ', 'Index 1977:Q1=100', 'SA']
            , ['User Cost Index of', 'Daily', 'D', '1967-01-01', '2013-12-01', 'OCALLA', '%', 'NSA']
            // , ['title', 'frequency', 'frequency_short', 'observation_start', 'observation_end', 'tix', 'units_short', 'seasonal_adjustment_short']
        ]

        searchHandler(searchResponse)
    }

    // Function that recieves response data from backend and then...
    function searchHandler(searchData) {

        // Clear table items
        tableItems = searchData;
        console.log(searchData)
        // Add search results to table
        createSearchTable();
    }


    // Feequency table ref
    var freqCompRef = {
        'D': 1, 'W': 2, 'M': 3, 'Q': 4
    }


    function createSearchTable() {

        // Hide loader
        $('#searchLoader').hide()

        $("#outputTableBody").empty();

        var table_body = document.getElementById('outputTableBody');

        // Filter out results that exist in current data table and limit result #
        // Grab IDs of current favorited datasets
        var comp_table_body = document.getElementById('compTableBody');
        var activeData = []
        for (i = 0; i < comp_table_body.rows.length; i++) {
            activeData.push(comp_table_body.rows[i].id)
        }

        // Exclude active dataseats from search
        var tableSorted = tableItems.filter(x => !activeData.includes(x[5]));

        for (i = 0; i < tableSorted.length; i++) {

            var tr = table_body.insertRow(-1)
            tr.id = tableSorted[i][5]
            tr.title = tableSorted[i][0]
            tr.style.cursor = "pointer"
            // Add data
            // Name
            var tc = tr.insertCell(-1)
            tc.innerHTML = tableSorted[i][0]
            // Freq
            var tc = tr.insertCell(-1)
            tc.innerHTML = tableSorted[i][2]
            // console.log(tc)
            // tc.style = 'text-align: center;vertical-align: middle;'
            // StartDate
            var tc = tr.insertCell(-1)
            tc.innerHTML = tableSorted[i][3]
            // EndDate
            var tc = tr.insertCell(-1)
            tc.innerHTML = tableSorted[i][4]
            // Units
            var tc = tr.insertCell(-1)
            tc.innerHTML = tableSorted[i][6].concat(', ', tableSorted[i][7])
            // tc.style.fontWeight = '900'
            // tc.style.color = tableSorted[i][5]
        }

        // Add listener to search table items
        table_body.querySelectorAll('tr').forEach(item => {
            if (item.parentElement.tagName == 'TBODY')
                // If search table item is clicked:
                item.addEventListener('click', function () {
                    // Create new item and remove event listeners
                    var newItem = item.cloneNode(true);
                    item.parentNode.replaceChild(newItem, item);

                    // Change cursor style
                    newItem.style.cursor = "auto"

                    // console.log('This is your newitem: ')
                    // console.log(newItem)

                    // Add data mod option to item
                    var tcMod = newItem.insertCell(-1)
                    // tcMod.innerHTML =
                    //     `<select style="width: fit-content;appearance: menulist;">
                    // <option title="down" value="fill" hidden>Fill</option>
                    // <option title="down" value="down_interpolate" hidden>Linear Interpolation</option>
                    // <option title="down" value="prorate" hidden>Prorate</option>
                    // <option title="up" value="average" selected>Average</option>
                    // <option title="up" value="sum">Sum</option>
                    //     </select>`

                    // Set options based on output data freq
                    // Grab current output date freq
                    var outputFreqTarget = $("#outputFreq")[0].value
                    console.log('output val is: ' + outputFreqTarget)
                    var seriesDateFreq = newItem.childNodes[1].innerHTML
                    console.log('series val is: ' + seriesDateFreq)
                    var outputVal = eval('freqCompRef.' + outputFreqTarget)
                    var seriesVal = eval('freqCompRef.' + seriesDateFreq)
                    if (outputVal == seriesVal) {
                        tcMod.innerHTML = 'None'
                    } else if (outputVal > seriesVal) {
                        tcMod.innerHTML =
                            `<select style="width: fit-content;appearance: menulist;">
                        <option title="down" value="fill" hidden>Fill</option>
                        <option title="down" value="down_interpolate" hidden>Linear Interpolation</option>
                        <option title="down" value="prorate" hidden>Prorate</option>
                        <option title="up" value="average" selected>Average</option>
                        <option title="up" value="sum">Sum</option>
                            </select>`
                    } else {
                        tcMod.innerHTML =
                            `<select style="width: fit-content;appearance: menulist;">
                    <option title="down" value="fill">Fill</option>
                    <option title="down" value="down_interpolate">Linear Interpolation</option>
                    <option title="down" value="prorate">Prorate</option>
                    <option title="up" value="average" hidden>Average</option>
                    <option title="up" value="sum" hidden>Sum</option>
                        </select>`

                    }

                    // Add remove item
                    var tcRemove = newItem.insertCell(-1)
                    tcRemove.innerHTML = '❌'
                    tcRemove.style.cursor = "pointer"
                    // Add item to comp table
                    $("#compTableBody").append(newItem)
                    // Add Remove listener
                    tcRemove.addEventListener('click', function (e) {
                        tcRemove.parentElement.remove()
                    })

                    // // Add remove listeners
                    // var itemCells = newItem.querySelectorAll('td')
                    // for (i = 0; i < itemCells.length - 1; i++) {
                    //     // console.log('listener for click remove is applied to: ')
                    //     // console.log(itemCells[i])
                    //     itemCells[i].addEventListener('click', function (e) {
                    //         // console.log('This is the parent element of the clicked cell:')
                    //         // console.log(itemCells[i].parentElement)
                    //         itemCells[i].parentElement.remove()
                    //     })
                    // }


                })
        })

    }


    function searchInput() {

        var ApiKey = ''
        var searchPhrase = 'gold'
        var resultLimit = 5

        $.ajax({
            method: 'GET',
            url: 'https://api.stlouisfed.org/fred/series/search?file_type=json&limit=' + resultLimit + '&search_text=' + searchPhrase + '&api_key=' + ApiKey,
            success: searchResponse,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error pulling data: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
            }
        });
    }

    function searchResponse(response) {
        // console.log(response)
        // var searchResponseTable = response
        // console.log(searchResponseTable)
    }



    function setInitial(response) {
        yourFoodsTable();
        setInitialTable();

    }

    var grades = ['A', 'B', 'C', 'D', 'F']
    var colors = ['darkgreen', 'yellowgreen', 'gold', 'orange', 'red']

    function yourFoodsTable() {
        // clear list
        $("#compList").empty();

        var compListItems = [];
        for (i = 0; i < yourFoods.length; i++) {
            var index = foodDB.findIndex((e) => e[4] == yourFoods[i])
            var food = foodDB[index][0]
            var grade = foodDB[index][3]
            var score = foodDB[index][2]
            var id = yourFoods[i]
            var colorIndex = grades.findIndex((e) => e == grade)
            var color = colors[colorIndex]
            var newItem = '<li class="w3-display-container" style="display: flex;cursor: pointer;" id="' + id + '"; title="' + score + '"><span style="margin: auto; margin-left: 0; margin-right: 10px;">' + food + '</span><span style="margin: auto; color: ' + color + '; margin-right: 0px;">' + grade + '</span></li>';
            compListItems.push([score, newItem])
            // var newItem = '<li class="w3-display-container" style="display: flex;" onclick="this.style.display=&quot;none&quot;" id="' + id + '"; title="' + score + '"><span style="margin: auto; margin-left: 0; margin-right: 10px;">' + food + '</span><span style="margin: auto; color: ' + color + '; margin-right: 0px;">' + grade + '</span></li>';
            // $("#compList").append(newItem);
        }

        // Rank list by score descending
        var compListSorted = compListItems.sort(function (a, b) {
            return b[0] - a[0];
        });
        // Then push list
        for (i = 0; i < compListSorted.length; i++) {
            $("#compList").append(compListSorted[i][1]);
        }


        document.querySelectorAll('li').forEach(item => {
            // console.log(item)
            if (item.className == 'w3-display-container') {
                item.addEventListener('click', function () {
                    yourFoods = yourFoods.filter(x => x != item.id);
                    item.remove();
                })
            }
        })

        // setInitialTable();
        // createTable();
    }

    // Sets random list of foods
    // function setInitialTable() {
    //     // Create array of items 
    //     tableItems = [];
    //     for (i = 1; i < 11; i++) {
    //         // Random items
    //         var index = Math.trunc(Math.random() * 6000)
    //         if (!yourFoods.includes(foodDB[index][4])) {
    //             var food = foodDB[index][0]
    //             var category = foodDB[index][1]
    //             var score = foodDB[index][2]
    //             var grade = foodDB[index][3]
    //             var colorIndex = grades.findIndex((e) => e == grade)
    //             var color = colors[colorIndex]
    //             var id = foodDB[index][4]
    //             tableItems.push([index, food, category, score, grade, color, id])
    //         }
    //     }

    //     createTable();

    // }








}(jQuery));



