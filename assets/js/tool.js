
(function inputScopeWrapper($) {

    $(function onDocReady() {

        // Add search button listener
        $('#searchForm').on('submit', function (event) {
            event.preventDefault();
            fredSearch();
        })

        // Add target date frequency listener
        $('#outputFreq').change(outputFreqChange)

        // Add download data button listener
        $('#downloadDataForm').on('submit', function (event) {
            event.preventDefault();
            downloadData();
        })

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
                    <option title="down" value="interpolate" hidden>Linear Interpolation</option>
                    <option title="down" value="prorate" hidden>Prorate</option>
                    <option title="up" value="average" selected>Average</option>
                    <option title="up" value="sum">Sum</option>
                        </select>`
            } else {
                compRows[i].cells[5].innerHTML =
                    `<select style="width: fit-content;appearance: menulist;">
                        <option title="down" value="fill">Fill</option>
                        <option title="down" value="interpolate">Linear Interpolation</option>
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

        var searchInput = document.getElementById("searchInput").value;
        // console.log(input)

        // Send search term to backend
        // https://quiver-stage.herokuapp.com/fredsearch
        $.ajax({
            method: 'GET',
            url: 'https://quiver-stage.herokuapp.com/fredsearch?searchKey=' + searchInput,
            // contentType: 'application/json',
            success: searchHandler,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error pulling data: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                // alert('An error occured when pulling the diet DB:\n' + jqXHR.responseText);
            }
        });

    }

    // Function that recieves response data from backend and then...
    function searchHandler(searchData) {
        tableItems = JSON.parse(searchData)
        // console.log(tableItems)

        // Clear table items
        // tableItems = searchData;
        // Add search results to table
        createSearchTable();
    }

    // DONT DELETE THIS
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

        // Remove active dataseats from search
        // var tableSorted = tableItems.filter(x => !activeData.includes(x.id));
        var tableSorted = []
        for (i = 0; i < Object.keys(tableItems).length; i++) {
            if (activeData.includes(tableItems[i].id) == false) {
                // console.log(tableItems[i])
                tableSorted.push(tableItems[i])
            }
        }

        // console.log(tableSorted)


        for (i = 0; i < Math.min(tableSorted.length, 15); i++) {

            var tr = table_body.insertRow(-1)
            tr.id = tableSorted[i].id
            tr.title = tableSorted[i].id
            tr.style.cursor = "pointer"
            // Add data
            // Name
            var tc = tr.insertCell(-1)
            tc.innerHTML = tableSorted[i].title
            // Freq
            var tc = tr.insertCell(-1)
            tc.innerHTML = tableSorted[i].frequency_short
            // console.log(tc)
            // tc.style = 'text-align: center;vertical-align: middle;'
            // StartDate
            var tc = tr.insertCell(-1)
            tc.innerHTML = tableSorted[i].observation_start
            // EndDate
            var tc = tr.insertCell(-1)
            tc.innerHTML = tableSorted[i].observation_end
            // Units
            var tc = tr.insertCell(-1)
            tc.innerHTML = tableSorted[i].units_short.concat(', ', tableSorted[i].seasonal_adjustment_short)
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
                    // <option title="down" value="interpolate" hidden>Linear Interpolation</option>
                    // <option title="down" value="prorate" hidden>Prorate</option>
                    // <option title="up" value="average" selected>Average</option>
                    // <option title="up" value="sum">Sum</option>
                    //     </select>`

                    // Set options based on output data freq
                    // Grab current output date freq
                    var outputFreqTarget = $("#outputFreq")[0].value
                    // console.log('output val is: ' + outputFreqTarget)
                    var seriesDateFreq = newItem.childNodes[1].innerHTML
                    // console.log('series val is: ' + seriesDateFreq)
                    var outputVal = eval('freqCompRef.' + outputFreqTarget)
                    var seriesVal = eval('freqCompRef.' + seriesDateFreq)
                    if (outputVal == seriesVal) {
                        tcMod.innerHTML = 'None'
                    } else if (outputVal > seriesVal) {
                        tcMod.innerHTML =
                            `<select style="width: fit-content;appearance: menulist;">
                        <option title="down" value="fill" hidden>Fill</option>
                        <option title="down" value="interpolate" hidden>Linear Interpolation</option>
                        <option title="down" value="prorate" hidden>Prorate</option>
                        <option title="up" value="average" selected>Average</option>
                        <option title="up" value="sum">Sum</option>
                            </select>`
                    } else {
                        tcMod.innerHTML =
                            `<select style="width: fit-content;appearance: menulist;">
                    <option title="down" value="fill">Fill</option>
                    <option title="down" value="interpolate">Linear Interpolation</option>
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

    // Function when user clicks download dtaa button
    function downloadData() {

        console.log("API Request initiated")
        jsonData = '{"requested_series_identifier_list": [{"series_identifier": "EXHOSLUSM495S","fill_methodology": "interpolate"},{"series_identifier": "CPHPTT01EZM659N","fill_methodology": "interpolate"},{"series_identifier": "HOUST","fill_methodology": "interpolate"}], "target_frequency": "D"}'


        $.ajax({
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            processData: false,
            method: 'POST',
            data: jsonData,
            url: 'https://quiver-stage.herokuapp.com/retrievedata',
            success: downloadDataHandler,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error pulling data: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
                // alert('An error occured when pulling the diet DB:\n' + jqXHR.responseText);
            }
        });

    }

    function downloadDataHandler(response) {
        dataResponse = JSON.parse(response)
        console.log(dataResponse)
        // dataResponseTest = jsonToCsv(dataResponse)

        // Keys
        // Object.keys(Object.values(dataResponse)[0][0])

        // Values
        // Object.values(Object.values(dataResponse)[0])[0]



        // for (i = 0; i < Object.keys(tableItems).length; i++) {
        //     if (activeData.includes(tableItems[i].id) == false) {
        //         // console.log(tableItems[i])
        //         tableSorted.push(tableItems[i])
        //     }
        // }



    }

    function jsonToCsv(items) {
        const header = Object.keys(items);
        header.unshift('date')
        // const headerString = header.join(',');
        outputArray = []
        outputArray.push(header)
        // For every date
        for (i = 0; i < Object.keys(Object.values(dataResponse)[0]).length; i++) {
            var newItem = []
            var rowDate = Object.keys(Object.values(dataResponse)[0])[i]
            newItem.push(rowDate)
            // Add all columns
            for (j = 0; j < Object.keys(dataResponse).length; j++) {
                newItem.push(Object.values(Object.values(dataResponse)[j])[i])
            }
            outputArray.push(newItem)
        }

        console.log(outputArray)






        // handle null or undefined values here
        // const replacer = (key, value) => value ?? '';
        // const rowItems = Object.values(dataResponse).map((row) =>
        //     header
        //         .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        //         .join(',')
        // );
        // join header and body, and break into separate lines
        // const csv = [headerString, ...rowItems].join('\r\n');
        // return csv;
    }
    // const obj = [
    //     { color: 'red', maxSpeed: 120, age: 2 },
    //     { color: 'blue', maxSpeed: 100, age: 3 },
    //     { color: 'green', maxSpeed: 130, age: 2 },
    // ];
    // const csv = jsonToCsv(obj);
    // console.log(csv);




}(jQuery));



