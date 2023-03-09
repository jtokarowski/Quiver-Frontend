
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

        $.ajax({
            method: 'GET',
            url: 'https://quiver-stage.herokuapp.com/fredsearch?searchKey=' + searchInput,
            // contentType: 'application/json',
            success: searchHandler,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error pulling data: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
            }
        });

    }

    // Function that recieves response data from backend and then...
    function searchHandler(searchData) {
        tableItems = JSON.parse(searchData)
        // Add search results to table
        createSearchTable();
    }

    // DONT DELETE THIS
    // Frequency table ref
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

                    // Add data mod option to item
                    var tcMod = newItem.insertCell(-1)

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

                })
        })

    }

    // Function when user clicks download dtaa button
    function downloadData() {

        tableData = $('#compTableBody')
        if (tableData[0].rows.length == 0) {
            alert('No data selected')
            throw "No data selected"
        }
        var seriesArray = []
        // Loop through 'My Data'
        for (i = 0; i < tableData[0].rows.length; i++) {

            var seriesID = tableData[0].rows[i].id
            if (tableData[0].rows[i].children[5].innerHTML == 'None') {
                var fillMethod = 'None'
            } else {
                var fillMethod = tableData[0].rows[i].children[5].children[0].selectedOptions[0].value
            }

            seriesArray.push({ "series_identifier": seriesID, "fill_methodology": fillMethod })

        }

        // Target output freq
        // var outputTarget = $('#outputFreq').selectedOptions[0].value
        var outputTarget = document.getElementById('outputFreq').selectedOptions[0].value

        var jsonData = JSON.stringify({ "requested_series_identifier_list": seriesArray, "target_frequency": outputTarget })
        // var jsonData = '{"requested_series_identifier_list": [{"series_identifier": "EXHOSLUSM495S","fill_methodology": "interpolate"},{"series_identifier": "CPHPTT01EZM659N","fill_methodology": "interpolate"},{"series_identifier": "HOUST","fill_methodology": "interpolate"}], "target_frequency": "D"}'

        console.log('Input data')
        console.log(jsonData)
        console.log("API Request initiated")

        $.ajax({
            contentType: 'application/json; charset=utf-8',
            method: 'POST',
            data: jsonData,
            url: 'https://quiver-stage.herokuapp.com/retrievedata',
            success: downloadDataHandler,
            error: function ajaxError(jqXHR, textStatus, errorThrown) {
                console.error('Error pulling data: ', textStatus, ', Details: ', errorThrown);
                console.error('Response: ', jqXHR.responseText);
            }
        });

    }

    function downloadDataHandler(response) {
        var download_link = document.createElement("a");
        download_link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(response);
        download_link.download = "fred_data.csv";
        // Trigger the download link
        document.body.appendChild(download_link);
        download_link.click();
        document.body.removeChild(download_link);

    }

}(jQuery));



